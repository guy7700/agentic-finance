// Runs after `next build` (see "build" in package.json).
//
// 1. Writes a forwarding page at every old address in src/data/redirects.mjs.
// 2. Checks that every address the site had before the restructure
//    (qa/baseline-urls.txt) still answers, as a page or a forwarding page.
//
// Any problem stops the build, so a broken link never reaches the live site.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { redirects } from '../src/data/redirects.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const BASELINE = path.join(ROOT, 'qa', 'baseline-urls.txt');
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
/** Marks a forwarding page, so one is never taken for a real page. */
const MARK = 'af-moved';

const problems = [];

/** "/partners/etoro" → "/partners/etoro/" (the site uses trailing slashes). */
const slashed = (p) => (p.endsWith('/') ? p : `${p}/`);
const fileOf = (p) => path.join(OUT, slashed(p), 'index.html');
const read = (p) => (fs.existsSync(fileOf(p)) ? fs.readFileSync(fileOf(p), 'utf8') : null);
const isForward = (html) => html.includes(`<meta name="${MARK}"`);
const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** The tags a link preview and a search engine read, copied from the new page's <head>. */
function previewTags(html) {
  const head = html.slice(0, html.indexOf('</head>'));
  const tags = head.match(
    /<title>[^<]*<\/title>|<meta (?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)" content="[^"]*"\/?>|<link rel="canonical" href="[^"]*"\/?>/g,
  );
  return tags ?? [];
}

/** "/events/2027#rio" → page "/events/2027", anchor "#rio". */
function split(to) {
  const i = to.indexOf('#');
  return i < 0 ? { page: to, anchor: '' } : { page: to.slice(0, i), anchor: to.slice(i) };
}

/**
 * A script redirect makes this forwarding page the referrer of the new page, so GA4 would count a
 * visit from a press article (or any other site) as direct. When the visitor came from another site
 * and the address has no campaign tags, pass that site on as utm_source with utm_medium=referral.
 */
const keepSource =
  'var s=location.search,h="";try{h=document.referrer?new URL(document.referrer).hostname:""}catch(e){}' +
  'if(h&&h!==location.hostname&&!/[?&]utm_source=/.test(s)){s+=(s?"&":"?")+"utm_source="+encodeURIComponent(h)+"&utm_medium=referral"}';

function forwardingPage(to, tags) {
  const { page, anchor } = split(to);
  const target = `${BASE_PATH}${slashed(page)}`;
  const href = `${target}${anchor}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="${MARK}" content="${escapeAttr(href)}"/>
<script>${keepSource}location.replace(${JSON.stringify(target)}+s+(location.hash||${JSON.stringify(anchor)}))</script>
<noscript><meta http-equiv="refresh" content="0;url=${escapeAttr(href)}"/></noscript>
${tags.join('\n')}
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1424;color:#f3efe6;font:16px/1.5 system-ui,sans-serif}a{color:#d6b46a}</style>
</head>
<body><p>This page has moved to <a href="${escapeAttr(href)}">${escapeAttr(href)}</a>.</p></body>
</html>
`;
}

if (!fs.existsSync(OUT)) {
  console.error('write-redirects: out/ is missing. Run `next build` first.');
  process.exit(1);
}

// 1. Forwarding pages
const seen = new Set();
let written = 0;
let cards = 0;
for (const { from, to } of redirects) {
  const key = slashed(from);
  if (seen.has(key)) {
    problems.push(`${from} is listed twice`);
    continue;
  }
  seen.add(key);
  if (slashed(from) === slashed(split(to).page)) {
    problems.push(`${from} forwards to itself`);
    continue;
  }
  const target = read(split(to).page);
  if (target === null) {
    problems.push(`${from} → ${to}: ${to} is not a page of this build`);
    continue;
  }
  if (isForward(target)) {
    problems.push(`${from} → ${to}: ${to} is itself a forwarding page; point ${from} at the final page`);
    continue;
  }
  const existing = read(from);
  if (existing !== null && !isForward(existing)) {
    problems.push(`${from} is still a real page; remove the page or the redirect, never both kept`);
    continue;
  }
  const tags = previewTags(target);
  if (!tags.some((t) => t.startsWith('<title>'))) problems.push(`${to} has no <title> to copy`);
  fs.mkdirSync(path.dirname(fileOf(from)), { recursive: true });
  fs.writeFileSync(fileOf(from), forwardingPage(to, tags));
  written++;
  keepOldShareCard(from, tags);
}

/**
 * Previews already posted in chats point at the old page's share card
 * (/og/<old path>.jpg). Keep that address alive with the new page's card.
 */
function keepOldShareCard(from, tags) {
  const tag = tags.find((t) => t.startsWith('<meta property="og:image" '));
  if (!tag) return;
  const current = path.join(OUT, new URL(tag.match(/content="([^"]*)"/)[1]).pathname.slice(BASE_PATH.length));
  const old = path.join(OUT, 'og', `${from.replace(/\/$/, '')}.jpg`);
  if (fs.existsSync(old) || !fs.existsSync(current)) return;
  fs.mkdirSync(path.dirname(old), { recursive: true });
  fs.copyFileSync(current, old);
  cards++;
}

// 2. Every address of the site before the restructure still answers.
const baseline = fs
  .readFileSync(BASELINE, 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'));
let pages = 0;
let forwards = 0;
for (const url of baseline) {
  const file = url.endsWith('/') ? path.join(OUT, url, 'index.html') : path.join(OUT, url);
  if (!fs.existsSync(file)) {
    problems.push(`${url} no longer answers: add it to src/data/redirects.mjs`);
    continue;
  }
  if (url.endsWith('/') && isForward(fs.readFileSync(file, 'utf8'))) forwards++;
  else pages++;
}

if (problems.length) {
  console.error(`write-redirects: ${problems.length} problem(s)\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(
  `write-redirects: ${written} forwarding page(s) and ${cards} old share card(s) written. All ${baseline.length} earlier addresses answer: ${pages} as pages, ${forwards} forwarded.`,
);
