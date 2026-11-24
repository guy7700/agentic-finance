// Link previews: every page in out/ has a title, an og:title and a share card that exists
// as a JPEG of 1200 × 630. Run after `npm run build`; needs no server.
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');
const BASE = (process.env.NEXT_PUBLIC_CANONICAL_BASE || 'https://agentic-finance.live').replace(/\/$/, '');

const pages = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name === 'index.html') pages.push(p);
  }
})(OUT);

const meta = (html, attr, key) => {
  const m = html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`));
  return m ? m[1].replace(/&amp;/g, '&').replace(/&#x27;/g, "'") : undefined;
};

/** Width and height from a JPEG's SOF marker. */
function jpegSize(buf) {
  for (let i = 2; i < buf.length; ) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xc3) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

const problems = [];
const rows = [];
for (const file of pages.sort()) {
  const route = '/' + path.relative(OUT, path.dirname(file)).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  if (/<meta name="robots" content="noindex/.test(html) && route.startsWith('/blog/first-post')) continue;
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const ogTitle = meta(html, 'property', 'og:title');
  const ogImage = meta(html, 'property', 'og:image');
  const twImage = meta(html, 'name', 'twitter:image');
  const where = route === '/.' ? '/' : route;
  if (!title) problems.push(`${where}: no <title>`);
  if (!ogTitle) problems.push(`${where}: no og:title`);
  if (!ogImage) {
    problems.push(`${where}: no og:image`);
    continue;
  }
  if (twImage !== ogImage) problems.push(`${where}: twitter:image differs from og:image`);
  if (!ogImage.startsWith(`${BASE}/og/`)) problems.push(`${where}: og:image is not a share card (${ogImage})`);
  const local = path.join(OUT, new URL(ogImage).pathname);
  if (!fs.existsSync(local)) problems.push(`${where}: ${ogImage} is missing from out/`);
  else {
    const buf = fs.readFileSync(local);
    const size = jpegSize(buf);
    if (!size || size.width !== 1200 || size.height !== 630) problems.push(`${where}: card is not a 1200 × 630 JPEG`);
    if (buf.length > 300 * 1024) problems.push(`${where}: card is ${Math.round(buf.length / 1024)} KB (WhatsApp skips images over about 300 KB)`);
  }
  if (/[–—]/.test(`${title} ${ogTitle}`)) problems.push(`${where}: en or em dash in a title`);
  rows.push(`${where.padEnd(44)} ${ogTitle}`);
}

console.log(rows.join('\n'));
console.log(`\n${rows.length} pages checked.`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n${problems.join('\n')}`);
  process.exit(1);
}
console.log('Every page has a title and its own 1200 × 630 share card.');
