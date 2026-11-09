import type { MetadataRoute } from 'next';
import { navigation } from '@/config/site';
import { editions } from '@/data/editions';
import { otherUseCases, useCases } from '@/data/partners';
import { profiledSpeakers } from '@/lib/content';
import { blogPageCount, getPosts } from '@/lib/daily';
import { absoluteUrl } from '@/lib/paths';

// Generated once at build time for the static export.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = new Set<string>(['/', '/invitation', '/photo-credits']);
  for (const g of navigation) {
    staticPaths.add(g.href);
    for (const i of g.items) staticPaths.add(i.href);
  }

  const editionPaths = editions.flatMap((e) => [
    `/editions/${e.slug}`,
    ...(e.status !== 'planned' ? [`/editions/${e.slug}/speakers`] : []),
    ...(e.hasAgenda ? [`/editions/${e.slug}/agenda`] : []),
    ...(e.hasGala ? [`/editions/${e.slug}/gala`] : []),
  ]);

  const paths = [
    ...staticPaths,
    ...editionPaths,
    ...profiledSpeakers().map((s) => `/speakers/${s.slug}`),
    ...[...useCases, ...otherUseCases].map((u) => `/partners/use-cases/${u.slug}`),
    ...Array.from({ length: blogPageCount() - 1 }, (_, i) => `/blog/page/${i + 2}`),
    ...getPosts().map((p) => `/blog/${p.slug}`),
  ];

  return Array.from(new Set(paths)).map((p) => ({
    url: absoluteUrl(p),
    changeFrequency: p.startsWith('/editions/abu-dhabi') || p === '/' ? 'weekly' : 'monthly',
    priority: p === '/' ? 1 : p.startsWith('/editions/abu-dhabi') || p === '/partners' || p === '/invitation' ? 0.9 : 0.6,
  }));
}
