import { events2027 } from '@/config/events-2027';
import type { ImageAsset } from './types';

/**
 * The 2027 event pages at /upcoming/2027/<slug>. One entry per page: adding a
 * page is adding an entry here, with no new route or component.
 *
 * Facts rule: the anchor event's days come from `src/config/events-2027.ts`
 * (checked against each organiser's site), never typed again here. The
 * Agentic Finance or The Odds day itself, its venue and its programme are
 * unconfirmed, so those fields do not exist yet. A page shows only what is
 * confirmed and says the rest follows.
 */
export type Upcoming2027 = {
  slug: string;
  brand: 'agentic-finance' | 'the-odds';
  name: string;
  city: string;
  country: string;
  /** The industry event it runs during, as named by its organiser. */
  context: string;
  /** `id` of that event in events-2027.ts. Leave out when it is not on the shortlist. */
  contextEventId?: string;
  tagline: string;
  positioning: string;
  image: ImageAsset;
  /** False keeps the page out of search results and the sitemap until the content is final. */
  published: boolean;
};

export const upcoming2027: Upcoming2027[] = [
  {
    slug: 'afhk',
    brand: 'agentic-finance',
    name: 'Agentic Finance Hong Kong',
    city: 'Hong Kong',
    country: 'Hong Kong SAR',
    context: 'Consensus Hong Kong',
    contextEventId: 'consensus-hk',
    tagline: 'Asia’s capital markets, and the agents entering them.',
    positioning:
      'A gateway between global institutions and Asian capital, with an active digital-asset policy agenda. A natural room for the trading, custody and market-infrastructure decisions agents will force.',
    image: { src: '/images/hong-kong/hk-peak-dawn.webp', alt: 'Hong Kong from Victoria Peak at dawn, the harbour lit under a pink and purple sky', position: '50% 55%' },
    published: false,
  },
  {
    slug: 'afdubai',
    brand: 'agentic-finance',
    name: 'Agentic Finance Dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    context: 'TOKEN2049 Dubai',
    contextEventId: 'token2049-dubai',
    tagline: 'The Gulf’s fastest-moving market for digital assets.',
    positioning:
      'A regional hub for exchanges, fintech and digital-asset firms, and one of More & More’s two bases. Dubai is where operators come to build, license and scale.',
    image: { src: '/images/cities/dubai.webp', alt: 'Downtown Dubai at dusk, the Burj Khalifa rising above the skyline' },
    published: false,
  },
  {
    slug: 'afsignal',
    brand: 'agentic-finance',
    name: 'Agentic Finance Paris',
    city: 'Paris',
    country: 'France',
    context: 'Signal Week',
    contextEventId: 'signal-week',
    tagline: 'European rules for autonomous finance.',
    positioning:
      'Europe sets much of the world’s regulatory tone. Paris is the room for governance, compliance and the institutional questions agentic finance has to answer before it scales.',
    image: { src: '/images/cities/paris.webp', alt: 'The Louvre pyramid in Paris, lit at night' },
    published: false,
  },
  {
    slug: 'ethcctheodds',
    brand: 'the-odds',
    name: 'The Odds at EthCC',
    city: 'Cannes',
    country: 'France',
    context: 'EthCC',
    contextEventId: 'ethcc',
    tagline: 'Prediction Markets Live, in Cannes.',
    positioning:
      'The Odds is More & More’s prediction markets stage. It ran at Paris Blockchain Week in April 2026 and at TOKEN2049 Singapore in October 2026.',
    image: { src: '/assets/events/cannes.jpg', alt: 'Yachts in the harbour at Cannes, with the Mediterranean coast behind' },
    published: false,
  },
  {
    slug: 'dbwtheodds',
    brand: 'the-odds',
    name: 'The Odds at DBW',
    city: 'Dubai',
    country: 'United Arab Emirates',
    context: 'DBW',
    tagline: 'Prediction Markets Live, in Dubai.',
    positioning:
      'The Odds is More & More’s prediction markets stage. It ran at Paris Blockchain Week in April 2026 and at TOKEN2049 Singapore in October 2026.',
    image: { src: '/images/cities/dubai.webp', alt: 'Downtown Dubai at dusk, the Burj Khalifa rising above the skyline' },
    published: false,
  },
  {
    slug: 'afsingapore',
    brand: 'agentic-finance',
    name: 'Agentic Finance Singapore',
    city: 'Singapore',
    country: 'Singapore',
    context: 'TOKEN2049 Singapore',
    contextEventId: 'token2049-sg',
    tagline: 'Back where the series began.',
    positioning:
      'Asia’s financial centre and home of the first edition. The second Singapore room builds on 2026: the same seniority, sharper questions.',
    image: { src: '/images/cities/singapore.webp', alt: 'Marina Bay at night, Gardens by the Bay and Marina Bay Sands across the water' },
    published: false,
  },
];

export function getUpcoming2027(slug: string): Upcoming2027 | undefined {
  return upcoming2027.find((p) => p.slug === slug);
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** "21 to 22 April 2027", from the anchor event's confirmed days. Empty when they are not confirmed. */
export function contextDates(page: Upcoming2027): string {
  const ev = events2027.find((e) => e.id === page.contextEventId);
  if (!ev?.start || !ev.end) return '';
  const [sy, sm, sd] = ev.start.split('-').map(Number);
  const [ey, em, ed] = ev.end.split('-').map(Number);
  if (sy === ey && sm === em) return sd === ed ? `${sd} ${MONTHS[sm - 1]} ${sy}` : `${sd} to ${ed} ${MONTHS[sm - 1]} ${sy}`;
  return `${sd} ${MONTHS[sm - 1]} to ${ed} ${MONTHS[em - 1]} ${ey}`;
}
