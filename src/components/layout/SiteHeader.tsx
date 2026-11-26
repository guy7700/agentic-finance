import { navigation, primaryActions } from '@/config/site';
import { getCurrentEdition } from '@/data/editions';
import { useCases } from '@/data/partners';
import { HeaderClient, type NavFeature } from './HeaderClient';

/**
 * Server wrapper: resolves the small, serialisable "featured" card shown in each
 * desktop panel, so the client bundle never ships the full content data.
 */
export function SiteHeader() {
  const current = getCurrentEdition();
  const features: Record<string, NavFeature> = {
    editions: {
      kicker: 'Next edition',
      title: `${current.shortName}`,
      text: `${current.guestCount} curated guests · ${current.partnerPositions} partner positions · Summit and VIP Gala`,
      href: `${current.path}`,
      image: { src: '/images/abu-dhabi-2026/al-maryah.webp', alt: current.image.alt },
    },
    network: {
      kicker: 'Agentic Finance Network',
      title: 'Join as a VC. Free.',
      text: 'Vetted deal flow, founders and funders dinners in 5 cities, and free summit passes.',
      href: '/network/vcs',
      image: { src: '/images/singapore-2026/networking-floor.webp', alt: 'Guests talking on the networking floor in Singapore' },
    },
    speakers: {
      kicker: 'Singapore 2026',
      title: 'Yoni Assia, eToro',
      text: 'Headline keynote: When the Broker Becomes an Agent.',
      href: '/speakers/yoni-assia',
      image: { src: '/images/speakers/yoni-assia.webp', alt: 'Yoni Assia, Co-Founder and CEO of eToro', position: '50% 20%' },
    },
    partners: {
      kicker: 'Use case',
      title: 'Agentic Finance by eToro',
      text: `Title partnership, CEO keynote and an F1 simulator activation. ${useCases.length} published use cases.`,
      href: '/partners/etoro',
      image: { src: '/images/singapore-2026/etoro-f1-simulator.webp', alt: 'A guest racing on eToro’s F1 simulator in Singapore', position: '45% 55%' },
    },
    live: {
      kicker: 'Watch',
      title: 'Singapore 2026 recap',
      text: 'Two minutes forty on the first edition.',
      href: '/about/video',
      image: { src: '/images/singapore-2026/recap-poster.jpg', alt: 'Still from the Singapore 2026 recap video' },
    },
    index: {
      kicker: 'Index',
      title: 'AF100',
      text: 'The AF100 list and how it is built, the industry map and quarterly reports.',
      href: '/af100',
      image: { src: '/images/singapore-2026/agentic-trading-panel.webp', alt: 'The Agentic Trading panel on stage in Singapore' },
    },
    about: {
      kicker: 'Produced by',
      title: 'More & More',
      text: '100+ events organised · 250+ deals and introductions · 5+ continents.',
      href: '/about#more-and-more',
      image: { src: '/images/more-and-more/tal-mor-founder.jpg', alt: 'Tal Mor, Founder and CEO of More & More, speaking on stage', position: '50% 25%' },
    },
  };

  return <HeaderClient navigation={navigation} actions={primaryActions} features={features} />;
}
