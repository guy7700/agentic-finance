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
      href: `/editions/${current.slug}`,
      image: { src: '/images/abu-dhabi-2026/al-maryah.webp', alt: current.image.alt },
    },
    program: {
      kicker: 'The six questions',
      title: 'Who controls the agent?',
      text: 'And five more decisions the room is here to settle.',
      href: '/program/questions',
      image: { src: '/images/singapore-2026/agentic-banking-panel.webp', alt: 'The Agentic Banking panel on stage in Singapore', position: '30% 50%' },
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
      href: '/partners/use-cases/etoro',
      image: { src: '/images/singapore-2026/etoro-f1-simulator.webp', alt: 'A guest racing on eToro’s F1 simulator in Singapore', position: '45% 55%' },
    },
    media: {
      kicker: 'Watch',
      title: 'Singapore 2026 recap',
      text: 'Two minutes forty on the first edition.',
      href: '/media/video',
      image: { src: '/images/singapore-2026/recap-poster.jpg', alt: 'Still from the Singapore 2026 recap video' },
    },
    about: {
      kicker: 'Produced by',
      title: 'More & More',
      text: '100+ events organised · 250+ deals and introductions · 5+ continents.',
      href: '/about/more-and-more',
      image: { src: '/images/more-and-more/tal-mor-founder.jpg', alt: 'Tal Mor, Founder and CEO of More & More, speaking on stage', position: '50% 25%' },
    },
  };

  return <HeaderClient navigation={navigation} actions={primaryActions} features={features} />;
}
