import { editions, getEdition, statusLabel } from '@/data/editions';
import { getUseCase, organizations, wallFor } from '@/data/partners';
import { networkPages } from '@/data/network';
import { pastArchives } from '@/data/past-archives';
import { eventDate, nextEdition2027, upcoming2027 } from '@/data/upcoming-2027';
import { trackRecord } from '@/data/about';
import { companySlug } from '@/lib/companies';
import { profiledSpeakers, speakerAppearances } from '@/lib/content';
import { blogPageCount, formatPostDate, getPosts } from '@/lib/daily';

/**
 * The share card (Open Graph image) of every page, 1200 × 630. Each card is
 * drawn at build time by src/app/og/[...path]/route.tsx and served as
 * /og/<page path>.jpg; pageMetadata() links a page to its card by path.
 *
 * Copy rule: everything on a card comes from the page itself or from the data
 * files, never typed fresh here. A missing fact stays off the card.
 */
export type OgCard = {
  /** The page the card belongs to, e.g. "/events/2027/af-dubai". */
  path: string;
  /** Small gold label above the headline. */
  eyebrow: string;
  title: string;
  /** Second headline line, set in the gold serif italic. */
  accent?: string;
  subtitle?: string;
  /** Short note in the footer's right corner. */
  note?: string;
  /** Background photo (a /public path), behind a navy scrim. */
  image?: string;
  /** Focal point of the photo crop, as in CSS object-position ("50% 40%"). */
  position?: string;
  /** Speaker headshot, framed on the right in place of a background photo. */
  portrait?: string;
  /** The Odds pages carry The Odds mark instead of the Agentic Finance one. */
  brand?: 'agentic-finance' | 'the-odds';
};

const SG = '/images/singapore-2026';
const MNM = '/images/more-and-more';

function staticCards(): OgCard[] {
  const nx = nextEdition2027();
  const nd = eventDate(nx);
  const singapore = getEdition('singapore-2026');
  const sgMetrics = (singapore?.metrics ?? []).map((m) => `${m.value} ${m.label.toLowerCase()}`);
  const questionnaire: Omit<OgCard, 'path'> = {
    eyebrow: 'More & More · 2027',
    title: 'Where will you be in',
    accent: '2027?',
    subtitle: 'Tell us where you will be and who you want to meet. We set up the meetings before you land.',
    image: '/images/hong-kong/hk-golden-hour.webp',
  };
  const blog: Omit<OgCard, 'path'> = {
    eyebrow: 'Today in agentic finance',
    title: 'AI agents in finance,',
    accent: 'one story a day.',
    subtitle: 'Our own summary of each story, why it matters, and a link to the original.',
  };

  return [
    {
      path: '/',
      eyebrow: `Next · ${nx.city} · ${nd.medium}`,
      title: 'Agentic Finance,',
      accent: 'where the leaders of AI and finance meet.',
      note: nx.attendees ? `Up to ${nx.attendees} curated attendees` : undefined,
      image: `${SG}/summit-poster.jpg`,
    },
    { path: '/events/2027/meetings', ...questionnaire },
    { path: '/events/2027/meetings/thanks', ...questionnaire },
    {
      path: '/apply',
      eyebrow: `${nx.name} · ${nd.medium}`,
      title: 'Apply to attend.',
      subtitle: `${nx.attendees ? `Up to ${nx.attendees} curated attendees. ` : ''}No tickets, no open registration.`,
      note: 'Invitation only',
      image: `${SG}/curated-introductions.webp`,
      position: '50% 40%',
    },

    // Network (Tal's copy, 25 Nov 2026)
    {
      path: '/network',
      eyebrow: 'Agentic Finance Network',
      title: 'Join the Network.',
      accent: 'Free to join.',
      subtitle: 'Startups, VCs, companies, institutions and ecosystem organisations, connected at every event.',
      image: `${SG}/networking-floor.webp`,
    },
    ...networkPages.map((p) => ({
      path: `/network/${p.slug}`,
      eyebrow: `Agentic Finance Network · ${p.card.title}`,
      title: p.title,
      subtitle: 'Free to join',
      image: `${SG}/networking-floor.webp`,
    })),

    { path: '/af100', eyebrow: 'Index', title: 'Research on', accent: 'agentic finance.', subtitle: 'Agentic Finance 100 · Industry Map · Quarterly Reports' },
    { path: '/af100/list', eyebrow: 'Index', title: 'Agentic Finance 100.', subtitle: 'The top 100 companies in agentic finance, ranked by financial institutions.' },
    { path: '/af100/map', eyebrow: 'Index', title: 'Industry Map.', subtitle: 'The agentic finance landscape, across twelve areas.' },
    { path: '/af100/reports', eyebrow: 'Index', title: 'Quarterly Reports.', subtitle: 'The state of agentic finance, every quarter.' },
    { path: '/privacy', eyebrow: 'Legal', title: 'Privacy.' },
    { path: '/terms', eyebrow: 'Legal', title: 'Terms & Conditions.' },
    {
      path: '/partners/book-a-call',
      eyebrow: 'Partner with us',
      title: 'Meet the people who decide',
      accent: 'the future of finance.',
      subtitle: trackRecord.map((m) => `${m.value} ${m.label.toLowerCase()}`).join(' · '),
      image: `${SG}/etoro-networking.webp`,
    },

    // Events
    {
      path: '/events',
      eyebrow: 'Events',
      title: 'Our Events.',
      subtitle: `Next: ${nx.name}, ${nd.medium} · 2027 Global Exposure`,
      image: nx.image.src,
    },
    {
      path: '/events/2026',
      eyebrow: 'Events · 2026',
      title: 'Where we were in',
      accent: '2026.',
      subtitle: 'The Odds · Paris, April · Agentic Finance · Singapore, October',
      image: singapore?.image.src,
    },
    {
      path: '/events/2027',
      eyebrow: '2027 Global Exposure',
      title: 'Where are we heading in',
      accent: '2027?',
      subtitle: upcoming2027.map((e) => e.city).join(' · '),
      image: '/images/hong-kong/hk-sunset-harbour.webp',
    },

    // Speakers
    {
      path: '/speakers',
      eyebrow: 'Speakers',
      title: 'Speakers at our events.',
      subtitle: 'Standard Chartered, eToro, Pantera Capital, Aave Labs, Chainlink Labs, KPMG, Fireblocks and more.',
      image: `${SG}/opening-keynote.webp`,
    },
    {
      path: '/speakers/nominate',
      eyebrow: 'Speakers',
      title: 'Nominate a speaker.',
      subtitle: 'Put forward a senior voice for the Agentic Finance stage, or nominate yourself.',
      image: `${SG}/cj-hetherington-stage.webp`,
    },

    // Partners. The categories and the partnership call are on /network/companies; the old
    // /partners/* addresses forward and keep their share-card address (scripts/write-redirects.mjs).
    {
      path: '/partners',
      eyebrow: 'Partners',
      title: 'The companies',
      accent: 'at our conferences.',
      subtitle: 'And what they achieved, from acquisitions to title partnerships.',
      image: `${SG}/etoro-networking.webp`,
    },

    // Photos, video and press (under About), and the Singapore recap
    {
      path: '/events/2026/singapore/recap',
      eyebrow: singapore ? `Singapore 2026 · ${singapore.dateLabel}` : 'Singapore 2026',
      title: 'Singapore 2026,',
      accent: 'the recap.',
      subtitle: sgMetrics.join(' · '),
      image: singapore?.image.src,
      position: singapore?.image.position,
    },
    {
      path: '/about/brand',
      eyebrow: 'About · Brand',
      title: 'Brand.',
      subtitle: 'Videos, photos and the brand kit.',
      image: `${SG}/recap-poster.jpg`,
    },
    {
      path: '/about/press',
      eyebrow: 'About · Press',
      title: 'Agentic Finance',
      accent: 'in the press.',
      subtitle: 'Coverage of Singapore, Paris and Abu Dhabi.',
      image: `${SG}/interview-capture.webp`,
    },
    {
      path: '/about/more-and-more',
      eyebrow: 'About us',
      title: 'More & More.',
      subtitle: trackRecord.map((m) => `${m.value} ${m.label.toLowerCase()}`).join(' · '),
      image: `${MNM}/about-mnm.jpg`,
    },
    { path: '/about/program', eyebrow: 'About · Program', title: 'What happens', accent: 'at our events.', image: `${SG}/networking-floor.webp` },
    { path: '/about/themes', eyebrow: 'About · Themes', title: 'The questions', accent: 'shaping finance.', image: `${SG}/agentic-trading-panel.webp` },
    ...pastArchives.map((a) => ({
      path: a.path,
      eyebrow: `Past edition · ${a.city} · ${a.date}`,
      title: a.name,
      subtitle: a.facts.map((f) => `${f.value} ${f.label.toLowerCase()}`).join(' · '),
      image: a.image.src,
      brand: a.id.startsWith('the-odds') ? ('the-odds' as const) : ('agentic-finance' as const),
    })),

    // Blog
    { path: '/live/news', ...blog },
    {
      path: '/live',
      eyebrow: 'Live',
      title: 'News, X Spaces,',
      accent: 'webinars and the newsletter.',
    },
    ...(['X Spaces', 'Webinars', 'Newsletter'] as const).map((label) => ({
      path: `/live/${label === 'X Spaces' ? 'spaces' : label.toLowerCase()}`,
      eyebrow: `Live · ${label}`,
      title: `${label}.`,
    })),
    ...Array.from({ length: Math.max(blogPageCount() - 1, 1) }, (_, i) => ({ path: `/live/news/page/${i + 2}`, ...blog })),

    // About
    {
      path: '/about',
      eyebrow: 'About',
      title: 'Who stands behind the room.',
      subtitle: 'More & More, the event series and our track record.',
      image: `${MNM}/about-mnm.jpg`,
    },
    {
      path: '/about/contact',
      eyebrow: 'Talk to the team',
      title: 'Contact.',
      subtitle: 'Attendance, partnerships, speaking or press. Every enquiry reaches a person.',
      image: `${SG}/the-odds-welcome.webp`,
    },
    {
      path: '/photo-credits',
      eyebrow: 'Agentic Finance',
      title: 'Photo credits',
      subtitle: 'The city photos in our events calendar, with their authors and licences.',
    },
  ];
}

function editionCards(): OgCard[] {
  // A planned 2027 city has no page of its own any more: its address is its /events/2027 page, which has its own card.
  // Past editions only: 2027 editions have their own cards below, and cancelled ones have no page.
  return editions.filter((e) => e.status === 'completed').flatMap((e) => {
    const venue = e.venue?.name;
    const where = !venue ? e.city : venue.includes(e.city) ? venue : `${venue}, ${e.city}`;
    const main: OgCard = {
      path: e.path,
      eyebrow: e.status === 'planned' ? `${statusLabel.planned} · ${e.country}` : `${statusLabel[e.status]} · ${e.country}`,
      title: 'Agentic Finance',
      accent: e.status === 'completed' ? `${e.city} ${e.year}` : e.city,
      subtitle:
        e.status === 'planned'
          ? [e.context ? `During ${e.context}` : '', e.dateLabel].filter(Boolean).join(' · ')
          : `${e.dateLabel} · ${where}`,
      note:
        e.status === 'planned'
          ? 'Exact day and venue to follow'
          : e.status === 'upcoming'
            ? `${e.guestCount} curated guests · Invitation only`
            : (e.metrics ?? []).slice(0, 2).map((m) => `${m.value} ${m.label.toLowerCase()}`).join(' · '),
      image: e.image.src,
      position: e.image.position,
    };
    const cards: OgCard[] = [main];
    if (e.status !== 'planned') {
      cards.push({
        path: `${e.path}/speakers`,
        eyebrow: `${e.shortName} · Speakers`,
        title: e.status === 'completed' ? `The ${e.city} lineup.` : 'Speakers',
        accent: e.status === 'completed' ? undefined : e.shortName,
        subtitle: e.status === 'completed' ? `${e.dateLabel} · ${where}` : 'Announced one by one as each confirms.',
        image: e.status === 'completed' ? `${SG}/agentic-banking-panel.webp` : e.image.src,
      });
    }
    if (e.status !== 'planned') {
      const orgCount = wallFor(e.slug).length;
      cards.push({
        path: `${e.path}/partners`,
        eyebrow: `${e.shortName} · Partners`,
        title: 'Partners and',
        accent: 'organisations.',
        subtitle: orgCount ? `${orgCount} organisations took part.` : 'Announced as they confirm.',
        image: e.status === 'completed' ? `${SG}/etoro-f1-simulator.webp` : e.image.src,
      });
    }
    if (e.hasAgenda) {
      cards.push({
        path: `${e.path}/agenda`,
        eyebrow: `${e.shortName} · Agenda`,
        title: 'The run of show.',
        subtitle: `${e.dateLabel} · ${where}`,
        image: `${SG}/opening-keynote.webp`,
      });
    }
    const gala = e.experiences?.find((x) => x.id === 'gala');
    if (e.hasGala && gala) {
      cards.push({
        path: `${e.path}/gala`,
        eyebrow: `${e.name} · VIP Gala`,
        title: 'The VIP Gala.',
        subtitle: gala.when,
        note: 'By personal invitation only',
        image: e.image.src,
      });
    }
    return cards;
  });
}

function upcoming2027Cards(): OgCard[] {
  return upcoming2027.map((p) => {
    const d = eventDate(p);
    return {
      path: p.path,
      eyebrow: `${d.medium}${d.provisional ? ' · Provisional' : ''} · During ${p.context}`,
      title: 'Agentic Finance',
      accent: p.city,
      subtitle: p.subtitle,
      note: p.attendees ? `Up to ${p.attendees} curated attendees` : 'Invitation only',
      image: p.image.src,
      position: p.image.position,
      brand: p.brand,
    };
  });
}

/** "CEO, eToro"; a title that already names the organisation ("Attaché, British High Commission") stands alone. */
function speakerLine(title: string, organization: string): string {
  const firstWord = organization.split(/[\s/]+/)[0];
  return firstWord && title.includes(firstWord) ? title : `${title}, ${organization}`;
}

function speakerCards(): OgCard[] {
  return profiledSpeakers().map((s) => ({
    path: `/speakers/${s.slug}`,
    eyebrow: ['Speaker', ...speakerAppearances(s).slice(0, 2).map((a) => a.label)].join(' · '),
    title: s.name,
    subtitle: speakerLine(s.title, s.organization),
    portrait: s.photo,
  }));
}

function partnerCaseCards(): OgCard[] {
  return organizations.map((o) => {
    const slug = companySlug(o.id)!;
    const u = getUseCase(slug);
    const e = u ? getEdition(u.edition) : undefined;
    return {
      path: `/partners/${slug}`,
      eyebrow: u ? `Company page · ${u.event?.label ?? e?.shortName ?? ''}` : 'Company page',
      title: o.name,
      accent: u ? 'at our events.' : undefined,
      subtitle: u?.positioning ?? o.about,
      image: u?.photos[0]?.src,
      position: u?.photos[0]?.position,
      brand: u?.event?.name.startsWith('The Odds') ? 'the-odds' : 'agentic-finance',
    };
  });
}

function blogCards(): OgCard[] {
  return getPosts().map((p) => ({
    path: `/live/news/${p.slug}`,
    eyebrow: `Today in agentic finance · ${formatPostDate(p)}`,
    title: p.title,
    subtitle: `Our summary, why it matters, and the original from ${p.sourceName}.`,
    image: p.image?.src.startsWith('/') ? p.image.src : undefined,
  }));
}

let cache: Map<string, OgCard> | undefined;

/** Every share card, keyed by page path. */
export function ogCards(): Map<string, OgCard> {
  cache ??= new Map(
    [...staticCards(), ...editionCards(), ...upcoming2027Cards(), ...speakerCards(), ...partnerCaseCards(), ...blogCards()].map((c) => [c.path, c]),
  );
  return cache;
}

export function getOgCard(path: string): OgCard | undefined {
  return ogCards().get(path === '/' ? '/' : path.replace(/\/$/, ''));
}

/** "/" → ["home.jpg"]; "/events/2027/af-dubai" → ["events", "2027", "af-dubai.jpg"]. */
export function ogImageSegments(path: string): string[] {
  const parts = path.split('/').filter(Boolean);
  if (!parts.length) return ['home.jpg'];
  parts[parts.length - 1] += '.jpg';
  return parts;
}

export function pathFromOgSegments(segments: string[]): string {
  const joined = segments.join('/').replace(/\.jpg$/, '');
  return joined === 'home' ? '/' : `/${joined}`;
}

/** Alt text for a card: what it says, in reading order. */
export function ogCardAlt(card: OgCard): string {
  const headline = [card.title, card.accent].filter(Boolean).join(' ');
  return [card.eyebrow, headline, card.subtitle].filter(Boolean).join('. ').replace(/([.?,])\./g, '$1');
}

/** Bump to make every platform fetch the cards again after a design change. */
const DESIGN_VERSION = 1;

/** Short content hash, so a card whose text or photo changes gets a new URL and is fetched again. */
export function ogCardVersion(card: OgCard): string {
  const text = `${DESIGN_VERSION}${JSON.stringify(card)}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}
