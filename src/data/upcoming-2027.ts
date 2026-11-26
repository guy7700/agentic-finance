import { events2027 } from '@/config/events-2027';
import type { ImageAsset } from './types';

/**
 * The 2027 editions: one record per event, and the only place their dates, times,
 * registration links and pages are written. The home page, /events, /events/2027,
 * the menu, the event pages, the share cards and the sitemap all read from here.
 *
 * Schedule (Tal's review, 26 Nov 2026): Hong Kong, Cannes, Dubai, Miami, Paris,
 * Singapore (Cannes is an Agentic Finance edition, not The Odds). Each edition is an afternoon summit (16:00 to 19:00) followed by a
 * Founders and Funders Dinner (19:00 to 20:00), on the evening before or the first
 * day of the main conference it runs during.
 *
 * `dateStatus` keeps estimates honest: only 'confirmed' is shown as a plain date.
 * 'planned' (a date Tal approved for planning) and 'provisional' (the evening before
 * the main conference, picked while nothing else is set) are both shown as
 * provisional. Rio de Janeiro was dropped and The Odds Dubai lives on The Odds' own site.
 */
export type Upcoming2027 = {
  slug: string;
  /** The page's address, for good: "/events/2027/hong-kong". */
  path: string;
  /** The matching record in editions.ts ("hong-kong-2027"). */
  editionSlug: string;
  brand: 'agentic-finance' | 'the-odds';
  name: string;
  city: string;
  country: string;
  /** The industry event it runs during, as named by its organiser. */
  context: string;
  /** `id` of that event in events-2027.ts, for its confirmed days. */
  contextEventId?: string;
  /** The organiser's site for that event. */
  contextUrl?: string;
  /** One line under the title. */
  subtitle: string;
  tagline: string;
  positioning: string;
  image: ImageAsset;
  /** A second photo for cards (the home page's next-event card). Defaults to `image`. */
  cardImage?: ImageAsset;
  /** Our day: ISO start and end with the local offset, and the local zone's short name. */
  startsAt: string;
  endsAt: string;
  tz: string;
  timeZone: string;
  dateStatus: 'confirmed' | 'planned' | 'provisional';
  /** "Up to N curated attendees", only where agreed. */
  attendees?: number;
  /** The event's own Luma registration. Without it, "Apply to attend" opens the interest form. */
  luma?: { eventId: string; url: string };
  /** False keeps the page out of search results and the sitemap. */
  published: boolean;
};

const SUBTITLE = 'Where finance leaders meet the technology of tomorrow.';

export const upcoming2027: Upcoming2027[] = [
  {
    slug: 'afhk',
    path: '/events/2027/hong-kong',
    editionSlug: 'hong-kong-2027',
    brand: 'agentic-finance',
    name: 'Agentic Finance Hong Kong',
    city: 'Hong Kong',
    country: 'Hong Kong SAR',
    context: 'Consensus Hong Kong',
    contextEventId: 'consensus-hk',
    contextUrl: 'https://consensus-hongkong.coindesk.com',
    subtitle: SUBTITLE,
    tagline: 'Asia’s capital markets, and the agents entering them.',
    positioning:
      'A gateway between global institutions and Asian capital, with an active digital-asset policy agenda. A natural room for the trading, custody and market-infrastructure decisions agents will force.',
    image: { src: '/images/hong-kong/hk-peak-dawn.webp', alt: 'Hong Kong from Victoria Peak at dawn, the harbour lit under a pink and purple sky', position: '50% 55%' },
    cardImage: { src: '/images/hong-kong/hk-junk-harbour.webp', alt: 'A red-sailed junk on Victoria Harbour at night, with the Hong Kong skyline behind', position: '58% 60%' },
    startsAt: '2027-02-01T16:00:00+08:00',
    endsAt: '2027-02-01T20:00:00+08:00',
    tz: 'HKT',
    timeZone: 'Asia/Hong_Kong',
    dateStatus: 'confirmed',
    attendees: 400,
    // "Agentic Finance Hong Kong" on the More & More Events calendar (checked 26 Nov 2026).
    luma: { eventId: 'evt-DTBF4KNDrFSuCux', url: 'https://luma.com/afhk27' },
    published: true,
  },
  {
    slug: 'afcannes',
    path: '/events/2027/cannes',
    editionSlug: 'cannes-2027',
    brand: 'agentic-finance',
    name: 'Agentic Finance Cannes',
    city: 'Cannes',
    country: 'France',
    context: 'EthCC',
    contextEventId: 'ethcc',
    contextUrl: 'https://ethcc.io',
    subtitle: SUBTITLE,
    tagline: 'Europe’s builders, in one room with its institutions.',
    positioning:
      'EthCC, Europe’s largest Ethereum conference, comes to Cannes in April. The room where the teams building on-chain infrastructure meet the institutions that will put agents to work on it.',
    image: { src: '/assets/events/cannes.jpg', alt: 'Yachts in the harbour at Cannes, with the Mediterranean coast behind' },
    startsAt: '2027-04-13T16:00:00+02:00',
    endsAt: '2027-04-13T20:00:00+02:00',
    tz: 'CEST',
    timeZone: 'Europe/Paris',
    dateStatus: 'planned',
    published: true,
  },
  {
    slug: 'afdubai',
    path: '/events/2027/af-dubai',
    editionSlug: 'dubai-2027',
    brand: 'agentic-finance',
    name: 'Agentic Finance Dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    context: 'TOKEN2049 Dubai',
    contextEventId: 'token2049-dubai',
    contextUrl: 'https://www.token2049.com/dubai',
    subtitle: SUBTITLE,
    tagline: 'The Gulf’s fastest-moving market for digital assets.',
    positioning:
      'A regional hub for exchanges, fintech and digital-asset firms, and one of More & More’s two bases. Dubai is where operators come to build, license and scale.',
    image: { src: '/images/cities/dubai.webp', alt: 'Downtown Dubai at dusk, the Burj Khalifa rising above the skyline' },
    startsAt: '2027-04-20T16:00:00+04:00',
    endsAt: '2027-04-20T20:00:00+04:00',
    tz: 'GST',
    timeZone: 'Asia/Dubai',
    dateStatus: 'planned',
    published: true,
  },
  {
    slug: 'afmiami',
    path: '/events/2027/miami',
    editionSlug: 'miami-2027',
    brand: 'agentic-finance',
    name: 'Agentic Finance Miami',
    city: 'Miami',
    country: 'United States',
    context: 'Consensus Miami',
    contextEventId: 'consensus-miami',
    subtitle: SUBTITLE,
    tagline: 'Where US capital meets the agent economy.',
    positioning:
      'Consensus Miami gathers the US digital-asset industry, its investors and its policymakers. Miami is the room for the institutions and builders taking agentic finance to American markets.',
    image: { src: '/assets/events/miami.jpg', alt: 'The Miami waterfront skyline at sunset' },
    startsAt: '2027-05-03T16:00:00-04:00',
    endsAt: '2027-05-03T20:00:00-04:00',
    tz: 'EDT',
    timeZone: 'America/New_York',
    dateStatus: 'planned',
    published: true,
  },
  {
    slug: 'afsignal',
    path: '/events/2027/paris',
    editionSlug: 'paris-2027',
    brand: 'agentic-finance',
    name: 'Agentic Finance Paris',
    city: 'Paris',
    country: 'France',
    context: 'Signal Week',
    contextEventId: 'signal-week',
    subtitle: SUBTITLE,
    tagline: 'European rules for autonomous finance.',
    positioning:
      'Europe sets much of the world’s regulatory tone. Paris is the room for governance, compliance and the institutional questions agentic finance has to answer before it scales.',
    image: { src: '/images/cities/paris.webp', alt: 'The Louvre pyramid in Paris, lit at night' },
    startsAt: '2027-07-05T16:00:00+02:00',
    endsAt: '2027-07-05T20:00:00+02:00',
    tz: 'CEST',
    timeZone: 'Europe/Paris',
    dateStatus: 'planned',
    published: true,
  },
  {
    slug: 'afsingapore',
    path: '/events/2027/singapore',
    editionSlug: 'singapore-2027',
    brand: 'agentic-finance',
    name: 'Agentic Finance Singapore',
    city: 'Singapore',
    country: 'Singapore',
    context: 'TOKEN2049 Singapore',
    contextEventId: 'token2049-sg',
    contextUrl: 'https://www.token2049.com/singapore',
    subtitle: SUBTITLE,
    tagline: 'Back where the series began.',
    positioning:
      'Asia’s financial centre and home of the first edition. The second Singapore room builds on 2026: the same seniority, sharper questions.',
    image: { src: '/images/cities/singapore.webp', alt: 'Marina Bay at night, Gardens by the Bay and Marina Bay Sands across the water' },
    // The evening before TOKEN2049 Singapore (6 to 7 October), picked provisionally (Tal, 26 Nov 2026).
    startsAt: '2027-10-05T16:00:00+08:00',
    endsAt: '2027-10-05T20:00:00+08:00',
    tz: 'SGT',
    timeZone: 'Asia/Singapore',
    dateStatus: 'provisional',
    published: true,
  },
];

export function getUpcoming2027(slug: string): Upcoming2027 | undefined {
  return upcoming2027.find((p) => p.slug === slug);
}

/** The 2027 page at `path` ("/events/2027/hong-kong"). */
export function getUpcoming2027ByPath(path: string): Upcoming2027 | undefined {
  return upcoming2027.find((p) => p.path === path);
}

/** The next edition: the first one whose day has not ended. Static pages are rebuilt daily. */
export function nextEdition2027(now = Date.now()): Upcoming2027 {
  return upcoming2027.find((p) => Date.parse(p.endsAt) > now) ?? upcoming2027[upcoming2027.length - 1];
}

/** The editions after `p`, in date order. */
export function editionsAfter(p: Upcoming2027): Upcoming2027[] {
  return upcoming2027.slice(upcoming2027.indexOf(p) + 1);
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function parts(p: Upcoming2027, iso: string) {
  const d = new Date(iso);
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { ...o, timeZone: p.timeZone }).format(d);
  return {
    weekday: f({ weekday: 'long' }),
    day: f({ day: 'numeric' }),
    month: f({ month: 'long' }),
    monthShort: f({ month: 'short' }),
    year: f({ year: 'numeric' }),
    time: f({ hour: '2-digit', minute: '2-digit', hour12: false }),
  };
}

/** Everything a page needs to show an edition's day: "Monday 1 February 2027", "16:00 to 20:00 HKT", "1 Feb". */
export function eventDate(p: Upcoming2027) {
  const s = parts(p, p.startsAt);
  const e = parts(p, p.endsAt);
  return {
    long: `${s.weekday} ${s.day} ${s.month} ${s.year}`,
    medium: `${s.day} ${s.month} ${s.year}`,
    short: `${s.day} ${s.monthShort}`,
    monthYear: `${s.month} ${s.year}`,
    weekday: s.weekday,
    start: s.time,
    end: e.time,
    time: `${s.time} to ${e.time} ${p.tz}`,
    /** True when the day may still move: shown with a "Provisional" note. */
    provisional: p.dateStatus !== 'confirmed',
  };
}

/** The programme of the day, from its times: the summit, then the Founders and Funders Dinner. */
export function eventPlan(p: Upcoming2027) {
  const { start, end } = eventDate(p);
  const dinner = '19:00';
  return [
    { when: `${start} to ${dinner}`, title: 'The Summit', body: 'Keynotes, panels and curated discussions on AI agents in finance, with private rooms for business meetings.' },
    { when: `${dinner} to ${end}`, title: 'Founders and Funders Dinner', body: 'Founders, investors and institutions at one table, to carry the afternoon’s conversations forward.' },
    { when: 'Throughout', title: 'The room', body: 'Hand-selected guests, curated introductions, light food and beverages.' },
  ];
}

/** The month of the anchor event: "July 2027", or "2027" without a confirmed date. */
export function contextMonth(page: Upcoming2027): string {
  const ev = events2027.find((e) => e.id === page.contextEventId);
  if (!ev?.start) return '2027';
  const [y, m] = ev.start.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** "21 to 22 April 2027", from the anchor event's confirmed days. Empty when they are not confirmed. */
export function contextDates(page: Upcoming2027): string {
  const ev = events2027.find((e) => e.id === page.contextEventId);
  if (!ev?.start || !ev.end) return '';
  const [sy, sm, sd] = ev.start.split('-').map(Number);
  const [ey, em, ed] = ev.end.split('-').map(Number);
  if (sy === ey && sm === em) return sd === ed ? `${sd} ${MONTHS[sm - 1]} ${sy}` : `${sd} to ${ed} ${MONTHS[sm - 1]} ${sy}`;
  return `${sd} ${MONTHS[sm - 1]} to ${ed} ${MONTHS[em - 1]} ${ey}`;
}
