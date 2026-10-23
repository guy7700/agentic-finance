import type { Metadata } from 'next';
import { VideoLibrary } from '@/components/media/VideoLibrary';
import { CtaBand } from '@/components/ui/CtaBand';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { getEdition } from '@/data/editions';
import { videos } from '@/data/media';
import { getSpeaker } from '@/lib/content';
import { absoluteUrl } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Video',
  description: 'Video from Agentic Finance: the Singapore 2026 recap, a highlight loop from the day, and The Odds Singapore aftermovie.',
  path: '/media/video',
});

export default function VideoPage() {
  const views = videos.map((v) => ({
    ...v,
    editionLabel: getEdition(v.edition)?.shortName ?? v.edition,
    speakerNames: (v.speakers ?? []).map((s) => getSpeaker(s)?.name).filter((n): n is string => Boolean(n)),
  }));
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Media', href: '/media' }, { label: 'Video' }]}
        eyebrow="Media · Video"
        title="Video."
        lede="Films from our editions. Every video here was recorded at an event we produced; full session recordings will be added as they are published."
      />
      <Section className="!pt-12">
        <Container>
          <VideoLibrary videos={views} />
        </Container>
      </Section>
      <CtaBand />
      <JsonLd
        data={videos.map((v) => ({
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: v.title,
          description: v.description,
          thumbnailUrl: [absoluteUrl(v.poster)],
          contentUrl: v.external ? v.src : absoluteUrl(v.src),
          duration: `PT${v.duration.split(':')[0]}M${v.duration.split(':')[1]}S`,
        }))}
      />
    </>
  );
}
