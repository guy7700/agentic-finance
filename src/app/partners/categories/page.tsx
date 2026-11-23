import type { Metadata } from 'next';
import { CategoryExplorer } from '@/components/partners/CategoryExplorer';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking } from '@/config/site';
import { getCurrentEdition } from '@/data/editions';
import { categoryViews } from '@/lib/category-views';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Partner categories: agentic payments to prediction markets',
  description:
    'Twelve partner categories, from agentic payments, agentic commerce and stablecoin payments to prediction markets, compliance and AI infrastructure.',
  path: '/partners/categories',
});

export default function CategoriesPage() {
  const current = getCurrentEdition();
  const views = categoryViews();

  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Partners', href: '/partners' }, { label: 'Partnership categories' }]}
        eyebrow={`Category ownership · ${current.shortName}`}
        title="Where does your company fit?"
        lede="Choose a category to see what it covers, who belongs in it, the conversations it leads and what happened in it in Singapore."
        actions={<ButtonLink href="/partners/book-a-call">{booking.partnership.label}</ButtonLink>}
      />
      <Section className="!pt-12">
        <Container>
          <CategoryExplorer categories={views} positions={current.partnerPositions ?? 8} />
        </Container>
      </Section>
      <CtaBand
        title="Not sure which category is yours?"
        body="Most companies span two or three. The partnerships team will help you pick the one you can credibly lead."
        actions={
          <>
            <ButtonLink href="/partners/book-a-call" size="lg">
              {booking.partnership.label}
            </ButtonLink>
            <ButtonLink href="/partners/use-cases" variant="outline" size="lg">
              See the use cases
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
