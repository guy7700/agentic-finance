import type { ImageAsset } from './types';

/**
 * What only the Hong Kong page has: its photos, the Consensus film and the Consensus week.
 * Its day, time, attendance and Luma registration are in upcoming-2027.ts; the sections every
 * 2027 event page shares are in event-landing.ts.
 */
const hk = (name: string, alt: string, position?: string): ImageAsset => ({ src: `/images/hong-kong/${name}.webp`, alt, position });

/** Hong Kong photography supplied for the page, in public/images/hong-kong. */
export const hkPhotos = {
  peakDawn: hk('hk-peak-dawn', 'Hong Kong from Victoria Peak at dawn, the harbour lit under a pink and purple sky', '50% 55%'),
  sunsetHarbour: hk('hk-sunset-harbour', 'Hong Kong Island towers at sunset, with Victoria Harbour on the right', '50% 60%'),
  junkHarbour: hk('hk-junk-harbour', 'A red-sailed junk on Victoria Harbour at night, with the Central skyline behind', '58% 60%'),
  goldenHour: hk('hk-golden-hour', 'Victoria Harbour and the Central skyline at golden hour, Kowloon beyond', '50% 55%'),
};

/** The film behind the hero: CoinDesk's Consensus Hong Kong highlights. */
export const hkHeroVideo = { id: 'GaGcJ1ALFxQ', title: 'Consensus Hong Kong highlights' };

export const consensusHk = {
  name: 'Consensus Hong Kong',
  dates: '1 to 3 February 2027',
  venue: 'Hong Kong Convention and Exhibition Centre',
  url: 'https://consensus-hongkong.coindesk.com',
};

/** Section 08: Consensus week, as the draft gives it. An entry without a date is not shown. */
export const hkWeekEvents: { title: string; date: string; note: string; stat?: string; href?: string }[] = [
  { title: 'Consensus Hong Kong', date: '1 to 3 Feb', note: 'Hong Kong Convention and Exhibition Centre', stat: '10K attendees from 100+ countries', href: 'https://consensus-hongkong.coindesk.com' },
  { title: 'Institutional Summit Hong Kong', date: '', note: 'Part of Consensus Hong Kong' },
  { title: 'Deal Flow+', date: '2 to 3 Feb', note: 'Pre-scheduled 1:1 meetings at Consensus', stat: '10,000+ 1:1 meetings' },
  { title: 'PitchFest', date: '', note: 'Part of Consensus Hong Kong' },
];

/** Consensus figures as given in the draft. */
export const hkConsensusStats = [
  { value: '10K', label: 'Attendees' },
  { value: '100+', label: 'Countries' },
  { value: '$87T', label: 'Assets managed, 2026' },
  { value: '10,000+', label: '1:1 meetings' },
];

