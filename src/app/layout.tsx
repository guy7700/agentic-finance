import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Space_Grotesk } from 'next/font/google';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { JsonLd } from '@/components/ui/JsonLd';
import { contacts, site } from '@/config/site';
import { absoluteUrl } from '@/lib/paths';
import './globals.css';

// The typography of mnm.live/agentic-finance-abu-dhabi: Space Grotesk for text
// and headings, Cormorant Garamond italic for accent words and large figures.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.canonicalBase),
  title: {
    default: 'Agentic Finance: AI agents in finance summits',
    template: '%s · Agentic Finance',
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: 'More & More', url: 'https://mnm.live' }],
  creator: 'More & More',
  publisher: 'More & More',
  robots: site.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: '#0A1428',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${cormorant.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            '@id': `${absoluteUrl('/')}#organization`,
            name: 'Agentic Finance',
            url: absoluteUrl('/'),
            description: site.description,
            email: contacts.general,
            logo: absoluteUrl('/brand/agentic-finance-logo-blue.svg'),
            parentOrganization: { '@type': 'Organization', name: 'More & More', url: 'https://mnm.live' },
          }}
        />
      </body>
    </html>
  );
}
