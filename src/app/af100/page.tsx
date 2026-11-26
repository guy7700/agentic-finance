import type { Metadata } from 'next';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/seo';

// Tal's Index section (site structure, 23 Nov 2026), at /af100/: no content yet, so kept out of search.
export const metadata: Metadata = pageMetadata({
  title: 'AF100',
  description: 'The AF100: the companies leading agentic finance, how the list is built, the industry map and quarterly reports.',
  path: '/af100',
  noindex: true,
});

const PARTS = [
  { title: 'The AF100 list', body: 'The list [TBC]' },
  { title: 'How it is built', body: 'Method [TBC]' },
  { title: 'Industry map', body: 'Map [TBC]' },
  { title: 'Quarterly reports', body: 'First report, Q1 2027 [TBC]' },
];

export default function Af100Page() {
  return (
    <>
      <PageHero size="md" crumbs={[{ label: 'Index' }]} eyebrow="Index" title="AF100." lede="The AF100 list and how it is built, the industry map and quarterly reports." />
      <Section className="!pt-12">
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            {PARTS.map((p) => (
              <li key={p.title} className="rounded-2xl border border-dashed border-line-strong bg-ink-card p-7">
                <SectionHeader title={p.title} size="md" as="h2" />
                <p className="mono-label mt-4">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
