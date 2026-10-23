import type { Metadata } from 'next';
import { Gallery } from '@/components/media/Gallery';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { gallery, galleryCollections, galleryTags } from '@/data/media';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Gallery',
  description:
    'Photography from Agentic Finance Singapore 2026 and More & More events in Paris and Abu Dhabi: the stages, the floor, partner activations and the people in the room.',
  path: '/media/gallery',
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Media', href: '/media' }, { label: 'Gallery' }]}
        eyebrow="Media · Photos by edition"
        title="Gallery."
        lede="Photographs from Agentic Finance Singapore 2026, and from the More & More rooms that came before it in Paris and Abu Dhabi. Select any photo to view it full size."
      />
      <Section className="!pt-10">
        <Container>
          <Gallery images={gallery} collections={galleryCollections} tags={galleryTags} />
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
