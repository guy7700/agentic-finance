import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditionNav } from '@/components/editions/EditionNav';
import { AgendaBrowser, type AgendaSession } from '@/components/speakers/AgendaBrowser';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { cityParams, getEditionByPath } from '@/data/editions';
import { getSpeaker, isContentSession, isProgrammeSession, sessionsForEdition, stageLabels } from '@/lib/content';
import { absoluteUrl, speakerThumb } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return cityParams(2026, (e) => !!e.hasAgenda);
}

export async function generateMetadata({ params }: PageProps<'/events/2026/[city]/agenda'>): Promise<Metadata> {
  const { city } = await params;
  const e = getEditionByPath(`/events/2026/${city}`);
  if (!e?.hasAgenda) return {};
  return pageMetadata({
    title: `${e.shortName} agenda`,
    description: `The run of show for ${e.name}, ${e.dateLabel}: both stages, every session and speaker, in Singapore time.`,
    path: `${e.path}/agenda`,
  });
}

export default async function AgendaPage({ params }: PageProps<'/events/2026/[city]/agenda'>) {
  const { city } = await params;
  const e = getEditionByPath(`/events/2026/${city}`);
  if (!e?.hasAgenda) notFound();

  const raw = sessionsForEdition(e.slug);
  const sessions: AgendaSession[] = raw.map((s) => ({
    id: s.id,
    stage: s.stage,
    start: s.start,
    end: s.end,
    format: s.format,
    title: s.title,
    summary: s.summary,
    note: s.note,
    linkTo: s.linkTo,
    people: s.speakers
      .map((slugId) => {
        const p = getSpeaker(slugId);
        if (!p) return null;
        return {
          slug: p.slug,
          name: p.name,
          title: p.title,
          organization: p.organization,
          photo: speakerThumb(p.photo),
          hasProfile: p.hasProfile !== false && Boolean(p.bio),
          moderator: s.moderator === p.slug,
        };
      })
      .filter((p) => p !== null),
  }));
  const contentCount = raw.filter(isProgrammeSession).length;

  return (
    <>
      <PageHero
        footer={<EditionNav edition={e} current="agenda" />}
        size="md"
        crumbs={[{ label: 'Events', href: '/events' }, { label: e.shortName, href: `${e.path}` }, { label: 'Agenda' }]}
        eyebrow={`Past edition · ${e.dateLabel} · ${e.venue?.name}`}
        title="The run of show."
        lede={`${contentCount} sessions across two stages, plus opening and closing remarks, 14:00-20:00 SGT. Agentic Finance on the main stage, hosted by Tal Mor of More & More and moderated by Vaibhavv Ali (Vali); The Odds: Prediction Markets Live alongside it.`}
        actions={
          <>
            <ButtonLink href={`${e.path}/speakers`} variant="outline">Speakers by session</ButtonLink>
            <ButtonLink href="/about/brand#videos" variant="ghost">Watch the recap</ButtonLink>
          </>
        }
      />
      <Section className="!pt-10">
        <Container>
          <AgendaBrowser
            sessions={sessions}
            timezone="SGT (UTC+8)"
            stages={[
              { id: 'af', ...stageLabels.af },
              { id: 'odds', ...stageLabels.odds },
            ]}
          />
        </Container>
      </Section>
      <CtaBand />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: e.name,
          startDate: e.startDate,
          endDate: e.endDate,
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          url: absoluteUrl(`${e.path}`),
          location: { '@type': 'Place', name: e.venue?.name, address: e.venue?.address },
          subEvent: raw.filter(isContentSession).map((s) => ({
            '@type': 'Event',
            name: s.title,
            description: s.summary,
            startDate: `2026-10-08T${s.start}:00+08:00`,
            endDate: `2026-10-08T${s.end}:00+08:00`,
            url: absoluteUrl(`${e.path}/agenda#${s.id}`),
            performer: s.speakers.map((p) => ({ '@type': 'Person', name: getSpeaker(p)?.name })),
          })),
        }}
      />
    </>
  );
}
