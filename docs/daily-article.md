# Publishing the daily article

One article a day from the agentic finance space. Each article is one JSON file. It appears in the "Latest news" block on the home page, gets its own page under `/blog`, and goes into the RSS feed at `/rss.xml`. Publishing never needs a code change: adding the file is the whole job.

## Where the file goes

```
src/content/daily/YYYY-MM-DD-<slug>.json
```

For example `src/content/daily/2026-10-26-agentic-payments-pilot.json`. The date prefix keeps the folder in order; the site reads the date from inside the file.

## Fields

| Field | Required | Rules |
| --- | --- | --- |
| `title` | yes | Our own headline, not the source's. Up to 140 characters. |
| `slug` | yes | Lowercase words joined by hyphens, unique. Becomes `/blog/<slug>`. `page` is reserved. |
| `date` | yes | Publication date, `YYYY-MM-DD`. A future date waits for that day's build. |
| `summary` | yes | 2 to 4 sentences in our own words. Never copy text from the article. Up to 900 characters. |
| `whyItMatters` | yes | One sentence on why it matters for finance. Up to 300 characters. |
| `sourceName` | yes | The publication, e.g. `CNBC`. |
| `sourceUrl` | yes | The original article, `https://` only. |
| `tags` | no | Lowercase-hyphenated words, e.g. `["agentic-payments", "banking"]`. Related posts are chosen by shared tags. |
| `draft` | no | `true` keeps the entry off the live site (it still shows on a local preview). Defaults to `false`. |
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

The home page block, right under the hero, lists the 3 newest published entries from the last 14 days. An entry leaves the block once it is 14 days old, and the block hides when none is left; every entry stays on `/blog`. The age is checked at build time and again in the visitor's browser, so the block never shows stale news even if a daily build is missed.
