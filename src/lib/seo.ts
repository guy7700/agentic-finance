import type { Metadata } from 'next';
import { site } from '@/config/site';
import { absoluteUrl } from './paths';

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Absolute or site-relative image; defaults to the generated brand image. */
  image?: string;
  imageAlt?: string;
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
 * The layout template adds " · Agentic Finance". Titles that already name the
 * brand, or would run past 60 characters with it, are used on their own.
 */
function documentTitle(title: string): Metadata['title'] {
  if (title.includes(site.name) || title.length + SUFFIX.length > TITLE_MAX) return { absolute: clamp(title, TITLE_MAX) };
  return title;
}

/** Consistent per-page metadata: canonical, Open Graph and Twitter cards. */
export function pageMetadata({ title, description, path, image, imageAlt, type = 'website', noindex }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const desc = clamp(description, DESCRIPTION_MAX);
  const images = [{ url: absoluteUrl(image ?? '/og-image.jpg'), width: 1200, height: 630, alt: imageAlt ?? site.name }];
  return {
    title: documentTitle(title),
    description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, siteName: site.name, type, images, locale: 'en_GB' },
    twitter: { card: 'summary_large_image', title, description: desc, images: images.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
