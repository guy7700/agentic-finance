import Link from 'next/link';
import { primaryActions } from '@/config/site';
import { trackRecord } from '@/data/about';
import { partnerInclusions } from '@/data/event-landing';
import type { PastEvent } from '@/data/events';
import { networkOverview, networkPages } from '@/data/network';
import { editionOrganizations, featuredOnStage, getOrganization } from '@/data/partners';
import { eventDate, nextEdition2027, upcoming2027 } from '@/data/upcoming-2027';
import { companyHref } from '@/lib/companies';
import { formatPostDate, getPosts } from '@/lib/daily';
import { getSpeaker } from '@/lib/content';
import { toSpeakerCard } from '@/lib/speaker-cards';
import { liveSchedule } from '@/data/live';
import { NetworkGraphic } from '../network/NetworkGraphic';
import { NetworkGroups } from '../network/NetworkGroups';
import { LogoMarqueeRows, type LogoItem } from '../partners/LogoWall';
import { PartnershipShowcase } from '../partners/PartnershipShowcase';
import { SpeakerCard } from '../speakers/SpeakerCard';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container, Eyebrow, Section, SectionHeader } from '../ui/Layout';

const isDefined = <T,>(x: T | undefined): x is T => x !== undefined;

/** 2. Partners and organisations at our conferences: two rows moving in opposite directions, right under the hero. */
export function HomeLogoStrip() {
  const partners = editionOrganizations.filter((r) => r.relationship === 'title-partner' || r.relationship === 'partner').map((r) => r.org);
  const onStage = editionOrganizations.filter((r) => r.relationship !== 'attended').map((r) => r.org);
  const ids = [...new Set([...partners, ...featuredOnStage, ...onStage])];
  const orgs: LogoItem[] = ids
    .map(getOrganization)
    .filter(isDefined)
    .map((o) => ({ ...o, href: companyHref(o.id) }));
  return (
    <section aria-labelledby="partners-strip-title" className="border-y border-line bg-ink-deep py-10 sm:py-12">
      <Container className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="partners-strip-title" className="display-tight text-[clamp(1.35rem,1.1rem+0.9vw,1.9rem)]">
          Partners &amp; Organizations <span className="serif-accent">at Our Conferences</span>
        </h2>
        <Link href="/partners" className="inline-flex min-h-11 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/80 hover:text-gold">
          All partners <Icon name="arrow-right" size={14} />
        </Link>
      </Container>
      <Container wide className="mt-8">
        <LogoMarqueeRows items={orgs} />
      </Container>
    </section>
  );
}

/** 3. 2027 Global Exposure: our own next editions, in date order, the next one first and largest. */
export function NextEditions() {
  const next = nextEdition2027();
  return (
    <Section bordered tone="raised" id="events" className="!py-16 sm:!py-20">
      <Container>
        <SectionHeader
          eyebrow="2027 Global Exposure"
          title={
            <>
              Our next <span className="serif-accent">editions</span>
            </>
          }
          lede="Each edition runs alongside a major industry week, from Asia to Europe, the Gulf and the Americas."
          action={
            <ButtonLink href="/events" variant="outline">
              Our events
            </ButtonLink>
          }
        />
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {upcoming2027.map((e) => {
            const d = eventDate(e);
            const isNext = e === next;
            return (
              <li key={e.slug}>
                <Link
                  href={e.path}
                  className={`group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl border p-4 transition-colors duration-500 ${isNext ? 'border-gold/70' : 'border-line hover:border-gold/50'}`}
                >
                  <Img
                    src={e.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                    position={e.image.position}
                    className="-z-20 object-cover transition-transform duration-1000 ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                  />
                  <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
                  {isNext ? (
                    <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink">Next event</span>
                  ) : null}
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-bright">
                    {d.short} 2027{d.provisional ? ' · Provisional' : ''}
                  </span>
                  <span className="mt-1 text-xl font-semibold leading-tight">{e.city}</span>
                  <span className="mt-1 text-[12.5px] leading-snug text-paper/75">During {e.context}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

/** 4. Past editions: the three recent editions side by side, and the wider track record as a fourth card. */
export function PastEditions({ events }: { events: PastEvent[] }) {
  return (
    <Section bordered id="past-editions" className="!py-16 sm:!py-20">
      <Container>
        <SectionHeader
          eyebrow="Past editions"
          title={
            <>
              Selected recent <span className="serif-accent">editions</span>
            </>
          }
          lede="Three recent rooms, from a broader track record of events organised by More & More."
          action={
            <ButtonLink href="/events#past" variant="outline">
              Past events
            </ButtonLink>
          }
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((e) => (
            <li key={e.id}>
              <PastEventCard event={e} />
            </li>
          ))}
          <li>
            <Link
              href="/about/more-and-more"
              className="edge-gold group relative isolate flex h-full min-h-72 flex-col justify-between overflow-hidden rounded-2xl border border-gold/50 bg-ink-raised p-6"
            >
              <span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_70%_at_30%_10%,rgb(209_182_121/0.18),transparent_70%)]" />
              <span>
                <span className="mono-label text-gold">More &amp; More track record</span>
                <span className="serif-figure mt-4 block text-[clamp(3.5rem,2.8rem+2vw,4.75rem)] leading-none text-gold">{trackRecord[0].value}</span>
                <span className="mt-2 block text-xl font-semibold">{trackRecord[0].label}</span>
              </span>
              <span>
                <ul className="flex flex-col gap-1.5 border-t border-line pt-4 text-[14px] text-paper/85">
                  {trackRecord.slice(1).map((m) => (
                    <li key={m.label}>
                      <span className="font-semibold text-paper">{m.value}</span> {m.label.toLowerCase()}
                    </li>
                  ))}
                </ul>
                <span className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                  About us <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </Container>
    </Section>
  );
}

/** A past edition: photo, name, verified figures and a link to its archive page. */
export function PastEventCard({ event: e }: { event: PastEvent }) {
  return (
    <Link href={e.href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-card transition-colors duration-500 hover:border-gold/60">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Img
          src={e.image.src}
          alt={e.image.alt}
          fill
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 50vw, 100vw"
          position={e.image.position}
          className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mono-label">
          {e.city} · {e.date}
        </p>
        <h3 className="mt-2 text-lg font-semibold leading-snug transition-colors group-hover:text-gold">{e.name}</h3>
        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
          {e.facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{f.label}</dt>
              <dd className="serif-figure text-2xl leading-tight">{f.value}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-auto flex items-center gap-1.5 pt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/80 group-hover:text-gold">
          The event <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

/** 5. Speakers at our events: small portraits, names and company logos, more of them at once. */
export function HomeSpeakers({ slugs }: { slugs: string[] }) {
  const speakers = slugs.map(getSpeaker).filter(isDefined).map((s) => toSpeakerCard(s));
  return (
    <Section bordered tone="raised" id="speakers" className="!py-16 sm:!py-20">
      <Container>
        <SectionHeader
          title={
            <>
              Speakers at <span className="serif-accent">our events</span>
            </>
          }
          action={
            <>
              <ButtonLink href="/speakers" variant="outline">
                All speakers
              </ButtonLink>
              <ButtonLink href="/speakers/nominate" variant="outline">
                Nominate a speaker
              </ButtonLink>
            </>
          }
        />
        <ul className="mt-10 grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {speakers.map((s) => (
            <li key={s.slug}>
              <SpeakerCard speaker={{ ...s, hasProfile: true }} compact sizes="(min-width: 1024px) 11vw, (min-width: 768px) 16vw, 31vw" />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** 6. The Agentic Finance Network: connected organisations, five free ways in. */
export function HomeNetwork() {
  return (
    <Section bordered id="network" className="isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_60%_at_80%_40%,rgb(209_182_121/0.1),transparent_70%)]" />
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-14">
          <div>
            <Eyebrow>Agentic Finance Network</Eyebrow>
            <h2 className="display mt-5 text-[length:var(--text-display-md)]">
              One network. <span className="serif-accent">Free to join.</span>
            </h2>
            <p className="lede mt-5 max-w-xl">{networkOverview.lede}</p>
            <ul className="mt-6 flex flex-col gap-2 text-[15px] text-paper/85">
              {networkOverview.benefits.slice(0, 3).map((b) => (
                <li key={b.title} className="flex gap-3">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    <strong className="font-semibold">{b.title}.</strong> <span className="text-muted">{b.body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={primaryActions.network.href} size="lg">
                {primaryActions.network.label}
              </ButtonLink>
            </div>
          </div>
          <NetworkGraphic className="mx-auto w-full max-w-[520px]" labels={networkPages.map((p) => p.card.title)} />
        </div>
        <div className="mt-12">
          <NetworkGroups compact />
        </div>
      </Container>
    </Section>
  );
}

/** 7. What our partners receive: "How we help you achieve your goals", the Abu Dhabi design Tal approved. */
export function PartnerBenefits() {
  return (
    <Section bordered tone="raised" id="partner-benefits">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-4xl">
            <span aria-hidden className="block h-px w-10 bg-gold" />
            <h2 className="display mt-5 text-[length:var(--text-display-md)]">How we help you achieve your goals</h2>
            <p className="display-tight mt-4 text-[clamp(1.4rem,1.1rem+1.2vw,2rem)] font-light text-paper/90">What our partners receive.</p>
          </div>
          <ButtonLink href={primaryActions.partner.href} size="lg">
            {primaryActions.partner.label}
          </ButtonLink>
        </div>
        <PartnershipShowcase items={partnerInclusions} />
      </Container>
    </Section>
  );
}

/**
 * 8. eToro: the relationship across our events, with Yoni Assia. The quotation is his, as published in
 * our press release "The Odds Conference Marks Strong Debut at Paris Blockchain Week" (Chainwire, 27 April
 * 2026), where he announced the Zengo acquisition live on stage.
 */
const ETORO_QUOTE: { text: string; source: string } | undefined = {
  text: 'What makes this moment even more meaningful is that the first conversations began four months ago at a More and More event in Abu Dhabi. It’s a strong example of how the right room can turn into real deals.',
  source: 'Yoni Assia, CEO, eToro · The Odds, Paris, April 2026',
};

export function EtoroStory() {
  const yoni = getSpeaker('yoni-assia');
  const steps = [
    { when: 'Abu Dhabi · 2025', what: 'eToro and Zengo meet at our Web2 to Web3 conference, where the first conversations begin.' },
    { when: 'Paris · April 2026', what: 'Yoni Assia announces the acquisition of Zengo live on our stage at The Odds, Paris Blockchain Week.' },
    { when: 'Singapore · October 2026', what: 'eToro becomes title partner: “Agentic Finance by eToro”, with Yoni Assia’s keynote.' },
  ];
  return (
    <Section bordered id="success-story">
      <Container>
        <article className="grid overflow-hidden rounded-3xl border border-gold/40 bg-ink-raised lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="relative min-h-[320px] lg:min-h-full">
            <Img src="/images/singapore-2026/etoro-branded-area.webp" alt="eToro’s branded area at Agentic Finance Singapore, where eToro was title partner" fill sizes="(min-width: 1024px) 40vw, 100vw" position="35% 55%" className="object-cover" />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-ink-raised/60" />
            {yoni ? (
              <span className="absolute bottom-5 left-5 flex items-center gap-3">
                <span className="relative size-14 overflow-hidden rounded-full border-2 border-gold">
                  <Img src={yoni.photo} alt={yoni.photoAlt} fill sizes="56px" position="50% 20%" className="object-cover" />
                </span>
                <span>
                  <span className="block font-semibold">{yoni.name}</span>
                  <span className="block text-sm text-paper/80">Co-Founder and CEO, eToro</span>
                </span>
              </span>
            ) : null}
          </div>
          <div className="flex flex-col p-7 sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <Eyebrow>Success story</Eyebrow>
              <span className="relative h-7 w-24">
                <Img src="/images/logos/etoro.png" alt="eToro" fill sizes="96px" className="object-contain object-right" />
              </span>
            </div>
            {ETORO_QUOTE ? (
              <blockquote className="mt-6">
                <p className="display-tight text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)]">“{ETORO_QUOTE.text}”</p>
                <footer className="mono-label mt-4">{ETORO_QUOTE.source}</footer>
              </blockquote>
            ) : (
              <h2 className="display-tight mt-6 text-[clamp(1.6rem,1.2rem+1.5vw,2.4rem)]">
                From our stage in Abu Dhabi to <span className="serif-accent">title partner.</span>
              </h2>
            )}
            <ol className="mt-8 flex flex-col border-t border-line">
              {steps.map((s, i) => (
                <li key={s.when} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[44px_170px_minmax(0,1fr)] sm:items-baseline sm:gap-4">
                  <span className="font-mono text-sm text-gold">0{i + 1}</span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-gold">{s.when}</span>
                  <span className="text-[15.5px] text-paper/90">{s.what}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/partners/etoro" variant="outline">
                The eToro company page
              </ButtonLink>
            </div>
          </div>
        </article>
      </Container>
    </Section>
  );
}

const WHO_PHOTOS = [
  { src: '/images/singapore-2026/agentic-capital-panel.webp', alt: 'The Agentic Capital panel at Agentic Finance Singapore', label: 'Singapore 2026', position: '50% 46%' },
  { src: '/images/more-and-more/the-odds-paris-room.jpg', alt: 'A full room at The Odds, Paris Blockchain Week', label: 'Paris 2026' },
  { src: '/images/more-and-more/web2toweb3-session.webp', alt: 'A seated session at the Web2 to Web3 conference in Abu Dhabi', label: 'Abu Dhabi 2025' },
  { src: '/images/singapore-2026/curated-introductions.webp', alt: 'Guests being introduced at Agentic Finance Singapore', label: 'Singapore 2026' },
];

/** 9. Who we are: More & More connects technology companies with the organisations that adopt technology. */
export function WhoWeAre() {
  return (
    <Section bordered tone="raised" id="who-we-are" aria-labelledby="who-we-are-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2 id="who-we-are-title" className="display mt-5 text-[length:var(--text-display-md)]">
              More &amp; More <span className="serif-accent">connects.</span>
            </h2>
            <p className="lede mt-5 max-w-xl">
              We connect innovative technology companies with the organisations that put technology to work: financial institutions, enterprises,
              sports organisations, municipalities and governments.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {trackRecord.map((m) => (
                <div key={m.label} className="flex flex-col-reverse gap-1 bg-ink-raised p-4">
                  <dt className="text-[12px] leading-snug text-muted">{m.label}</dt>
                  <dd className="serif-figure text-2xl leading-none text-gold">{m.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <ButtonLink href="/about/more-and-more" variant="outline">
                About us
              </ButtonLink>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {WHO_PHOTOS.map((p, i) => (
              <li key={p.src} className={`relative overflow-hidden rounded-2xl border border-line ${i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'} ${i === 1 ? 'self-end' : ''}`}>
                <Img src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 26vw, 50vw" position={p.position} className="object-cover" />
                <span className="absolute bottom-2 left-2 rounded-full border border-paper/20 bg-ink/70 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/90 backdrop-blur-sm">
                  {p.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/** 10. Live, as a media desk: the latest news, the next X Spaces, webinars and the monthly newsletter. */
export function HomeLive() {
  const [lead, ...rest] = getPosts();
  const spaces = liveSchedule.spaces.filter((s) => s.status === 'upcoming').slice(0, 2);
  return (
    <Section bordered id="live">
      <Container>
        <SectionHeader
          eyebrow="Live"
          title={
            <>
              Agentic finance, <span className="serif-accent">as it happens</span>
            </>
          }
          action={
            <ButtonLink href="/live" variant="outline">
              Live
            </ButtonLink>
          }
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {lead ? (
            <article className="flex flex-col rounded-2xl border border-line bg-ink-card p-6 sm:p-8">
              <p className="mono-label text-gold">
                Latest news · <time dateTime={lead.date}>{formatPostDate(lead)}</time> · {lead.sourceName}
              </p>
              <h3 className="display-tight mt-4 text-[clamp(1.5rem,1.2rem+1.1vw,2.2rem)]">
                <Link href={`/live/news/${lead.slug}`} className="hover:text-gold">
                  {lead.title}
                </Link>
              </h3>
              <p className="mt-4 leading-relaxed text-muted">{lead.summary}</p>
              <ul className="mt-6 flex flex-col divide-y divide-line border-t border-line">
                {rest.slice(0, 3).map((p) => (
                  <li key={p.slug} className="flex items-baseline justify-between gap-4 py-3">
                    <Link href={`/live/news/${p.slug}`} className="font-medium leading-snug hover:text-gold">
                      {p.title}
                    </Link>
                    <span className="mono-label shrink-0">{p.sourceName.split(' (')[0]}</span>
                  </li>
                ))}
              </ul>
              <Link href="/live/news" className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold hover:text-gold-bright">
                All news <Icon name="arrow-right" size={14} />
              </Link>
            </article>
          ) : null}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-line bg-ink-card p-6">
              <p className="mono-label flex items-center gap-2">
                <Icon name="mic" size={14} className="text-gold" />
                Upcoming X Spaces · Provisional
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {spaces.map((s) => (
                  <li key={s.id} className="flex gap-4">
                    <span className="flex w-14 shrink-0 flex-col items-center rounded-lg border border-gold/40 py-1.5">
                      <span className="font-mono text-[10px] uppercase text-gold">{s.month}</span>
                      <span className="serif-figure text-2xl leading-none">{s.day}</span>
                    </span>
                    <span>
                      <span className="block font-semibold leading-snug">{s.title}</span>
                      <span className="mt-0.5 block text-sm text-muted">{s.time}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/live/spaces" className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold hover:text-gold-bright">
                X Spaces <Icon name="arrow-right" size={14} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Link href="/live/webinars" className="group rounded-2xl border border-line bg-ink-card p-6 transition-colors hover:border-gold/60">
                <p className="mono-label flex items-center gap-2">
                  <Icon name="play" size={14} className="text-gold" />
                  Webinars
                </p>
                <p className="mt-3 font-semibold leading-snug group-hover:text-gold">Sessions with practitioners, and our stage recordings.</p>
              </Link>
              <Link href="/live/newsletter" className="group rounded-2xl border border-gold/40 bg-gold/[0.06] p-6 transition-colors hover:border-gold">
                <p className="mono-label flex items-center gap-2">
                  <Icon name="mail" size={14} className="text-gold" />
                  Monthly newsletter
                </p>
                <p className="mt-3 font-semibold leading-snug group-hover:text-gold">Receive the latest insights every month.</p>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

