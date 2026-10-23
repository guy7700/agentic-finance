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
  /** The edition every global "Request an invitation" CTA points to. */
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
    minutes: 20,
    label: 'Book a 20-minute partnership call',
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
  { label: 'More & More on Telegram', short: 'Telegram', href: 'https://t.me/moreandmorebd' },
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

/** The six top-level groups, in the order defined by the navigation spec. */
export const navigation: NavGroup[] = [
  {
    id: 'editions',
    label: 'Editions',
    job: 'The series: what is coming, and what already happened.',
    href: '/editions',
    items: [
      { label: 'Abu Dhabi 2026', description: 'Upcoming · Summit and VIP Gala, Tue 8 Dec', href: '/editions/abu-dhabi-2026' },
      { label: 'Singapore 2026', description: 'Archive · 8 Oct 2026, recap and numbers', href: '/editions/singapore-2026' },
      { label: '2027 cities', description: 'Hong Kong, Rio de Janeiro, Paris, Dubai, Singapore', href: '/editions/2027' },
      { label: 'Request an invitation', description: 'Abu Dhabi 2026', href: '/invitation', cta: true },
    ],
  },
  {
    id: 'program',
    label: 'Program',
    job: 'What the room discusses and who belongs in it.',
    href: '/program',
    items: [
      { label: 'Topics', description: '15 areas', href: '/program/topics' },
      { label: 'The six questions', description: 'What the room is here to settle', href: '/program/questions' },
      { label: 'Formats', description: 'Keynotes, firesides, introductions, meetings', href: '/program/formats' },
      { label: 'Who gets in', description: 'Invitation only, every request reviewed', href: '/program/who-gets-in' },
    ],
  },
  {
    id: 'speakers',
    label: 'Speakers',
    job: 'Everyone who has held the floor, tagged by city.',
    href: '/speakers',
    items: [
      { label: 'All speakers', description: 'Every edition', href: '/speakers' },
      { label: 'Abu Dhabi 2026', description: 'Announced one by one', href: '/editions/abu-dhabi-2026/speakers' },
      { label: 'Singapore 2026', description: '60+ speakers, 17 sessions', href: '/editions/singapore-2026/speakers' },
      { label: 'Nominate a speaker', description: 'Form or 15-minute call', href: '/speakers/nominate', cta: true },
    ],
  },
  {
    id: 'partners',
    label: 'Partners',
    job: 'The commercial path. Ends in a call, never a price list.',
    href: '/partners',
    items: [
      { label: 'Partnership categories', description: '12 categories, 8 positions in Abu Dhabi', href: '/partners/categories' },
      { label: 'Use cases', description: 'eToro, Fireblocks, Alpaca, Limitless', href: '/partners/use-cases' },
      { label: 'Past partners', description: 'Logo wall by edition', href: '/partners/past-partners' },
      { label: 'Book a partnership call', description: '20 minutes', href: '/partners/book-a-call', cta: true },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    job: 'Proof in pictures for partners and guests.',
    href: '/media',
    items: [
      { label: 'Singapore 2026 recap', description: 'Numbers, sessions, moments', href: '/media/singapore-2026-recap' },
      { label: 'Video', description: 'Recap and highlights', href: '/media/video' },
      { label: 'Gallery', description: 'Photos by edition', href: '/media/gallery' },
      { label: 'Press and brand kit', description: 'Coverage, logos, contacts', href: '/media/press' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    job: 'Who stands behind the room.',
    href: '/about',
    items: [
      { label: 'More & More', description: 'Producer, track record', href: '/about/more-and-more' },
      { label: 'Event series', description: 'Web2 to Web3, The Odds, Agentic Finance', href: '/about/event-series' },
      { label: 'FAQ', description: 'Access, invitations, partnerships', href: '/about/faq' },
      { label: 'Contact', description: 'Talk to the team', href: '/about/contact' },
    ],
  },
];

/** The two permanent header actions. */
export const primaryActions = {
  invitation: { label: 'Request an invitation', href: '/invitation' },
  partner: { label: 'Partner with us', href: '/partners' },
} as const;
