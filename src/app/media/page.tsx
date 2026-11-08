import type { Metadata } from 'next';
import { Gallery } from '@/components/media/Gallery';
import { PressMentions } from '@/components/media/PressMentions';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { GroupIndex } from '@/components/ui/GroupIndex';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { gallery, galleryCollections, galleryTags, videos } from '@/data/media';
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
          <SectionHeader
            eyebrow="Gallery"
            title={
              <>
                Photos by <span className="serif-accent">edition</span>.
              </>
            }
            lede="Filter by edition or moment. Select any photo to view it full screen."
            action={<ButtonLink href="/media/gallery" variant="outline">Full gallery</ButtonLink>}
          />
          <div className="mt-10">
            <Gallery images={gallery} collections={galleryCollections} tags={galleryTags} limit={9} moreHref="/media/gallery" />
          </div>
        </Container>
      </Section>
      <Section bordered tone="raised">
        <Container>
          <SectionHeader
            eyebrow="Coverage"
            title={
              <>
                Agentic Finance in the <span className="serif-accent">Press</span>
              </>
            }
            action={<ButtonLink href="/media/press#in-the-press" variant="outline">Press and brand kit</ButtonLink>}
          />
          <PressMentions limit={3} className="mt-10" />
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
