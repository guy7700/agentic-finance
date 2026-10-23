// Shared Playwright helpers. Uses an installed Chrome (set CHROME_PATH if needed).
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'output');
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || 'http://localhost:3000';
const CHROME =
  process.env.CHROME_PATH ||
  (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : '/usr/bin/google-chrome');

async function launch() {
  return chromium.launch({ executablePath: CHROME, headless: true });
}
async function mobile(browser) {
  return browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
}
async function desktop(browser, w = 1440, h = 900) {
  return browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
}
module.exports = { launch, mobile, desktop, OUT, BASE };
