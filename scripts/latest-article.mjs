// Picks one recent article about AI in finance from public news feeds and asks
// Claude for a two-sentence summary in our own words. Runs before every build;
// the deploy workflow's daily schedule makes it rotate.
//
// Writes src/data/latest-article.json (read by the home page at build time) and
// public/latest-article.json (served on the live site, so tomorrow's run can skip
// today's pick). Any failure writes nothing and exits 0: the home page then hides
// the block instead of showing a stale or unchecked article.
//
//   npm run news                 pick, summarise, write (needs ANTHROPIC_API_KEY)
//   npm run news -- --candidates print the shortlist only, no API call

import fs from 'node:fs';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';

const FEEDS = [
  { source: 'Business Insider', url: 'https://feeds.businessinsider.com/custom/all' },
  { source: 'CNBC', url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html' },
  { source: 'CNBC', url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html' },
  { source: 'TechCrunch', url: 'https://techcrunch.com/category/fintech/feed/' },
];
const LIVE_COPY = 'https://agentic-finance.live/latest-article.json';
const OUT_FILES = ['src/data/latest-article.json', 'public/latest-article.json'];
const MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;
const SHORTLIST = 12;

const AI = /\b(AI|A\.I\.|artificial intelligence|agentic|agents?|LLMs?|OpenAI|Anthropic|chatbots?|machine learning)\b/i;
const AGENTS = /\b(agentic|AI agents?|agents?)\b/i;
const FINANCE =
  /\b(banks?|banking|bankers?|financ\w*|fintech|payments?|trading|traders?|investors?|investing|asset managers?|wealth|hedge funds?|stablecoins?|crypto\w*|bitcoin|Wall Street|brokers?|brokerage|insurers?|lenders?|lending|credit|stocks?|markets?|capital|funds?|money)\b/gi;

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const log = (...a) => console.log('[latest-article]', ...a);

function decode(s = '') {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

const text = (html) => decode(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const noLongDashes = (s) => s.replace(/\s*[—–]\s*/g, ' - ');
const tag = (xml, name) => xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1];

/** RSS <item> and Atom <entry>, reduced to what the shortlist needs. */
function parseFeed(xml, source) {
  const items = [];
  for (const [, body] of xml.matchAll(/<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/g)) {
    const title = noLongDashes(text(tag(body, 'title')));
    const url = text(tag(body, 'link')) || body.match(/<link[^>]*href="([^"]+)"/)?.[1] || text(tag(body, 'id'));
    const published = new Date(text(tag(body, 'pubDate') ?? tag(body, 'published') ?? tag(body, 'updated')));
    // Business Insider ships the full article in <content>; keep only its summary bullets.
    const content = decode(tag(body, 'content') ?? '');
    const bullets = content.match(/<ul class="summary-list">([\s\S]*?)<\/ul>/)?.[1];
    const blurb = text(tag(body, 'description') ?? bullets ?? '').slice(0, 500);
    if (title && /^https:\/\//.test(url) && !Number.isNaN(published.getTime())) {
      items.push({ title, url, source, publishedAt: published.toISOString(), blurb });
    }
  }
  return items;
}

function score(item) {
  const all = `${item.title} ${item.blurb}`;
  if (!AI.test(all)) return 0;
  const finance = new Set((all.match(FINANCE) ?? []).map((w) => w.toLowerCase())).size;
  if (!finance) return 0;
  return finance + (AGENTS.test(all) ? 3 : 0) + (AI.test(item.title) ? 1 : 0);
}

async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'agentic-finance.live news block' }, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function shortlist() {
  const now = Date.now();
  const results = await Promise.allSettled(FEEDS.map(async (f) => parseFeed(await get(f.url), f.source)));
  results.forEach((r, i) => r.status === 'rejected' && log('feed failed:', FEEDS[i].url, r.reason?.message));
  const seen = new Set();
  const previous = await get(LIVE_COPY)
    .then((t) => JSON.parse(t).url)
    .catch(() => undefined);
  const fresh = results
    .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    .filter((it) => now - Date.parse(it.publishedAt) < MAX_AGE_MS && Date.parse(it.publishedAt) <= now + 3_600_000)
    .filter((it) => !seen.has(it.url) && seen.add(it.url))
    .map((it) => ({ ...it, score: score(it) }))
    .filter((it) => it.score > 0)
    .sort((a, b) => b.score - a.score || Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  // Rotate: skip yesterday's pick unless it is the only relevant article left.
  const rotated = fresh.filter((it) => it.url !== previous);
  return (rotated.length ? rotated : fresh).slice(0, SHORTLIST);
}

const SCHEMA = {
  type: 'object',
  properties: {
    index: { type: 'integer', description: 'Index of the chosen article, or -1 if none fits.' },
    summary: { type: 'string', description: 'Two short sentences, in our own words.' },
  },
  required: ['index', 'summary'],
  additionalProperties: false,
};

const SYSTEM = `You pick the news item for the home page of Agentic Finance, an invitation-only summit series about AI agents in finance: banking, trading, payments, asset management, digital assets and the infrastructure and rules around them.

From the numbered articles, choose the one most relevant to that audience. Prefer stories about AI agents or AI systems acting in financial services. If none is genuinely about AI in finance, return index -1 and an empty summary.

Then write a summary of the chosen article: exactly two short sentences, 230 characters at most in total. Rules:
- Use only facts stated in that article's headline and blurb. Add no numbers, names or claims that are not there.
- Write it fresh in your own words. Do not reuse any phrase of five or more words from the headline or blurb.
- Plain, neutral news register. No hype, no opinion, no question, no call to action.
- No em dashes or en dashes.`;

async function summarise(items) {
  const client = new Anthropic();
  const list = items
    .map((it, i) => `[${i}] ${it.source}, ${it.publishedAt.slice(0, 10)}\nHeadline: ${it.title}\nBlurb: ${it.blurb || '(none)'}`)
    .join('\n\n');
  const response = await client.beta.messages.create({
    model: 'claude-opus-5-5',
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: SCHEMA } },
    system: SYSTEM,
    messages: [{ role: 'user', content: list }],
  });
  if (response.stop_reason === 'refusal') throw new Error(`declined (${response.stop_details?.category ?? 'no category'})`);
  if (response.stop_reason !== 'end_turn') throw new Error(`stopped early: ${response.stop_reason}`);
  const out = response.content.find((b) => b.type === 'text');
  if (!out) throw new Error('no text block in the response');
  return JSON.parse(out.text);
}

/** True if `summary` repeats six or more consecutive words of `source`. */
function copies(summary, source) {
  const words = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
  const src = ` ${words(source).join(' ')} `;
  const sum = words(summary);
  for (let i = 0; i + 6 <= sum.length; i++) if (src.includes(` ${sum.slice(i, i + 6).join(' ')} `)) return true;
  return false;
}

async function main() {
  for (const f of OUT_FILES) fs.rmSync(path.join(root, f), { force: true });

  const items = await shortlist();
  if (process.argv.includes('--candidates')) {
    items.forEach((it, i) => log(`[${i}] ${it.score} ${it.publishedAt.slice(0, 16)} ${it.source}: ${it.title}`));
    return;
  }
  if (!items.length) return log('no relevant article from the last 3 days; block hidden');
  if (!process.env.ANTHROPIC_API_KEY) return log('ANTHROPIC_API_KEY is not set; block hidden');

  const { index, summary: raw } = await summarise(items);
  const pick = items[index];
  if (!pick) return log('no article judged relevant; block hidden');
  const summary = noLongDashes(raw.trim());
  if (summary.length < 60 || summary.length > 280) throw new Error(`summary length ${summary.length} out of range`);
  if (copies(summary, `${pick.title} ${pick.blurb}`)) throw new Error('summary repeats the source wording');

  const article = {
    title: pick.title,
    summary,
    source: pick.source,
    url: pick.url,
    publishedAt: pick.publishedAt,
    generatedAt: new Date().toISOString(),
  };
  for (const f of OUT_FILES) fs.writeFileSync(path.join(root, f), `${JSON.stringify(article, null, 2)}\n`);
  log(`picked ${pick.source}: ${pick.title}`);
}

main().catch((err) => {
  for (const f of OUT_FILES) fs.rmSync(path.join(root, f), { force: true });
  if (err instanceof Anthropic.APIError) log(`Claude API error ${err.status ?? ''}: ${err.message}; block hidden`);
  else log(`${err.message}; block hidden`);
});
