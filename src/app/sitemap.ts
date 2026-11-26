import type { MetadataRoute } from 'next';
import { navigation } from '@/config/site';
import { editions } from '@/data/editions';
import { upcoming2027 } from '@/data/upcoming-2027';
import { organizations } from '@/data/partners';
import { pastArchives } from '@/data/past-archives';
import { companySlug } from '@/lib/companies';
import { profiledSpeakers } from '@/lib/content';
import { blogPageCount, getPosts } from '@/lib/daily';
import { absoluteUrl } from '@/lib/paths';

// Generated once at build time for the static export.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = new Set<string>(['/', '/events/2026', '/apply', '/photo-credits', '/terms']);
  // In-page links ("/about#faq") are sections of a page already listed, not pages.
  for (const href of navigation.flatMap((g) => [g.href, ...g.items.map((i) => i.href)])) {
    if (!href.includes('#')) staticPaths.add(href);
  }
  for (const p of ['/about/press', '/about/brand', '/about/more-and-more', '/about/program', '/about/themes', '/live']) staticPaths.add(p);

  // Past editions with their sub-pages. 2027 editions are listed below from their own schedule;
  // cancelled ones (Abu Dhabi 2026) are not pages any more.
  const editionPaths = editions.filter((e) => e.status === 'completed').flatMap((e) => [
    e.path,
    `${e.path}/speakers`,
    `${e.path}/partners`,
    ...(e.hasRecapPage ? [`${e.path}/recap`] : []),
    ...(e.hasAgenda ? [`${e.path}/agenda`] : []),
    ...(e.hasGala ? [`${e.path}/gala`] : []),
  ]);

  const paths = [
    ...staticPaths,
    ...editionPaths,
    ...upcoming2027.filter((p) => p.published).map((p) => p.path),
    ...profiledSpeakers().map((s) => `/speakers/${s.slug}`),
    ...organizations.map((o) => `/partners/${companySlug(o.id)}`),
    ...pastArchives.map((a) => a.path),
    ...Array.from({ length: blogPageCount() - 1 }, (_, i) => `/live/news/page/${i + 2}`),
    ...getPosts().map((p) => `/live/news/${p.slug}`),
  ];

  return Array.from(new Set(paths)).map((p) => ({
    url: absoluteUrl(p),
    changeFrequency: p.startsWith('/events/2027') || p === '/' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : p.startsWith('/events/2027') || p === '/partners' || p === '/partners/book-a-call' || p.startsWith('/network') ? 0.9 : 0.6,
  }));
}
