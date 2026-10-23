import type { NextConfig } from 'next';

/**
 * Static export for GitHub Pages (agentic-finance.live). `next build` writes the
 * whole site as plain files to `out/`; there is no server.
 *
 * NEXT_PUBLIC_BASE_PATH stays empty on the custom domain. Set it only if the site
 * is ever served from a sub-path (for example username.github.io/repo).
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

const nextConfig: NextConfig = {
  output: 'export',
  // /editions/ → editions/index.html, which every static host serves correctly.
  trailingSlash: true,
  // Cache Components / Partial Prefetching need a running server; a static
  // export has none, so they stay off.
  basePath: basePath || undefined,
  poweredByHeader: false,
  images: {
    // GitHub Pages has no image optimiser; images are pre-sized WebP files.
    unoptimized: true,
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
