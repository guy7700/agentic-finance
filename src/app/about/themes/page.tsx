import type { Metadata } from 'next';
import { ProgramSection } from '@/components/about/AboutSections';
import { CategoryExplorer } from '@/components/partners/CategoryExplorer';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { categoryViews } from '@/lib/category-views';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Themes: the questions shaping finance',
  description:
    'The themes of Agentic Finance: six questions shaping finance, fifteen topics, and twelve areas of the agentic finance industry, from agentic payments to trading, wallets and compliance.',
  path: '/about/themes',
});

/**
 * Themes (Tal's review, 26 Nov 2026): the former partnership categories (industry areas, not
 * partnership types), the topics and the questions shaping finance, on one page.
 */
export default function ThemesPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Themes' }]}
        eyebrow="About · Themes"
        title="The questions shaping finance."
        lede="What our rooms discuss: the questions the industry has to answer, the topics behind them, and the areas of agentic finance."
      />
      <ProgramSection />
      <Section bordered tone="raised" id="areas">
        <Container>
          <SectionHeader
            eyebrow="Industry areas"
            title="Twelve areas of agentic finance."
            lede="Choose an area to see what it covers, who belongs in it, the conversations it leads and what happened in it in Singapore."
          />
          <div className="mt-12">
            <CategoryExplorer categories={categoryViews()} />
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
