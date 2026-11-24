import { booking } from '@/config/site';
import { editions, getCurrentEdition, getEdition, statusLabel } from '@/data/editions';
import { otherUseCases, useCases } from '@/data/partners';
import { contextDates, upcoming2027 } from '@/data/upcoming-2027';
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
  /** The page the card belongs to, e.g. "/editions/dubai-2027". */
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
  const next = getCurrentEdition();
  const singapore = getEdition('singapore-2026');
  const sgMetrics = (singapore?.metrics ?? []).map((m) => `${m.value} ${m.label.toLowerCase()}`);
  const planned = editions.filter((e) => e.status === 'planned');
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
      eyebrow: `Next · ${next.city} · ${next.dateLabel}`,
      title: 'AI Agents Are Rewriting Finance.',
      accent: 'We’re Bringing the Industry Together.',
      note: singapore ? `Singapore 2026 · ${sgMetrics[0]}` : undefined,
      image: `${SG}/summit-poster.jpg`,
    },
    { path: '/2027', ...questionnaire },
    { path: '/2027/thanks', ...questionnaire },
    {
      path: '/invitation',
      eyebrow: `${next.name} · ${next.dateLabel}`,
      title: 'Apply to attend.',
      subtitle: `${next.guestCount} hand-selected guests. No tickets, no open registration.`,
      note: 'Invitation only',
      image: `${SG}/curated-introductions.webp`,
      position: '50% 40%',
    },

    // Editions
    {
      path: '/editions',
      eyebrow: 'Editions',
      title: 'The series.',
      subtitle: [next.shortName, singapore?.shortName, `${planned.length} cities in 2027`].filter(Boolean).join(' · '),
      image: next.image.src,
    },
    {
      path: '/editions/2027',
      eyebrow: 'The 2027 international series',
      title: 'Agentic Finance',
      accent: '2027',
      subtitle: planned.map((e) => e.city).join(' · '),
      note: 'Dates and venues to follow',
      image: '/images/hong-kong/hk-sunset-harbour.webp',
    },

    // Program
    {
      path: '/program',
      eyebrow: 'Program',
      title: 'What the room is here to decide.',
      subtitle: 'Topics, the six questions, formats and who gets in.',
      image: `${SG}/agentic-banking-panel.webp`,
      position: '30% 50%',
    },
    {
      path: '/program/topics',
      eyebrow: 'Program · 15 areas',
      title: 'The topics.',
      subtitle: 'AI agents in banking, trading and payments, wallets, stablecoins, regulation and AI infrastructure.',
      image: `${SG}/agentic-payments-panel.webp`,
    },
    {
      path: '/program/questions',
      eyebrow: 'The questions shaping finance',
      title: 'Six questions.',
      accent: 'No easy answers.',
      subtitle: 'From who controls the agent to who is liable when an autonomous transaction goes wrong.',
      image: `${SG}/agentic-trading-panel.webp`,
    },
    {
      path: '/program/formats',
      eyebrow: 'Formats',
      title: 'Event formats and',
      accent: 'experience',
      subtitle: 'Curated meetings and private meeting rooms come first. Then keynotes, firesides, panels and networking.',
      image: `${SG}/networking-floor.webp`,
    },
    {
      path: '/program/who-gets-in',
      eyebrow: 'Invitation only · Every request reviewed',
      title: 'The guest list is the product.',
      subtitle: 'There are no tickets. Every guest is selected, and every invitation is personal.',
      image: `${SG}/media-on-site.webp`,
    },

    // Speakers
    {
      path: '/speakers',
      eyebrow: 'Speakers · Every edition',
      title: 'Everyone who has held the floor.',
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

    // Partners
    {
      path: '/partners',
      eyebrow: `Partnerships · ${next.name}`,
      title: 'Don’t sponsor a conference.',
      accent: 'Own the conversation.',
      subtitle: next.partnerPositions ? `No more than ${next.partnerPositions} strategic partner positions in ${next.city}.` : undefined,
      image: `${SG}/etoro-networking.webp`,
    },
    {
      path: '/partners/categories',
      eyebrow: 'Partners · 12 categories',
      title: 'Where does your company fit?',
      subtitle: 'From agentic payments and stablecoins to prediction markets, compliance and AI infrastructure.',
      image: `${SG}/etoro-branded-area.webp`,
    },
    {
      path: '/partners/use-cases',
      eyebrow: 'Partner use cases',
      title: 'What partners received.',
      subtitle: [...useCases, ...otherUseCases].map((u) => u.partner).join(' · '),
      image: `${SG}/etoro-booth.webp`,
    },
    {
      path: '/partners/past-partners',
      eyebrow: 'By edition',
      title: 'Partners and organisations.',
      subtitle: 'The organisations that took part in each Agentic Finance edition.',
      image: `${SG}/networking-floor.webp`,
    },
    {
      path: '/partners/book-a-call',
      eyebrow: 'Partners',
      title: 'Book a partnership call.',
      subtitle: `A ${booking.partnership.minutes}-minute call with the partnerships team, or send an enquiry.`,
      image: `${SG}/f1-simulator.webp`,
    },

    // Media
    {
      path: '/media',
      eyebrow: 'Media',
      title: 'Proof in pictures.',
      subtitle: 'The rooms we have built, as they happened: recap, photos, video and press.',
      image: `${SG}/agentic-trading-panel.webp`,
    },
    {
      path: '/media/singapore-2026-recap',
      eyebrow: singapore ? `Singapore 2026 · ${singapore.dateLabel}` : 'Singapore 2026',
      title: 'Singapore 2026,',
      accent: 'the recap.',
      subtitle: sgMetrics.join(' · '),
      image: singapore?.image.src,
      position: singapore?.image.position,
    },
    {
      path: '/media/video',
      eyebrow: 'Media · Video',
      title: 'Video.',
      subtitle: 'Films from our editions: recaps, highlights and aftermovies.',
      image: `${SG}/recap-poster.jpg`,
    },
    {
      path: '/media/gallery',
      eyebrow: 'Media · Photos by edition',
      title: 'Gallery.',
      subtitle: 'Agentic Finance Singapore 2026, and More & More events in Paris and Abu Dhabi.',
      image: `${SG}/etoro-team.webp`,
    },
    {
      path: '/media/press',
      eyebrow: 'Media · Press',
      title: 'Press and brand kit.',
      subtitle: 'Coverage, official logo files, key facts and media contacts.',
      image: `${SG}/interview-capture.webp`,
    },

    // Blog
    { path: '/blog', ...blog },
    ...Array.from({ length: Math.max(blogPageCount() - 1, 1) }, (_, i) => ({ path: `/blog/page/${i + 2}`, ...blog })),

    // About
    {
      path: '/about',
      eyebrow: 'About',
      title: 'Who stands behind the room.',
      subtitle: 'Agentic Finance is produced by More & More.',
      image: `${MNM}/about-mnm.jpg`,
    },
    {
      path: '/about/more-and-more',
      eyebrow: 'The producer',
      title: 'More & More',
      subtitle: 'Curated side events, executive gatherings and VIP delegations. 100+ events organised, 250+ deals and introductions.',
      image: `${MNM}/about-mnm.jpg`,
    },
    {
      path: '/about/event-series',
      eyebrow: 'The More & More ecosystem',
      title: 'Three brands.',
      accent: 'Three rooms.',
      subtitle: 'Agentic Finance · The Odds: Prediction Markets Live · Web2 to Web3 Summit',
      image: `${MNM}/the-odds-stage.webp`,
    },
    {
      path: '/about/faq',
      eyebrow: 'Access, invitations, partnerships',
      title: 'Common questions.',
      subtitle: 'Applying to attend, speaker nominations, partnerships, locations and media enquiries.',
      image: `${MNM}/concept-the-room.webp`,
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
  return editions.flatMap((e) => {
    const venue = e.venue?.name;
    const where = !venue ? e.city : venue.includes(e.city) ? venue : `${venue}, ${e.city}`;
    const main: OgCard = {
      path: `/editions/${e.slug}`,
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
        path: `/editions/${e.slug}/speakers`,
        eyebrow: `${e.shortName} · Speakers`,
        title: e.status === 'completed' ? `The ${e.city} lineup.` : 'Speakers',
        accent: e.status === 'completed' ? undefined : e.shortName,
        subtitle: e.status === 'completed' ? `${e.dateLabel} · ${where}` : 'Announced one by one as each confirms.',
        image: e.status === 'completed' ? `${SG}/agentic-banking-panel.webp` : e.image.src,
      });
    }
    if (e.hasAgenda) {
      cards.push({
        path: `/editions/${e.slug}/agenda`,
        eyebrow: `${e.shortName} · Agenda`,
        title: 'The run of show.',
        subtitle: `${e.dateLabel} · ${where}`,
        image: `${SG}/opening-keynote.webp`,
      });
    }
    const gala = e.experiences?.find((x) => x.id === 'gala');
    if (e.hasGala && gala) {
      cards.push({
        path: `/editions/${e.slug}/gala`,
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
    const dates = contextDates(p);
    const odds = p.brand === 'the-odds';
    return {
      path: `/upcoming/2027/${p.slug}`,
      eyebrow: `2027 · ${p.country}`,
      title: odds ? 'The Odds' : 'Agentic Finance',
      accent: odds ? `at ${p.context}, ${p.city}` : p.city,
      subtitle: [`During ${p.context}`, dates].filter(Boolean).join(' · '),
      note: 'Exact day and venue to follow',
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
  return [...useCases, ...otherUseCases].map((u) => {
    const e = getEdition(u.edition);
    return {
      path: `/partners/use-cases/${u.slug}`,
      eyebrow: `Partner use case · ${u.event?.label ?? e?.shortName ?? ''}`,
      title: `${u.partner} at`,
      accent: u.event?.name ?? e?.name,
      subtitle: u.positioning,
      image: u.photos[0]?.src,
      position: u.photos[0]?.position,
      brand: u.event?.name.startsWith('The Odds') ? 'the-odds' : 'agentic-finance',
    };
  });
}

function blogCards(): OgCard[] {
  return getPosts().map((p) => ({
    path: `/blog/${p.slug}`,
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

/** "/" → ["home.jpg"]; "/editions/dubai-2027" → ["editions", "dubai-2027.jpg"]. */
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
