import Link from 'next/link';
import { events2027 } from '@/config/events-2027';
import { externalLinks, primaryActions } from '@/config/site';
import type { PastEvent } from '@/data/events';
import { videos } from '@/data/media';
import { editionOrganizations, featuredOnStage, getOrganization } from '@/data/partners';
import { formats } from '@/data/program';
import { cn } from '@/lib/cn';
import { VideoPlayer } from '../media/VideoPlayer';
import { YouTubeEmbed } from '../media/YouTubeEmbed';
import { LogoWall, type LogoItem } from '../partners/LogoWall';
import { PartnerLogoStrip } from '../partners/PartnerLogoStrip';
import { ButtonLink } from '../ui/Button';
import { Icon, type IconName } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container, Eyebrow, Section, SectionHeader } from '../ui/Layout';
import { StatusBadge } from '../ui/StatusBadge';
import { PastEventCard } from './HomeEvents';

const isDefined = <T,>(x: T | undefined): x is T => x !== undefined;

/** Partners first, then the organisations our speakers came from, kept apart so a logo never reads as an endorsement. */
export function HomePartners() {
  const partners: LogoItem[] = editionOrganizations
    .filter((r) => r.relationship === 'title-partner' || r.relationship === 'partner')
    .map((r) => {
      const org = getOrganization(r.org);
      return org && { ...org, note: r.relationship === 'title-partner' ? 'Title Partner' : r.note };
    })
    .filter(isDefined);
  const onStage = featuredOnStage.map(getOrganization).filter(isDefined);

  return (
    <Section id="partners" className="!py-16 sm:!py-20">
      <Container>
        <SectionHeader
          title={
            <>
              Partners &amp; Organizations <span className="serif-accent">at Our Conferences</span>
            </>
          }
          size="md"
          action={
            <ButtonLink href="/partners/past-partners" variant="outline">
              By edition
            </ButtonLink>
          }
        />
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div>
            <p className="mono-label">Partners · Singapore 2026</p>
            <LogoWall items={partners} columns="wide" labelled className="mt-5" />
          </div>
          <PartnerLogoStrip
            items={onStage}
            label="Organizations represented by our speakers"
            caption=""
            link={null}
          />
        </div>
      </Container>
    </Section>
  );
}

/** Past Editions: the latest edition's film first, with city, date and highlights. */
export function PastEditions({ events }: { events: PastEvent[] }) {
  const [featured, ...earlier] = events;
  const film = videos.find((v) => v.edition === featured.id);
  return (
    <Section bordered id="editions">
      <Container>
        <SectionHeader
          title={
            <>
              Past <span className="serif-accent">Editions</span>
            </>
          }
          action={
            <ButtonLink href="/editions" variant="outline">
              All Editions
            </ButtonLink>
          }
        />
        <article className="edge-gold relative mt-12 grid overflow-hidden rounded-2xl border border-line bg-ink-card lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {film ? (
            <VideoPlayer src={film.src} poster={film.poster} title={film.title} duration={film.duration} hasAudio={film.hasAudio} className="rounded-none" />
          ) : (
            <div className="relative aspect-video">
              <Img src={featured.image.src} alt={featured.image.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" position={featured.image.position} className="object-cover" />
            </div>
          )}
          <div className="flex flex-col p-6 sm:p-8">
            <StatusBadge status="completed" label="Edition" className="self-start" />
            <p className="mono-label mt-6">
              {featured.city} · {featured.date}
            </p>
            <h3 className="mt-2 font-serif text-[clamp(2rem,1.6rem+1.6vw,2.75rem)] font-medium italic leading-[1.05] text-gold">{featured.name}</h3>
            {featured.venue ? <p className="mt-2 text-sm font-light text-muted">{featured.venue}</p> : null}
            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-5">
              {featured.facts.map((f) => (
                <div key={f.label} className="flex flex-col-reverse">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{f.label}</dt>
                  <dd className="serif-figure text-[clamp(1.9rem,1.5rem+1vw,2.5rem)] leading-tight">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto pt-8">
              <ButtonLink href={featured.href}>Open the edition</ButtonLink>
            </div>
          </div>
        </article>
        {earlier.length ? (
          <>
            <p className="mono-label mt-14">Earlier More &amp; More events</p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {earlier.map((e) => {
                const yt = videos.find((v) => v.edition === e.id && v.youtubeId);
                return (
                  <li key={e.id}>
                    {yt?.youtubeId ? (
                      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-card">
                        <YouTubeEmbed id={yt.youtubeId} poster={yt.poster} title={yt.title} duration={yt.duration} className="rounded-none border-0" />
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          <p className="mono-label">
                            {e.date} · {e.city}
                          </p>
                          <h4 className="mt-2 text-xl font-medium leading-snug">{e.name}</h4>
                          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-4">
                            {e.facts.map((f) => (
                              <div key={f.label} className="flex flex-col-reverse">
                                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{f.label}</dt>
                                <dd className="serif-figure text-[28px] leading-tight">{f.value}</dd>
                              </div>
                            ))}
                          </dl>
                          <Link
                            href={e.href}
                            className="mt-auto flex items-center gap-1.5 pt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/85 transition-colors hover:text-gold"
                          >
                            More about this event
                            <Icon name="arrow-right" size={16} />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <PastEventCard event={e} />
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </Container>
    </Section>
  );
}

const VALUE: { icon: IconName; label: string }[] = [
  { icon: 'handshake', label: 'Curated BD introductions' },
  { icon: 'users', label: 'Meetings' },
  { icon: 'door', label: 'Dedicated private rooms' },
  { icon: 'bank', label: 'Institutional access' },
  { icon: 'mic', label: 'Thought leadership' },
  { icon: 'link', label: 'Strategic partnerships' },
  { icon: 'target', label: 'Deal-making' },
];

const photo = (id: string) => formats.find((f) => f.id === id)?.image;

/** Who we are and what companies get: the brief's list on the left, networking and meeting photographs on the right. */
export function WhoWeAre() {
  const shots = [
    photo('introductions'),
    photo('networking'),
    { src: '/images/singapore-2026/etoro-networking.webp', alt: 'Guests meeting beside eToro’s stand in Singapore', position: '50% 35%' },
  ].filter(isDefined);
  return (
    <Section bordered tone="raised" id="who-we-are" aria-labelledby="who-we-are-title" className="isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_15%_40%,rgb(209_182_121/0.1),transparent_70%)]"
      />
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2 id="who-we-are-title" className="display mt-5 text-[length:var(--text-display-md)]">
              Where the Future of Finance{' '}
              <span className="serif-accent [text-shadow:0_0_36px_rgb(209_182_121/0.35)]">Meets Its Next Partners.</span>
            </h2>
            <p className="lede mt-6 max-w-xl">
              Agentic Finance is produced by{' '}
              <a href={externalLinks.moreAndMore} target="_blank" rel="noopener noreferrer" className="link-underline text-gold hover:text-gold-bright">
                More &amp; More
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              , which runs curated summits and side events across technology and finance.
            </p>
            <ul className="mt-10 border-t border-line">
              {VALUE.map((v, i) => (
                <li key={v.label} className="reveal group relative overflow-hidden border-b border-line">
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-x-100"
                  />
                  <span className="relative flex min-h-16 items-center gap-4 px-1 py-3 sm:px-2">
                    <span aria-hidden className="serif-figure w-7 shrink-0 text-lg leading-none text-gold/70 transition-colors group-hover:text-gold">
                      0{i + 1}
                    </span>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright transition-shadow duration-500 group-hover:shadow-[0_0_24px_rgb(209_182_121/0.5)]">
                      <Icon name={v.icon} size={18} />
                    </span>
                    <span className="text-[17px] font-medium leading-snug transition-[color,transform] duration-500 group-hover:translate-x-1 group-hover:text-gold sm:text-lg">
                      {v.label}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={primaryActions.partner.href}>{primaryActions.partner.label}</ButtonLink>
              <ButtonLink href="/about" variant="outline">
                About us
              </ButtonLink>
            </div>
          </div>

          <div className="relative">
            <span aria-hidden className="absolute -inset-3 -z-10 translate-x-3 translate-y-3 rounded-3xl border border-gold/20 sm:-inset-4 sm:translate-x-4 sm:translate-y-4" />
            <div className="grid grid-cols-2 gap-3">
              {shots.map((s, i) => (
                <figure
                  key={s.src}
                  className={cn(
                    'group relative overflow-hidden rounded-2xl border border-line',
                    i === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/3]',
                  )}
                >
                  <Img
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes={i === 0 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                    position={s.position}
                    className="object-cover transition-transform duration-1000 ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                  />
                  {i === 0 ? (
                    <>
                      <span aria-hidden className="scrim-bottom absolute inset-x-0 bottom-0 h-1/2" />
                      <figcaption className="eyebrow absolute bottom-4 left-4 sm:bottom-5 sm:left-5">Agentic Finance Singapore 2026</figcaption>
                    </>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

const CATEGORIES: { name: string; icon: IconName }[] = [
  { name: 'Agentic Payments', icon: 'card' },
  { name: 'Agentic Trading', icon: 'chart' },
  { name: 'AI Infrastructure', icon: 'chip' },
  { name: 'Capital & Asset Management', icon: 'bank' },
  { name: 'Data & Oracles', icon: 'database' },
  { name: 'Compliance & Security', icon: 'shield' },
  { name: 'Tokenization', icon: 'token' },
  { name: 'Wallets, Custody & Settlement', icon: 'wallet' },
];

/** Icon-led category cards, as named in the brief. */
export function CategoryCards() {
  return (
    <Section bordered tone="raised" id="categories">
      <Container>
        <SectionHeader
          title={
            <>
              Topics and <span className="serif-accent">categories</span>
            </>
          }
          action={
            <>
              <ButtonLink href="/partners/categories" variant="outline">
                All categories
              </ButtonLink>
              <ButtonLink href="/program/topics" variant="outline">
                Topics
              </ButtonLink>
            </>
          }
        />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c.name} className="min-w-0">
              <Link
                href="/partners/categories"
                className="edge-gold group relative flex h-full min-h-40 flex-col justify-between gap-6 rounded-2xl border border-line bg-ink-card p-4 transition-colors duration-500 hover:border-gold/60 min-[360px]:p-5 sm:p-6"
              >
                <span className="flex size-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright transition-shadow duration-500 group-hover:shadow-[0_0_24px_rgb(209_182_121/0.35)]">
                  <Icon name={c.icon} size={22} />
                </span>
                <span className="flex items-end justify-between gap-3">
                  <span className="min-w-0 hyphens-auto break-words text-[17px] font-medium leading-snug transition-colors group-hover:text-gold sm:text-lg">{c.name}</span>
                  <Icon name="arrow-right" size={16} className="mb-1 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Formats as photographs, meetings first. */
export function FormatTiles() {
  return (
    <Section bordered id="formats">
      <Container>
        <SectionHeader
          title={
            <>
              Event formats and <span className="serif-accent">experience</span>
            </>
          }
          action={
            <ButtonLink href="/program/formats" variant="outline">
              All formats
            </ButtonLink>
          }
        />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {formats.map((f, i) => (
            <li
              key={f.id}
              className={cn(
                'relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-2xl border border-line p-5 sm:p-6',
                i < 2 ? 'lg:col-span-3 lg:min-h-96' : 'lg:col-span-2',
                i === formats.length - 1 && 'sm:col-span-2 lg:col-span-2',
              )}
            >
              <Img
                src={f.image.src}
                alt={f.image.alt}
                fill
                sizes={i < 2 ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 33vw, 100vw'}
                position={f.image.position}
                className="-z-10 object-cover opacity-80"
              />
              <span aria-hidden className="scrim-bottom absolute inset-0 -z-10" />
              <h3 className="text-xl font-medium leading-tight sm:text-2xl">{f.name}</h3>
              <p className="mt-2 max-w-md text-[15px] font-light leading-relaxed text-paper/85">{f.summary}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

const MEDIA = [
  { href: '/media/video', label: 'Video library', text: 'Films from our Editions, by edition and type.', image: '/images/singapore-2026/recap-poster.jpg' },
  { href: '/media/gallery', label: 'Photo gallery', text: 'Filter by edition and view full screen.', image: '/images/singapore-2026/agentic-finance-backdrop.webp' },
  { href: '/media/press', label: 'Agentic Finance in the Press', text: 'Coverage, recaps and original links.' },
];

/** Media, video gallery and press coverage. */
export function MediaTeaser() {
  return (
    <Section bordered id="media">
      <Container>
        <SectionHeader
          title={
            <>
              Media, video and <span className="serif-accent">press</span>
            </>
          }
          action={
            <ButtonLink href="/media" variant="outline">
              All media
            </ButtonLink>
          }
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {MEDIA.map((m) => (
            <li key={m.href}>
              <Link
                href={m.href}
                className="edge-gold group relative isolate flex min-h-64 h-full flex-col justify-end overflow-hidden rounded-2xl border border-line bg-ink-card p-6 transition-colors duration-500 hover:border-gold/60"
              >
                {m.image ? (
                  <>
                    <Img src={m.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="-z-10 object-cover opacity-60 transition-transform duration-700 group-hover:scale-[1.04]" />
                    <span aria-hidden className="scrim-bottom absolute inset-0 -z-10" />
                  </>
                ) : (
                  <span aria-hidden className="hairline-grid absolute inset-0 -z-10 opacity-40" />
                )}
                <span className="flex items-end justify-between gap-3">
                  <span>
                    <span className="block text-xl font-medium leading-tight transition-colors group-hover:text-gold">{m.label}</span>
                    <span className="mt-1.5 block text-sm font-light text-paper/80">{m.text}</span>
                  </span>
                  <Icon name="arrow-right" size={18} className="mb-1 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Invitation to the "Where will you be in 2027?" questionnaire, with a few of the 2027 cities. */
export function QuestionnaireBand() {
  const seen = new Set<string>();
  const cities = events2027
    .filter((e) => e.image && !seen.has(e.city) && seen.add(e.city))
    .slice(0, 6);
  return (
    <Section bordered tone="deep" id="where-2027" aria-labelledby="where-2027-title" className="isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_70%_at_20%_50%,rgb(209_182_121/0.14),transparent_70%)]"
      />
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
          <div>
            <Eyebrow>Agentic Finance 2027</Eyebrow>
            <h2 id="where-2027-title" className="display mt-5 text-[length:var(--text-display-md)]">
              We want to create the next big thing for our partners
            </h2>
            <p className="mt-6 text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)] font-light leading-tight">
              Where will you be in <span className="serif-accent [text-shadow:0_0_36px_rgb(209_182_121/0.35)]">2027?</span>
            </p>
            <div className="mt-10">
              <ButtonLink href="/2027" size="lg">
                Tell us where you’ll be
              </ButtonLink>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cities.map((e) => (
              <li key={e.city} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                <Img
                  src={e.image!.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 17vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-1000 ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                />
                <span aria-hidden className="scrim-bottom absolute inset-x-0 bottom-0 h-2/3" />
                <span className="eyebrow absolute bottom-3 left-3 text-paper [text-shadow:0_1px_6px_rgb(0_0_0/0.8)]">{e.city}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
