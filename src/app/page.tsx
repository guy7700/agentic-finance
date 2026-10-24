import Link from 'next/link';
import type { Metadata } from 'next';
import { HomeHero } from '@/components/home/HomeHero';
import { PastEventCard, UpcomingEventCard } from '@/components/home/HomeEvents';
import { LatestArticle } from '@/components/home/LatestArticle';
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
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { Stats } from '@/components/ui/Stats';
import { booking, externalLinks, primaryActions, site } from '@/config/site';
import { editionsByStatus, getCurrentEdition, getEdition } from '@/data/editions';
import { pastEvents, upcomingEvents } from '@/data/events';
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

  return (
    <>
      <HomeHero next={next} />

      <LatestArticle />

      {/* Events: upcoming first, then the record */}
      <Section id="events">
        <Container>
          <SectionHeader title="Upcoming events." action={<ButtonLink href="/editions" variant="outline">All editions</ButtonLink>} />
          <ul className="mt-12 grid gap-4 lg:grid-cols-2">
            {upcomingEvents.map((e) => (
              <li key={e.id} className="flex">
                <UpcomingEventCard event={e} />
              </li>
            ))}
          </ul>
          <h3 className="display mt-20 text-[length:var(--text-display-sm)]">Past events.</h3>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((e) => (
              <li key={e.id}>
                <PastEventCard event={e} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Main themes */}
      <Section bordered tone="raised" id="questions">
        <Container>
          <SectionHeader
            title="Main themes."
            action={<ButtonLink href="/program/questions" variant="outline">Explore the themes</ButtonLink>}
          />
          <div className="mt-14">
            <QuestionsEditorial questions={questions} variant="compact" />
          </div>
        </Container>
      </Section>

      {/* Who is in the room */}
      <Section bordered id="room">
        <Container>
          <SectionHeader title="Who is in the room." lede="Every guest is selected for seniority, institutional relevance and fit." />
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
      <Section bordered tone="raised" id="speakers">
        <Container>
          <SectionHeader
            title="Speakers at our conferences."
            lede="Abu Dhabi speakers are announced as each one confirms."
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

      {/* Formats */}
      <Section bordered id="experience">
        <Container>
          <SectionHeader
            title="How the day works."
            lede="Keynotes, focused discussions, curated introductions and private meetings."
            action={<ButtonLink href="/program/formats" variant="outline">All formats</ButtonLink>}
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

      {/* Singapore recap */}
      <Section bordered tone="raised" id="singapore">
        <Container>
          <SectionHeader
            eyebrow={`${singapore.dateLabel} · Suntec Singapore · TOKEN2049 week`}
            title="Singapore 2026 recap."
            lede="Our first edition, with lead partner eToro."
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
      <Section bordered id="partnerships">
        <Container>
          <SectionHeader
            eyebrow={`Partnerships · ${next.shortName}`}
            title={`${next.partnerPositions} partner positions.`}
            lede="Each position comes with one category to lead, stage visibility and curated introductions."
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

      {/* 2027: cities only */}
      <Section bordered tone="raised" id="expansion">
        <Container>
          <SectionHeader title="Five cities in 2027." action={<ButtonLink href="/editions/2027" variant="outline">The 2027 series</ButtonLink>} />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {planned.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/editions/${e.slug}`}
                  className="group relative isolate flex min-h-[240px] flex-col justify-end overflow-hidden rounded-2xl border border-line p-5 transition-colors hover:border-line-strong"
                >
                  <Img
                    src={e.image.src}
                    alt={e.image.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                    position={e.image.position}
                    className="-z-20 object-cover opacity-60 grayscale-[0.35] transition-[transform,filter,opacity] duration-700 group-hover:scale-[1.04] group-hover:opacity-80 group-hover:grayscale-0"
                  />
                  <span aria-hidden className="scrim-bottom absolute inset-0 -z-10" />
                  {e.country !== e.city ? <p className="mono-label text-paper/70">{e.country}</p> : null}
                  <h3 className="display mt-2 text-[28px]">{e.city}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* About: goals and what is next */}
      <Section bordered id="about">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <h2 className="display text-[length:var(--text-display-md)]">About Agentic Finance.</h2>
            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <p className="eyebrow">Our goal</p>
                <p className="mt-4 text-lg leading-relaxed text-paper/90">
                  Bring the decision-makers, founders, capital allocators and regulators shaping how AI agents change finance into one
                  room.
                </p>
              </div>
              <div>
                <p className="eyebrow">What is next</p>
                <p className="mt-4 text-lg leading-relaxed text-paper/90">
                  Abu Dhabi: the Summit on 4 December 2026 and the VIP Gala on 8 December. Then Hong Kong, Rio de Janeiro, Paris, Dubai
                  and Singapore in 2027.
                </p>
              </div>
              <p className="text-sm text-muted sm:col-span-2">
                Produced by <TextLink href={externalLinks.moreAndMore}>More &amp; More</TextLink>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={`Agentic Finance Summit Abu Dhabi · ${next.dateLabel}`}
        title="Join us in Abu Dhabi."
        body={`${next.guestCount} curated guests. By invitation only.`}
        actions={
          <>
            <ButtonLink href={primaryActions.invitation.href} size="lg">
              {primaryActions.invitation.label}
            </ButtonLink>
            <ButtonLink href={primaryActions.partner.href} variant="outline" size="lg">
              {primaryActions.partner.label}
            </ButtonLink>
          </>
        }
      />

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
