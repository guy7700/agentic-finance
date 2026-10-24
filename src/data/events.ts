import type { ImageAsset } from './types';

export type EventItem = {
  id: string;
  name: string;
  date: string;
  time?: string;
  place: string;
  access?: string;
  facts: { value: string; label: string }[];
  href: string;
  cta: string;
  image?: ImageAsset;
};

/**
 * The home page events block. Facts as published on
 * mnm.live/agentic-finance-abu-dhabi (checked 24 October 2026); the two
 * More & More events come from that page's "Our Recent Events" list.
 */
export const upcomingEvents: EventItem[] = [
  {
    id: 'abu-dhabi-summit',
    name: 'Agentic Finance Summit Abu Dhabi',
    date: 'Friday 4 December 2026',
    time: '14:00-18:00 GST',
    place: 'Saadiyat Island, Abu Dhabi',
    access: 'By invitation',
    facts: [{ value: '500', label: 'Curated guests' }],
    href: '/invitation',
    cta: 'Request an invitation',
  },
  {
    id: 'abu-dhabi-gala',
    name: 'Agentic Finance VIP Gala',
    date: 'Tuesday 8 December 2026',
    time: '20:00-00:00',
    place: 'Abu Dhabi beach venue',
    access: 'By personal invitation',
    facts: [{ value: '200', label: 'Guests' }],
    href: '/editions/abu-dhabi-2026/gala',
    cta: 'Discover the Gala',
  },
];

export const pastEvents: EventItem[] = [
  {
    id: 'singapore-2026',
    name: 'Agentic Finance Summit Singapore',
    date: '8 October 2026',
    place: 'Suntec Singapore · TOKEN2049 week',
    access: 'Lead partner eToro',
    facts: [
      { value: '650+', label: 'Attendees' },
      { value: '60+', label: 'Speakers' },
      { value: '17', label: 'Sessions' },
      { value: '2', label: 'Stages' },
    ],
    href: '/editions/singapore-2026',
    cta: 'Open the archive',
    image: {
      src: '/images/singapore-2026/agentic-capital-panel.webp',
      alt: 'The Agentic Capital panel on the Singapore stage',
      position: '50% 46%',
    },
  },
  {
    id: 'the-odds-paris-2026',
    name: 'The Odds at Paris Blockchain Week',
    date: 'April 2026',
    place: 'Paris',
    access: 'Produced by More & More',
    facts: [
      { value: '200+', label: 'Attendees' },
      { value: '20+', label: 'Speakers' },
      { value: '8', label: 'Sessions' },
    ],
    href: '/about/event-series',
    cta: 'About the series',
    image: { src: '/images/more-and-more/the-odds-paris-room.jpg', alt: 'A full room at The Odds, Paris Blockchain Week' },
  },
  {
    id: 'web2-to-web3-2025',
    name: 'Web2 to Web3 Summit',
    date: '2025',
    place: 'Abu Dhabi',
    access: 'Produced by More & More',
    facts: [
      { value: '150', label: 'Attendees' },
      { value: '15+', label: 'Speakers' },
      { value: '8', label: 'Sessions' },
    ],
    href: '/about/event-series',
    cta: 'About the series',
    image: { src: '/images/more-and-more/web2toweb3-session.webp', alt: 'A seated session at the Web2 to Web3 Summit in Abu Dhabi' },
  },
];
