import type { Metadata } from 'next';
import { LiveNav, LivePlaceholder } from '@/components/live/LiveNav';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/seo';

// No content yet: a [TBC] page, kept out of search until it has some.
export const metadata: Metadata = pageMetadata({
  title: 'Newsletter',
  description: 'Newsletter signup and archive from Agentic Finance.',
  path: '/live/newsletter',
  noindex: true,
});

export default function LiveNewsletterPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Live', href: '/live' }, { label: 'Newsletter' }]}
        eyebrow="Live · Newsletter"
        title="Newsletter."
        footer={<LiveNav current="newsletter" />}
      />
      <Section className="!pt-12">
        <Container>
          <LivePlaceholder what="Signup and archive" />
        </Container>
      </Section>
    </>
  );
}
