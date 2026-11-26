import type { Metadata } from 'next';
import { MoreAndMoreSection, TeamSection } from '@/components/about/AboutSections';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About us: More & More',
  description:
    'More & More, the producer of Agentic Finance: why we convene, our track record (100+ events, 250+ deals and introductions, $50M+ sponsorship value, 5+ continents) and the team.',
  path: '/about/more-and-more',
});

/**
 * About us (Tal's review, 26 Nov 2026): the producer, why we convene, More & More's track record
 * and the team, as one page. "Four ways into the room" left the site.
 */
export default function AboutUsPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'About', href: '/about' }, { label: 'About us' }]}
        eyebrow="About us"
        title="More & More."
        lede="The producer of Agentic Finance and The Odds, and the team behind every room."
      />
      <MoreAndMoreSection />
      <TeamSection />
      <CtaBand />
    </>
  );
}
