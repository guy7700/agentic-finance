import type { Metadata } from 'next';
import { UseCaseCard } from '@/components/partners/UseCaseCard';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking } from '@/config/site';
import { useCases } from '@/data/partners';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Partner use cases',
  description:
    'How eToro, Fireblocks, Alpaca and Limitless partnered with Agentic Finance Singapore 2026: title partnership, keynotes, panel seats, branded areas, activations and executive networking.',
  path: '/partners/use-cases',
});

export default function UseCasesPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Partners', href: '/partners' }, { label: 'Use cases' }]}
        eyebrow="Singapore 2026 · Verified activations"
        title="What partners received."
        lede="Four partners, four different objectives. From a title partnership with a CEO keynote and an F1 simulator, to a single executive seat in the category that mattered most."
        actions={<ButtonLink href="/partners/book-a-call">{booking.partnership.label}</ButtonLink>}
      />
      <Section className="!pt-12">
        <Container>
          <div className="grid gap-5 lg:grid-cols-3">
            <UseCaseCard useCase={useCases[0]} featured className="lg:col-span-3" />
            {useCases.slice(1).map((u) => (
              <UseCaseCard key={u.slug} useCase={u} />
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-subtle">
            Use cases describe what each partner received at Agentic Finance Singapore on 8 October 2026, as documented by More &amp; More.
          </p>
        </Container>
      </Section>
      <CtaBand
        title="Want this list with your name on it?"
        body="Positions for Abu Dhabi are limited to eight. Start with a 20-minute call."
        actions={
          <>
            <ButtonLink href="/partners/book-a-call" size="lg">
              {booking.partnership.label}
            </ButtonLink>
            <ButtonLink href="/partners/categories" variant="outline" size="lg">
              Partnership categories
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
