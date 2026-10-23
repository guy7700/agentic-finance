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
    'How an Agentic Finance day works: keynotes and fireside conversations, senior institutional discussions, curated introductions, private meetings and executive networking.',
  path: '/program/formats',
});

export default function FormatsPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Program', href: '/program' }, { label: 'Formats' }]}
        eyebrow="Fewer sessions. Better conversations."
        title="How the day works."
        lede="The programme is short on purpose. Time on stage is given to a few voices; time off stage is structured around introductions that were arranged before anyone arrived."
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
                  <span className="font-mono text-sm text-gold">0{i + 1} / 05</span>
                  <h2 className="display-tight mt-4 text-[clamp(1.8rem,1.3rem+1.6vw,2.75rem)]">{f.name}</h2>
                  <p className="mt-4 text-lg text-paper/90">{f.summary}</p>
                  <p className="mt-4 leading-relaxed text-muted">{f.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[13px] text-subtle">All photography from Agentic Finance Singapore, 8 October 2026.</p>
          <div className="mt-14 flex flex-wrap gap-3">
            <ButtonLink href="/editions/singapore-2026/agenda" variant="outline">See a full run of show</ButtonLink>
            <ButtonLink href="/invitation">Request an invitation</ButtonLink>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
