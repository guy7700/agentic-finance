import type { Metadata } from 'next';
import { Gallery } from '@/components/media/Gallery';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { GroupIndex } from '@/components/ui/GroupIndex';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { gallery, galleryCollections, videos } from '@/data/media';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Media',
  description: 'Agentic Finance in pictures and video: the Singapore 2026 recap, event photography by edition, press resources and the brand kit.',
  path: '/media',
});

export default function MediaPage() {
  const recap = videos[0];
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Media' }]}
        eyebrow="Media"
        title="Proof in pictures."
        lede="The rooms we have built, as they happened. For guests deciding whether to come, and for partners deciding whether to be seen there."
        image={{ src: '/images/singapore-2026/agentic-trading-panel.webp', alt: '' }}
        actions={<ButtonLink href="/media/singapore-2026-recap">Singapore 2026 recap</ButtonLink>}
      />
      <GroupIndex group="media" />
      <Section bordered tone="raised">
        <Container>
          <SectionHeader eyebrow="Video" title="Watch Singapore." action={<ButtonLink href="/media/video" variant="outline">All videos</ButtonLink>} />
          <div className="mt-10">
            <VideoPlayer src={recap.src} poster={recap.poster} title={recap.title} duration={recap.duration} hasAudio={recap.hasAudio} />
          </div>
        </Container>
      </Section>
      <Section bordered>
        <Container>
          <SectionHeader eyebrow="Gallery" title="Selected photographs." action={<ButtonLink href="/media/gallery" variant="outline">Full gallery</ButtonLink>} />
          <div className="mt-10">
            <Gallery images={gallery.filter((g) => g.edition === 'singapore-2026').slice(0, 9)} collections={galleryCollections} filters={false} />
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
