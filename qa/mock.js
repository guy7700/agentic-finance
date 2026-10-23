// Local stand-in for the Google Apps Script webhooks, used only for QA.
const http = require('http');
const fs = require('fs');
const path = require('path');
const LOG = path.join(__dirname, 'output', 'mock-log.jsonl');
fs.mkdirSync(path.dirname(LOG), { recursive: true });
http.createServer((req, res) => {
  // Behave like Apps Script: cross-site reads allowed.
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    if (req.url.startsWith('/fail')) { res.writeHead(500); return res.end('fail'); }
    fs.appendFileSync(LOG, JSON.stringify({ url: req.url, method: req.method, ct: req.headers['content-type'], body }) + '\n');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"ok":true}');
  });
}).listen(4010, () => console.log('mock webhook on :4010'));
