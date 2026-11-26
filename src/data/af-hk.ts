import type { ImageAsset } from './types';

/**
 * Content for /events/2027/hong-kong (formerly /upcoming/2027/afhk), from docs/hong-kong-page-structure.md.
 *
 * Unconfirmed facts are optional fields. While one is empty the page leaves out
 * the sentence, number or card that depends on it; nothing is invented and no
 * "TBC" is shown to visitors. Fill the field and the page picks it up.
 */
export const hkEvent: {
  /** ISO start with offset, e.g. '2027-02-02T14:00:00+08:00'. Drives the countdown. */
  startsAt?: string;
  /** ISO end with offset. */
  endsAt?: string;
  /** Day line, e.g. 'Tuesday 2 February 2027'. */
  dayLabel?: string;
  /** Time line, e.g. '14:00 to 18:00 HKT'. */
  timeLabel?: string;
  venue?: string;
  /** Number of invited guests. Unlocks every sentence that quotes the seat count. */
  seats?: number;
} = {
  startsAt: '2027-02-01T16:00:00+08:00',
  endsAt: '2027-02-01T20:00:00+08:00',
  dayLabel: 'Monday 1 February 2027',
  timeLabel: '16:00 to 20:00 HKT',
};

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

/** Speaker slugs, in the order of the draft. All exist in speakers.ts. */
export const hkSpeakerSlugs = [
  'yoni-assia', 'stani-kulechov', 'scott-lawin', 'johann-eid', 'stephen-humenik', 'giovanni-cunti', 'reza-bundy', 'cj-hetherington',
];

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

/** Section 02: the logo strip under the hero. Organisation ids from partners.ts; each appeared at Agentic Finance Singapore. */
export const hkStripLogos = ['etoro', 'limitless', 'pantera', 'fireblocks', 'alpaca', 'kpmg', 'standard-chartered'];

/** Section 05: the logo wall. */
export const hkWallLogos = [
  'etoro', 'fireblocks', 'alpaca', 'limitless', 'pantera', 'kpmg', 'standard-chartered', 'aave', 'chainlink', 'crypto-com', 'nethermind', 'zengo',
  'alchemy', 'trm-labs', 'liquid', 'redstone', 'secondlane', 'world', 'animoca', 'bank-frick',
];

/** Section 07: the rotating questions above the categories. */
export const hkRotatingQuestions = [
  'Who controls the agent?',
  'What happens when agents trade with other agents?',
  'Can an AI manage institutional capital?',
  'What becomes the wallet when the customer is software?',
  'Who is liable when an autonomous transaction goes wrong?',
  'What infrastructure will billions of financial agents require?',
];

const sg = (name: string, alt: string, position?: string): ImageAsset => ({ src: `/images/singapore-2026/${name}.webp`, alt, position });

/** Section 13: the logo row above the case study. */
export const hkUseCaseLogos = ['etoro', 'fireblocks', 'mme', 'limitless'];

/** "How we help you achieve your goals": seven parts, each with what was delivered and a Singapore photo, as on the Abu Dhabi page. */
export const hkInclusions: { title: string; body: string; proof: string; image: ImageAsset }[] = [
  {
    title: 'Stage',
    body: 'Keynote, panel, fireside chat, moderation, workshop.',
    proof: 'Yoni Assia’s keynote in Singapore, and panels at The Odds in Paris.',
    image: sg('agentic-banking-panel', 'The Agentic Banking panel on stage in Singapore', '30% 50%'),
  },
  {
    title: 'Access',
    body: 'Curated meetings, VIP introductions, private gatherings, executive networking.',
    proof: 'Curated introductions and structured networking at every summit we run.',
    image: sg('curated-introductions', 'Guests being introduced at Agentic Finance Singapore'),
  },
  {
    title: 'Space',
    body: 'Booth, lounge, meeting area, activation, demo station.',
    proof: 'eToro’s branded area in Singapore, and branded activations at The Odds in Paris.',
    image: sg('etoro-branded-area', 'eToro’s branded table and giveaways at Agentic Finance Singapore', '35% 55%'),
  },
  {
    title: 'Brand',
    body: 'Stage branding, screens, roll-ups, venue presence, website, agenda.',
    proof: '“Agentic Finance by eToro” in Singapore, and eToro x Zengo stage branding at The Odds in Paris.',
    image: sg('etoro-team', 'The eToro team at its branded area at Agentic Finance Singapore', '45% 40%'),
  },
  {
    title: 'Content',
    body: 'Interviews, podcasts, photography, video clips, social distribution.',
    proof: 'Photography, video and interviews at every event we produce.',
    image: sg('interview-capture', 'A speaker filmed at the Agentic Finance backdrop in Singapore'),
  },
  {
    title: 'PR',
    body: 'Media access, announcements, speaker positioning, event communications.',
    proof: 'CNBC on stage in Singapore, and media on site at our events.',
    image: sg('media-on-site', 'A camera on speakers greeting on the Singapore stage', '45% 50%'),
  },
  {
    title: 'Experience',
    body: 'Create something people remember, from simulations and demonstrations to interactive financial experiences.',
    proof: 'eToro’s F1 simulator in Singapore, and branded activations at The Odds in Paris.',
    image: sg('f1-simulator', 'eToro’s F1 simulator at Agentic Finance Singapore', '60% 45%'),
  },
];

/** "About the event": what the afternoon is, as short facts. */
export const hkFormat = ['Keynotes', 'Panels', 'Curated discussions', 'Networking', 'Business meetings in private meeting rooms', 'Light food and beverages'];
export const hkAudience = [
  'Banks and financial institutions',
  'Sovereign, family-office and institutional capital',
  'Regulators',
  'Exchanges and market infrastructure',
  'Companies building agentic AI for finance',
];
export const hkAgendaHours = 3;

/** "About the event": what happens, in three short parts. From the concept agreed on 23 November 2026. */
export const hkPlan = [
  { when: 'On stage · 3 hours', title: 'The programme', body: 'Keynotes, panels and curated discussions on AI agents in finance.' },
  { when: 'Off stage', title: 'Business meetings', body: 'Private meeting rooms for the meetings you came for, with networking around them.' },
  { when: 'Throughout', title: 'The room', body: 'Light food and beverages, from 16:00 to 20:00.' },
];

/** "Where will you be in 2027": the five cities, Hong Kong first. */
export const hkSeries: { city: string; month: string; anchor: string; image: ImageAsset }[] = [
  { city: 'Hong Kong', month: 'February', anchor: 'Consensus Hong Kong', image: { src: '/images/hong-kong/hk-junk-harbour.webp', alt: '', position: '58% 60%' } },
  { city: 'Dubai', month: 'April', anchor: 'TOKEN2049 Dubai', image: { src: '/images/cities/dubai.webp', alt: '' } },
  { city: 'Paris', month: 'July', anchor: 'Signal Week', image: { src: '/images/cities/paris.webp', alt: '' } },
  { city: 'Rio de Janeiro', month: 'August', anchor: 'Blockchain.RIO', image: { src: '/images/cities/rio-de-janeiro.webp', alt: '' } },
  { city: 'Singapore', month: 'October', anchor: 'TOKEN2049 Singapore', image: { src: '/images/cities/singapore.webp', alt: '' } },
];


export type HkFaq = { id: string; q: string; a: string };

/** Section 15: the nine questions of the draft. */
export function hkFaqs(): HkFaq[] {
  const where = hkEvent.dayLabel
    ? `${hkEvent.dayLabel}${hkEvent.timeLabel ? `, ${hkEvent.timeLabel}` : ''}${hkEvent.venue ? `, at ${hkEvent.venue}` : ''}, Hong Kong, during Consensus Hong Kong week.${hkEvent.venue ? '' : ' The venue follows once confirmed.'}`
    : 'In Hong Kong during Consensus Hong Kong week, in February 2027. The exact day, time and venue follow once confirmed.';
  return [
    {
      id: 'who',
      q: 'Who is it for?',
      a: 'Senior decision-makers: banks and financial institutions, sovereign, family-office and institutional capital, regulators, exchanges and market infrastructure, and the companies building agentic AI for finance.',
    },
    {
      id: 'register',
      q: 'Can anyone register?',
      a: 'No. Agentic Finance Hong Kong is invitation-only and there are no tickets. Every guest is selected; you can request an invitation from this page, and each request is reviewed by the team.',
    },
    {
      id: 'invited',
      q: 'I have received a personal invitation. What next?',
      a: 'Verify it on the invitation page with your code and the email address it was sent to, then complete your registration. Invitations are personal and cannot be transferred.',
    },
    { id: 'where', q: 'Where and when?', a: where },
    {
      id: 'consensus',
      q: 'Is this connected to Consensus Hong Kong?',
      a: `Agentic Finance Hong Kong is held during Consensus Hong Kong week (${consensusHk.dates}), produced independently by More & More.`,
    },
    {
      id: 'nominate',
      q: 'Can I nominate a speaker?',
      a: 'Yes. Use any “Nominate a speaker” button on this page, or the Speakers page, and tell us who should be on stage and why.',
    },
    {
      id: 'partner',
      q: 'Can my company become a partner?',
      a: 'Yes. Partnerships are shaped in a call with the partnerships team, around the category your company wants to lead and the people it needs to meet. Book a call or contact us to discuss.',
    },
    {
      id: 'category',
      q: 'What does owning a category mean?',
      a: 'Each part of the agentic finance ecosystem (trading, payments, commerce, wallets, compliance, capital and more) is a conversation we lead on stage. A category partner becomes the company associated with one of them: its session, its branding and the introductions around it.',
    },
    {
      id: 'singapore',
      q: 'What did partners receive in Singapore?',
      a: 'Title positioning, keynotes and panel seats, branded areas, main-stage branding, activations such as an F1 simulator, PR, photography, video and executive networking. The use cases on this page and on the partners pages show it partner by partner.',
    },
  ];
}
