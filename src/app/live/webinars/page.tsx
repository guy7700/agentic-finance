import type { Metadata } from 'next';
import { LiveNav, LivePlaceholder } from '@/components/live/LiveNav';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/seo';

// No content yet: a [TBC] page, kept out of search until it has some.
export const metadata: Metadata = pageMetadata({
  title: 'Webinars',
  description: 'Webinars from Agentic Finance.',
  path: '/live/webinars',
  noindex: true,
});

export default function LiveWebinarsPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Live', href: '/live' }, { label: 'Webinars' }]}
        eyebrow="Live · Webinars"
        title="Webinars."
        footer={<LiveNav current="webinars" />}
      />
      <Section className="!pt-12">
        <Container>
          <LivePlaceholder what="Webinars" />
        </Container>
      </Section>
    </>
  );
}
