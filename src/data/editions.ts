import { externalLinks } from '@/config/site';
import type { Edition } from './types';

/**
 * The Agentic Finance series. Status drives every template: upcoming editions
 * convert, completed editions prove, planned editions collect interest.
 *
 * Editorial rules encoded here:
 * - Abu Dhabi: only "December 2026" is public for the summit. The VIP Gala date
 *   (Tue 8 Dec) belongs to the Gala and is never reused as the summit date.
 * - Singapore: completed. Retrospective figures as published on the Abu Dhabi site.
 * - 2027: planned cities only. No dates, venues or speakers.
 */
export const editions: Edition[] = [
  {
    slug: 'abu-dhabi-2026',
    name: 'Agentic Finance Abu Dhabi',
    shortName: 'Abu Dhabi 2026',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    year: 2026,
    status: 'upcoming',
    dateLabel: 'December 2026',
    venue: { name: 'Abu Dhabi', note: 'Date and venue are shared with invited guests as they are confirmed.' },
    tagline: 'Where finance’s decision-makers meet.',
    summary:
      'An invitation-only gathering of 500 hand-selected leaders shaping the future of finance, digital assets and prediction markets.',
    positioning:
      'Abu Dhabi is where sovereign wealth, global banks and regulators already meet. Agentic Finance Abu Dhabi brings the people building what comes next into one room.',
    image: {
      src: '/images/abu-dhabi-2026/al-maryah.webp',
      alt: 'Al Maryah Island, Abu Dhabi: the financial district towers on the waterfront',
      caption: 'Al Maryah Island, Abu Dhabi',
    },
    heroVideo: { src: '/video/singapore-2026-summit-ambient.mp4', poster: '/images/singapore-2026/summit-poster.jpg' },
    facts: [
      { value: '500', label: 'Curated guests' },
      { value: '8', label: 'Strategic partner positions' },
      { value: 'Invitation', label: 'Only. No tickets' },
    ],
    experiences: [
      {
        id: 'summit',
        name: 'Agentic Finance Summit',
        when: 'Abu Dhabi · December 2026',
        summary:
          'The main gathering. 500 hand-selected guests from institutions, capital and the companies building agentic finance.',
        points: [
          'Keynotes and fireside conversations',
          'Senior founder and institutional discussions',
          'Curated introductions and private meetings',
        ],
        href: '/invitation',
        cta: 'Request an invitation',
      },
      {
        id: 'gala',
        name: 'VIP Gala',
        when: 'Abu Dhabi · Tuesday 8 December 2026',
        summary: 'An exclusive evening for approximately 200 invited senior leaders and strategic partners.',
        points: ['Executive networking, seated and unhurried', 'Private relationship building', 'By personal invitation only'],
        href: '/editions/abu-dhabi-2026/gala',
        cta: 'Discover the Gala',
      },
    ],
    speakersAnnounced: false,
    hasGala: true,
    invitationUrl: externalLinks.invitation,
    partnerPositions: 8,
    guestCount: 500,
  },
  {
    slug: 'singapore-2026',
    name: 'Agentic Finance Singapore',
    shortName: 'Singapore 2026',
    city: 'Singapore',
    country: 'Singapore',
    year: 2026,
    status: 'completed',
    dateLabel: '8 October 2026',
    startDate: '2026-10-08T14:00:00+08:00',
    endDate: '2026-10-08T20:00:00+08:00',
    venue: { name: 'Suntec City Convention Centre', address: '1 Raffles Boulevard, Suntec City, Singapore' },
    context: 'TOKEN2049 Week',
    tagline: 'The first edition. Two stages, one afternoon, the room that started the series.',
    summary:
      'An official side event of TOKEN2049 Singapore, produced by More & More at Suntec City: banks, exchanges, funds, regulators and builders comparing notes on AI agents in production.',
    positioning:
      'One afternoon during TOKEN2049 week, structured for meetings and conversation over spectacle. Agentic Finance on the main stage, The Odds: Prediction Markets Live alongside it.',
    image: {
      src: '/images/singapore-2026/agentic-capital-panel.webp',
      alt: 'The five-strong Agentic Capital panel on the Singapore stage',
      position: '50% 46%',
    },
    heroVideo: { src: '/video/singapore-2026-summit-ambient.mp4', poster: '/images/singapore-2026/summit-poster.jpg' },
    metrics: [
      { value: '650+', label: 'Attendees' },
      { value: '60+', label: 'Speakers' },
      { value: '17', label: 'Sessions' },
      { value: '2', label: 'Stages' },
    ],
    speakersAnnounced: true,
    hasAgenda: true,
  },
  {
    slug: 'hong-kong-2027',
    name: 'Agentic Finance Hong Kong',
    shortName: 'Hong Kong 2027',
    city: 'Hong Kong',
    country: 'Hong Kong SAR',
    year: 2027,
    status: 'planned',
    dateLabel: 'Dates to be announced',
    tagline: 'Asia’s capital markets, and the agents entering them.',
    summary: 'A planned 2027 edition in one of Asia’s deepest capital markets.',
    positioning:
      'A gateway between global institutions and Asian capital, with an active digital-asset policy agenda. A natural room for the trading, custody and market-infrastructure decisions agents will force.',
    image: {
      src: '/images/cities/hong-kong.webp',
      alt: 'Victoria Harbour at night, a red-sailed junk in front of the Hong Kong skyline',
    },
  },
  {
    slug: 'rio-de-janeiro-2027',
    name: 'Agentic Finance Rio de Janeiro',
    shortName: 'Rio de Janeiro 2027',
    city: 'Rio de Janeiro',
    country: 'Brazil',
    year: 2027,
    status: 'planned',
    dateLabel: 'Dates to be announced',
    tagline: 'Latin America’s payments momentum, in one room.',
    summary: 'A planned 2027 edition, the series’ first in Latin America.',
    positioning:
      'Brazil has become one of the most closely watched markets for digital payments and fintech. Rio is where agentic payments and commerce meet population scale.',
    image: {
      src: '/images/cities/rio-de-janeiro.webp',
      alt: 'Christ the Redeemer above Rio de Janeiro, with Sugarloaf Mountain across the bay',
    },
  },
  {
    slug: 'paris-2027',
    name: 'Agentic Finance Paris',
    shortName: 'Paris 2027',
    city: 'Paris',
    country: 'France',
    year: 2027,
    status: 'planned',
    dateLabel: 'Dates to be announced',
    tagline: 'European rules for autonomous finance.',
    summary: 'A planned 2027 edition in the city where More & More produced The Odds in April 2026.',
    positioning:
      'Europe sets much of the world’s regulatory tone. Paris is the room for governance, compliance and the institutional questions agentic finance has to answer before it scales.',
    image: { src: '/images/cities/paris.webp', alt: 'The Louvre pyramid in Paris, lit at night' },
  },
  {
    slug: 'dubai-2027',
    name: 'Agentic Finance Dubai',
    shortName: 'Dubai 2027',
    city: 'Dubai',
    country: 'United Arab Emirates',
    year: 2027,
    status: 'planned',
    dateLabel: 'Dates to be announced',
    tagline: 'The Gulf’s fastest-moving market for digital assets.',
    summary: 'A planned 2027 edition in More & More’s home market.',
    positioning:
      'A regional hub for exchanges, fintech and digital-asset firms, and one of More & More’s two bases. Dubai is where operators come to build, license and scale.',
    image: { src: '/images/cities/dubai.webp', alt: 'Downtown Dubai at dusk, the Burj Khalifa rising above the skyline' },
  },
  {
    slug: 'singapore-2027',
    name: 'Agentic Finance Singapore',
    shortName: 'Singapore 2027',
    city: 'Singapore',
    country: 'Singapore',
    year: 2027,
    status: 'planned',
    dateLabel: 'Dates to be announced',
    tagline: 'Back where the series began.',
    summary: 'A planned 2027 return to the city that hosted the first Agentic Finance Summit.',
    positioning:
      'Asia’s financial centre and home of the first edition. The second Singapore room builds on 2026: the same seniority, sharper questions.',
    image: {
      src: '/images/cities/singapore.webp',
      alt: 'Marina Bay at night, Gardens by the Bay and Marina Bay Sands across the water',
    },
  },
];

export function getEdition(slug: string): Edition | undefined {
  return editions.find((e) => e.slug === slug);
}

export function editionsByStatus(status: Edition['status']): Edition[] {
  return editions.filter((e) => e.status === status);
}

export function getCurrentEdition(): Edition {
  const upcoming = editions.find((e) => e.status === 'upcoming');
  if (!upcoming) throw new Error('No upcoming edition configured');
  return upcoming;
}

export const statusLabel: Record<Edition['status'], string> = {
  upcoming: 'Upcoming',
  completed: 'Archive',
  planned: 'Planned · 2027',
};

/** Short labels for other More & More stages referenced by speaker records. */
export const conferenceLabels: Record<string, { label: string; city?: string }> = {
  'the-odds-paris-2026': { label: 'The Odds · Paris 2026', city: 'Paris' },
  'more-and-more': { label: 'More & More conferences' },
};
