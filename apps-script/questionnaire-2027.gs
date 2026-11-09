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
  'submitted_at', 'full_name', 'email', 'company', 'events_selected', 'other_event', 'audience_wanted',
  'tell_us_more', 'consent', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'channel',
  'prefilled', 'source_url', 'status', 'owner', 'notes',
];
var TEAM_COLUMNS = ['status', 'owner', 'notes'];
/** On a repeat answer, a blank optional field keeps what the person gave before. */
var KEEP_IF_BLANK = ['company', 'tell_us_more', 'prefilled', 'source_url'];
/** Columns of the first version of the form (9 Nov 2026 review). upgradeSheet() moves them out of the Sheet. */
var REMOVED_COLUMNS = [
  'first_name', 'last_name', 'company_type', 'role_title', 'seniority', 'hq_country', 'hq_city',
  'cities_selected', 'regions_selected', 'phone', 'linkedin',
];
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
    if (!fullName_(data)) return json_({ ok: false, error: 'missing_name' });
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

/**
 * Run once from the editor after deploying this version, if the Sheet has the old columns.
 * Copies the tab as a backup, then rewrites it with the new columns: first_name and
 * last_name become full_name, the removed fields leave (they stay in the backup tab),
 * and any column the team added keeps its place to the right. Safe to run twice.
 */
function upgradeSheet() {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    upgradeSheet_();
  } finally {
    lock.releaseLock();
  }
}

function upgradeSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = sheet_();
  var values = sheet.getDataRange().getValues();
  var oldHeaders = values[0].map(function (h) { return String(h).trim(); });
  var hasOld = oldHeaders.some(function (h) { return REMOVED_COLUMNS.indexOf(h) !== -1; });
  if (!hasOld) return console.log('Nothing to upgrade: the Sheet has no old columns.');

  var stamp = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd HH.mm');
  sheet.copyTo(ss).setName('Backup before full name ' + stamp);

  var extras = oldHeaders.filter(function (h) {
    return h && COLUMNS.indexOf(h) === -1 && REMOVED_COLUMNS.indexOf(h) === -1;
  });
  var headers = COLUMNS.concat(extras);
  var rows = values.slice(1)
    .filter(function (row) { return row.join('') !== ''; })
    .map(function (row) {
      var o = {};
      oldHeaders.forEach(function (h, i) { if (h) o[h] = row[i]; });
      var joined = [o.first_name, o.last_name].map(function (x) { return String(x == null ? '' : x).trim(); }).filter(String).join(' ');
      o.full_name = String(o.full_name == null ? '' : o.full_name).trim() || joined;
      return headers.map(function (h) {
        var v = o[h] === undefined ? '' : o[h];
        // Text that looks like a formula goes back in as text.
        return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
      });
    });

  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).clearDataValidations();
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  setup();
  console.log('Upgraded ' + rows.length + ' rows. The old columns are in the backup tab.');
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
  // A column this version writes but the Sheet lacks (before upgradeSheet runs) is added on the right, so no answer is lost.
  var next = sheet.getLastColumn();
  COLUMNS.forEach(function (c) {
    if (map[c]) return;
    next += 1;
    sheet.getRange(1, next).setValue(c).setFontWeight('bold');
    map[c] = next;
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

/** The full name. A page still open from before the change may send first_name and last_name: join them. */
function fullName_(d) {
  return clean_(d.full_name || [d.first_name, d.last_name].filter(function (x) { return x; }).join(' '), 200);
}

function toRecord_(d, email) {
  var list = function (v) {
    return (Array.isArray(v) ? v : []).map(function (x) { return clean_(x, 200); }).filter(String).join('; ');
  };
  return {
    submitted_at: new Date(),
    full_name: fullName_(d),
    email: email,
    company: clean_(d.company, 200),
    events_selected: list(d.events_selected),
    other_event: clean_(d.other_event, 500),
    audience_wanted: list(d.audience_wanted),
    tell_us_more: clean_(d.tell_us_more, 1000),
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

/** Where the person will be and what they need, as labelled lines for the email. Events read "Event, City". */
function answerLines_(r) {
  var lines = [];
  if (r.events_selected) lines.push(['Events', String(r.events_selected)]);
  if (r.other_event) lines.push(['Somewhere else', r.other_event]);
  if (!lines.length) lines.push(['Events', 'Not given']);
  lines.push(['Who you would like to connect with', r.audience_wanted ? String(r.audience_wanted).split('; ').join(', ') : 'Not given']);
  if (r.tell_us_more) lines.push(['What you need', r.tell_us_more]);
  return lines;
}

function postToChat_(url, r, result) {
  if (!url) return;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var link = ss.getUrl() + '#gid=' + result.sheet.getSheetId() + '&range=A' + result.row;
  var lines = [
    (result.action === 'updated' ? '*Updated answer*: ' : '*New answer*: ') + r.full_name + (r.company ? ', ' + r.company : ''),
    '*Events*: ' + (r.events_selected || '-'),
    '*Somewhere else*: ' + (r.other_event || '-'),
    '*Wants to connect with*: ' + (r.audience_wanted || '-'),
    '*What they need*: ' + (r.tell_us_more || '-'),
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
  // Greet by the first word of the full name, without the formula guard clean_ may have added.
  var first = String(r.full_name).replace(/^'/, '').split(/\s+/)[0];
  var answers = answerLines_(r);
  var subject = first + ', Your next deals start here';
  var sender = props.getProperty('SENDER_NAME') || DEFAULT_SENDER;

  var text = ['Hi ' + first + ',', '', 'Thanks. Here is what we have:']
    .concat(answers.map(function (l) { return l[0] + ': ' + l[1]; }))
    .concat([
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
    return '<p style="margin:0 0 ' + (last ? '20px' : '6px') + ';color:#C2C6D6;white-space:pre-line;"><strong style="color:#E6CF9C;">' + esc(label) + ':</strong> ' + esc(value) + '</p>';
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
    answers.map(function (l, i) { return row(l[0], l[1], i === answers.length - 1); }).join('') +
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
        full_name: 'Test Person',
        email: 'change-me@example.com',
        company: 'Test Co',
        events_selected: ['TOKEN2049 Singapore', 'Sibos, Singapore'],
        other_event: '',
        audience_wanted: ['Commercial Banks', 'Payment Providers'],
        tell_us_more: 'A test answer to the open question.',
        consent: true,
        utm_content: 'email_1',
        channel: 'email',
      }),
    },
  });
  console.log(res.getContent());
}

/** Run from the editor to check the Chat connection; the log shows the result. */
function testChat() {
  var url = PropertiesService.getScriptProperties().getProperty('CHAT_WEBHOOK_URL');
  if (!url) return console.log('CHAT_WEBHOOK_URL is not set in Project Settings > Script properties.');
  var res = UrlFetchApp.fetch(url.trim(), {
    method: 'post',
    contentType: 'application/json; charset=UTF-8',
    payload: JSON.stringify({ text: 'Test from the questionnaire script: Chat is connected.' }),
    muteHttpExceptions: true,
  });
  console.log(res.getResponseCode() + ' ' + res.getContentText().slice(0, 300));
}
