import type { Metadata } from 'next';
import { NewsletterForm } from '@/components/live/NewsletterForm';
import { ButtonLink } from '@/components/ui/Button';
import { IndexNav } from '@/components/ui/IndexNav';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { quarterlyReports } from '@/data/index-initiatives';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Quarterly Reports on agentic finance',
  description: 'Quarterly reports on the state of agentic finance: what went live, what was funded, and what financial institutions are deciding.',
  path: '/af100/reports',
});

const INSIDE = [
  { title: 'What went live', body: 'Agent products in production at banks, exchanges, payment networks and fintechs.' },
  { title: 'What was funded', body: 'Rounds, acquisitions and partnerships across the twelve areas.' },
  { title: 'What institutions decide', body: 'Policy, liability and adoption, from regulators and the institutions in our consortium.' },
];

export default function QuarterlyReportsPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Index', href: '/af100' }, { label: 'Quarterly Reports' }]}
        eyebrow="Index · Quarterly Reports"
        title="The state of agentic finance, every quarter."
        lede="A quarterly view of the industry, drawn from our news desk, our events and the institutions around them."
        footer={<IndexNav current="/af100/reports" />}
      />
      <Section className="!pt-12">
        <Container>
          {quarterlyReports.length ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {quarterlyReports.map((r) => (
                <li key={r.href} className="rounded-2xl border border-line bg-ink-card p-6">
                  <p className="mono-label text-gold">{r.quarter}</p>
                  <p className="mt-2 text-xl font-semibold">{r.title}</p>
                  <p className="mt-2 text-muted">{r.summary}</p>
                  <ButtonLink href={r.href} variant="outline" className="mt-5">
                    Read the report
                  </ButtonLink>
                </li>
              ))}
            </ul>
          ) : null}
          <SectionHeader eyebrow="Inside each report" title="Three questions, every quarter." size="md" className={quarterlyReports.length ? 'mt-16' : ''} />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {INSIDE.map((x) => (
              <li key={x.title} className="rounded-2xl border border-line bg-ink-card/60 p-6">
                <p className="text-lg font-semibold">{x.title}</p>
                <p className="mt-2 leading-relaxed text-muted">{x.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14 rounded-2xl border border-gold/40 bg-gold/[0.05] p-6 sm:p-8">
            <p className="text-lg font-semibold">Receive each report as it is published, with the monthly newsletter.</p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
