import type { Metadata } from 'next';
import { site } from '@/config/site';
import { getOgCard, ogCardAlt, ogCardVersion, ogImageSegments, type OgCard } from './og/cards';
import { absoluteUrl } from './paths';

type PageMetaInput = {
  /** The search title. The layout adds " · Agentic Finance" when it fits. */
  title: string;
  description: string;
  path: string;
  /**
   * The title for link previews (Telegram, WhatsApp, LinkedIn, X). Defaults to
   * the title as the browser shows it, brand included.
   */
  socialTitle?: string;
  type?: 'website' | 'profile' | 'article';
  noindex?: boolean;
};

/** Search engines cut titles near 60 characters and descriptions near 155. */
const TITLE_MAX = 59;
const DESCRIPTION_MAX = 154;
const SUFFIX = ` · ${site.name}`;

function clamp(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const sentence = cut.lastIndexOf('. ');
  if (sentence > max * 0.55) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:]+$/, '')}…`;
}

/**
 * The title as the browser shows it. The layout template adds " · Agentic
 * Finance"; titles that already name the brand, or would run past 60
 * characters with it, are used on their own.
 */
function shownTitle(title: string): string {
  if (title.includes(site.name) || title.length + SUFFIX.length > TITLE_MAX) return clamp(title, TITLE_MAX);
  return `${title}${SUFFIX}`;
}

/** The page's share card, as Open Graph image fields. */
export function ogImage(card: OgCard) {
  const url = `${absoluteUrl(`/og/${ogImageSegments(card.path).join('/')}`)}?v=${ogCardVersion(card)}`;
  return { url, width: 1200, height: 630, alt: ogCardAlt(card), type: 'image/jpeg' };
}

/** Consistent per-page metadata: canonical, Open Graph and Twitter cards. */
export function pageMetadata({ title, description, path, socialTitle, type = 'website', noindex }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const desc = clamp(description, DESCRIPTION_MAX);
  const shown = shownTitle(title);
  const share = socialTitle ?? shown;
  const card = getOgCard(path) ?? getOgCard('/');
  if (!getOgCard(path)) console.warn(`[seo] No share card for ${path}; using the home card. Add one in src/lib/og/cards.ts.`);
  const images = card ? [ogImage(card)] : [];
  return {
    // The layout's title template would add the suffix again, so the finished title is passed as absolute.
    title: { absolute: shown },
    description: desc,
    alternates: { canonical: url },
    openGraph: { title: share, description: desc, url, siteName: site.name, type, images, locale: 'en_GB' },
    twitter: { card: 'summary_large_image', title: share, description: desc, images },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
