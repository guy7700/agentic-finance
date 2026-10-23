import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { seriesBrands } from '@/data/about';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Event series',
  description:
    'The More & More event ecosystem: Agentic Finance, The Odds: Prediction Markets Live, and the Web2 to Web3 Summit. Related brands with distinct audiences and programmes.',
  path: '/about/event-series',
});

export default function EventSeriesPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Event series' }]}
        eyebrow="The More & More ecosystem"
        title="Three brands. Three rooms."
        lede="More & More produces several curated series. They share a standard and a team, not an audience: each has its own programme, guest list and purpose."
      />
      <Section className="!pt-12">
        <Container>
          <ol className="flex flex-col gap-6">
            {seriesBrands.map((b, i) => (
              <li
                key={b.id}
                className={`grid overflow-hidden rounded-2xl border lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] ${b.id === 'agentic-finance' ? 'border-gold/50' : 'border-line'}`}
              >
                <div className={`relative min-h-[280px] ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <Img src={b.image.src} alt={b.image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                  {b.id === 'agentic-finance' ? (
                    <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink">You are here</span>
                  ) : null}
                </div>
                <div className="flex flex-col p-7 sm:p-10">
                  <p className="eyebrow">{b.focus}</p>
                  <h2 className="display-tight mt-4 text-[clamp(1.8rem,1.3rem+1.6vw,2.75rem)]">{b.name}</h2>
                  <p className="mt-4 leading-relaxed text-paper/85">{b.summary}</p>
                  <div className="mt-6 rounded-xl border border-line bg-ink-card/50 p-4">
                    <p className="mono-label">Relationship to Agentic Finance</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{b.relationship}</p>
                  </div>
                  <ul className="mt-6 flex flex-col gap-2">
                    {b.facts.map((f) => (
                      <li key={f} className="flex gap-2.5 text-sm text-muted">
                        <Icon name="check" size={16} className="mt-0.5 shrink-0 text-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {b.href ? (
                    <div className="mt-auto pt-8">
                      <ButtonLink href={b.href} variant={b.id === 'agentic-finance' ? 'gold' : 'outline'}>
                        {b.linkLabel ?? 'Learn more'}
                      </ButtonLink>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
