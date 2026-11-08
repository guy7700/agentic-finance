import type { Metadata } from 'next';
import { EditionCard } from '@/components/editions/EditionCard';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { editionsByStatus } from '@/data/editions';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Editions: Abu Dhabi, Singapore and 2027',
  description:
    'Agentic Finance editions: the Abu Dhabi summit on 4 December 2026, the Singapore 2026 archive and five cities in 2027.',
  path: '/editions',
});

export default function EditionsPage() {
  const [upcoming] = editionsByStatus('upcoming');
  const completed = editionsByStatus('completed');
  const planned = editionsByStatus('planned');

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Editions' }]}
        eyebrow="Editions"
        title="The series."
        lede="What is coming, and what already happened. Every edition is its own curated room; the standard and the questions travel with us."
        actions={
          <>
            <ButtonLink href="/invitation">Apply to attend</ButtonLink>
            <ButtonLink href="/editions/2027" variant="outline">The 2027 cities</ButtonLink>
          </>
        }
      />

      <Section className="!pt-16">
        <Container>
          <h2 className="sr-only">Current and past editions</h2>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            {upcoming ? <EditionCard edition={upcoming} size="feature" /> : null}
            <div className="grid gap-5">
              {completed.map((e) => (
                <EditionCard key={e.slug} edition={e} size="standard" />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <SectionHeader
            eyebrow="2027 · Planned"
            title="Five cities in 2027."
            lede="Each edition runs during a major industry week in its city. Exact dates and venues follow once confirmed."
            action={<ButtonLink href="/editions/2027" variant="outline">About the 2027 series</ButtonLink>}
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {planned.map((e, i) => (
              <li key={e.slug}>
                <EditionCard edition={e} size="compact" index={`0${i + 1}`} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
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
