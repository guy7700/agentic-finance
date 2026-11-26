/**
 * Site-wide configuration: identity, external URLs, contacts and the global
 * navigation tree. Every CTA on the site resolves through this file, so a new
 * upcoming edition or a new booking link is a one-line change.
 */

export const site = {
  name: 'Agentic Finance',
  producer: 'More & More',
  /**
   * Public URL of the site, used for canonical tags, sitemaps and social previews.
   */
  canonicalBase: (process.env.NEXT_PUBLIC_CANONICAL_BASE ?? 'https://agentic-finance.live').replace(/\/$/, ''),
  /** Search indexing stays off until the launch is approved. */
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true',
  description:
    'Agentic Finance is an invitation-only summit series convening the institutions, capital allocators, regulators and builders shaping AI-native finance.',
  tagline: 'Where finance’s decision-makers meet.',
  /** The edition every global "Apply to attend" CTA points to. */
  currentEdition: 'abu-dhabi-2026',
  copyrightYear: 2026,
} as const;

export const externalLinks = {
  /** Luma registration for the current upcoming edition (Abu Dhabi 2026). */
  invitation: 'https://luma.com/25oj08jc',
  /** Personal-invitation verification flow on the live Abu Dhabi site. */
  verifyInvitation: 'https://mnm.live/agentic-finance-abu-dhabi/invitation',
  /** Existing working speaker-nomination page, kept as a fallback. */
  nominateLegacy: 'https://mnm.live/agentic-finance-abu-dhabi/nominate',
  /** Singapore 2026 registration (closed, kept for reference only). */
  singaporeRegistration: 'https://luma.com/8oxs8lco',
  moreAndMore: 'https://mnm.live/',
  moreAndMoreCaseStudies: 'https://mnm.live/case-studies',
  theOddsSingapore: 'https://mnm.live/theodds/t2049singapore',
  token2049: 'https://www.token2049.com/singapore',
  luma: 'https://lu.ma/moreandmore',
} as const;

export const booking = {
  partnership: {
    url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2zWBN4qAjLZHmAPekDSY8oGVtQhMd5aSu7h0lhOGREZB26jPcYsNkdTEZQepVr_g1j6EYFOJ7d?gv=true',
    minutes: 30,
    label: 'Partner with us',
  },
  speaker: {
    url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2zWBN4qAjLZHmAPekDSY8oGVtQhMd5aSu7h0lhOGREZB26jPcYsNkdTEZQepVr_g1j6EYFOJ7d?gv=true',
    minutes: 15,
    label: 'Book a 15-minute introductory call',
  },
} as const;

export const contacts = {
  general: 'tal@mnm.live',
  partnerships: 'partners@mnm.live',
  press: 'tal@mnm.live',
} as const;

export const social = [
  { label: 'More & More on LinkedIn', short: 'LinkedIn', href: 'https://www.linkedin.com/company/moreandmore-bd/' },
  { label: 'More & More on X', short: 'X', href: 'https://x.com/moreandmorebd' },
  { label: 'More & More on Instagram', short: 'Instagram', href: 'https://www.instagram.com/moreandmorebd' },
  { label: 'The Odds on Telegram', short: 'Telegram', href: 'https://t.me/theoddspredict' },
] as const;

export type NavItem = {
  label: string;
  description: string;
  href: string;
  /** Highlighted conversion entry, rendered in gold. */
  cta?: boolean;
};

export type NavGroup = {
  id: string;
  label: string;
  /** The panel's one-line job, from the navigation specification. */
  job: string;
  href: string;
  items: NavItem[];
};

/** The top-level groups, in the order of Tal's site structure: Events, Network, Partners, Speakers, Live, Index, About. */
export const navigation: NavGroup[] = [
  {
    id: 'editions',
    label: 'Events',
    job: 'The series: what is coming, and what already happened.',
    href: '/events',
    items: [
      { label: 'Abu Dhabi 2026', description: 'Upcoming · Summit and VIP Gala, Tue 8 Dec', href: '/events/2026/abu-dhabi' },
      { label: 'Singapore 2026', description: 'Archive · 8 Oct 2026, recap and numbers', href: '/events/2026/singapore' },
      { label: '2027 cities', description: 'Hong Kong, Rio de Janeiro, Paris, Dubai, Singapore', href: '/events/2027' },
      { label: 'Apply to attend', description: 'Abu Dhabi 2026', href: '/apply', cta: true },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    job: 'Startups, VCs, companies, banks and ecosystem builders in one network.',
    href: '/network',
    items: [
      { label: 'Startups', description: 'Free membership', href: '/network/startups' },
      { label: 'VCs', description: 'Free, Venture Partner tier by request', href: '/network/vcs' },
      { label: 'Companies', description: 'Founding and Strategic Partner seats', href: '/network/companies' },
      { label: 'Institutions', description: 'Free, by invitation', href: '/network/institutions' },
      { label: 'Ecosystem', description: 'Associations, governments, accelerators, media', href: '/network/ecosystem' },
    ],
  },
  {
    id: 'partners',
    label: 'Partners',
    job: 'Every company we’ve worked with.',
    href: '/partners',
    items: [
      { label: 'All companies', description: 'By Network group and by event', href: '/partners' },
      { label: 'Case studies', description: 'eToro, Fireblocks, Alpaca, Limitless, MME Legal', href: '/partners#case-studies' },
      { label: 'Partnership categories', description: '12 categories', href: '/network/companies#categories' },
      { label: 'Partner with us', description: 'A 30-minute call', href: '/network/companies#book-a-call', cta: true },
    ],
  },
  {
    id: 'speakers',
    label: 'Speakers',
    job: 'Everyone who has held the floor, tagged by city.',
    href: '/speakers',
    items: [
      { label: 'All speakers', description: 'Every edition', href: '/speakers' },
      { label: 'Abu Dhabi 2026', description: 'Announced one by one', href: '/events/2026/abu-dhabi/speakers' },
      { label: 'Singapore 2026', description: '60+ speakers, 17 sessions', href: '/events/2026/singapore/speakers' },
      { label: 'Nominate a speaker', description: 'Form or 15-minute call', href: '/speakers/nominate', cta: true },
    ],
  },
  {
    id: 'live',
    label: 'Live',
    job: 'News, X Spaces, webinars and the newsletter.',
    href: '/live',
    items: [
      { label: 'News', description: 'Today in agentic finance', href: '/live/news' },
      { label: 'X Spaces', description: 'Episodes [TBC]', href: '/live/spaces' },
      { label: 'Webinars', description: '[TBC]', href: '/live/webinars' },
      { label: 'Newsletter', description: 'Signup and archive [TBC]', href: '/live/newsletter' },
    ],
  },
  {
    id: 'index',
    label: 'Index',
    job: 'The AF100, the industry map and quarterly reports.',
    href: '/af100',
    items: [{ label: 'AF100', description: 'The list, the map and quarterly reports [TBC]', href: '/af100' }],
  },
  {
    id: 'about',
    label: 'About',
    job: 'Who stands behind the room.',
    href: '/about',
    items: [
      { label: 'Program', description: 'Six questions, 15 topics, formats, who gets in', href: '/about#program' },
      { label: 'More & More', description: 'Producer, track record', href: '/about#more-and-more' },
      { label: 'Event series', description: 'Web2 to Web3, The Odds, Agentic Finance', href: '/about#event-series' },
      { label: 'Gallery', description: 'Photos from every event', href: '/about/gallery' },
      { label: 'Video', description: 'Recaps and highlights', href: '/about/video' },
      { label: 'Press and brand kit', description: 'Coverage, logos, contacts', href: '/about/press' },
      { label: 'FAQ', description: 'Access, invitations, partnerships', href: '/about#faq' },
      { label: 'Contact', description: 'Talk to the team', href: '/about/contact' },
    ],
  },
];

/** The two permanent header actions. */
export const primaryActions = {
  /** `short` is the header button (Tal's site structure: "Apply"); `label` is used on buttons across the site. */
  invitation: { label: 'Apply to attend', short: 'Apply', href: '/apply' },
  partner: { label: 'Partner with us', href: '/network/companies' },
  /** The 2027 questionnaire, linked from the header and the mobile menu. */
  questionnaire: { label: 'Where in 2027?', href: '/events/2027/meetings' },
} as const;
