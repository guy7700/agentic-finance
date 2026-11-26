import Link from 'next/link';
import { events2027 } from '@/config/events-2027';
import { externalLinks, primaryActions } from '@/config/site';
import type { PastEvent } from '@/data/events';
import { getEdition } from '@/data/editions';
import { videos } from '@/data/media';
import { networkOverview, networkPages } from '@/data/network';
import { editionOrganizations, featuredOnStage, getOrganization } from '@/data/partners';
import { VideoPlayer } from '../media/VideoPlayer';
import { YouTubeEmbed } from '../media/YouTubeEmbed';
import { LogoWall, type LogoItem } from '../partners/LogoWall';
import { ButtonLink } from '../ui/Button';
import { Icon, type IconName } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container, Eyebrow, Section, SectionHeader } from '../ui/Layout';
import { StatusBadge } from '../ui/StatusBadge';
import { PastEventCard } from './HomeEvents';

const isDefined = <T,>(x: T | undefined): x is T => x !== undefined;

/** One logo wall of the organisations at our conferences: partners, then a curated set from the stage, with no categories. */
export function HomePartners() {
  const ids = [...editionOrganizations.filter((r) => getEdition(r.edition) && (r.relationship === 'title-partner' || r.relationship === 'partner')).map((r) => r.org), ...featuredOnStage];
  const orgs: LogoItem[] = [...new Set(ids)].map(getOrganization).filter(isDefined);

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
            <ButtonLink href="/partners" variant="outline">
              All companies
            </ButtonLink>
          }
        />
        <LogoWall items={orgs} className="mt-10" />
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
            <ButtonLink href="/events" variant="outline">
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

/**
 * Who we are, short (Tal's homepage order): the headline, the producer and what companies
 * get, linking to /about. The full story, formats and photos are on /about.
 */
export function WhoWeAre() {
  return (
    <Section bordered tone="raised" id="who-we-are" aria-labelledby="who-we-are-title" className="isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_15%_40%,rgb(209_182_121/0.1),transparent_70%)]"
      />
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
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
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/about">About us</ButtonLink>
              <ButtonLink href={primaryActions.partner.href} variant="outline">
                {primaryActions.partner.label}
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {VALUE.map((v) => (
              <li key={v.label} className="flex min-h-14 items-center gap-3 rounded-xl border border-line bg-ink-card/60 px-4 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright">
                  <Icon name={v.icon} size={16} />
                </span>
                <span className="text-[15px] font-medium leading-snug">{v.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/** The Network (Tal's homepage order): one card per audience, each linking to its application form. */
export function HomeNetwork() {
  return (
    <Section bordered id="network">
      <Container>
        <SectionHeader
          title={
            <>
              The Agentic Finance <span className="serif-accent">Network</span>
            </>
          }
          lede={networkOverview.lede}
          action={
            <ButtonLink href="/network" variant="outline">
              The Network
            </ButtonLink>
          }
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {networkPages.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/network/${p.slug}#apply`}
                className="edge-gold group relative flex h-full min-h-64 flex-col justify-between gap-6 rounded-2xl border border-line bg-ink-card p-6 transition-colors duration-500 hover:border-gold/60"
              >
                <span>
                  <span className="flex items-center justify-between gap-3 text-xl font-medium transition-colors group-hover:text-gold">
                    {p.card.title}
                    <Icon name="arrow-right" size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="mt-3 block text-[15px] leading-relaxed text-muted">{p.card.line}</span>
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="mono-label text-gold">{p.card.membership}</span>
                  <span className="text-sm font-semibold text-paper/85">{p.primaryCta}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

const LIVE = [
  {
    label: 'X Spaces and webinars',
    title: 'Latest X Space or webinar',
    links: [
      { label: 'X Spaces', href: '/live/spaces' },
      { label: 'Webinars', href: '/live/webinars' },
    ],
  },
  { label: 'Newsletter', title: 'Newsletter signup', links: [{ label: 'Newsletter', href: '/live/newsletter' }] },
];

/** Live (Tal's homepage order): the latest X Space or webinar and the newsletter signup, both [TBC] until they exist. */
export function HomeLive() {
  return (
    <Section bordered tone="raised" id="live">
      <Container>
        <SectionHeader
          title={<span className="serif-accent">Live</span>}
          lede="News, X Spaces, webinars and the newsletter."
          action={
            <ButtonLink href="/live/news" variant="outline">
              All news
            </ButtonLink>
          }
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {LIVE.map((x) => (
            <li key={x.title} className="flex min-h-48 flex-col justify-between gap-6 rounded-2xl border border-dashed border-line-strong bg-ink-card p-6">
              <span>
                <span className="mono-label">{x.label}</span>
                <span className="mt-3 block text-xl font-medium">{x.title}</span>
                <span className="mono-label mt-2 block">[TBC]</span>
              </span>
              <span className="flex flex-wrap gap-x-6 gap-y-2">
                {x.links.map((l) => (
                  <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-bright">
                    {l.label}
                    <Icon name="arrow-right" size={14} />
                  </Link>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Index (Tal's homepage order): a preview of the AF100, [TBC] until the list exists. */
export function HomeIndex() {
  return (
    <Section bordered id="index">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
          <SectionHeader
            stacked
            eyebrow="Index"
            title={<span className="serif-accent">AF100</span>}
            lede="The AF100 list and how it is built, the industry map and quarterly reports."
          />
          <Link
            href="/af100"
            className="group flex min-h-48 flex-col justify-between gap-6 rounded-2xl border border-dashed border-line-strong bg-ink-card p-6 transition-colors hover:border-gold"
          >
            <span className="flex items-center justify-between gap-3 text-xl font-medium group-hover:text-gold">
              AF100 preview
              <Icon name="arrow-right" size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="mono-label">[TBC]</span>
          </Link>
        </div>
      </Container>
    </Section>
  );
}

const MEDIA = [
  { href: '/about/video', label: 'Video library', text: 'Films from our Editions, by edition and type.', image: '/images/singapore-2026/recap-poster.jpg' },
  { href: '/about/gallery', label: 'Photo gallery', text: 'Filter by edition and view full screen.', image: '/images/singapore-2026/agentic-finance-backdrop.webp' },
  { href: '/about/press', label: 'Agentic Finance in the Press', text: 'TradingView, Binance, CoinMarketCap and more.' },
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
            <ButtonLink href="/about/gallery" variant="outline">
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
              <ButtonLink href="/events/2027/meetings" size="lg">
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
