import type { Metadata } from 'next';
import { EditionCard } from '@/components/editions/EditionCard';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { editions } from '@/data/editions';
import { pageMetadata } from '@/lib/seo';

/** Every 2026 event, in date order (Tal's site structure: /events/2026/). */
const events2026 = editions
  .filter((e) => e.year === 2026)
  .sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''));

export const metadata: Metadata = pageMetadata({
  title: 'Agentic Finance events in 2026',
  description: `Agentic Finance in 2026: ${events2026.map((e) => `${e.name}, ${e.dateLabel}`).join('; ')}.`,
  path: '/events/2026',
});

export default function Events2026Page() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Events', href: '/events' }, { label: '2026' }]}
        eyebrow="Events · 2026"
        title={
          <>
            Agentic Finance in <span className="text-gold">2026.</span>
          </>
        }
        lede="Every Agentic Finance event this year."
      />

      <Section className="!pt-16">
        <Container>
          <h2 className="sr-only">2026 events</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {events2026.map((e) => (
              <EditionCard key={e.slug} edition={e} size="standard" sizes="(min-width: 768px) 50vw, 100vw" />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
