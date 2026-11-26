import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { IndexNav } from '@/components/ui/IndexNav';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { referenceMaps } from '@/data/index-initiatives';
import { categories } from '@/data/partners';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Industry Map: the agentic finance landscape',
  description: 'The agentic finance landscape across twelve areas, from agentic payments and trading to wallets, identity and compliance. Our own map follows in 2027.',
  path: '/af100/map',
});

export default function IndustryMapPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Index', href: '/af100' }, { label: 'Industry Map' }]}
        eyebrow="Index · Industry Map"
        title="The agentic finance landscape."
        lede="Who builds what in agentic finance. In 2027 we build our own map of the industry, with our consortium."
        footer={<IndexNav current="/af100/map" />}
      />
      <Section className="!pt-12">
        <Container>
          <SectionHeader eyebrow="The framework" title="Twelve areas." lede="The areas our events are organised around, and the frame for our 2027 map." size="md" />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <li key={c.id} className="flex flex-col gap-2 bg-ink p-6">
                <span className="font-mono text-xs text-gold">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-lg font-semibold">{c.name}</span>
                <span className="text-sm leading-relaxed text-muted">{c.companies.join(' · ')}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      {referenceMaps.length ? (
        <Section bordered tone="raised">
          <Container>
            <SectionHeader eyebrow="Reference maps" title="Maps by others." lede="Published by their authors; shown with attribution." size="md" />
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {referenceMaps.map((m) => (
                <li key={m.url} className="rounded-2xl border border-line bg-ink-card p-6">
                  <p className="text-lg font-semibold">{m.title}</p>
                  <p className="mono-label mt-1">By {m.by}</p>
                  {m.note ? <p className="mt-2 text-muted">{m.note}</p> : null}
                  <ButtonLink href={m.url} variant="outline" className="mt-5">
                    View the map
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
      <Section bordered>
        <Container>
          <div className="flex flex-col gap-6 rounded-2xl border border-gold/40 bg-gold/[0.05] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <p className="display-tight text-[clamp(1.5rem,1.2rem+1vw,2.2rem)]">Should your company be on the 2027 map?</p>
              <p className="mt-2 max-w-xl text-muted">Tell us what you build and in which area.</p>
            </div>
            <ButtonLink href="/about/contact?topic=general" size="lg">
              Put a company forward
            </ButtonLink>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
