import type { Metadata } from 'next';
import { SpeakerDirectory } from '@/components/speakers/SpeakerDirectory';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { conferenceLabels, editions } from '@/data/editions';
import { speakers } from '@/data/speakers';
import { pageMetadata } from '@/lib/seo';
import { toDirectoryEntry } from '@/lib/speaker-cards';

export const metadata: Metadata = pageMetadata({
  title: 'All speakers',
  description:
    'The Agentic Finance speaker directory: leaders from Standard Chartered, eToro, Pantera Capital, Aave Labs, Chainlink Labs, KPMG, Fireblocks and more, filterable by edition, city and organisation.',
  path: '/speakers',
});

function count<T>(items: T[], key: (t: T) => string[]) {
  const map = new Map<string, number>();
  for (const it of items) for (const k of key(it)) map.set(k, (map.get(k) ?? 0) + 1);
  return map;
}

export default function SpeakersPage() {
  const entries = speakers.map(toDirectoryEntry);

  const eventCounts = count(entries, (e) => e.events);
  const editionEvents = editions
    .filter((e) => e.status !== 'planned')
    .map((e) => ({ value: e.shortName, label: e.shortName, count: eventCounts.get(e.shortName) ?? 0 }));
  const otherEvents = Object.values(conferenceLabels).map((c) => ({ value: c.label, label: c.label, count: eventCounts.get(c.label) ?? 0 }));
  const events = [...editionEvents, ...otherEvents].filter((o) => o.count > 0 || editionEvents.includes(o));

  const cityCounts = count(entries, (e) => e.cities);
  const cities = Array.from(cityCounts, ([value, n]) => ({ value, label: value, count: n })).sort((a, b) => a.label.localeCompare(b.label));
  const orgCounts = count(entries, (e) => [e.organization]);
  const organizations = Array.from(orgCounts, ([value, n]) => ({ value, label: value, count: n })).sort((a, b) => a.label.localeCompare(b.label));

  const abuDhabi = editions.find((e) => e.status === 'upcoming');

  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Speakers' }]}
        eyebrow="Speakers · Every edition"
        title="Everyone who has held the floor."
        lede="Operators from the banks, exchanges, funds, regulators and infrastructure providers putting AI agents into production, tagged by the edition and city where they spoke."
        actions={
          <>
            <ButtonLink href="/speakers/nominate">Nominate a speaker</ButtonLink>
            <ButtonLink href="/editions/singapore-2026/agenda" variant="outline">Who spoke when</ButtonLink>
          </>
        }
      />
      <Section className="!pt-0">
        <Container>
          <SpeakerDirectory
            entries={entries}
            events={events}
            cities={cities}
            organizations={organizations}
            emptyEvents={
              abuDhabi
                ? {
                    [abuDhabi.shortName]: {
                      title: `${abuDhabi.city} speakers are announced one by one.`,
                      body: `No speakers have been publicly announced for ${abuDhabi.name} yet. The first names will appear here as they confirm.`,
                    },
                  }
                : {}
            }
          />
          <p className="mt-14 max-w-3xl text-[13px] leading-relaxed text-subtle">
            Profiles, titles and photographs are as published for each edition. “More &amp; More conferences” marks speakers listed among
            speakers at our conferences without a specific Agentic Finance edition; “The Odds · Paris 2026” marks speakers from the sister
            prediction-markets summit.
          </p>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
