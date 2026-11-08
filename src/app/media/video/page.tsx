import type { Metadata } from 'next';
import { VideoLibrary } from '@/components/media/VideoLibrary';
import { CtaBand } from '@/components/ui/CtaBand';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { getEdition } from '@/data/editions';
import { otherEventLabels, videos } from '@/data/media';
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
    editionLabel: getEdition(v.edition)?.shortName ?? otherEventLabels[v.edition] ?? v.edition,
    speakerNames: (v.speakers ?? []).map((s) => getSpeaker(s)?.name).filter((n): n is string => Boolean(n)),
  }));
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Media', href: '/media' }, { label: 'Video' }]}
        eyebrow="Media · Video"
        title="Video."
        lede="Films from our editions: recaps, highlights and aftermovies. Browse by edition or by type."
      />
      <Section className="!pt-12">
        <Container>
          <VideoLibrary
            videos={views}
            note="Full keynote and panel recordings from Singapore have not been published yet. They will appear here, by edition and type, as they are released."
          />
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
          ...(v.youtubeId
            ? { embedUrl: `https://www.youtube.com/embed/${v.youtubeId}`, url: v.src }
            : { contentUrl: v.external ? v.src : absoluteUrl(v.src) }),
          duration: `PT${v.duration.split(':')[0]}M${v.duration.split(':')[1]}S`,
        }))}
      />
    </>
  );
}
