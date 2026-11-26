import type { MetadataRoute } from 'next';
import { navigation } from '@/config/site';
import { editions } from '@/data/editions';
import { upcoming2027 } from '@/data/upcoming-2027';
import { otherUseCases, useCases } from '@/data/partners';
import { profiledSpeakers } from '@/lib/content';
import { blogPageCount, getPosts } from '@/lib/daily';
import { absoluteUrl } from '@/lib/paths';

// Generated once at build time for the static export.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = new Set<string>(['/', '/events/2026', '/apply', '/photo-credits']);
  // In-page links ("/about#faq") are sections of a page already listed, not pages.
  for (const href of navigation.flatMap((g) => [g.href, ...g.items.map((i) => i.href)])) {
    if (!href.includes('#')) staticPaths.add(href);
  }
  for (const p of ['/about/press', '/about/gallery', '/about/video', '/live']) staticPaths.add(p);

  // Planned 2027 cities point at their /events/2027 page, listed below once published.
  const editionPaths = editions.filter((e) => e.status !== 'planned').flatMap((e) => [
    e.path,
    ...(e.status !== 'planned' ? [`${e.path}/speakers`, `${e.path}/partners`] : []),
    ...(e.hasRecapPage ? [`${e.path}/recap`] : []),
    ...(e.hasAgenda ? [`${e.path}/agenda`] : []),
    ...(e.hasGala ? [`${e.path}/gala`] : []),
  ]);

  const paths = [
    ...staticPaths,
    ...editionPaths,
    ...upcoming2027.filter((p) => p.published).map((p) => p.path),
    ...profiledSpeakers().map((s) => `/speakers/${s.slug}`),
    ...[...useCases, ...otherUseCases].map((u) => `/partners/${u.slug}`),
    ...Array.from({ length: blogPageCount() - 1 }, (_, i) => `/live/news/page/${i + 2}`),
    ...getPosts().map((p) => `/live/news/${p.slug}`),
  ];

  return Array.from(new Set(paths)).map((p) => ({
    url: absoluteUrl(p),
    changeFrequency: p.startsWith('/events/2026/abu-dhabi') || p === '/' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : p.startsWith('/events/2026/abu-dhabi') || p === '/partners' || p === '/apply' ? 0.9 : 0.6,
  }));
}
