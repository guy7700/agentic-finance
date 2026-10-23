/**
 * Legacy URL map: every public URL of the Singapore and Abu Dhabi sites and
 * where it lives in the global site. Used in two places:
 *
 * 1. `next.config.ts` redirects, for legacy paths that reach this app.
 * 2. The migration notes (MIGRATION.md), for the redirects that must be added
 *    to the main mnm.live app, because `/agentic-finance-abu-dhabi` sits
 *    outside this app's base path.
 *
 * `source` paths are written relative to mnm.live. `inApp` is the source as
 * seen by this app when it is mounted at mnm.live/agentic-finance.
 */
export type LegacyRedirect = {
  source: string;
  destination: string;
  /** True when the path is served by this app once mounted at /agentic-finance. */
  inApp: boolean;
  note?: string;
};

export const legacyRedirects: LegacyRedirect[] = [
  // Singapore 2026 site (currently at mnm.live/agentic-finance)
  { source: '/agentic-finance/agenda', destination: '/editions/singapore-2026/agenda', inApp: true },
  { source: '/agentic-finance/partner', destination: '/partners/book-a-call', inApp: true },
  { source: '/agentic-finance/nominate', destination: '/speakers/nominate', inApp: true },
  { source: '/agentic-finance/gallery', destination: '/media/gallery', inApp: true },
  // /agentic-finance/speakers and /agentic-finance/speakers/:slug keep the same paths.

  // Abu Dhabi 2026 site
  { source: '/agentic-finance-abu-dhabi', destination: '/editions/abu-dhabi-2026', inApp: false },
  { source: '/agentic-finance-abu-dhabi/gala', destination: '/editions/abu-dhabi-2026/gala', inApp: false },
  { source: '/agentic-finance-abu-dhabi/speakers', destination: '/editions/abu-dhabi-2026/speakers', inApp: false },
  { source: '/agentic-finance-abu-dhabi/speakers/:slug', destination: '/speakers/:slug', inApp: false },
  { source: '/agentic-finance-abu-dhabi/nominate', destination: '/speakers/nominate', inApp: false },
  { source: '/agentic-finance-abu-dhabi/partner', destination: '/partners/book-a-call', inApp: false },
  {
    source: '/agentic-finance-abu-dhabi/invitation',
    destination: '/agentic-finance-abu-dhabi/invitation',
    inApp: false,
    note: 'Keep live: personal-invitation verification runs on the existing app. Do not redirect until it is migrated.',
  },
];
