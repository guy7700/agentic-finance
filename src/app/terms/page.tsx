import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { publishedTermsSections, termsMeta, type TermsBlock } from '@/data/terms';
import { pageMetadata } from '@/lib/seo';

/**
 * Terms & Conditions, as approved by More & More (26 Nov 2026). The wording lives in src/data/terms.ts,
 * which also keeps any text with a bracketed placeholder off the page.
 */
export const metadata: Metadata = pageMetadata({
  title: 'Terms & Conditions',
  description:
    'Terms & Conditions for agentic-finance.live and the Agentic Finance network, events, index and publications, operated by More & More.',
  path: '/terms',
});

// Emails, web addresses and "Privacy Policy" become links; everything else stays as written.
const LINKABLE = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+|https:\/\/[^\s]+|Privacy Policy)/g;

function linkify(text: string): ReactNode[] {
  return text.split(LINKABLE).map((part, i) => {
    if (i % 2 === 0) return part;
    const cls = 'font-medium text-gold hover:text-gold-bright';
    if (part === 'Privacy Policy')
      return (
        <Link key={i} href="/privacy" className={cls}>
          {part}
        </Link>
      );
    if (part.startsWith('https://'))
      return (
        <a key={i} href={part} className={cls} {...(part.startsWith('https://agentic-finance.live') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>
          {part.replace('https://', '')}
        </a>
      );
    return (
      <a key={i} href={`mailto:${part}`} className={cls}>
        {part}
      </a>
    );
  });
}

function Block({ block }: { block: TermsBlock }) {
  switch (block.kind) {
    case 'p':
      return <p>{linkify(block.text)}</p>;
    case 'h':
      return <h3 className="!mt-9 text-lg font-semibold text-paper">{block.text}</h3>;
    case 'list':
      return (
        <ul className="list-disc space-y-2 pl-5 marker:text-gold">
          {block.items.map((item) => (
            <li key={item}>{linkify(item)}</li>
          ))}
        </ul>
      );
    case 'lines':
      return (
        <p className="rounded-xl border border-line bg-ink-card px-5 py-4">
          {block.lines.map((line, i) => (
            <span key={line} className={i === 0 ? 'block font-semibold text-paper' : 'block'}>
              {linkify(line)}
            </span>
          ))}
        </p>
      );
  }
}

export default function TermsPage() {
  const sections = publishedTermsSections();
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Terms & Conditions' }]}
        eyebrow="Legal"
        title="Terms & Conditions."
        lede={
          <>
            {termsMeta.byline}
            <span className="mt-2 block text-base text-subtle">Last updated: {termsMeta.lastUpdated}</span>
          </>
        }
      />
      <Section className="!pt-12">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
            <nav aria-label="Sections" className="hidden lg:block">
              <ol className="sticky top-[calc(var(--header-h)+32px)] space-y-2.5 text-sm">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex gap-3 text-muted transition-colors hover:text-gold">
                      <span className="w-5 shrink-0 font-mono text-xs leading-5 text-gold/80">{i + 1}</span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="min-w-0 max-w-3xl space-y-14">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-[calc(var(--header-h)+24px)]">
                  <h2 className="flex gap-4 text-2xl font-semibold tracking-tight text-paper">
                    <span className="font-mono text-base leading-8 text-gold">{String(i + 1).padStart(2, '0')}</span>
                    <span>{s.title}</span>
                  </h2>
                  <div className="prose-af mt-5 space-y-4">
                    {s.blocks.map((b, j) => (
                      <Block key={j} block={b} />
                    ))}
                  </div>
                </section>
              ))}
              <p className="border-t border-line pt-8 text-sm text-subtle">© 2026 More &amp; More. All rights reserved.</p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
