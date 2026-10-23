import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { contacts, site } from '@/config/site';
import { getCurrentEdition, getEdition } from '@/data/editions';
import { asset } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Press and brand kit',
  description: 'Press resources for Agentic Finance: official logo files, key facts about the series and editions, and media contacts.',
  path: '/media/press',
});

const LOGOS = [
  { name: 'Agentic Finance wordmark, gold', file: '/brand/agentic-finance-logo-gold.svg', bg: 'bg-ink' },
  { name: 'Agentic Finance logo', file: '/brand/agentic-finance-logo.svg', bg: 'bg-ink' },
  { name: 'More & More logo, white', file: '/brand/more-and-more-logo-white.svg', bg: 'bg-ink' },
];

export default function PressPage() {
  const next = getCurrentEdition();
  const sg = getEdition('singapore-2026')!;
  const facts = [
    ['What', 'Agentic Finance: an invitation-only summit series for the leaders shaping AI-native finance.'],
    ['Producer', 'More & More, a curated events and business-development company, headquartered in Tel Aviv and Dubai.'],
    ['First edition', `${sg.name}, ${sg.dateLabel}, ${sg.venue?.name}. An official side event of TOKEN2049 Singapore. ${sg.metrics?.map((m) => `${m.value} ${m.label.toLowerCase()}`).join(', ')}.`],
    ['Next edition', `${next.name}, ${next.dateLabel}. ${next.guestCount} curated guests; VIP Gala on Tuesday 8 December 2026.`],
    ['2027', 'Planned editions in Hong Kong, Rio de Janeiro, Paris, Dubai and Singapore. Dates to be announced.'],
  ];

  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Media', href: '/media' }, { label: 'Press and brand kit' }]}
        eyebrow="Media · Press"
        title="Press and brand kit."
        lede="Key facts, official logo files and the people to talk to. For interview requests, accreditation and imagery, contact the team."
        actions={
          <>
            <ButtonLink href={`mailto:${contacts.press}?subject=Agentic%20Finance%20media%20enquiry`} icon="mail">
              Email the press team
            </ButtonLink>
            <ButtonLink href="/about/contact?topic=press" variant="outline">
              Media enquiry form
            </ButtonLink>
          </>
        }
      />

      <Section className="!pt-12">
        <Container>
          <SectionHeader eyebrow="Coverage" title="In the press." size="md" />
          <div className="mt-8 rounded-2xl border border-dashed border-line-strong p-8 sm:p-10">
            <p className="text-lg text-paper/90">Coverage of Agentic Finance will be listed here as it is published.</p>
            <p className="mt-2 text-muted">
              Writing about the series or an edition? Send us the link and we will add it.{' '}
              <a href={`mailto:${contacts.press}`} className="font-semibold text-gold">
                {contacts.press}
              </a>
            </p>
          </div>
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <SectionHeader eyebrow="Brand kit" title="Logo files." lede="Official marks as used on our event sites. Please do not alter, recolour or crop them." size="md" />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {LOGOS.map((l) => (
              <li key={l.file} className="overflow-hidden rounded-2xl border border-line">
                <div className={`relative flex h-48 items-center justify-center p-8 ${l.bg}`}>
                  <span className="relative h-full w-full">
                    <Img src={l.file} alt={l.name} fill sizes="320px" className="object-contain" unoptimized />
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-line bg-ink-card p-4">
                  <span className="text-sm font-semibold">{l.name}</span>
                  <a href={asset(l.file)} download className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-bright">
                    <Icon name="download" size={16} />
                    SVG
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { name: 'Ink', hex: '#0A0E1A', cls: 'bg-ink border border-line-strong' },
              { name: 'Paper', hex: '#F3F1EA', cls: 'bg-paper' },
              { name: 'Gold', hex: '#D4AF5A', cls: 'bg-gold' },
            ].map((c) => (
              <div key={c.hex} className="flex items-center gap-4 rounded-2xl border border-line p-4">
                <span className={`size-12 shrink-0 rounded-xl ${c.cls}`} />
                <span>
                  <span className="block font-semibold">{c.name}</span>
                  <span className="font-mono text-xs text-muted">{c.hex}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Typography: Archivo and JetBrains Mono. For event photography, contact the press team.
          </p>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <SectionHeader eyebrow="Fact sheet" title="Key facts." size="md" />
            <dl className="flex flex-col border-t border-line">
              {facts.map(([k, v]) => (
                <div key={k} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
                  <dt className="mono-label pt-0.5">{k}</dt>
                  <dd className="leading-relaxed text-paper/90">{v}</dd>
                </div>
              ))}
              <div className="grid gap-2 border-b border-line py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
                <dt className="mono-label pt-0.5">Media contact</dt>
                <dd>
                  <a href={`mailto:${contacts.press}`} className="font-semibold text-gold">
                    {contacts.press}
                  </a>
                  <span className="text-muted"> · {site.producer}</span>
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
