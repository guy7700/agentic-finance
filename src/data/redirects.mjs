/**
 * Moved pages: every old address and where its content lives now.
 *
 * The site is a static export on GitHub Pages, which cannot send real HTTP
 * redirects. After `next build`, scripts/write-redirects.mjs writes a small
 * forwarding page at each `from` address. It sends visitors on at once (keeping
 * any ?utm= codes and #anchors), names the new page as the canonical one for
 * search engines, and copies the new page's title and share card so old links
 * still preview properly in WhatsApp, Telegram and LinkedIn.
 *
 * Checked on every build, which fails if a rule breaks:
 * - `to` is a real page of the build, never another forwarding page.
 * - `from` is not a real page: a page that still exists is never overwritten.
 * - every address in qa/baseline-urls.txt (the site before the restructure,
 *   24 Nov 2026) still answers, as a page or a forwarding page.
 *
 * Paths are written without the trailing slash, like the site's links. A `to` may
 * end in "#section" to land on part of a page.
 * The restructure follows Tal's "agentic-finance.live: Site Structure" (23 Nov 2026).
 */

/** @type {{ from: string; to: string }[]} */
export const redirects = [
  // Case studies: /partners/use-cases/<company> → /partners/<company>. All five stay, MME Legal included.
  { from: '/partners/use-cases/etoro', to: '/partners/etoro' },
  { from: '/partners/use-cases/fireblocks', to: '/partners/fireblocks' },
  { from: '/partners/use-cases/alpaca', to: '/partners/alpaca' },
  { from: '/partners/use-cases/limitless', to: '/partners/limitless' },
  { from: '/partners/use-cases/mme-legal', to: '/partners/mme-legal' },

  // Events: /editions/<city>-<year> → /events/<year>/<city>, sub-pages included.
  { from: '/editions', to: '/events' },
  { from: '/editions/abu-dhabi-2026', to: '/events/2026/abu-dhabi' },
  { from: '/editions/abu-dhabi-2026/speakers', to: '/events/2026/abu-dhabi/speakers' },
  { from: '/editions/abu-dhabi-2026/gala', to: '/events/2026/abu-dhabi/gala' },
  { from: '/editions/singapore-2026', to: '/events/2026/singapore' },
  { from: '/editions/singapore-2026/speakers', to: '/events/2026/singapore/speakers' },
  { from: '/editions/singapore-2026/agenda', to: '/events/2026/singapore/agenda' },

  // 2027: the city pages forward to the detailed 2027 pages (user, 24 Nov 2026). No Rio page:
  // Rio lands on its section of /events/2027.
  { from: '/editions/2027', to: '/events/2027' },
  { from: '/editions/hong-kong-2027', to: '/events/2027/hong-kong' },
  { from: '/editions/dubai-2027', to: '/events/2027/af-dubai' },
  { from: '/editions/paris-2027', to: '/events/2027/paris' },
  { from: '/editions/rio-de-janeiro-2027', to: '/events/2027#rio-de-janeiro-2027' },
  { from: '/editions/singapore-2027', to: '/events/2027/singapore' },
  { from: '/upcoming/2027/afhk', to: '/events/2027/hong-kong' },
  { from: '/upcoming/2027/afdubai', to: '/events/2027/af-dubai' },
  { from: '/upcoming/2027/afsignal', to: '/events/2027/paris' },
  { from: '/upcoming/2027/ethcctheodds', to: '/events/2027/the-odds-cannes' },
  { from: '/upcoming/2027/dbwtheodds', to: '/events/2027/the-odds-dubai' },
  { from: '/upcoming/2027/afsingapore', to: '/events/2027/singapore' },

  // The 2027 questionnaire. Personal links carry name, email, company and utm_* in the
  // query string, which the forward keeps.
  { from: '/2027', to: '/events/2027/meetings' },
  { from: '/2027/thanks', to: '/events/2027/meetings/thanks' },

  // About is one page (who we are, topics, formats, who it's for, team, FAQ): the Program
  // pages and the About sub-pages land on their section of it.
  { from: '/program', to: '/about#program' },
  { from: '/program/questions', to: '/about#questions' },
  { from: '/program/topics', to: '/about#topics' },
  { from: '/program/formats', to: '/about#formats' },
  { from: '/program/who-gets-in', to: '/about#who-its-for' },
  { from: '/about/more-and-more', to: '/about#more-and-more' },
  { from: '/about/event-series', to: '/about#event-series' },
  { from: '/about/faq', to: '/about#faq' },

  // Media: photos, video and press live under About (Tal's feedback, 24 Nov 2026); the
  // Singapore recap is a page of the Singapore event.
  { from: '/media', to: '/about/gallery' },
  { from: '/media/gallery', to: '/about/gallery' },
  { from: '/media/video', to: '/about/video' },
  { from: '/media/press', to: '/about/press' },
  { from: '/media/singapore-2026-recap', to: '/events/2026/singapore/recap' },
  { from: '/brand', to: '/about/press#brand-kit' },

  // Live: the blog is the news of Live (Tal's site structure). Its posts move with it.
  { from: '/blog', to: '/live/news' },

  // Apply to attend (Tal's site structure: /apply/).
  { from: '/invitation', to: '/apply' },
];
