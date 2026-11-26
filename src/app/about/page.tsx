import type { Metadata } from 'next';
import Link from 'next/link';
import { AboutIndex, EventSeriesSection, WhoWeAreSection } from '@/components/about/AboutSections';
import { Icon } from '@/components/ui/Icon';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About: More & More and the Agentic Finance series',
  description:
    'Agentic Finance is produced by More & More, which connects technology companies with financial institutions, enterprises and governments: 100+ events organised.',
  path: '/about',
});

const PAGES = [
  { href: '/about/more-and-more', title: 'About us', text: 'More & More, our track record and the team.' },
  { href: '/about/program', title: 'Program', text: 'What happens at our events: formats and experiences.' },
  { href: '/about/themes', title: 'Themes', text: 'The questions and topics shaping finance.' },
  { href: '/about/brand', title: 'Brand', text: 'Videos, photos and the brand kit.' },
  { href: '/about/press', title: 'Press', text: 'Coverage of our events.' },
  { href: '/about/contact', title: 'Contact', text: 'Talk to the team.' },
];

/**
 * About (Tal's review, 26 Nov 2026): More & More first, then the event series with its track
 * record; the rest of About has its own pages. No calls to action in the opening section.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'About' }]}
        eyebrow="About"
        title="Who stands behind the room."
        lede="Agentic Finance is produced by More & More, a team that has spent years building rooms where institutions, founders, capital and regulators do business."
        image={{ src: '/images/more-and-more/about-mnm.jpg', alt: '' }}
        footer={<AboutIndex />}
      />
      <WhoWeAreSection />
      <EventSeriesSection />
      <Section bordered tone="raised">
        <Container>
          <SectionHeader title="More about us" size="md" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-line bg-ink-card/60 p-6 transition-colors hover:border-gold/60">
                  <span>
                    <span className="block text-lg font-semibold group-hover:text-gold">{p.title}</span>
                    <span className="mt-1 block text-sm text-muted">{p.text}</span>
                  </span>
                  <Icon name="arrow-right" size={18} className="shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
