# Publishing the daily article

One article a day from the agentic finance space. Each article is one JSON file. It appears in the "Latest news" block on the home page, and gets its own page under `/live/news`. There is no RSS feed (removed on Tal's feedback, 24 Nov 2026). Publishing never needs a code change: adding the file is the whole job.

## Where the file goes

```
src/content/daily/YYYY-MM-DD-<slug>.json
```

For example `src/content/daily/2026-10-26-agentic-payments-pilot.json`. The date prefix keeps the folder in order; the site reads the date from inside the file.

## Fields

| Field | Required | Rules |
| --- | --- | --- |
| `title` | yes | Our own headline, not the source's. Up to 140 characters. |
| `slug` | yes | Lowercase words joined by hyphens, unique. Becomes `/live/news/<slug>`. `page` is reserved. |
| `date` | yes | Publication date, `YYYY-MM-DD`. A future date waits for that day's build. |
| `summary` | yes | 2 to 4 sentences in our own words. Never copy text from the article. Up to 900 characters. |
| `whyItMatters` | yes | One sentence on why it matters for finance. Up to 300 characters. |
| `sourceName` | yes | The publication, e.g. `CNBC`. |
| `sourceUrl` | yes | The original article, `https://` only. |
| `tags` | no | Lowercase-hyphenated words, e.g. `["agentic-payments", "banking"]`. Related posts are chosen by shared tags. |
| `draft` | no | `true` keeps the entry off the live site (it still shows on a local preview). Defaults to `false`. |
| `rank` | no | Order within a day: `1` is the day's lead story, shown in the home page hero. |
| `image` | no | Only an image we own or license: `{ "src": "/images/blog/<file>.webp", "alt": "...", "credit": "..." }`. Put the file in `public/images/blog/` first. |

Em dashes and en dashes are turned into commas or hyphens automatically, so copy stays within the house style.

## Example

```json
{
  "title": "Will AI agents pull deposits away from banks?",
  "slug": "ai-agents-bank-deposits",
  "date": "2026-10-23",
  "summary": "Investors are asking whether AI agents acting for customers could move deposits away from banks. Analysts quoted by CNBC think the risk is overstated, at least for now.",
  "whyItMatters": "Deposits are a bank's cheapest funding, so agents that move money for customers reach the core of the banking model.",
  "sourceName": "CNBC",
  "sourceUrl": "https://www.cnbc.com/investingclub/2026/10/23/ai-agents-could-disrupt-bank-deposits-why-wall-street-may-be-overreacting.html",
  "tags": ["banking", "ai-agents"],
  "draft": true
}
```

This entry is in the repo as a draft so the templates can be tested. It never appears on the live site.

## How it goes live

The site is a static build on GitHub Pages, deployed by `.github/workflows/deploy.yml`:

1. **The Wire's "Add to website" action** commits the file to `main` in `guy7700/agentic-finance` through the GitHub contents API (`PUT /repos/guy7700/agentic-finance/contents/src/content/daily/<file>.json`), using a fine-grained token that can only write this repository's contents.
2. **The push triggers a deploy.** The site rebuilds and publishes in about two to three minutes.
3. **A scheduled build runs every day at 04:00 UTC.** It publishes entries whose date has arrived and drops entries more than 14 days old from the home page block.

To publish by hand, add the file on github.com (Add file, then Create new file) and commit it to `main`.

## Checks

Every entry is checked during the build. A missing field, a bad date, a duplicate slug or a non-https link stops the build, the Actions log names the file and the problem, and the live site stays as it was until the file is fixed.

The home page block, right under the hero, lists the 3 newest published entries from the last 14 days. An entry leaves the block once it is 14 days old, and the block hides when none is left; every entry stays on `/live/news`. The age is checked at build time and again in the visitor's browser, so the block never shows stale news even if a daily build is missed.


## From the Agentic Finance Wire (26 Nov 2026)

The Wire (claude.ai artifact "Agentic Finance Wire") scores the day's stories and stores them in its own database: `articles` (title, source, url, summary, score, verdict, category, `featured` date) and `briefs` (one per day, with the `top` story ids). The site's news archive started from the Wire's top stories of 24 to 26 November, one file each, with `rank` from the brief's order.

Never publish a Wire article's `angle` field: it holds internal outreach notes. Use the Wire's `summary` (our own words) and write `whyItMatters`; keep `title` our own headline.

**Automating it, without a daily AI cost on the site:** the site is a static export rebuilt every day by GitHub Actions, so it only needs the files to appear in `src/content/daily/`. The lightest route is one extra step at the end of the Wire's own 07:00 run: write that day's top 1 to 3 stories as JSON files in this format and commit them to the repo (a GitHub token with write access to `guy7700/agentic-finance` is the only credential needed). The alternative is a public, read-only table or view in Supabase that the build reads; that needs a small migration and a row-level-security policy. Either way the website itself makes no AI calls, so `scripts/latest-article.mjs` and its ANTHROPIC_API_KEY can be retired.

**Media partners (BeInCrypto, CoinDesk and others):** reproducing their articles or images needs their permission. What to ask each partner for: an RSS feed or API of headlines, summaries and links that may be shown on agentic-finance.live, written permission to show their article images (or an image feed), and the attribution format they require. Until then, posts show our own summary and link to the original.
