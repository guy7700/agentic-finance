import type { Metadata } from 'next';
import { LiveNav, LivePlaceholder } from '@/components/live/LiveNav';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/seo';

// No content yet: a [TBC] page, kept out of search until it has some.
export const metadata: Metadata = pageMetadata({
  title: 'X Spaces',
  description: 'X Spaces episodes from Agentic Finance.',
  path: '/live/spaces',
  noindex: true,
});

export default function LiveXSpacesPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Live', href: '/live' }, { label: 'X Spaces' }]}
        eyebrow="Live · X Spaces"
        title="X Spaces."
        footer={<LiveNav current="spaces" />}
      />
      <Section className="!pt-12">
        <Container>
          <LivePlaceholder what="Episodes" />
        </Container>
      </Section>
    </>
  );
}
