import { site } from '@/config/site';

/**
 * Base path the app is served under (e.g. "/agentic-finance" when mounted on
 * mnm.live as a zone). next/link applies it automatically; public assets do not.
 */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

/** Prefix a /public asset path with the base path. External URLs pass through. */
export function asset(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${basePath}${path}`;
}

/**
 * Absolute public URL, used for canonicals, sitemaps and JSON-LD. Routes get a
 * trailing slash to match the static export (files keep their extension).
 */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path;
  if (path === '/') return `${site.canonicalBase}/`;
  const [route, hash] = path.split('#');
  const isFile = /\.[a-z0-9]+$/i.test(route);
  const withSlash = isFile || route.endsWith('/') ? route : `${route}/`;
  return `${site.canonicalBase}${withSlash}${hash ? `#${hash}` : ''}`;
}

/** Smaller speaker portrait for cards and avatars (full size stays on profiles). */
export function speakerThumb(photo: string): string {
  return photo.replace('/images/speakers/', '/images/speakers/thumb/');
}

export function isExternal(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}
