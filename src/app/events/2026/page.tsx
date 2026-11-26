import type { Metadata } from 'next';
import { PastEventCard } from '@/components/home/HomeSections';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { pastEvents } from '@/data/events';
import { pageMetadata } from '@/lib/seo';

/** The 2026 editions (Paris in April, Singapore in October), in date order. */
const events2026 = pastEvents.filter((e) => e.date.includes('2026')).reverse();

export const metadata: Metadata = pageMetadata({
  title: 'Where we were in 2026',
  description: `Our 2026 editions: ${events2026.map((e) => `${e.name}, ${e.city}, ${e.date}`).join('; ')}.`,
  path: '/events/2026',
});

/** The 2026 yearly overview, in retrospective wording (Tal, 26 Nov 2026). */
export default function Events2026Page() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Events', href: '/events' }, { label: '2026' }]}
        eyebrow="Events · 2026"
        title={
          <>
            Where we were in <span className="text-gold">2026.</span>
          </>
        }
        lede="The Odds in Paris in April, and the first Agentic Finance Summit in Singapore in October."
        actions={<ButtonLink href="/events/2027" variant="outline">Where are we heading in 2027?</ButtonLink>}
      />
      <Section className="!pt-16">
        <Container>
          <h2 className="sr-only">2026 events</h2>
          <ul className="grid gap-5 md:grid-cols-2">
            {events2026.map((e) => (
              <li key={e.id}>
                <PastEventCard event={e} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
