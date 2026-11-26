import type { Metadata } from 'next';
import {
  AboutIndex,
  EventSeriesSection,
  FaqSection,
  FormatsSection,
  MoreAndMoreSection,
  ProgramSection,
  TeamSection,
  WhoItsForSection,
  WhoWeAreSection,
} from '@/components/about/AboutSections';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About Agentic Finance',
  description:
    'Who produces Agentic Finance, what the room discusses (six questions, 15 topics), the formats, who gets in, the team, and answers to common questions.',
  path: '/about',
});

/**
 * One page (Tal's site structure, 23 Nov 2026): who we are, topics, formats,
 * who it's for, team, FAQ. Program, More & More, Event series and FAQ were
 * separate pages until 25 Nov 2026; their addresses forward to the sections.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'About' }]}
        eyebrow="About"
        title="Who stands behind the room."
        lede="Agentic Finance is produced by More & More, a team that has spent years building rooms where institutions, founders, capital and regulators actually do business."
        image={{ src: '/images/more-and-more/about-mnm.jpg', alt: '' }}
        actions={<ButtonLink href="#more-and-more">About More &amp; More</ButtonLink>}
        footer={<AboutIndex />}
      />
      <WhoWeAreSection />
      <MoreAndMoreSection />
      <EventSeriesSection />
      <ProgramSection />
      <FormatsSection />
      <WhoItsForSection />
      <TeamSection />
      <FaqSection />
      <CtaBand />
    </>
  );
}
