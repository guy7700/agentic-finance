import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { JsonLd } from '@/components/ui/JsonLd';
import { contacts, site, social } from '@/config/site';
import { absoluteUrl } from '@/lib/paths';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.canonicalBase),
  title: {
    default: 'Agentic Finance · The invitation-only summit series for AI-native finance',
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
  themeColor: '#0A0E1A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-gold px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
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
            parentOrganization: { '@type': 'Organization', name: 'More & More', url: 'https://mnm.live' },
            sameAs: social.map((s) => s.href),
          }}
        />
      </body>
    </html>
  );
}
