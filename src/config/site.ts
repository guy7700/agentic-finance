import { eventDate, nextEdition2027, upcoming2027 } from '@/data/upcoming-2027';

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
  copyrightYear: 2026,
} as const;

export const externalLinks = {
  /** Luma registration of Abu Dhabi 2026, which will not take place. Not linked anywhere; kept for the record. */
  abuDhabiRegistration: 'https://luma.com/25oj08jc',
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

/** Partnership enquiries go to Guy (Tal's review, 26 Nov 2026). */
export const contacts = {
  general: 'tal@mnm.live',
  partnerships: 'guy@mnm.live',
  press: 'tal@mnm.live',
} as const;

/**
 * Social icons in the footer and on Contact. Destinations as linked from mnm.live. Telegram is
 * The Odds' channel, More & More's prediction-markets community: no More & More channel was found.
 */
export const social = [
  { label: 'More & More on LinkedIn', short: 'LinkedIn', href: 'https://www.linkedin.com/company/moreandmore-bd/' },
  { label: 'More & More on X', short: 'X', href: 'https://x.com/moreandmorebd' },
  { label: 'The Odds by More & More on Telegram', short: 'Telegram', href: 'https://t.me/theoddspredict' },
  { label: 'More & More on Instagram', short: 'Instagram', href: 'https://www.instagram.com/moreandmorebd' },
  { label: 'More & More website, mnm.live', short: 'Website', href: 'https://mnm.live/' },
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

/** The next edition and the one after it, for the Events menu (Tal: "the next two events, past, and partner with us"). */
const next = nextEdition2027();
const nextTwo = upcoming2027.slice(upcoming2027.indexOf(next), upcoming2027.indexOf(next) + 2);
const menuDate = (p: (typeof upcoming2027)[number]) => {
  const d = eventDate(p);
  return `${d.medium}${d.provisional ? ', provisional' : ''} · During ${p.context}`;
};

/** The top-level groups, in the order of Tal's site structure: Events, Network, Partners, Speakers, Live, Index, About. */
export const navigation: NavGroup[] = [
  {
    id: 'editions',
    label: 'Events',
    job: 'Face-to-face gatherings around the world.',
    href: '/events',
    items: [
      ...nextTwo.map((p) => ({ label: p.name, description: menuDate(p), href: p.path })),
      { label: 'Past events', description: 'Singapore, The Odds Paris, Web2 to Web3 Abu Dhabi', href: '/events#past' },
      { label: 'Partner at our events', description: 'Book a partnership call', href: '/partners/book-a-call', cta: true },
    ],
  },
  {
    id: 'network',
    label: 'Network',
    job: 'Free to join for startups, VCs, companies, institutions and the ecosystem.',
    href: '/network',
    items: [
      { label: 'Startups', description: 'Join for free', href: '/network/startups' },
      { label: 'Venture Capital', description: 'Join for free', href: '/network/vcs' },
      { label: 'Companies', description: 'Join for free', href: '/network/companies' },
      { label: 'Institutions', description: 'Join for free', href: '/network/institutions' },
      { label: 'Ecosystem', description: 'Join for free', href: '/network/ecosystem' },
    ],
  },
  {
    id: 'partners',
    label: 'Partners',
    job: 'The companies at our conferences, and what they achieved.',
    href: '/partners',
    items: [
      { label: 'All partners', description: 'Every company, by group and by event', href: '/partners' },
      { label: 'Achievements of our partners', description: 'Launches, deals and milestones', href: '/partners#achievements' },
      { label: 'Book a partnership call', description: 'A 30-minute call with the team', href: '/partners/book-a-call', cta: true },
    ],
  },
  {
    id: 'speakers',
    label: 'Speakers',
    job: 'Everyone who has taken the stage at our events.',
    href: '/speakers',
    items: [
      { label: 'All speakers', description: 'Every event', href: '/speakers' },
      { label: 'Nominate a speaker', description: 'Form or 15-minute call', href: '/speakers/nominate', cta: true },
    ],
  },
  {
    id: 'live',
    label: 'Live',
    job: 'News, X Spaces, webinars and the monthly newsletter.',
    href: '/live',
    items: [
      { label: 'News', description: 'Agentic finance, every day', href: '/live/news' },
      { label: 'X Spaces', description: 'Live conversations on X', href: '/live/spaces' },
      { label: 'Webinars', description: 'Sessions with practitioners', href: '/live/webinars' },
      { label: 'Newsletter', description: 'The month in agentic finance', href: '/live/newsletter' },
    ],
  },
  {
    id: 'index',
    label: 'Index',
    job: 'Research on the agentic finance industry.',
    href: '/af100',
    items: [
      { label: 'Index overview', description: 'Three initiatives', href: '/af100' },
      { label: 'Agentic Finance 100', description: 'The top 100 companies, ranked by institutions', href: '/af100/list' },
      { label: 'Industry Map', description: 'The agentic finance landscape', href: '/af100/map' },
      { label: 'Quarterly Reports', description: 'The state of the industry', href: '/af100/reports' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    job: 'More & More, the producer behind the room.',
    href: '/about',
    items: [
      { label: 'About us', description: 'More & More, track record and team', href: '/about/more-and-more' },
      { label: 'Event series', description: 'Web2 to Web3, The Odds, Agentic Finance', href: '/about#event-series' },
      { label: 'Program', description: 'What happens at our events', href: '/about/program' },
      { label: 'Themes', description: 'The questions shaping finance', href: '/about/themes' },
      { label: 'Brand', description: 'Videos, photos and brand kit', href: '/about/brand' },
      { label: 'Press', description: 'Coverage of our events', href: '/about/press' },
      { label: 'Contact', description: 'Talk to the team', href: '/about/contact' },
    ],
  },
];

/**
 * Calls to action. "Partner with us" is the one global CTA (Tal's review, 26 Nov 2026): it
 * replaces the header's Apply button and always leads to the partnership booking page.
 * Attendance CTAs open the next event's registration; Network CTAs the free forms.
 */
export const primaryActions = {
  partner: { label: 'Partner with us', href: '/partners/book-a-call' },
  /** General "Apply to attend": the next event's registration section, where the Luma window opens. */
  invitation: { label: 'Apply to attend', short: 'Apply', href: `${next.path}#join` },
  network: { label: 'Join our Network for free', href: '/network#who-are-you' },
} as const;
