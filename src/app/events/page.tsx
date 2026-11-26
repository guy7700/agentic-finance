import type { Metadata } from 'next';
import { cardFromUpcoming2027, EditionCard } from '@/components/editions/EditionCard';
import { EventTabs } from '@/components/editions/EventTabs';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { editionsByStatus } from '@/data/editions';
import { upcoming2027 } from '@/data/upcoming-2027';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Events: Abu Dhabi, Singapore and 2027',
  description:
    'Agentic Finance editions: the Abu Dhabi summit on 4 December 2026, the Singapore 2026 archive and five cities in 2027.',
  path: '/events',
});

export default function EditionsPage() {
  const [upcoming] = editionsByStatus('upcoming');
  const completed = editionsByStatus('completed');
  const planned = editionsByStatus('planned');
  // The Odds 2027 pages have no planned-city card of their own.
  const odds2027 = upcoming2027.filter((p) => p.brand === 'the-odds' && p.published);

  const upcomingTab = (
    <>
      {upcoming ? <EditionCard edition={upcoming} size="feature" /> : null}
      <div className="mt-16">
        <SectionHeader
          eyebrow="2027 · Planned"
          title="Five cities in 2027."
          lede="Each edition runs during a major industry week in its city. Exact dates and venues follow once confirmed."
          action={<ButtonLink href="/events/2027" variant="outline">About the 2027 series</ButtonLink>}
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {planned.map((e, i) => (
            <li key={e.slug}>
              <EditionCard edition={e} size="compact" index={`0${i + 1}`} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw" />
            </li>
          ))}
        </ul>
        {odds2027.length ? (
          <>
            <h3 className="mono-label mt-12 text-paper/70">The Odds · 2027</h3>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {odds2027.map((p) => (
                <li key={p.slug}>
                  <EditionCard edition={cardFromUpcoming2027(p)} size="compact" sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw" />
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </>
  );

  const pastTab = (
    <div className="grid gap-5 md:grid-cols-2">
      {completed.map((e) => (
        <EditionCard key={e.slug} edition={e} size="standard" />
      ))}
    </div>
  );

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Events' }]}
        eyebrow="Events"
        title="The series."
        lede="What is coming, and what already happened. Every edition is its own curated room; the standard and the questions travel with us."
        actions={
          <>
            <ButtonLink href="/invitation">Apply to attend</ButtonLink>
            <ButtonLink href="/events/2027" variant="outline">The 2027 cities</ButtonLink>
          </>
        }
      />

      <Section className="!pt-16">
        <Container>
          <h2 className="sr-only">Upcoming and past events</h2>
          <EventTabs
            label="Events"
            tabs={[
              { id: 'upcoming', label: 'Upcoming', content: upcomingTab },
              { id: 'past', label: 'Past', count: completed.length, content: pastTab },
            ]}
          />
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <SectionHeader eyebrow="How to read an edition" title="Three states." />
          <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {[
              { k: 'Upcoming', v: 'Open for invitation requests, speaker nominations and partnership conversations. Only confirmed details are published.' },
              { k: 'Archive', v: 'Completed editions: verified numbers, the agenda as it ran, speakers, partners, photography and video.' },
              { k: 'Planned', v: 'The 2027 calendar, with a month for each city. Exact dates, venues and speakers follow once confirmed.' },
            ].map((x) => (
              <div key={x.k} className="bg-ink p-7">
                <dt className="text-xl font-semibold text-gold">{x.k}</dt>
                <dd className="mt-3 leading-relaxed text-muted">{x.v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
