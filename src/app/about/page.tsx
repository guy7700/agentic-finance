import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { GroupIndex } from '@/components/ui/GroupIndex';
import { Img } from '@/components/ui/Img';
import { Container, Eyebrow, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { Stats } from '@/components/ui/Stats';
import { producerMetrics } from '@/data/about';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description: 'Who stands behind Agentic Finance: More & More, the producer of curated executive gatherings across global technology and institutional markets.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'About' }]}
        eyebrow="About"
        title="Who stands behind the room."
        lede="Agentic Finance is produced by More & More, a team that has spent years building rooms where institutions, founders, capital and regulators actually do business."
        image={{ src: '/images/more-and-more/about-mnm.jpg', alt: '' }}
        actions={<ButtonLink href="/about/more-and-more">About More &amp; More</ButtonLink>}
      />
      <GroupIndex group="about" />
      <Section bordered tone="raised">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>Why we convene this room</Eyebrow>
              <h2 className="display mt-5 text-[length:var(--text-display-sm)]">The most valuable deals still happen in the room.</h2>
              <p className="mt-6 leading-relaxed text-muted">
                AI agents are entering trading, payments, custody and capital management faster than the rules, the infrastructure or the
                relationships around them. The people who will decide how that goes rarely sit in the same room. Agentic Finance exists to
                put them there: selectively, with time for the conversations that matter, and with introductions arranged in advance.
              </p>
              <Stats items={producerMetrics} size="md" className="mt-10" source="More & More track record, as published." />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
              <Img src="/images/singapore-2026/opening-keynote.webp" alt="Tal Mor of More & More opening the day on the Singapore stage" fill sizes="(min-width: 1024px) 50vw, 100vw" position="62% 35%" className="object-cover" />
            </div>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
