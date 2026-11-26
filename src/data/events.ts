import { hkEvent } from './af-hk';
import type { ImageAsset } from './types';

/**
 * The home page events block: the next event, the 2027 calendar and the "Our Recent
 * Events" figures (as published on mnm.live/agentic-finance-abu-dhabi, checked
 * 25 October 2026).
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
  /** ISO start and end with offset, for the event's structured data. */
  start?: string;
  end?: string;
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

/**
 * The next event on the home page and the news pages: Hong Kong (user, 26 Nov 2026;
 * Abu Dhabi will not take place, and its own pages stay as they are). Day and time come
 * from src/data/af-hk.ts; the venue is not confirmed yet, so it is left out.
 */
export const nextEvent: UpcomingEvent = {
  id: 'hong-kong-2027',
  name: 'Agentic Finance Hong Kong',
  date: hkEvent.dayLabel ?? 'February 2027',
  time: hkEvent.timeLabel,
  city: 'Hong Kong',
  venue: hkEvent.venue,
  line: 'During Consensus Hong Kong.',
  href: '/events/2027/hong-kong',
  start: hkEvent.startsAt,
  end: hkEvent.endsAt,
};

/** The 2027 calendar, in date order. */
export const plannedEvents: UpcomingEvent[] = [
  { id: 'hong-kong-2027', name: 'Agentic Finance Hong Kong', date: 'February 2027', city: 'Hong Kong', line: 'During Consensus Hong Kong.', href: '/events/2027/hong-kong' },
  { id: 'dubai-2027', name: 'Agentic Finance Dubai', date: 'April 2027', city: 'Dubai', line: 'During TOKEN2049 Dubai.', href: '/events/2027/af-dubai' },
  { id: 'paris-2027', name: 'Agentic Finance Paris', date: 'July 2027', city: 'Paris', line: 'During Signal Week.', href: '/events/2027/paris' },
  { id: 'rio-de-janeiro-2027', name: 'Agentic Finance Rio de Janeiro', date: 'August 2027', city: 'Rio de Janeiro', line: 'During Blockchain.RIO.', href: '/events/2027#rio-de-janeiro-2027' },
  { id: 'singapore-2027', name: 'Agentic Finance Singapore', date: 'October 2027', city: 'Singapore', line: 'During TOKEN2049 Singapore.', href: '/events/2027/singapore' },
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
    href: '/events/2026/singapore',
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
    href: '/about#event-series',
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
    href: '/about#event-series',
    image: { src: '/images/more-and-more/web2toweb3-session.webp', alt: 'A seated session at the Web2 to Web3 Summit in Abu Dhabi' },
  },
];
