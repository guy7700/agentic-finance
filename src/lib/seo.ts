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

/** Consistent per-page metadata: canonical, Open Graph and Twitter cards. */
export function pageMetadata({ title, description, path, image, imageAlt, type = 'website', noindex }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const images = [{ url: absoluteUrl(image ?? '/og-image.jpg'), width: 1200, height: 630, alt: imageAlt ?? site.name }];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type, images, locale: 'en_GB' },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
