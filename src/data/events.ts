import type { ImageAsset } from './types';
import { eventDate, nextEdition2027 } from './upcoming-2027';

/**
 * The home page events: the next event, and the past editions with their figures (as
 * published on mnm.live/agentic-finance-abu-dhabi, checked 25 October 2026).
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
 * The next event on the home page, the news pages and the share cards: the first 2027 edition
 * whose day has not passed (Hong Kong, 1 Feb 2027; Abu Dhabi 2026 will not take place).
 * Built from the one schedule in upcoming-2027.ts.
 */
const next = nextEdition2027();
const nextDate = eventDate(next);
export const nextEvent: UpcomingEvent = {
  id: next.editionSlug,
  name: next.name,
  date: nextDate.long,
  time: nextDate.time,
  city: next.city,
  line: `During ${next.context}.${next.attendees ? ` Up to ${next.attendees} curated attendees.` : ''}`,
  href: next.path,
  start: next.startsAt,
  end: next.endsAt,
};

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
    name: 'The Odds: Prediction Markets Live',
    city: 'Paris',
    date: 'April 2026',
    facts: [
      { value: '200+', label: 'Attendees' },
      { value: '20+', label: 'Speakers' },
      { value: '8', label: 'Sessions' },
    ],
    href: '/events/2026/the-odds-paris',
    image: { src: '/images/more-and-more/the-odds-paris-room.jpg', alt: 'A full room at The Odds, Paris Blockchain Week' },
  },
  {
    id: 'web2-to-web3-2025',
    name: 'Web2 to Web3 Conference',
    city: 'Abu Dhabi',
    date: '2025',
    facts: [
      { value: '150', label: 'Attendees' },
      { value: '15+', label: 'Speakers' },
      { value: '8', label: 'Sessions' },
    ],
    href: '/events/2025/web2-to-web3-abu-dhabi',
    image: { src: '/images/more-and-more/web2toweb3-session.webp', alt: 'A seated session at the Web2 to Web3 Summit in Abu Dhabi' },
  },
];
