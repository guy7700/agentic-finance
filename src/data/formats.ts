import type { IconName } from '@/components/ui/Icon';
import type { ImageAsset } from './types';

/**
 * What happens at our events (Tal's review, 26 Nov 2026): the formats and experiences we offer,
 * with a photo from our own events where one shows it, and an icon where none does yet.
 */
export const programFormats: { title: string; body: string; image?: ImageAsset; icon: IconName }[] = [
  { title: 'Side events', body: 'Curated gatherings alongside the industry’s major weeks: TOKEN2049, Consensus, EthCC, Signal Week.', icon: 'calendar', image: { src: '/images/more-and-more/the-odds-room.webp', alt: 'A packed room facing a panel at a More & More side event' } },
  { title: 'Closed-door gatherings', body: 'Private rooms and roundtables where senior people speak freely.', icon: 'door', image: { src: '/images/more-and-more/hub71-networking.jpg', alt: 'Guests in conversation at the Web2 to Web3 conference in Abu Dhabi' } },
  { title: 'Hand-selected audiences', body: 'Every guest is selected. Invitations are personal and reviewed by the team.', icon: 'users', image: { src: '/images/singapore-2026/curated-introductions.webp', alt: 'Guests being introduced at Agentic Finance Singapore' } },
  { title: 'Keynotes', body: 'The leaders of the companies and institutions shaping the market, on one stage.', icon: 'mic', image: { src: '/images/singapore-2026/opening-keynote.webp', alt: 'A keynote on the main stage at Agentic Finance Singapore' } },
  { title: 'Panels', body: 'Bankers, founders, investors and regulators, on the questions the industry has to answer.', icon: 'users', image: { src: '/images/singapore-2026/agentic-banking-panel.webp', alt: 'The Agentic Banking panel at Agentic Finance Singapore', position: '30% 50%' } },
  { title: 'Industry-leading speakers', body: 'From eToro, Standard Chartered, Pantera Capital, Aave Labs, Chainlink Labs, KPMG and more.', icon: 'spark', image: { src: '/images/singapore-2026/cj-hetherington-stage.webp', alt: 'A speaker on the Agentic Finance stage in Singapore' } },
  { title: 'AI and agentic finance programming', body: 'Agentic trading, payments, banking, capital and wallets: a programme built around AI agents in finance.', icon: 'chip', image: { src: '/images/singapore-2026/agentic-trading-panel.webp', alt: 'The Agentic Trading panel at Agentic Finance Singapore' } },
  { title: 'Exhibition booths', body: 'Partner booths and branded areas on the floor, where the conversations continue.', icon: 'card', image: { src: '/images/singapore-2026/etoro-booth.webp', alt: 'eToro’s booth at Agentic Finance Singapore' } },
  { title: 'Interactive experiences', body: 'Activations people remember, like eToro’s F1 simulator in Singapore.', icon: 'target', image: { src: '/images/singapore-2026/f1-simulator.webp', alt: 'eToro’s F1 simulator at Agentic Finance Singapore', position: '60% 45%' } },
  { title: 'Curated experiences', body: 'Introductions arranged before the day, and time on the floor to follow them up.', icon: 'handshake', image: { src: '/images/singapore-2026/networking-floor.webp', alt: 'Delegates on the networking floor at Agentic Finance Singapore', position: '50% 40%' } },
  { title: 'Startup competitions', body: 'Startups pitch to the investors and companies in the Network, who choose who goes through.', icon: 'chart' },
  { title: 'Food and beverages', body: 'Light food and drinks through the afternoon, and the Founders and Funders Dinner to close the day.', icon: 'spark' },
];
