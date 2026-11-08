import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Img } from '@/components/ui/Img';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { formats } from '@/data/program';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Formats',
  description:
    'How an Agentic Finance day works: keynotes, senior discussions, curated introductions, private meetings and executive networking.',
  path: '/program/formats',
});

// Named in Tal's brief; photographs to be supplied.
const EXTRAS = ['Receptions', 'Food & beverages', 'Competitions'];

export default function FormatsPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Program', href: '/program' }, { label: 'Formats' }]}
        eyebrow="Formats"
        title={
          <>
            Event formats and <span className="serif-accent">experience</span>
          </>
        }
        lede="Curated meetings and private meeting rooms come first. Then keynotes, firesides, panels, networking and deal-making."
      />
      <Section className="!pt-10">
        <Container>
          <ol className="flex flex-col gap-6">
            {formats.map((f, i) => (
              <li key={f.id} className="grid overflow-hidden rounded-2xl border border-line bg-ink-card/50 lg:grid-cols-2">
                <div className={`relative min-h-[280px] lg:min-h-[400px] ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <Img src={f.image.src} alt={f.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" position={f.image.position} className="object-cover" />
                </div>
                <div className="flex flex-col justify-center p-7 sm:p-12">
                  <span className="font-mono text-sm text-gold">
                    0{i + 1} / 0{formats.length}
                  </span>
                  <h2 className="display-tight mt-4 text-[clamp(1.8rem,1.3rem+1.6vw,2.75rem)]">{f.name}</h2>
                  <p className="mt-4 text-lg font-light text-paper/90">{f.summary}</p>
                  <p className="mt-4 font-light leading-relaxed text-muted">{f.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[13px] text-subtle">All photography from Agentic Finance Singapore, 8 October 2026.</p>
          <h2 className="display mt-20 text-[length:var(--text-display-sm)]">
            Also part of the <span className="serif-accent">experience</span>
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {EXTRAS.map((name) => (
              <li key={name} className="edge-gold relative flex min-h-48 flex-col justify-end rounded-2xl border border-dashed border-line-strong bg-ink-card p-6">
                <span className="mono-label">Photo [TBC]</span>
                <span className="mt-2 text-xl font-medium">{name}</span>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap gap-3">
            <ButtonLink href="/editions/singapore-2026/agenda" variant="outline">See a full run of show</ButtonLink>
            <ButtonLink href="/invitation">Apply to attend</ButtonLink>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
