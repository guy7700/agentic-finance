import type { Metadata } from 'next';
import { CategoryExplorer, type CategoryView } from '@/components/partners/CategoryExplorer';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking } from '@/config/site';
import { getCurrentEdition } from '@/data/editions';
import { categories, useCases } from '@/data/partners';
import { topics } from '@/data/program';
import { getSession } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Partnership categories',
  description:
    'Twelve partnership categories, from agentic trading and payments to compliance, data, AI infrastructure and banking. No more than eight strategic positions in Abu Dhabi.',
  path: '/partners/categories',
});

export default function CategoriesPage() {
  const current = getCurrentEdition();
  const views: CategoryView[] = categories.map((c, i) => ({
    ...c,
    number: String(i + 1).padStart(2, '0'),
    topics: topics.filter((t) => t.category === c.id).map((t) => ({ slug: t.slug, name: t.name })),
    sessionList: c.sessions
      .map((id) => getSession(id))
      .filter((s) => s !== undefined)
      .map((s) => ({ id: s.id, title: s.title, format: s.format })),
    useCases: useCases.filter((u) => u.categories[0] === c.id).map((u) => ({ slug: u.slug, partner: u.partner })),
  }));

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
