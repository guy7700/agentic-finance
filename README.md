# Agentic Finance — global site

The permanent home of **Agentic Finance**, More & More’s invitation-only summit series: the upcoming **Abu Dhabi 2026** edition, the **Singapore 2026** archive, and the **2027** international series (Hong Kong, Rio de Janeiro, Paris, Dubai, Singapore).

Built with Next.js 16 (App Router, static export), React 19, TypeScript and Tailwind CSS v4. The whole site is plain files, hosted on GitHub Pages at https://agentic-finance.live.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting, the GoDaddy DNS records and form settings.

---

## Route map

Navigation follows the six-group hierarchy in the navigation spec (`Agentic Finance – Menu.html`). Desktop: mega-menu panels. Mobile: 390px drawer with accordions and pinned CTAs.

| Group | Route | Page |
| --- | --- | --- |
| — | `/` | Global homepage |
| — | `/invitation` | Request an invitation (current edition → Luma) |
| **Events** | `/events` | Series overview |
| | `/events/2026` | Every 2026 event |
| | `/events/2026/abu-dhabi` | Abu Dhabi: Summit + VIP Gala |
| | `/events/2026/abu-dhabi/gala` | VIP Gala, Tue 8 Dec 2026 |
| | `/events/2026/singapore` | Archive: recap, agenda, speakers, partners, gallery |
| | `/events/2026/singapore/agenda` | Run of show, both stages (legacy `#af-1530` anchors kept) |
| | `/events/2027` | 2027 international series |
| | `/events/2027/{hong-kong,af-dubai,paris,the-odds-cannes,the-odds-dubai,singapore}` | 2027 event pages (kept out of search until `published`) |
| | `/events/2027/meetings` | "Where will you be in 2027?" questionnaire (personal links, Meta pixel) |
| **About** | `/about` | One page: who we are, More & More, event series, program (six questions, 15 topics), formats, who gets in, team, FAQ |
| | `/about/press` | Press coverage and brand kit |
| | `/about/gallery` | Photos from every event |
| | `/about/video` | Video library |
| | `/about/contact` | Contact form (`?topic=&edition=` prefill) |
| | `/events/2026/singapore/recap` | Singapore 2026 recap |
| **Live** | `/live` | News, X Spaces, webinars and newsletter |
| | `/live/news`, `/live/news/{slug}` | Daily news (formerly `/blog`), from `src/content/daily` |
| | `/live/{spaces,webinars,newsletter}` | [TBC] pages, kept out of search until they have content |
| **Speakers** | `/speakers` | Directory (filters: edition, city, organisation, search) |
| | `/speakers/{slug}` | Speaker profiles (59) |
| | `/events/2026/abu-dhabi/speakers` | Abu Dhabi lineup (announced one by one) |
| | `/events/2026/singapore/speakers` | Singapore lineup + speakers by session |
| | `/speakers/nominate` | Nomination form + 15-minute call |
| **Partners** | `/partners` | Partnership overview |
| | `/partners/categories` | 12 categories (interactive, `?category=` deep links) |
| | `/partners/use-cases` | Use cases index |
| | `/partners/{etoro,fireblocks,alpaca,limitless,mme-legal}` | Case studies |
| | `/partners/past-partners` | Logos by edition, partners kept separate from on-stage organisations |
| | `/partners/book-a-call` | 20-minute call (Google appointment schedule) + enquiry form |
| — | `/sitemap.xml`, `/robots.txt`, `/og/<page path>.jpg` | SEO and link previews: one share card per page, drawn at build time from `src/lib/og/cards.ts` |

## Architecture

```
src/
  config/site.ts          Identity, navigation tree, CTAs, external URLs, booking links, contacts
  config/forms.ts         Form webhook URLs (Apps Script)
  data/                   All content, typed (types.ts)
    editions.ts           Editions + status (upcoming | completed | planned)
    speakers.ts           Speaker profiles (migrated, curated order)
    sessions.ts           Singapore run of show
    program.ts            Topics, six questions, formats, audience
    partners.ts           Categories, use cases, organisations, edition relationships
    media.ts              Gallery collections and videos
    about.ts              Producer facts, event series, FAQ
    legacy-redirects.ts   Old URL → new URL map
  lib/                    Queries (content.ts), SEO, paths/base path, form validation
  components/
    layout/               Header (mega-menu + mobile drawer), footer
    ui/                   Buttons, hero, stats, accordion, breadcrumbs, JSON-LD…
    editions/             Edition cards, global-series selector, edition templates
    speakers/             Speaker card, directory, agenda browser
    program/ partners/ media/ forms/ home/
  app/                    Routes (see map above)
```

Edition pages are one template per status (`UpcomingEdition`, `CompletedEdition`), rendered by `app/events/2026/[city]`. Each edition's address is its `path` in `src/data/editions.ts`; the 2027 pages are `app/events/2027/[slug]`, from `src/data/upcoming-2027.ts`. Nothing is duplicated per city.

**Moved pages.** Old addresses are listed in `src/data/redirects.mjs`. After `next build`, `scripts/write-redirects.mjs` writes a forwarding page at each one and fails the build if any address in `qa/baseline-urls.txt` (the site on 24 Nov 2026) stops answering.

### Adding or updating content

- **New edition / city:** add a record to `src/data/editions.ts`. Give it a `path`. A planned city gets a card on `/events` and a section on `/events/2027`; its page is its entry in `src/data/upcoming-2027.ts`. When it becomes the next event, set `status: 'upcoming'`, fill `dateLabel`, `facts`, `experiences`, `invitationUrl`, and point `site.currentEdition` at it; every “Request an invitation” CTA follows.
- **Archive an edition:** set `status: 'completed'`, add `metrics`, and add its sessions file to `sessions` in `src/lib/content.ts`.
- **Announce an Abu Dhabi speaker:** add `'abu-dhabi-2026'` to that speaker’s `editions` in `src/data/speakers.ts` (or add a new speaker record and headshot in `public/images/speakers/`). The empty state is replaced automatically.
- **Announce a partner:** add an `editionOrganizations` record in `src/data/partners.ts` with `relationship: 'partner'`. Only records with `title-partner` or `partner` are shown as partners.
- **Photos and video:** add to `src/data/media.ts` (captions are required).

## Forms

Nomination, partnership and contact forms validate in the browser and post directly to the Google Apps Script web apps the live Abu Dhabi forms use, with the same payload shape (`formType: "Speaker nomination" | "Partner application"`), plus `"Contact enquiry"` for the contact form. Success is only shown after the script confirms delivery; otherwise the visitor sees the error and a direct email (`tal@mnm.live`, `partners@mnm.live`). Delivery is on only when built with `NEXT_PUBLIC_FORMS_LIVE=true` (the GitHub deploy sets this), so local builds never write to the production sheets.

## Content rules encoded in the data

- Abu Dhabi: only “December 2026” is public for the Summit; Tuesday 8 December is the **VIP Gala** date and is never used as the Summit date. No venue is published.
- No Abu Dhabi speakers are labelled confirmed; past speakers appear under “Speakers at our conferences”.
- Singapore figures are the published retrospective: 650+ attendees, 60+ speakers, 17 sessions, 2 stages.
- 12 partnership categories vs. no more than 8 Abu Dhabi positions, stated wherever categories appear.
- Only eToro, Fireblocks, Alpaca and Limitless are shown as Singapore partners; other logos are “represented on stage”.
- 2027 cities: “Dates to be announced”, no venues, no speakers.
- No price list is published.

## Quality checks run

- `tsc` and ESLint clean; production build prerenders 114 pages.
- 82 scripted interaction checks (desktop mega-menu, keyboard, Escape/outside click, mobile drawer, both CTAs, directory filters, category explorer, topics, global series, gallery lightbox, FAQ, video, agenda filters, all three forms incl. validation) — all passing in dev and production builds.
- No horizontal overflow on any route at 390, 768, 1024 and 1280px.
- axe-core (WCAG 2.1 AA + best practices): 0 violations on every route, desktop and mobile.
- Link and image crawl: 123 internal links resolve, all images load.
- Lighthouse (mobile, simulated slow 4G): performance 89–91, accessibility 100, best practices 100, CLS 0. SEO reads 69 only because indexing is intentionally disabled pre-launch.
