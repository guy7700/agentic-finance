import type { ImageAsset } from './types';
import { contextDates, eventDate, type Upcoming2027 } from './upcoming-2027';

/**
 * What every 2027 event page shares, on the Hong Kong template Tal approved (23 and 26 Nov
 * 2026). Each page fills it with its own event record from upcoming-2027.ts, so no page shows
 * another city's facts. Logos, speakers and use cases are from past events and are labelled so.
 */

/** Speakers at our conferences (past events), in the order of the Hong Kong draft. All exist in speakers.ts. */
export const landingSpeakerSlugs = [
  'yoni-assia', 'stani-kulechov', 'scott-lawin', 'johann-eid', 'stephen-humenik', 'giovanni-cunti', 'reza-bundy', 'cj-hetherington',
];

/** The logo rows under the hero and the wall "Partners at our conferences": organisation ids from partners.ts, all from past events. */
export const landingStripLogos = [
  'etoro', 'fireblocks', 'alpaca', 'limitless', 'kalshi', 'aws', 'pantera', 'kpmg', 'standard-chartered', 'crypto-com',
  'chainlink', 'aave', 'base', 'alchemy', 'nethermind', 'zengo', 'trm-labs', 'animoca', 'world', 'blockaid', 'redstone', 'mme',
];
export const landingWallLogos = [
  'etoro', 'fireblocks', 'alpaca', 'limitless', 'pantera', 'kpmg', 'standard-chartered', 'aave', 'chainlink', 'crypto-com', 'nethermind', 'zengo',
  'alchemy', 'trm-labs', 'liquid', 'redstone', 'secondlane', 'world', 'animoca', 'bank-frick',
];

/** The rotating questions above the categories. */
export const landingQuestions = [
  'Who controls the agent?',
  'What happens when agents trade with other agents?',
  'Can an AI manage institutional capital?',
  'What becomes the wallet when the customer is software?',
  'Who is liable when an autonomous transaction goes wrong?',
  'What infrastructure will billions of financial agents require?',
];

/** The logo row above the eToro use case. */
export const landingUseCaseLogos = ['etoro', 'fireblocks', 'mme', 'limitless'];

const sg = (name: string, alt: string, position?: string): ImageAsset => ({ src: `/images/singapore-2026/${name}.webp`, alt, position });

/**
 * "How we help you achieve your goals": the seven parts of a partnership, as on the Abu Dhabi
 * page Tal approved, each with what was delivered and a photo from Singapore.
 */
export const partnerInclusions: { title: string; body: string; proof: string; image: ImageAsset }[] = [
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
export const landingFormat = ['Keynotes', 'Panels', 'Curated discussions', 'Business meetings in private rooms', 'Founders and Funders Dinner', 'Light food and beverages'];
export const landingAudience = [
  'Banks and financial institutions',
  'Sovereign, family-office and institutional capital',
  'Regulators',
  'Exchanges and market infrastructure',
  'Companies building agentic AI for finance',
];

export type LandingFaq = { id: string; q: string; a: string };

/** The common questions, answered from the event's own record. */
export function landingFaqs(e: Upcoming2027): LandingFaq[] {
  const d = eventDate(e);
  const anchorDates = contextDates(e);
  return [
    {
      id: 'who',
      q: 'Who is it for?',
      a: 'Senior decision-makers: banks and financial institutions, sovereign, family-office and institutional capital, regulators, exchanges and market infrastructure, and the companies building agentic AI for finance.',
    },
    {
      id: 'register',
      q: 'Can anyone register?',
      a: `No. ${e.name} is invitation-only and there are no tickets. Every guest is selected${e.attendees ? `, up to ${e.attendees} in all` : ''}. Apply to attend from this page and the team reviews each request.`,
    },
    {
      id: 'where',
      q: 'Where and when?',
      a: `${d.long}, ${d.time}, in ${e.city}, during ${e.context}${anchorDates ? ` (${anchorDates})` : ''}.${d.provisional ? ' The date is provisional and is confirmed here first.' : ''} The venue is shared with registered guests.`,
    },
    {
      id: 'format',
      q: 'What happens on the day?',
      a: `The Summit runs from ${d.start} to 19:00: keynotes, panels and curated discussions, with private rooms for meetings. The Founders and Funders Dinner follows until ${d.end}.`,
    },
    {
      id: 'anchor',
      q: `Is this part of ${e.context}?`,
      a: `${e.name} is held during ${e.context}${anchorDates ? ` (${anchorDates})` : ''}, and is produced independently by More & More.`,
    },
    {
      id: 'nominate',
      q: 'Can I nominate a speaker?',
      a: 'Yes. Use any “Nominate a speaker” button on this page, or the Speakers page, and tell us who should be on stage and why.',
    },
    {
      id: 'partner',
      q: 'Can my company become a partner?',
      a: 'Yes. Partnerships are shaped in a call with the team, around the conversation your company wants to lead and the people it needs to meet. Book a partnership call from this page.',
    },
    {
      id: 'singapore',
      q: 'What did partners receive at past events?',
      a: 'Title positioning, keynotes and panel seats, branded areas, main-stage branding, activations such as an F1 simulator, PR, photography, video and executive networking. The company pages show it partner by partner.',
    },
  ];
}
