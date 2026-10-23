import type { Metadata } from 'next';
import Link from 'next/link';
import { Gallery } from '@/components/media/Gallery';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { Container, Eyebrow, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { Stats } from '@/components/ui/Stats';
import { getEdition } from '@/data/editions';
import { gallery, galleryCollections, videos } from '@/data/media';
import { useCases } from '@/data/partners';
import { getSession, getSpeaker, stageLabels } from '@/lib/content';
import { speakerThumb } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Singapore 2026 recap',
  description:
    'The Agentic Finance Singapore 2026 recap: 650+ attendees, 60+ speakers, 17 sessions and two stages at Suntec City during TOKEN2049 week, 8 October 2026.',
  path: '/media/singapore-2026-recap',
  image: '/images/singapore-2026/agentic-capital-panel.webp',
});

const HIGHLIGHTS = [
  { id: 'af-1600', why: 'The day’s headline keynote. The Odds stage paused so both rooms could attend.' },
  { id: 'af-1430', why: 'A regulated bank, a Big Four firm, the FCA’s attaché and a trade mission on what changes when an agent acts for a customer.' },
  { id: 'af-1530', why: 'DeFi, brokerage, oracle and security leaders on custody when the account holder is software.' },
  { id: 'af-1830', why: 'Allocators on handing investment decisions to agents: mandates, oversight and where capital goes first.' },
  { id: 'af-1900', why: 'Policy, law and risk on the limits for autonomous agents, and who is accountable when one has to be stopped.' },
  { id: 'odds-1700', why: 'On The Odds stage: oracles, resolution and the law behind who decides what is true.' },
];

export default function SingaporeRecapPage() {
  const e = getEdition('singapore-2026')!;
  const recap = videos.find((v) => v.id === 'singapore-2026-recap')!;
  const highlights = videos.find((v) => v.id === 'singapore-2026-highlights')!;
  const networking = gallery.filter((g) => g.edition === e.slug && g.tags.includes('networking'));
  const stage = gallery.filter((g) => g.edition === e.slug && g.tags.includes('stage')).slice(0, 6);

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Media', href: '/media' }, { label: 'Singapore 2026 recap' }]}
        eyebrow={`Recap · ${e.dateLabel} · ${e.venue?.name} · ${e.context}`}
        title="Singapore 2026, the recap."
        lede="The first Agentic Finance room: one afternoon during TOKEN2049 week, two stages, and the banks, exchanges, funds, regulators and builders putting AI agents into production."
        image={{ src: e.image.src, alt: '', position: e.image.position }}
        footer={<Stats items={e.metrics ?? []} size="md" />}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
            <VideoPlayer src={recap.src} poster={recap.poster} title={recap.title} duration={recap.duration} hasAudio={recap.hasAudio} />
            <div>
              <Eyebrow>At a glance</Eyebrow>
              <dl className="mt-6 flex flex-col border-t border-line">
                {[
                  ['When', `${e.dateLabel}, 14:00–20:00 SGT`],
                  ['Where', `${e.venue?.name}, Singapore`],
                  ['Context', 'Official side event of TOKEN2049 Singapore'],
                  ['Stages', 'Agentic Finance main stage · The Odds: Prediction Markets Live'],
                  ['Host', 'Tal Mor, Founder, More & More'],
                  ['Title partner', 'eToro: “Agentic Finance by eToro”'],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 border-b border-line py-3.5 text-[15px]">
                    <dt className="mono-label pt-0.5">{k}</dt>
                    <dd className="text-paper/90">{v}</dd>
                  </div>
                ))}
              </dl>
              <TextLink href={`/editions/${e.slug}`} className="mt-6">
                The full Singapore archive
              </TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <SectionHeader
            eyebrow="Notable sessions"
            title="What the room talked about."
            action={<ButtonLink href={`/editions/${e.slug}/agenda`} variant="outline">Full agenda</ButtonLink>}
          />
          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHTS.map((h) => {
              const s = getSession(h.id);
              if (!s) return null;
              return (
                <li key={h.id} className="flex flex-col rounded-2xl border border-line bg-ink p-6">
                  <p className="flex flex-wrap gap-x-3 font-mono text-[10.5px] uppercase tracking-[0.08em]">
                    <span className={s.stage === 'af' ? 'text-gold' : 'text-[#9fb6e8]'}>{stageLabels[s.stage].name}</span>
                    <span className="text-muted">
                      {s.format} · {s.start}
                    </span>
                  </p>
                  <h3 className="mt-3 text-lg font-bold leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{h.why}</p>
                  <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                    <span className="flex -space-x-2">
                      {s.speakers.slice(0, 5).map((slug) => {
                        const p = getSpeaker(slug);
                        return p ? (
                          <span key={slug} className="relative size-9 overflow-hidden rounded-full border-2 border-ink bg-ink-raised" title={p.name}>
                            <Img src={speakerThumb(p.photo)} alt={p.name} fill sizes="36px" position="50% 20%" className="object-cover" />
                          </span>
                        ) : null;
                      })}
                    </span>
                    <Link href={`/editions/${e.slug}/agenda#${s.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:text-gold-bright">
                      Session <Icon name="arrow-right" size={14} />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <SectionHeader eyebrow="On stage" title="Two stages, one afternoon." />
          <div className="mt-10">
            <Gallery images={stage} collections={galleryCollections} filters={false} />
          </div>
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <SectionHeader
            eyebrow="Partner activations"
            title="Seen, introduced, remembered."
            lede="Title positioning, a CEO keynote, panel seats in the categories that mattered and an F1 simulator on the floor."
            action={<ButtonLink href="/partners/use-cases" variant="outline">All use cases</ButtonLink>}
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((u) => (
              <li key={u.slug}>
                <Link href={`/partners/use-cases/${u.slug}`} className="group block overflow-hidden rounded-2xl border border-line bg-ink hover:border-gold/60">
                  <span className="relative block aspect-[4/3] overflow-hidden">
                    <Img src={u.photos[0].src} alt={u.photos[0].alt} fill sizes="(min-width: 1024px) 25vw, 50vw" position={u.photos[0].position} className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </span>
                  <span className="block p-5">
                    <span className="block text-lg font-bold">{u.partner}</span>
                    <span className="mt-1 block text-sm text-muted">{u.positioning}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <div>
              <Eyebrow>Networking moments</Eyebrow>
              <h2 className="display mt-5 text-[length:var(--text-display-sm)]">The meetings between the sessions.</h2>
              <p className="mt-5 text-muted">
                Structured networking blocks, curated introductions across both rooms and a partner pavilion on the floor. The silent
                highlight loop below shows the floor in motion.
              </p>
              <div className="mt-8">
                <VideoPlayer src={highlights.src} poster={highlights.poster} title={highlights.title} duration={highlights.duration} hasAudio={false} />
              </div>
            </div>
            <Gallery images={networking} collections={galleryCollections} filters={false} />
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Next · Agentic Finance Abu Dhabi · December 2026"
        title="See you in Abu Dhabi."
        body="500 hand-selected guests, a separate VIP Gala and no more than eight strategic partners."
      />
    </>
  );
}
