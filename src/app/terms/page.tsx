import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { contacts } from '@/config/site';
import { pageMetadata } from '@/lib/seo';

/**
 * Terms & Conditions. The route and page exist; the legal text itself has to come from More & More's
 * approved terms, which are not on file, so none is written here and the page stays out of search.
 */
export const metadata: Metadata = pageMetadata({
  title: 'Terms & Conditions',
  description: 'Terms & Conditions for agentic-finance.live and Agentic Finance events, produced by More & More.',
  path: '/terms',
  noindex: true,
});

export default function TermsPage() {
  return (
    <>
      <PageHero size="md" crumbs={[{ label: 'About', href: '/about' }, { label: 'Terms & Conditions' }]} eyebrow="Legal" title="Terms & Conditions." />
      <Section className="!pt-12">
        <Container>
          <div className="max-w-3xl rounded-2xl border border-line bg-ink-card p-7 sm:p-9">
            <p className="text-lg leading-relaxed text-paper/90">
              The terms and conditions for this site and for Agentic Finance events are being finalised by More &amp; More and will be published
              on this page.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Until then, questions about using this site or attending our events go to{' '}
              <a href={`mailto:${contacts.general}`} className="font-semibold text-gold">
                {contacts.general}
              </a>
              . How we handle personal data is set out in our{' '}
              <Link href="/privacy" className="font-semibold text-gold">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
