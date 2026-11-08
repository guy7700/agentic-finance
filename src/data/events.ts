import type { ImageAsset } from './types';

/**
 * The home page events block. Facts as published on
 * mnm.live/agentic-finance-abu-dhabi (checked 25 October 2026): the summit and
 * Gala, its 2027 calendar, and its "Our Recent Events" figures.
 */
export type UpcomingEvent = {
  id: string;
  name: string;
  date: string;
  time?: string;
  city: string;
  venue?: string;
  line: string;
  /** At most one line about a side event, inside the same card. */
  note?: string;
  href: string;
};

export type PastEvent = {
  id: string;
  name: string;
  city: string;
  date: string;
  venue?: string;
  facts: { value: string; label: string }[];
  href: string;
  image: ImageAsset;
};

/** The next event. Its own page, mnm.live/agentic-finance-abu-dhabi, handles sign-ups. */
export const nextEvent: UpcomingEvent = {
  id: 'abu-dhabi-2026',
  name: 'Agentic Finance Summit Abu Dhabi',
  date: 'Friday 4 December 2026',
  time: '14:00-18:00 GST',
  city: 'Abu Dhabi',
  venue: 'Saadiyat Island',
  line: '500 curated guests. By invitation only.',
  note: 'VIP Gala on Tuesday 8 December 2026, by personal invitation only.',
  href: 'https://mnm.live/agentic-finance-abu-dhabi',
};

/** The 2027 calendar, in date order. */
export const plannedEvents: UpcomingEvent[] = [
  { id: 'hong-kong-2027', name: 'Agentic Finance Hong Kong', date: 'February 2027', city: 'Hong Kong', line: 'During Consensus Hong Kong.', href: '/editions/hong-kong-2027' },
  { id: 'dubai-2027', name: 'Agentic Finance Dubai', date: 'April 2027', city: 'Dubai', line: 'During TOKEN2049 Dubai.', href: '/editions/dubai-2027' },
  { id: 'paris-2027', name: 'Agentic Finance Paris', date: 'June 2027', city: 'Paris', line: 'During Proof of Talk.', href: '/editions/paris-2027' },
  { id: 'rio-de-janeiro-2027', name: 'Agentic Finance Rio de Janeiro', date: 'August 2027', city: 'Rio de Janeiro', line: 'During Blockchain.RIO.', href: '/editions/rio-de-janeiro-2027' },
  { id: 'singapore-2027', name: 'Agentic Finance Singapore', date: 'October 2027', city: 'Singapore', line: 'During TOKEN2049 Singapore.', href: '/editions/singapore-2027' },
];

export const pastEvents: PastEvent[] = [
  {
    id: 'singapore-2026',
    name: 'Agentic Finance Summit Singapore',
    city: 'Singapore',
    date: '8 October 2026',
    venue: 'Suntec · TOKEN2049 week',
    facts: [
      { value: '650+', label: 'Attendees' },
      { value: '60+', label: 'Speakers' },
      { value: '17', label: 'Sessions' },
    ],
    href: '/editions/singapore-2026',
    image: {
      src: '/images/singapore-2026/agentic-capital-panel.webp',
      alt: 'The Agentic Capital panel on the Singapore stage',
      position: '50% 46%',
    },
  },
  {
    id: 'the-odds-paris-2026',
    name: 'The Odds at Paris Blockchain Week',
    city: 'Paris',
    date: 'April 2026',
    facts: [
      { value: '200+', label: 'Attendees' },
      { value: '20+', label: 'Speakers' },
      { value: '8', label: 'Sessions' },
    ],
    href: '/about/event-series',
    image: { src: '/images/more-and-more/the-odds-paris-room.jpg', alt: 'A full room at The Odds, Paris Blockchain Week' },
  },
  {
    id: 'web2-to-web3-2025',
    name: 'Web2 to Web3 Summit',
    city: 'Abu Dhabi',
    date: '2025',
    facts: [
      { value: '150', label: 'Attendees' },
      { value: '15+', label: 'Speakers' },
      { value: '8', label: 'Sessions' },
    ],
    href: '/about/event-series',
    image: { src: '/images/more-and-more/web2toweb3-session.webp', alt: 'A seated session at the Web2 to Web3 Summit in Abu Dhabi' },
  },
];
