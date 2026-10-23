import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { absoluteUrl } from '@/lib/paths';

/**
 * Indexing is controlled by NEXT_PUBLIC_ALLOW_INDEXING at build time.
 * Generated once at build time for the static export.
 */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  if (!site.allowIndexing) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
