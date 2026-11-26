import { navigation, primaryActions } from '@/config/site';
import { trackRecord } from '@/data/about';
import { eventDate, nextEdition2027 } from '@/data/upcoming-2027';
import { HeaderClient, type NavFeature } from './HeaderClient';

/**
 * Server wrapper: resolves the small, serialisable "featured" card shown in each
 * desktop panel, so the client bundle never ships the full content data.
 */
export function SiteHeader() {
  const next = nextEdition2027();
  const d = eventDate(next);
  const features: Record<string, NavFeature> = {
    editions: {
      kicker: 'Next event',
      title: next.name,
      text: `${d.long} · ${next.attendees ? `Up to ${next.attendees} curated attendees · ` : ''}During ${next.context}`,
      href: next.path,
      image: { src: next.image.src, alt: next.image.alt, position: next.image.position },
    },
    network: {
      kicker: 'Agentic Finance Network',
      title: 'Join for free.',
      text: 'Startups, VCs, companies, institutions and ecosystem organisations, connected at every event.',
      href: '/network',
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
      kicker: 'Partner with us',
      title: 'Book a partnership call',
      text: 'Thirty minutes with the team: your goals, the rooms that serve them, and who you want to meet.',
      href: primaryActions.partner.href,
      image: { src: '/images/singapore-2026/etoro-f1-simulator.webp', alt: 'A guest racing on eToro’s F1 simulator in Singapore', position: '45% 55%' },
    },
    live: {
      kicker: 'Watch',
      title: 'Singapore 2026 recap',
      text: 'Two minutes forty on the first edition.',
      href: '/about/brand#videos',
      image: { src: '/images/singapore-2026/recap-poster.jpg', alt: 'Still from the Singapore 2026 recap video' },
    },
    index: {
      kicker: 'Index',
      title: 'Agentic Finance 100',
      text: 'The top 100 companies in agentic finance, ranked by the institutions that use them.',
      href: '/af100',
      image: { src: '/images/singapore-2026/agentic-trading-panel.webp', alt: 'The Agentic Trading panel on stage in Singapore' },
    },
    about: {
      kicker: 'Produced by',
      title: 'More & More',
      text: trackRecord.map((m) => `${m.value} ${m.label.toLowerCase()}`).join(' · '),
      href: '/about/more-and-more',
      image: { src: '/images/more-and-more/tal-mor-founder.jpg', alt: 'Tal Mor, Founder and CEO of More & More, speaking on stage', position: '50% 25%' },
    },
  };

  return <HeaderClient navigation={navigation} actions={{ partner: primaryActions.partner }} features={features} />;
}
