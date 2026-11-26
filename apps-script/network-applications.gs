/**
 * Agentic Finance Network applications: the Google Sheet layer (agentic-finance.live/network/*).
 *
 * Supabase is the primary record. The network-apply edge function saves each application in
 * public.network_applications, then posts it here; this script writes it to the Sheet, one tab per
 * audience, and answers with a link to the row (used in the Google Chat message). The edge function
 * retries a failed post, so this script must be safe to call twice: it updates the row with the same
 * application_id instead of adding another.
 *
 * Bound to the Sheet "Agentic Finance VC Network" (all five forms, one tab each, VCs first). Setup steps: docs/network.md.
 *
 * Script property (Project Settings > Script properties):
 *   SHEETS_TOKEN  Shared secret. setup() creates it; the same value goes into the Supabase Edge Function
 *                 secret SHEETS_WEBHOOK_TOKEN. Requests without it are refused.
 */

// VCs first: the Sheet is mainly for the funds. Each form keeps its own tab.
// The Sheet "Agentic Finance VC Network". Used when the script is not opened from the Sheet itself.
var SHEET_ID = '10g3JOI_-cBLy4CDP--CfoayWRX56OgmlmxwF_a4mWrw';

function ss_() {
  return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SHEET_ID);
}

var TABS = { vc: 'VCs', startup: 'Startups', company: 'Companies', institution: 'Institutions', ecosystem: 'Ecosystem' };

var BASE_COLUMNS = ['application_id', 'first_submitted', 'last_submitted', 'times_submitted', 'name', 'email', 'organisation', 'role', 'website', 'linkedin'];
var AUDIENCE_COLUMNS = {
  startup: ['one_liner', 'category', 'stage', 'raising', 'raising_amount', 'meet', 'competition'],
  vc: ['fund_type', 'check_size', 'stage_focus', 'categories', 'regions', 'venture_partner_interest'],
  company: ['seat', 'category', 'cities', 'goals', 'timing', 'notes'],
  institution: ['institution_type', 'region', 'team', 'interests', 'cities', 'long_term_partnership'],
  ecosystem: ['org_type', 'region', 'community_size', 'wants', 'can_share'],
};
var TAIL_COLUMNS = ['source', 'page', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'crm_record'];
var TEAM_COLUMNS = ['status', 'owner', 'notes_team'];
var STATUSES = ['new', 'contacted', 'approved', 'declined'];
var CHECK_SIZES = { under_250k: 'Under $250K', '250k_1m': '$250K to $1M', '1m_5m': '$1M to $5M', '5m_plus': '$5M+' };

function columnsFor_(audience) {
  return BASE_COLUMNS.concat(AUDIENCE_COLUMNS[audience] || [], TAIL_COLUMNS, TEAM_COLUMNS);
}

function doGet() {
  return json_({ ok: true, service: 'network-applications' });
}

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var token = PropertiesService.getScriptProperties().getProperty('SHEETS_TOKEN');
    if (!token || data.token !== token) return json_({ ok: false, error: 'not_authorized' });

    var app = data.application || {};
    if (!app.id || !TABS[app.audience]) return json_({ ok: false, error: 'invalid' });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var result = upsert_(app);
      var ss = ss_();
      return json_({
        ok: true,
        action: result.action,
        sheet: result.sheet.getName(),
        row_url: ss.getUrl() + '#gid=' + result.sheet.getSheetId() + '&range=A' + result.row,
      });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  }
}

/** Run once from the editor: creates the five tabs and the shared token (shown in the log). */
function setup() {
  Object.keys(TABS).forEach(function (audience) {
    var sheet = sheet_(audience);
    headerMap_(sheet, audience);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold');
    var map = headerMap_(sheet, audience);
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).setAllowInvalid(true).build();
    sheet.getRange(2, map.status, Math.max(sheet.getMaxRows() - 1, 1), 1).setDataValidation(rule);
  });
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SHEETS_TOKEN')) props.setProperty('SHEETS_TOKEN', Utilities.getUuid() + Utilities.getUuid().replace(/-/g, ''));
  console.log('SHEETS_TOKEN (copy into the Supabase secret SHEETS_WEBHOOK_TOKEN): ' + props.getProperty('SHEETS_TOKEN'));
}

function sheet_(audience) {
  var ss = ss_();
  var name = TABS[audience];
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    // Use the empty first tab of a new Sheet for the first audience, then add the rest.
    var first = ss.getSheets()[0];
    if (ss.getSheets().length === 1 && first.getLastRow() === 0 && !TABS_HAS_(first.getName())) {
      first.setName(name);
      sheet = first;
    } else {
      sheet = ss.insertSheet(name);
    }
  }
  return sheet;
}

function TABS_HAS_(name) {
  return Object.keys(TABS).some(function (k) { return TABS[k] === name; });
}

/** Header name -> 1-based column, read from row 1, so the team can add or move columns. Missing ones are added on the right. */
function headerMap_(sheet, audience) {
  var columns = columnsFor_(audience);
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight('bold');
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var map = {};
  headers.forEach(function (h, i) { if (h) map[String(h).trim()] = i + 1; });
  var next = sheet.getLastColumn();
  columns.forEach(function (c) {
    if (map[c]) return;
    next += 1;
    sheet.getRange(1, next).setValue(c).setFontWeight('bold');
    map[c] = next;
  });
  return map;
}

function cell_(key, value) {
  if (Array.isArray(value)) return value.join(', ');
  if (key === 'check_size' && CHECK_SIZES[value]) return CHECK_SIZES[value];
  if (value === null || value === undefined) return '';
  return String(value).slice(0, 2000);
}

function toRecord_(app) {
  var p = app.payload || {};
  var utm = app.utm || {};
  var record = {
    application_id: app.id,
    first_submitted: app.created_at ? new Date(app.created_at) : '',
    last_submitted: app.last_submitted_at ? new Date(app.last_submitted_at) : '',
    times_submitted: app.submission_count || 1,
    name: app.name || '',
    email: app.email || '',
    organisation: app.organisation || '',
    role: p.role || '',
    website: p.website || '',
    linkedin: p.linkedin || '',
    source: app.source || '',
    page: app.page || '',
    utm_source: utm.utm_source || '',
    utm_medium: utm.utm_medium || '',
    utm_campaign: utm.utm_campaign || '',
    utm_content: utm.utm_content || '',
    crm_record: app.crm_url || '',
  };
  (AUDIENCE_COLUMNS[app.audience] || []).forEach(function (k) { record[k] = cell_(k, p[k]); });
  return record;
}

/** Add a row, or update the row with the same application_id. The team columns are only set on a new row. */
function upsert_(app) {
  var sheet = sheet_(app.audience);
  var map = headerMap_(sheet, app.audience);
  var record = toRecord_(app);
  var lastRow = sheet.getLastRow();
  var row = 0;
  if (lastRow > 1) {
    var ids = sheet.getRange(2, map.application_id, lastRow - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === String(app.id)) { row = i + 2; break; }
    }
  }
  if (row) {
    Object.keys(record).forEach(function (key) {
      if (map[key] && TEAM_COLUMNS.indexOf(key) === -1) sheet.getRange(row, map[key]).setValue(record[key]);
    });
    return { action: 'updated', row: row, sheet: sheet };
  }
  var values = [];
  for (var c = 0; c < sheet.getLastColumn(); c++) values.push('');
  Object.keys(record).forEach(function (key) { if (map[key]) values[map[key] - 1] = record[key]; });
  if (map.status) values[map.status - 1] = 'new';
  sheet.appendRow(values);
  return { action: 'created', row: sheet.getLastRow(), sheet: sheet };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
