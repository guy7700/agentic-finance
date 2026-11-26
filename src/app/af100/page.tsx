import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { IndexNav } from '@/components/ui/IndexNav';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { indexInitiatives } from '@/data/index-initiatives';
import { pageMetadata } from '@/lib/seo';

// The Index lives at /af100 (a folder named "index" cannot build on Next 16.4.6).
export const metadata: Metadata = pageMetadata({
  title: 'Index: research on the agentic finance industry',
  description: 'The Agentic Finance Index: the Agentic Finance 100, the Industry Map and Quarterly Reports on AI agents in finance.',
  path: '/af100',
});

/** Index overview (Tal, 26 Nov 2026): "it's an index; AF100 is one of the indexes". */
export default function IndexOverviewPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Index' }]}
        eyebrow="Index"
        title="Research on agentic finance."
        lede="Three initiatives that map, rank and report on the companies putting AI agents to work in finance."
        footer={<IndexNav current="/af100" />}
      />
      <Section className="!pt-12">
        <Container>
          <ul className="grid gap-4 md:grid-cols-3">
            {indexInitiatives.map((i, n) => (
              <li key={i.href}>
                <Link href={i.href} className="edge-gold group relative flex h-full flex-col gap-5 rounded-2xl border border-line bg-ink-card p-7 transition-colors hover:border-gold/60">
                  <span className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold-bright">
                      <Icon name={i.icon} size={22} />
                    </span>
                    <span className="font-mono text-sm text-gold">0{n + 1}</span>
                  </span>
                  <span className="text-2xl font-semibold group-hover:text-gold">{i.title}</span>
                  <span className="leading-relaxed text-muted">{i.body}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                    Open <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
