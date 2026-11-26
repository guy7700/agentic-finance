import type { Metadata } from 'next';
import { BrandKit } from '@/components/media/BrandKit';
import { Gallery } from '@/components/media/Gallery';
import { VideoLibrary } from '@/components/media/VideoLibrary';
import { ButtonLink } from '@/components/ui/Button';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { conferenceLabels, getEdition } from '@/data/editions';
import { gallery, galleryCollections, galleryTags, otherEventLabels, videos } from '@/data/media';
import { getSpeaker } from '@/lib/content';
import { absoluteUrl } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Brand: videos, photos and brand kit',
  description: 'Films and photographs from Agentic Finance and More & More events in Singapore, Paris and Abu Dhabi, and the official logo files.',
  path: '/about/brand',
});

/** Brand (Tal's review, 26 Nov 2026): videos, the photo gallery and the brand kit on one page. Press is its own page. */
export default function BrandPage() {
  const views = videos.map((v) => ({
    ...v,
    editionLabel: getEdition(v.edition)?.shortName ?? otherEventLabels[v.edition] ?? conferenceLabels[v.edition]?.label ?? v.edition,
    speakerNames: (v.speakers ?? []).map((s) => getSpeaker(s)?.name).filter((n): n is string => Boolean(n)),
  }));
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Brand' }]}
        eyebrow="About · Brand"
        title="Brand."
        lede="Our events on film and in photographs, and the official logo files."
        footer={
          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {[
              { href: '#videos', label: 'Videos' },
              { href: '#photos', label: 'Photos' },
              { href: '#brand-kit', label: 'Brand kit' },
            ].map((l) => (
              <a key={l.href} href={l.href} className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
                {l.label}
              </a>
            ))}
          </nav>
        }
      />
      <Section className="!pt-12" id="videos">
        <Container>
          <SectionHeader eyebrow="Videos" title="Our events on film." lede="Recaps, highlights and aftermovies, by event and type." size="md" />
          <div className="mt-10">
            <VideoLibrary videos={views} />
          </div>
        </Container>
      </Section>
      <Section bordered tone="raised" id="photos">
        <Container>
          <SectionHeader
            eyebrow="Photos"
            title="Gallery."
            lede="Singapore 2026, and the More & More rooms in Paris and Abu Dhabi. Select any photo to view it full screen."
            size="md"
            action={
              <ButtonLink href="/about/press" variant="outline">
                Press
              </ButtonLink>
            }
          />
          <div className="mt-10">
            <Gallery images={gallery} collections={galleryCollections} tags={galleryTags} />
          </div>
        </Container>
      </Section>
      <BrandKit />
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
