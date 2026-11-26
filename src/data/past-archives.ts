import type { ImageAsset } from './types';

/**
 * Archive pages for the past editions that are not Agentic Finance editions in editions.ts:
 * The Odds in Paris (April 2026) and the Web2 to Web3 conference in Abu Dhabi (2025). Facts as
 * published on mnm.live and in the event records; photos, films, speakers, companies and press
 * are pulled from their own data by the ids below.
 */
export type PastArchive = {
  id: string;
  path: string;
  name: string;
  city: string;
  date: string;
  where: string;
  summary: string;
  facts: { value: string; label: string }[];
  image: ImageAsset;
  /** Ids used by the gallery, the videos, speakers' conferences, companies and press. */
  galleryId: string;
  videoIds: string[];
  conferenceId: string;
  orgEdition?: string;
  pressIds: string[];
  /** Company pages from this event. */
  companyPages?: { label: string; href: string }[];
  caseStudy: string;
};

export const pastArchives: PastArchive[] = [
  {
    id: 'the-odds-paris-2026',
    path: '/events/2026/the-odds-paris',
    name: 'The Odds: Prediction Markets Live',
    city: 'Paris',
    date: 'April 2026',
    where: 'Connect Lounge, the Louvre · Paris Blockchain Week',
    summary:
      'A curated summit for the operators, exchanges, market makers, regulators and capital shaping prediction markets, produced by More & More during Paris Blockchain Week.',
    facts: [
      { value: '200+', label: 'Attendees' },
      { value: '20+', label: 'Speakers' },
      { value: '8', label: 'Sessions' },
    ],
    image: { src: '/images/more-and-more/the-odds-paris-room.jpg', alt: 'A full room at The Odds, Paris Blockchain Week' },
    galleryId: 'the-odds-paris-2026',
    videoIds: ['the-odds-paris-2026'],
    conferenceId: 'the-odds-paris-2026',
    orgEdition: 'the-odds-paris-2026',
    pressIds: ['the-odds-paris-2026'],
    companyPages: [{ label: 'MME Legal | Tax | Compliance', href: '/partners/mme-legal' }],
    caseStudy: 'https://mnm.live/case-studies',
  },
  {
    id: 'web2toweb3-abu-dhabi-2025',
    path: '/events/2025/web2-to-web3-abu-dhabi',
    name: 'Web2 to Web3 Conference',
    city: 'Abu Dhabi',
    date: 'December 2025',
    // 10 December 2025 at Hub71, ADGM, during Abu Dhabi Finance Week (our Chainwire releases of 1 Dec 2025 and 5 Jan 2026).
    where: 'Hub71, ADGM · 10 December 2025 · during Abu Dhabi Finance Week',
    summary:
      'A curated institutional programme where banks, payment leaders, regulators and VCs met the founders building the onboarding layer for institutional capital. Speakers from Fireblocks, eToro, CertiK, Zengo, Nominis and CryptoLaw Partners.',
    facts: [
      { value: '150', label: 'Attendees' },
      { value: '15+', label: 'Speakers' },
      { value: '8', label: 'Sessions' },
    ],
    image: { src: '/images/more-and-more/web2toweb3-session.webp', alt: 'A seated session at the Web2 to Web3 conference in Abu Dhabi' },
    galleryId: 'web2toweb3-abu-dhabi-2025',
    videoIds: ['web2-to-web3-2025', 'web2toweb3-abu-dhabi-2025'],
    conferenceId: 'web2toweb3-abu-dhabi-2025',
    orgEdition: 'web2toweb3-abu-dhabi-2025',
    pressIds: ['web2toweb3-abu-dhabi-2025'],
    caseStudy: 'https://mnm.live/case-studies#web2-to-web3',
  },
];

export const getPastArchive = (id: string) => pastArchives.find((a) => a.id === id);
