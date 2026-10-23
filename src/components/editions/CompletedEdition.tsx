import Link from 'next/link';
import { externalLinks } from '@/config/site';
import { getCurrentEdition } from '@/data/editions';
import { gallery, galleryCollections, videos } from '@/data/media';
import { editionOrganizations, getOrganization, useCases } from '@/data/partners';
import type { Edition } from '@/data/types';
import { getSpeaker, isProgrammeSession, sessionsForEdition, speakersForEdition, stageLabels } from '@/lib/content';
import { speakerThumb } from '@/lib/paths';
import { toSpeakerCard } from '@/lib/speaker-cards';
import { Gallery } from '../media/Gallery';
import { VideoPlayer } from '../media/VideoPlayer';
import { LogoWall } from '../partners/LogoWall';
import { SpeakerCard } from '../speakers/SpeakerCard';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { ButtonLink, TextLink } from '../ui/Button';
import { CtaBand } from '../ui/CtaBand';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container, Eyebrow, Section, SectionHeader } from '../ui/Layout';
import { StatusBadge } from '../ui/StatusBadge';
import { Stats } from '../ui/Stats';

export function CompletedEdition({ edition }: { edition: Edition }) {
  const next = getCurrentEdition();
  const recap = videos.find((v) => v.edition === edition.slug && v.kind === 'recap');
  const sessions = sessionsForEdition(edition.slug).filter(isProgrammeSession);
  const editionSpeakers = speakersForEdition(edition.slug);
  const verified = editionOrganizations
    .filter((r) => r.edition === edition.slug && (r.relationship === 'title-partner' || r.relationship === 'partner'))
    .map((r) => ({ ...getOrganization(r.org)!, note: r.relationship === 'title-partner' ? 'Title Partner' : r.note }));
  const onStage = editionOrganizations
    .filter((r) => r.edition === edition.slug && r.relationship !== 'title-partner' && r.relationship !== 'partner')
    .map((r) => getOrganization(r.org))
    .filter((o) => o !== undefined)
    .slice(0, 24);
  const photos = gallery.filter((g) => g.edition === edition.slug).slice(0, 6);
  const editionCases = useCases.filter((u) => u.edition === edition.slug);

  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10">
          <Img src={edition.image.src} alt="" fill preload sizes="100vw" position={edition.image.position} className="object-cover opacity-60" />
          <div className="scrim-hero absolute inset-0" />
        </div>
        <Container className="flex min-h-[min(92svh,880px)] flex-col justify-end pb-14 pt-[calc(var(--header-h)+40px)]">
          <Breadcrumbs items={[{ label: 'Editions', href: '/editions' }, { label: edition.shortName }]} />
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <StatusBadge status="completed" label={`Archive · ${edition.dateLabel}`} />
            {edition.context ? <span className="mono-label text-paper/70">{edition.context}</span> : null}
          </div>
          <h1 className="display mt-6 max-w-5xl text-[length:var(--text-display-lg)]">{edition.name} 2026</h1>
          <p className="lede mt-6 max-w-3xl text-paper/80">{edition.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/80">
            <li className="flex items-center gap-2">
              <Icon name="calendar" size={16} className="text-gold" />
              {edition.dateLabel} · 14:00–20:00 SGT
            </li>
            {edition.venue ? (
              <li className="flex items-center gap-2">
                <Icon name="pin" size={16} className="text-gold" />
                {edition.venue.name}
              </li>
            ) : null}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#recap" size="lg" icon="play">
              Watch the recap
            </ButtonLink>
            <ButtonLink href={`/editions/${edition.slug}/agenda`} variant="outline" size="lg">
              Browse the agenda
            </ButtonLink>
          </div>
          <Stats items={edition.metrics ?? []} size="md" className="mt-12" />
        </Container>
      </header>

      <div className="border-b border-gold/30 bg-gold/[0.06]">
        <Container className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-paper/90">
            This edition has concluded. <span className="text-muted">The next one is</span>{' '}
            <strong className="text-gold">
              {next.name}, {next.dateLabel}
            </strong>
            .
          </p>
          <TextLink href={`/editions/${next.slug}`}>Go to {next.shortName}</TextLink>
        </Container>
      </div>

      {/* Recap */}
      <Section id="recap">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start">
            {recap ? <VideoPlayer src={recap.src} poster={recap.poster} title={recap.title} duration={recap.duration} hasAudio={recap.hasAudio} /> : null}
            <div>
              <Eyebrow>The day</Eyebrow>
              <h2 className="display-tight mt-5 text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)]">One afternoon. Two stages. The room that started the series.</h2>
              <p className="mt-5 leading-relaxed text-muted">{edition.positioning}</p>
              <ul className="mt-6 flex flex-col gap-3 border-t border-line pt-6 text-[15px]">
                <li className="flex gap-3">
                  <span className="mono-label w-28 shrink-0 pt-1">Main stage</span>
                  <span className="text-paper/85">Agentic Finance, hosted by Tal Mor of More &amp; More, with Vaibhavv Ali (Vali) moderating.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mono-label w-28 shrink-0 pt-1">Second stage</span>
                  <span className="text-paper/85">
                    The Odds: Prediction Markets Live, co-located on the same day.{' '}
                    <a href={externalLinks.theOddsSingapore} target="_blank" rel="noopener noreferrer" className="text-gold underline decoration-gold/50 underline-offset-4 hover:text-gold-bright">
                      About The Odds
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mono-label w-28 shrink-0 pt-1">Context</span>
                  <span className="text-paper/85">
                    An official side event of TOKEN2049 Singapore, which ran 7–8 October 2026 at Marina Bay Sands.
                  </span>
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/media/singapore-2026-recap" variant="outline">Read the full recap</ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Agenda */}
      <Section bordered tone="raised" id="agenda">
        <Container>
          <SectionHeader
            eyebrow="The agenda"
            title={`${sessions.length} sessions across two stages.`}
            lede="Keynotes, panels and one-on-ones on banking, wallets, payments, trading, capital and the limits on autonomous agents."
            action={<ButtonLink href={`/editions/${edition.slug}/agenda`} variant="outline">Full run of show</ButtonLink>}
          />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {sessions.map((s) => (
              <li key={s.id} className="bg-ink-raised">
                <Link href={`/editions/${edition.slug}/agenda#${s.id}`} className="group flex h-full flex-col gap-2 p-6 transition-colors hover:bg-ink-card">
                  <span className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.08em]">
                    <span className="text-paper/80">{s.start}</span>
                    <span className={s.stage === 'af' ? 'text-gold' : 'text-[#9fb6e8]'}>{stageLabels[s.stage].name}</span>
                    <span className="text-subtle">{s.format}</span>
                  </span>
                  <span className="font-semibold leading-snug group-hover:text-gold">{s.title}</span>
                  <span className="mt-1 flex -space-x-2">
                    {s.speakers.slice(0, 6).map((slug) => {
                      const p = getSpeaker(slug);
                      return p ? (
                        <span key={slug} className="relative size-8 overflow-hidden rounded-full border-2 border-ink-raised bg-ink">
                          <Img src={speakerThumb(p.photo)} alt="" fill sizes="32px" position="50% 20%" className="object-cover" />
                        </span>
                      ) : null;
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Speakers */}
      <Section bordered id="speakers">
        <Container>
          <SectionHeader
            eyebrow="Speakers"
            title="The Singapore lineup."
            lede="Operators from the banks, exchanges, funds and infrastructure providers putting AI agents into production."
            action={<ButtonLink href={`/editions/${edition.slug}/speakers`} variant="outline">All {editionSpeakers.length} profiles</ButtonLink>}
          />
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-6">
            {editionSpeakers.slice(0, 12).map((s) => (
              <li key={s.slug}>
                <SpeakerCard speaker={{ ...toSpeakerCard(s, { withTagline: true }), tags: [] }} sizes="(min-width: 1024px) 15vw, 45vw" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Partners */}
      <Section bordered tone="raised" id="partners">
        <Container>
          <SectionHeader
            eyebrow="Partners"
            title="Who made it happen."
            lede="Verified partners of the Singapore edition, and the organisations represented on its stages."
            action={<ButtonLink href="/partners/use-cases" variant="outline">Partner use cases</ButtonLink>}
          />
          <p className="mono-label mt-12">Partners · Singapore 2026</p>
          <LogoWall items={verified} columns="wide" labelled className="mt-4" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {editionCases.map((u) => (
              <Link key={u.slug} href={`/partners/use-cases/${u.slug}`} className="group flex items-center justify-between rounded-xl border border-line px-5 py-4 text-sm hover:border-gold/60">
                <span>
                  <span className="block font-semibold">{u.partner}</span>
                  <span className="text-muted">{u.positioning}</span>
                </span>
                <Icon name="arrow-right" size={16} className="shrink-0 text-gold transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
          <p className="mono-label mt-14">Organisations on stage</p>
          <LogoWall items={onStage} className="mt-4" />
          <p className="mt-4 text-[13px] text-subtle">
            Represented by speakers on the Singapore stages. Inclusion here does not imply sponsorship.
          </p>
        </Container>
      </Section>

      {/* Gallery */}
      <Section bordered id="gallery">
        <Container>
          <SectionHeader
            eyebrow="Gallery"
            title="Moments from Suntec City."
            action={<ButtonLink href="/media/gallery" variant="outline">Full gallery</ButtonLink>}
          />
          <div className="mt-10">
            <Gallery images={photos} collections={galleryCollections} filters={false} />
          </div>
        </Container>
      </Section>

      {/* Venue */}
      <Section bordered tone="raised" id="venue">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-line">
              <Img src="/images/singapore-2026/suntec.jpg" alt="Suntec City and Suntec Convention Centre, Downtown Singapore" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <Eyebrow>Location</Eyebrow>
              <h2 className="display mt-5 text-[length:var(--text-display-sm)]">{edition.venue?.name}</h2>
              <p className="mt-2 text-muted">{edition.venue?.address}</p>
              <p className="mt-6 leading-relaxed text-paper/85">
                Set in the Downtown Core, walking distance from Marina Bay Sands, where TOKEN2049’s main event took place, and minutes
                from the hotels, offices and side events that fill the city during TOKEN2049 week.
              </p>
              <TextLink href={externalLinks.token2049} className="mt-6">
                TOKEN2049 Singapore
              </TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={`Next · ${next.name} · ${next.dateLabel}`}
        title="Singapore was the first room. Abu Dhabi is next."
        body="500 hand-selected guests, a separate VIP Gala and no more than eight strategic partners."
      />
    </>
  );
}
