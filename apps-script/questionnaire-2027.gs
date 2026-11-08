/**
 * "Where will you be in 2027?" questionnaire backend (agentic-finance.live/2027).
 *
 * Same pattern as the site's other forms: the browser posts to this Google Apps
 * Script web app, which writes to the Sheet, posts to Google Chat and sends the
 * thank-you email. Bound to the Sheet "Agentic Finance Questionnaire 2027 Responses".
 * Setup steps: docs/questionnaire-2027.md.
 *
 * Script properties (Project Settings > Script properties):
 *   CHAT_WEBHOOK_URL  Incoming webhook of the "Questionnaire 2027 Tracker" Chat space.
 *   SENDER_NAME       Name on, and signing, the thank-you email (default "Guy Kaufman").
 *   REPLY_TO          Reply-to address (optional; replies go to the sending account otherwise).
 *   BOOKING_URL       Tal's booking page (default below).
 * The thank-you email is sent from the account that deploys this script.
 */

var SHEET_NAME = 'Responses';
var DEFAULT_BOOKING_URL = 'https://calendar.app.google/S5s1qzpFsr4m2ZMC8';
var DEFAULT_SENDER = 'Guy Kaufman';

/** Columns, in order. The last three belong to the team and are never written after a row is created. */
var COLUMNS = [
  'submitted_at', 'first_name', 'last_name', 'email', 'company', 'company_type', 'role_title', 'seniority',
  'hq_country', 'hq_city', 'events_selected', 'cities_selected', 'regions_selected', 'other_event',
  'audience_wanted', 'phone', 'linkedin', 'consent', 'utm_source', 'utm_medium', 'utm_campaign',
  'utm_content', 'channel', 'prefilled', 'source_url', 'status', 'owner', 'notes',
];
var TEAM_COLUMNS = ['status', 'owner', 'notes'];
/** On a repeat answer, a blank optional field keeps what the person gave before. */
var KEEP_IF_BLANK = ['last_name', 'company', 'company_type', 'role_title', 'seniority', 'hq_country', 'hq_city', 'phone', 'linkedin', 'prefilled', 'source_url'];
var STATUSES = ['new', 'contacted', 'meeting booked'];

// Rate limits: per email address, and across the whole form.
var PER_EMAIL_LIMIT = 5; // submissions per 10 minutes
var GLOBAL_LIMIT = 60; // submissions per minute
var EMAIL_COOLDOWN_SECONDS = 600; // at most one thank-you email per address per 10 minutes

function doGet() {
  return json_({ ok: true, service: 'questionnaire-2027' });
}

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
    if (data.website) return json_({ ok: true, action: 'ignored' });

    var email = clean_(data.email, 200).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json_({ ok: false, error: 'invalid_email' });
    if (!clean_(data.first_name, 100)) return json_({ ok: false, error: 'missing_name' });
    if (data.consent !== true) return json_({ ok: false, error: 'missing_consent' });

    var cache = CacheService.getScriptCache();
    if (!underLimit_(cache, 'rl:global:' + Math.floor(Date.now() / 60000), GLOBAL_LIMIT, 120)) {
      return json_({ ok: false, error: 'rate_limited' });
    }
    if (!underLimit_(cache, 'rl:email:' + email, PER_EMAIL_LIMIT, 600)) {
      return json_({ ok: false, error: 'rate_limited' });
    }

    var record = toRecord_(data, email);
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    var result;
    try {
      result = upsert_(record);
    } finally {
      lock.releaseLock();
    }

    var props = PropertiesService.getScriptProperties();
    try {
      postToChat_(props.getProperty('CHAT_WEBHOOK_URL'), record, result);
    } catch (err) {
      console.error('Chat post failed: ' + err);
    }
    if (!cache.get('mail:' + email)) {
      try {
        sendThankYou_(record, props);
        cache.put('mail:' + email, '1', EMAIL_COOLDOWN_SECONDS);
      } catch (err) {
        console.error('Thank-you email failed: ' + err);
      }
    }

    return json_({ ok: true, action: result.action, row: result.row });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  }
}

/** Run once from the editor: writes the header row, freezes it and adds the status dropdown. */
function setup() {
  var sheet = sheet_();
  sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  var statusCol = COLUMNS.indexOf('status') + 1;
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(false).build();
  sheet.getRange(2, statusCol, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (sheet.getName() !== SHEET_NAME) sheet.setName(SHEET_NAME);
  return sheet;
}

/** Header name -> 1-based column, read from row 1 so the team can add columns to the right. */
function headerMap_(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), COLUMNS.length);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  if (!headers[0]) {
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
    headers = COLUMNS;
  }
  var map = {};
  headers.forEach(function (h, i) {
    if (h) map[String(h).trim()] = i + 1;
  });
  return map;
}

/** Add a row, or update the row with the same email. Team columns are only set on a new row. */
function upsert_(record) {
  var sheet = sheet_();
  var map = headerMap_(sheet);
  var emailCol = map.email;
  var lastRow = sheet.getLastRow();
  var row = 0;
  if (lastRow > 1) {
    var emails = sheet.getRange(2, emailCol, lastRow - 1, 1).getValues();
    for (var i = 0; i < emails.length; i++) {
      if (String(emails[i][0]).trim().toLowerCase() === record.email) {
        row = i + 2;
        break;
      }
    }
  }

  if (row) {
    // Update only the columns the form owns; status, owner and notes stay as the team left them.
    Object.keys(record).forEach(function (key) {
      if (TEAM_COLUMNS.indexOf(key) !== -1 || !map[key]) return;
      if (record[key] === '' && KEEP_IF_BLANK.indexOf(key) !== -1) return;
      sheet.getRange(row, map[key]).setValue(record[key]);
    });
    return { action: 'updated', row: row, sheet: sheet };
  }

  var width = sheet.getLastColumn();
  var values = [];
  for (var c = 0; c < width; c++) values.push('');
  Object.keys(record).forEach(function (key) {
    if (map[key]) values[map[key] - 1] = record[key];
  });
  if (map.status) values[map.status - 1] = 'new';
  sheet.appendRow(values);
  return { action: 'created', row: sheet.getLastRow(), sheet: sheet };
}

function toRecord_(d, email) {
  var list = function (v) {
    return (Array.isArray(v) ? v : []).map(function (x) { return clean_(x, 200); }).filter(String).join('; ');
  };
  return {
    submitted_at: new Date(),
    first_name: clean_(d.first_name, 100),
    last_name: clean_(d.last_name, 100),
    email: email,
    company: clean_(d.company, 200),
    company_type: clean_(d.company_type, 100),
    role_title: clean_(d.role_title, 200),
    seniority: clean_(d.seniority, 100),
    hq_country: clean_(d.hq_country, 100),
    hq_city: clean_(d.hq_city, 100),
    events_selected: list(d.events_selected),
    cities_selected: list(d.cities_selected),
    regions_selected: list(d.regions_selected),
    other_event: clean_(d.other_event, 500),
    audience_wanted: list(d.audience_wanted),
    phone: clean_(d.phone, 60),
    linkedin: clean_(d.linkedin, 300),
    consent: d.consent === true ? 'yes' : 'no',
    utm_source: clean_(d.utm_source, 100),
    utm_medium: clean_(d.utm_medium, 100),
    utm_campaign: clean_(d.utm_campaign, 100),
    utm_content: clean_(d.utm_content, 100),
    channel: clean_(d.channel, 40),
    prefilled: clean_(d.prefilled, 200),
    source_url: clean_(d.source_url, 500),
  };
}

/** Trim, cap the length and stop spreadsheet formula injection. */
function clean_(v, max) {
  var s = String(v == null ? '' : v).trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function underLimit_(cache, key, limit, ttl) {
  var n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), ttl);
  return n <= limit;
}

/** Where the person will be, as labelled lines for the email: cities (including each chosen event's city), events, regions, free text. */
function whereLines_(r) {
  var split = function (v) { return v ? String(v).split('; ') : []; };
  var picked = split(r.events_selected);
  var notSure = picked.indexOf('Not sure yet') !== -1;
  var cities = split(r.cities_selected);
  var events = [];
  picked.forEach(function (label) {
    if (label === 'Not sure yet') return;
    // Event options read "date, event, city".
    var parts = label.split(', ');
    if (parts.length < 3) return events.push(label);
    var city = parts[parts.length - 1];
    if (cities.indexOf(city) === -1) cities.push(city);
    events.push(parts.slice(1, -1).join(', ') + ' (' + parts[0].replace(' (TBC)', ', TBC') + ')');
  });
  var lines = [];
  if (cities.length) lines.push(['Cities', cities.join(', ')]);
  if (events.length) lines.push(['Events', events.join(', ')]);
  if (r.regions_selected) lines.push(['Regions', split(r.regions_selected).join(', ')]);
  if (r.other_event) lines.push(['Somewhere else', r.other_event]);
  if (!lines.length) lines.push(['Cities', notSure ? 'Not sure yet' : 'Not given']);
  else if (notSure) lines.push(['Also', 'Not sure yet']);
  return lines;
}

function postToChat_(url, r, result) {
  if (!url) return;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var link = ss.getUrl() + '#gid=' + result.sheet.getSheetId() + '&range=A' + result.row;
  var who = [r.first_name, r.last_name].filter(String).join(' ');
  var role = [r.role_title, r.company].filter(String).join(' at ') || r.company;
  var place = [r.hq_city, r.hq_country].filter(String).join(', ');
  var lines = [
    (result.action === 'updated' ? '*Updated answer*: ' : '*New answer*: ') + who + (role ? ', ' + role : '') + (place ? ' (' + place + ')' : ''),
    '*Cities*: ' + (r.cities_selected || '-'),
    '*Events*: ' + (r.events_selected || '-'),
    '*Regions*: ' + (r.regions_selected || '-'),
    '*Somewhere else*: ' + (r.other_event || '-'),
    '*Wants to meet*: ' + (r.audience_wanted || '-'),
    '*Source*: ' + [r.utm_content, r.channel].filter(String).join(', '),
    '<' + link + '|Open the row in the Sheet>',
  ];
  UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json; charset=UTF-8',
    payload: JSON.stringify({ text: lines.join('\n') }),
    muteHttpExceptions: true,
  });
}

/** The thank-you email, from the campaign flow, in the site's navy and gold. Signed by the sender, who sets up the call with Tal. */
function sendThankYou_(r, props) {
  var booking = props.getProperty('BOOKING_URL') || DEFAULT_BOOKING_URL;
  var first = r.first_name;
  var where = whereLines_(r);
  var audiences = r.audience_wanted ? r.audience_wanted.split('; ').join(', ') : 'Not given';
  var subject = first + ', Your next deals start here';
  var sender = props.getProperty('SENDER_NAME') || DEFAULT_SENDER;

  var text = ['Hi ' + first + ',', '', 'Thanks. Here is what we have:']
    .concat(where.map(function (l) { return l[0] + ': ' + l[1]; }))
    .concat([
      'Who you want to meet: ' + audiences,
      '',
      "Next: within a few days we'll come back with the institutions and people we can put you in front of in each city, and how we'd set up the meetings.",
      '',
      "Want to move faster? I'm setting up 30-minute calls with our founder, Tal Mor. Pick a time: " + booking,
      '',
      sender,
      'More and More',
      '',
      'You are getting this because you answered our 2027 questionnaire. Reply "unsubscribe" and we will not contact you again.',
    ])
    .join('\n');

  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };
  var row = function (label, value, last) {
    return '<p style="margin:0 0 ' + (last ? '20px' : '6px') + ';color:#C2C6D6;"><strong style="color:#E6CF9C;">' + esc(label) + ':</strong> ' + esc(value) + '</p>';
  };
  var html =
    '<div style="margin:0;padding:32px 16px;background:#0A1428;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#050B18;border:1px solid #3a3a36;border-radius:16px;">' +
    '<tr><td style="height:1px;background:linear-gradient(90deg,transparent,#E6CF9C,transparent);"></td></tr>' +
    '<tr><td style="padding:32px 28px;font-family:\'Space Grotesk\',Helvetica,Arial,sans-serif;color:#FFFFFF;font-size:16px;line-height:1.6;">' +
    '<p style="margin:0 0 6px;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#E6CF9C;">Agentic Finance 2027</p>' +
    '<p style="margin:0 0 20px;font-family:Georgia,\'Cormorant Garamond\',serif;font-style:italic;font-size:30px;line-height:1.1;color:#D1B679;">Your next deals start here</p>' +
    '<p style="margin:0 0 16px;">Hi ' + esc(first) + ',</p>' +
    '<p style="margin:0 0 12px;">Thanks. Here is what we have:</p>' +
    where.map(function (l) { return row(l[0], l[1], false); }).join('') +
    row('Who you want to meet', audiences, true) +
    '<p style="margin:0 0 24px;">Next: within a few days we\'ll come back with the institutions and people we can put you in front of in each city, and how we\'d set up the meetings.</p>' +
    '<p style="margin:0 0 8px;">Want to move faster? I\'m setting up 30-minute calls with our founder, Tal Mor. Pick a time:</p>' +
    '<p style="margin:0 0 28px;"><a href="' + esc(booking) + '" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#D1B679;color:#0A1428;font-size:12px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;">Book 30 minutes with Tal</a></p>' +
    '<p style="margin:0;">' + esc(sender) + '<br><span style="color:#C2C6D6;">More and More</span></p>' +
    '</td></tr>' +
    '<tr><td style="padding:16px 28px 24px;border-top:1px solid #23293a;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#8E95A8;">' +
    'You are getting this because you answered our 2027 questionnaire. Reply "unsubscribe" and we will not contact you again.' +
    '</td></tr></table></div>';

  var options = { htmlBody: html, name: sender };
  var replyTo = props.getProperty('REPLY_TO');
  if (replyTo) options.replyTo = replyTo;
  MailApp.sendEmail(r.email, subject, text, options);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run from the editor to try the whole flow with a test address. Change the email first. */
function testSubmission() {
  var res = doPost({
    postData: {
      contents: JSON.stringify({
        first_name: 'Test',
        last_name: 'Person',
        email: 'change-me@example.com',
        company: 'Test Co',
        events_selected: ['6-7 Oct, TOKEN2049 Singapore, Singapore'],
        cities_selected: ['Dubai'],
        regions_selected: [],
        other_event: '',
        audience_wanted: ['Banks', 'Payments'],
        consent: true,
        utm_content: 'email_1',
        channel: 'email',
      }),
    },
  });
  console.log(res.getContent());
}
