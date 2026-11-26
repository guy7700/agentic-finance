import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/seo';

// No terms published yet: a [TBC] page, kept out of search.
export const metadata: Metadata = pageMetadata({ title: 'Terms', description: 'Terms of use for agentic-finance.live.', path: '/terms', noindex: true });

export default function TermsPage() {
  return (
    <>
      <PageHero size="md" crumbs={[{ label: 'Terms' }]} eyebrow="Legal" title="Terms." />
      <Section className="!pt-12">
        <Container>
          <div className="rounded-2xl border border-dashed border-line-strong bg-ink-card p-8">
            <span className="mono-label">Terms of use [TBC]</span>
          </div>
        </Container>
      </Section>
    </>
  );
}
