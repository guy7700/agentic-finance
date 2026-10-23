import Link from 'next/link';
import type { Metadata } from 'next';
import { EditionCard } from '@/components/editions/EditionCard';
import { GlobalSeries } from '@/components/editions/GlobalSeries';
import { HomeHero } from '@/components/home/HomeHero';
import { VideoPlayer } from '@/components/media/VideoPlayer';
import { LogoWall } from '@/components/partners/LogoWall';
import { UseCaseCard } from '@/components/partners/UseCaseCard';
import { QuestionsEditorial } from '@/components/program/QuestionsEditorial';
import { SpeakerCard } from '@/components/speakers/SpeakerCard';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Eyebrow, Section, SectionHeader } from '@/components/ui/Layout';
import { Stats } from '@/components/ui/Stats';
import { booking, site } from '@/config/site';
import { producerMetrics, producerTimeline } from '@/data/about';
import { editions, editionsByStatus, getCurrentEdition, getEdition } from '@/data/editions';
import { videos } from '@/data/media';
import { categories, featuredOnStage, getOrganization, partnerBenefits, useCases } from '@/data/partners';
import { audience, formats, strategicQuestions } from '@/data/program';
import { getSession, getSpeaker } from '@/lib/content';
import { absoluteUrl } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';
import { toSpeakerCard } from '@/lib/speaker-cards';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Agentic Finance · The invitation-only summit series for AI-native finance',
    description: site.description,
    path: '/',
  }),
  title: { absolute: 'Agentic Finance · The invitation-only summit series for AI-native finance' },
};

const FEATURED_SPEAKERS = [
  'yoni-assia',
  'mark-willis',
  'scott-lawin',
  'stani-kulechov',
  'johann-eid',
  'anton-ruddenklau',
  'yoshi-yokokawa',
  'megan-otway',
  'itai-turbahn',
  'joanna-ossinger',
];

export default function HomePage() {
  const next = getCurrentEdition();
  const singapore = getEdition('singapore-2026')!;
  const planned = editionsByStatus('planned');
  const recap = videos.find((v) => v.id === 'singapore-2026-recap')!;
  const featured = FEATURED_SPEAKERS.map(getSpeaker).filter((s) => s !== undefined).map((s) => toSpeakerCard(s));
  const onStage = featuredOnStage.map(getOrganization).filter((o) => o !== undefined);
  const etoro = useCases[0];
  const questions = strategicQuestions.map((q) => ({ ...q, sessionTitle: q.session ? getSession(q.session)?.title : undefined }));
  const seriesData = editions.map(({ slug, name, shortName, city, country, year, status, dateLabel, tagline, summary, image, metrics, facts, context }) => ({
    slug,
    name,
    shortName,
    city,
    country,
    year,
    status,
    dateLabel,
    tagline,
    summary,
    image,
    metrics,
    facts,
    context,
  }));

  return (
    <>
      <HomeHero next={next} last={singapore} />

      {/* Positioning */}
      <Section className="!py-16 sm:!py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-end">
            <p className="display-tight text-[clamp(1.6rem,1.1rem+1.8vw,2.6rem)] text-paper">
              Not a conference. <span className="text-gold">A room.</span>
            </p>
            <p className="lede">
              Agentic Finance is not an AI conference and not a crypto conference. It is a selective gathering of senior institutional
              decision-makers, founders, capital allocators, financial-infrastructure leaders and regulators, built around the
              decisions AI agents now force on finance. Access, discussion and curated introductions matter more than size.
            </p>
          </div>
        </Container>
      </Section>

      {/* The global series */}
      <Section bordered tone="raised" id="series">
        <Container>
          <SectionHeader
            index="01"
            eyebrow="The global series"
            title={
              <>
                One standard.
                <br />
                Seven cities.
              </>
            }
            lede="Singapore opened the series. Abu Dhabi is next. Five cities follow in 2027. Each edition is its own curated room; the questions travel with us."
            action={<ButtonLink href="/editions" variant="outline">All editions</ButtonLink>}
          />
          <div className="mt-14">
            <GlobalSeries editions={seriesData} />
          </div>
        </Container>
      </Section>

      {/* Six questions */}
      <Section bordered id="questions">
        <Container>
          <SectionHeader
            index="02"
            eyebrow="The questions shaping finance"
            title="Six decisions the room is here to settle."
            lede="Every session is built around a decision someone in the room has to make. These are the six we keep coming back to."
            action={<ButtonLink href="/program/questions" variant="outline">Read the six questions</ButtonLink>}
          />
          <div className="mt-14">
            <QuestionsEditorial questions={questions} variant="compact" />
          </div>
        </Container>
      </Section>

      {/* Who is in the room */}
      <Section bordered tone="raised" id="room">
        <Container>
          <SectionHeader
            index="03"
            eyebrow="Who is in the room"
            title="Chosen for what they decide."
            lede="Every guest is selected for seniority, institutional relevance and fit. The room is built to be small enough that everyone in it matters."
          />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {audience.map((a, i) => (
              <li key={a.label} className="flex flex-col gap-3 bg-ink-raised p-6">
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <span className="text-lg font-bold leading-snug">{a.label}</span>
                <span className="text-sm leading-relaxed text-muted">{a.detail}</span>
              </li>
            ))}
          </ul>
          <div className="mt-16">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <p className="mono-label">Organisations represented on our Singapore stages</p>
              <TextLink href="/partners/past-partners">Partners and organisations by edition</TextLink>
            </div>
            <LogoWall items={onStage} className="mt-5" />
            <p className="mt-4 text-[13px] text-subtle">
              Logos show organisations whose executives spoke in Singapore. They are not all sponsors; verified partners are listed
              separately.
            </p>
          </div>
        </Container>
      </Section>

      {/* Speakers */}
      <Section bordered id="speakers">
        <Container>
          <SectionHeader
            index="04"
            eyebrow="Our speakers"
            title="Speakers at our conferences."
            lede="A deliberately short list, chosen for what they decide rather than how often they speak. Abu Dhabi speakers are announced one by one, as each confirms."
            action={
              <>
                <ButtonLink href="/speakers" variant="outline">All speakers</ButtonLink>
                <ButtonLink href="/speakers/nominate">Nominate a speaker</ButtonLink>
              </>
            }
          />
          <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-5">
            {featured.map((s) => (
              <li key={s.slug}>
                <SpeakerCard speaker={s} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Inside the experience */}
      <Section bordered tone="raised" id="experience">
        <Container>
          <SectionHeader
            index="05"
            eyebrow="Inside the experience"
            title="Fewer sessions. Better conversations."
            lede="Keynotes with room to say something, discussions built around one decision, and introductions arranged before anyone arrives."
            action={<ButtonLink href="/program/formats" variant="outline">How the day works</ButtonLink>}
          />
          <div className="mt-14 grid gap-4 md:grid-cols-2 md:grid-rows-[300px_300px]">
            {formats.slice(0, 3).map((f, i) => (
              <FormatTile key={f.id} format={f} n={i + 1} large={i === 0} className={i === 0 ? 'md:row-span-2' : ''} />
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {formats.slice(3).map((f, j) => (
              <FormatTile key={f.id} format={f} n={j + 4} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Singapore proof */}
      <Section bordered id="singapore">
        <Container>
          <SectionHeader
            index="06"
            eyebrow={`Singapore 2026 · ${singapore.dateLabel} · ${singapore.context}`}
            title="The proof."
            lede={singapore.summary}
            action={
              <>
                <ButtonLink href="/media/singapore-2026-recap" variant="outline">Read the recap</ButtonLink>
                <ButtonLink href="/editions/singapore-2026" variant="ghost">Open the archive</ButtonLink>
              </>
            }
          />
          <Stats items={singapore.metrics ?? []} className="mt-12" source="Retrospective figures as published for the Singapore 2026 edition." />
          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <VideoPlayer src={recap.src} poster={recap.poster} title={recap.title} duration={recap.duration} hasAudio={recap.hasAudio} />
            <div className="flex flex-col gap-6">
              <p className="mono-label">Notable sessions</p>
              <ul className="flex flex-col border-t border-line">
                {['af-1600', 'af-1530', 'af-1430', 'af-1830'].map((id) => {
                  const s = getSession(id)!;
                  return (
                    <li key={id} className="border-b border-line">
                      <Link href={`/editions/singapore-2026/agenda#${id}`} className="group flex items-start justify-between gap-4 py-4">
                        <span>
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-gold">
                            {s.format} · {s.start}
                          </span>
                          <span className="mt-1 block font-semibold leading-snug group-hover:text-gold">{s.title}</span>
                        </span>
                        <Icon name="arrow-right" size={16} className="mt-5 shrink-0 text-muted transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/partners/use-cases/etoro"
                className="group relative isolate mt-auto flex min-h-[180px] flex-col justify-end overflow-hidden rounded-2xl border border-line p-5"
              >
                <Img
                  src="/images/singapore-2026/etoro-f1-simulator.webp"
                  alt="A guest racing on eToro’s F1 simulator in Singapore"
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  position="45% 55%"
                  className="-z-20 object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <span aria-hidden className="scrim-bottom absolute inset-0 -z-10" />
                <span className="eyebrow">Partner activation</span>
                <span className="mt-1.5 text-lg font-bold">Agentic Finance by eToro: title partnership and F1 simulator</span>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Partnerships */}
      <Section bordered tone="raised" id="partnerships">
        <Container>
          <SectionHeader
            index="07"
            eyebrow={`Partnership opportunities · ${next.shortName}`}
            title={
              <>
                {next.partnerPositions} strategic partners.
                <br />
                No more.
              </>
            }
            lede="A limited number of positions, so every partner is seen, introduced and remembered. Don’t sponsor a conference: own the conversation your company wants to lead."
            action={
              <>
                <ButtonLink href="/partners/book-a-call">{booking.partnership.label}</ButtonLink>
                <ButtonLink href="/partners" variant="outline">Partnership overview</ButtonLink>
              </>
            }
          />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {partnerBenefits.map((b, i) => (
              <li key={b.title} className="flex flex-col gap-3 bg-ink-raised p-6 sm:p-7">
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <span className="text-xl font-bold">{b.title}</span>
                <span className="text-[15px] leading-relaxed text-muted">{b.body}</span>
              </li>
            ))}
          </ul>
          <div className="mt-14">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <p className="mono-label">Category ownership · 12 conversations</p>
              <TextLink href="/partners/categories">Explore the categories</TextLink>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/partners/categories?category=${c.id}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm text-paper/85 transition-colors hover:border-gold hover:text-gold"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            <UseCaseCard useCase={etoro} featured className="lg:col-span-3" />
            {useCases.slice(1).map((u) => (
              <UseCaseCard key={u.slug} useCase={u} />
            ))}
          </div>
        </Container>
      </Section>

      {/* 2027 */}
      <Section bordered id="expansion">
        <Container>
          <SectionHeader
            index="08"
            eyebrow="2027 global expansion"
            title="Five cities. Dates to be announced."
            lede="The series becomes international in 2027. Each city will be announced with its date and venue as they are confirmed."
            action={<ButtonLink href="/editions/2027" variant="outline">The 2027 series</ButtonLink>}
          />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {planned.map((e, i) => (
              <li key={e.slug}>
                <EditionCard edition={e} size="compact" index={`0${i + 1}`} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Producer */}
      <Section bordered tone="raised" id="producer">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <Eyebrow index="09">Produced by More &amp; More</Eyebrow>
              <h2 className="display mt-5 text-[length:var(--text-display-md)]">We have built this room before.</h2>
              <p className="lede mt-6">
                More &amp; More creates curated side events, executive gatherings, VIP delegations and business-development
                environments across global technology and institutional markets, built on one idea: the most valuable deals still
                happen in the room.
              </p>
              <ol className="mt-10 border-t border-line">
                {producerTimeline.map((t) => (
                  <li key={t.what} className="grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] gap-4 border-b border-line py-4 text-[15px]">
                    <span className={`font-mono text-[11px] uppercase tracking-[0.08em] ${t.next ? 'text-gold' : 'text-muted'}`}>{t.when}</span>
                    <span className={t.next ? 'font-semibold text-gold' : 'text-paper/90'}>{t.what}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/about/more-and-more" variant="outline">About More &amp; More</ButtonLink>
                <ButtonLink href="/about/event-series" variant="ghost">The event series</ButtonLink>
              </div>
            </div>
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                <Img
                  src="/images/more-and-more/web2toweb3-session.webp"
                  alt="A seated session at the Web2 to Web3 Summit in Abu Dhabi, produced by More & More"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute bottom-4 left-4 rounded-full border border-paper/20 bg-ink/75 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] backdrop-blur-sm">
                  Web2 to Web3 Summit · Abu Dhabi 2025
                </span>
              </div>
              <Stats items={producerMetrics} size="md" className="mt-8" />
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Agentic Finance',
          url: absoluteUrl('/'),
          publisher: { '@id': `${absoluteUrl('/')}#organization` },
        }}
      />
    </>
  );
}

function FormatTile({ format, n, large, className }: { format: (typeof formats)[number]; n: number; large?: boolean; className?: string }) {
  return (
    <figure className={`group relative isolate min-h-[260px] overflow-hidden rounded-2xl border border-line ${className ?? ''}`}>
      <Img
        src={format.image.src}
        alt={format.image.alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        position={format.image.position}
        className="-z-20 object-cover opacity-75 transition-transform duration-[900ms] group-hover:scale-[1.04]"
      />
      <span aria-hidden className="scrim-bottom absolute inset-0 -z-10" />
      <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <span className="font-mono text-xs text-gold">0{n}</span>
        <span className={`mt-2 block font-extrabold leading-tight ${large ? 'text-3xl sm:text-4xl' : 'text-xl'}`} style={{ fontStretch: '108%' }}>
          {format.name}
        </span>
        <span className="mt-1.5 block max-w-md text-sm text-paper/80">{format.summary}</span>
      </figcaption>
    </figure>
  );
}
