import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AgendaBrowser, type AgendaSession } from '@/components/speakers/AgendaBrowser';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { editions, getEdition } from '@/data/editions';
import { getSpeaker, isContentSession, isProgrammeSession, sessionsForEdition, stageLabels } from '@/lib/content';
import { absoluteUrl, speakerThumb } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return editions.filter((e) => e.hasAgenda).map((e) => ({ edition: e.slug }));
}

export async function generateMetadata({ params }: PageProps<'/editions/[edition]/agenda'>): Promise<Metadata> {
  const { edition: slug } = await params;
  const e = getEdition(slug);
  if (!e?.hasAgenda) return {};
  return pageMetadata({
    title: `${e.shortName} agenda`,
    description: `The run of show for ${e.name}, ${e.dateLabel}: both stages, every session and speaker, in Singapore time.`,
    path: `/editions/${e.slug}/agenda`,
  });
}

export default async function AgendaPage({ params }: PageProps<'/editions/[edition]/agenda'>) {
  const { edition: slug } = await params;
  const e = getEdition(slug);
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
        size="md"
        crumbs={[{ label: 'Editions', href: '/editions' }, { label: e.shortName, href: `/editions/${e.slug}` }, { label: 'Agenda' }]}
        eyebrow={`Archive · ${e.dateLabel} · ${e.venue?.name}`}
        title="The run of show."
        lede={`${contentCount} sessions across two stages, plus opening and closing remarks, 14:00–20:00 SGT. Agentic Finance on the main stage, hosted by Tal Mor of More & More and moderated by Vaibhavv Ali (Vali); The Odds: Prediction Markets Live alongside it.`}
        actions={
          <>
            <ButtonLink href={`/editions/${e.slug}/speakers`} variant="outline">Speakers by session</ButtonLink>
            <ButtonLink href="/media/video" variant="ghost">Watch the recap</ButtonLink>
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
          url: absoluteUrl(`/editions/${e.slug}`),
          location: { '@type': 'Place', name: e.venue?.name, address: e.venue?.address },
          subEvent: raw.filter(isContentSession).map((s) => ({
            '@type': 'Event',
            name: s.title,
            description: s.summary,
            startDate: `2026-10-08T${s.start}:00+08:00`,
            endDate: `2026-10-08T${s.end}:00+08:00`,
            url: absoluteUrl(`/editions/${e.slug}/agenda#${s.id}`),
            performer: s.speakers.map((p) => ({ '@type': 'Person', name: getSpeaker(p)?.name })),
          })),
        }}
      />
    </>
  );
}
