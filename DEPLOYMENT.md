# Deployment: GitHub Pages + agentic-finance.live

The site is a static export (`next build` → `out/`), hosted on GitHub Pages and served at **https://agentic-finance.live**.

## How it deploys

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `out/` to GitHub Pages. No server is involved.

Build settings (repository → Settings → Secrets and variables → Actions → **Variables**):

| Variable | Default | Effect |
| --- | --- | --- |
| `FORMS_LIVE` | `true` | Forms post to the existing Google Apps Script sheets. Set `false` to switch delivery off. |
| `ALLOW_INDEXING` | `true` | Search engines may index the site. Set `false` to send `noindex`. |

## Daily "In the news" article

The workflow also runs every day at 04:00 UTC. Before building, `npm run news` (`scripts/latest-article.mjs`) reads the Business Insider, CNBC and TechCrunch fintech feeds, shortlists articles from the last 3 days about AI in finance, and asks Claude to pick one and write a two-sentence summary in its own words. The home page shows the headline, that summary, the source, the date and a link to the original.

It needs one repository secret (Settings → Secrets and variables → Actions → **Secrets**): `ANTHROPIC_API_KEY`. Without it, or when no recent article fits, or the summary fails its checks, the block is simply hidden. The page also hides it in the browser once the article is more than 3 days old. GitHub pauses scheduled workflows in a repository with no activity for 60 days; re-enable it in the Actions tab if that happens.

## Domain (GoDaddy DNS for agentic-finance.live)

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | guy7700.github.io |

Remove GoDaddy’s default parked `@` A records and any domain forwarding. The custom domain is set in the repository’s Pages settings (and `public/CNAME`). Once the certificate is issued, tick **Enforce HTTPS** in Settings → Pages.

## Forms

The browser posts directly to the two Apps Script web apps used by the live Abu Dhabi site (`src/config/forms.ts`). Both allow cross-site requests, so the site only shows success when the script confirms delivery. Partnership and nomination payloads match the Abu Dhabi forms field for field; the contact form adds `formType: "Contact enquiry"`.

## Local

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in out/
```

## Old mnm.live URLs (optional)

To send visitors from the old pages to the new site, add redirects on the mnm.live server, for example `mnm.live/agentic-finance` → `https://agentic-finance.live/`, `/agentic-finance-abu-dhabi` → `https://agentic-finance.live/editions/abu-dhabi-2026/`, and `/agentic-finance/speakers/:slug` → `https://agentic-finance.live/speakers/:slug/`. The full map is in `src/data/legacy-redirects.ts`. Keep `/agentic-finance-abu-dhabi/invitation` live, because invitation verification still runs there.
