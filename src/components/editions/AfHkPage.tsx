import { booking } from '@/config/site';
import {
  consensusHk,
  hkAgendaHours,
  hkAudience,
  hkConsensusStats,
  hkEvent,
  hkFaqs,
  hkFormat,
  hkHeroVideo,
  hkInclusions,
  hkPhotos,
  hkPlan,
  hkSeries,
  hkRotatingQuestions,
  hkSpeakerSlugs,
  hkStripLogos,
  hkUseCaseLogos,
  hkWallLogos,
  hkWeekEvents,
} from '@/data/af-hk';
import { getOrganization, useCases } from '@/data/partners';
import type { Upcoming2027 } from '@/data/upcoming-2027';
import { categoryViews } from '@/lib/category-views';
import { getSpeaker } from '@/lib/content';
import { toSpeakerCard } from '@/lib/speaker-cards';
import { YouTubeBackground } from '../media/YouTubeBackground';
import { CategoryRing } from '../partners/CategoryRing';
import { LogoMarquee, LogoWall, type LogoItem } from '../partners/LogoWall';
import { PartnershipShowcase } from '../partners/PartnershipShowcase';
import { UseCaseCard } from '../partners/UseCaseCard';
import { SpeakerCard } from '../speakers/SpeakerCard';
import { Accordion } from '../ui/Accordion';
import { ButtonLink, TextLink } from '../ui/Button';
import { CtaBand } from '../ui/CtaBand';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { JsonLd } from '../ui/JsonLd';
import { Container, Eyebrow, Section, SectionHeader } from '../ui/Layout';
import { Countdown } from './af-hk/Countdown';

const interestHref = '/about/contact?topic=attendance&edition=afhk';
const TZ = 'Asia/Hong_Kong';

function logos(ids: string[]): LogoItem[] {
  return ids.map((id) => getOrganization(id)).filter((o) => o !== undefined);
}

/** "1 Feb", "Monday", "16:00" in Hong Kong time, from an ISO string. */
function hkt(iso: string) {
  const d = new Date(iso);
  return {
    day: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: TZ }).format(d),
    weekday: new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: TZ }).format(d),
    time: new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).format(d),
  };
}

/**
 * Agentic Finance Hong Kong, after the review of 23 November 2026: a short
 * hero, the event as facts with the join panel beside it, partners and proof,
 * then the city and Consensus as background, and a centred close.
 */
export function AfHkPage({ page }: { page: Upcoming2027 }) {
  const seats = hkEvent.seats;
  // "Fewer than 1%" is only true against Consensus's 10,000 when the room is under 100.
  const underOnePercent = seats !== undefined && seats < 100;
  const etoro = useCases.find((u) => u.slug === 'etoro');
  const speakers = hkSpeakerSlugs.map((s) => getSpeaker(s)).filter((s) => s !== undefined);
  const week = hkWeekEvents.filter((e) => e.date);
  const faqs = hkFaqs();

  const start = hkEvent.startsAt ? hkt(hkEvent.startsAt) : undefined;
  const end = hkEvent.endsAt ? hkt(hkEvent.endsAt) : undefined;
  const keyFacts = [
    ...(start ? [{ value: start.day, label: `${start.weekday} · 2027` }] : []),
    ...(start ? [{ value: start.time, label: end ? `To ${end.time} HKT` : 'HKT' }] : []),
    { value: `${hkAgendaHours}h`, label: 'Of agenda' },
    ...(seats ? [{ value: String(seats), label: 'Seats' }] : []),
  ];

  return (
    <>
      {/* 01 Hero: name, one line, two actions */}
      <header id="hero" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-ink-deep">
          <Img src={page.image.src} alt="" fill preload sizes="100vw" position={page.image.position} className="object-cover opacity-55" />
          <YouTubeBackground id={hkHeroVideo.id} title={hkHeroVideo.title} className="absolute inset-0 opacity-50" />
          <div className="scrim-hero absolute inset-0" />
        </div>
        <Container className="flex min-h-[min(100svh,900px)] flex-col justify-center pb-16 pt-[calc(var(--header-h)+48px)]">
          <div className="max-w-3xl">
            <h1 className="display text-[length:var(--text-display-lg)]">
              Agentic Finance <span className="serif-accent">Hong Kong</span>
            </h1>
            <p className="lede mt-6 max-w-xl text-paper/85">Where finance’s decision-makers meet. An invitation-only gathering of the leaders shaping finance, digital assets and prediction markets.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={interestHref} size="lg">
                Apply to attend
              </ButtonLink>
              <ButtonLink href={booking.partnership.url} variant="outline" size="lg">
                Book a partnership call
              </ButtonLink>
            </div>
            {keyFacts.length ? (
              <dl className="mt-12 grid max-w-xl grid-cols-3 border-t border-paper/15 pt-8">
                {keyFacts.map((f, i) => (
                  <div
                    key={f.label}
                    className={`flex flex-col-reverse justify-end gap-3 ${i > 0 ? 'border-l border-paper/15 pl-4 sm:pl-8' : 'pr-4'}`}
                  >
                    <dt className="mono-label text-paper/75">{f.label}</dt>
                    <dd className="serif-figure text-[clamp(1.75rem,1.3rem+1.6vw,3rem)] leading-none text-gold">{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </Container>
      </header>

      {/* 02 Partner logo strip */}
      <section aria-label="Partners and organisations" className="border-y border-line bg-ink-deep py-9">
        <Container>
          <LogoMarquee items={logos(hkStripLogos)} />
        </Container>
      </section>

      {/* 03 About the event: facts and a photo, with the join panel beside them */}
      <Section id="about">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <SectionHeader
                eyebrow="About the event"
                title={
                  <>
                    One afternoon. <span className="serif-accent">One room.</span>
                  </>
                }
                size="md"
              />
              <p className="lede reveal mt-6 max-w-2xl">
                One afternoon during Consensus week, built for the people who set agent strategy at banks, exchanges, payment networks and funds, and the
                meetings that move deals forward.
              </p>
              <ol className="reveal mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                {hkPlan.map((p) => (
                  <li key={p.title} className="flex flex-col gap-2 bg-ink p-6">
                    <span className="mono-label text-gold">{p.when}</span>
                    <span className="text-lg font-semibold">{p.title}</span>
                    <span className="text-[15px] leading-relaxed text-muted">{p.body}</span>
                  </li>
                ))}
              </ol>

              <figure className="reveal group relative mt-10 aspect-[16/10] overflow-hidden rounded-2xl border border-line">
                <Img
                  src="/images/singapore-2026/networking-floor.webp"
                  alt="Delegates in conversation on the networking floor at Agentic Finance Singapore"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  position="50% 40%"
                  className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                />
                <div aria-hidden className="scrim-bottom absolute inset-0" />
                <span className="absolute right-4 top-4 rounded-full border border-paper/20 bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/85 backdrop-blur-sm">
                  Singapore 2026
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <p className="mono-label text-gold">On the day</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {hkFormat.map((x) => (
                      <li key={x} className="rounded-full border border-paper/20 bg-ink/60 px-3 py-1.5 text-[13px] text-paper/90 backdrop-blur-md">
                        {x}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </figure>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-5 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:self-start">
              {/* The join panel (was its own section) */}
              <aside
                id="join"
                aria-labelledby="join-title"
                className="edge-gold relative isolate overflow-hidden rounded-2xl border border-gold/50 bg-ink-card p-7 sm:p-9"
              >
                <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgb(209_182_121/0.18),transparent_70%)]" />
                <p className="flex items-center justify-between gap-3">
                  <span className="eyebrow">Registration</span>
                  <span className="rounded-full border border-gold/40 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gold">Invitation only</span>
                </p>
                <h2 id="join-title" className="display-tight mt-5 text-[clamp(2rem,1.6rem+1.2vw,2.6rem)]">
                  Join the <span className="serif-accent">Summit</span>
                </h2>
                {hkEvent.startsAt ? <Countdown startsAt={hkEvent.startsAt} className="mt-8 border-y border-line py-6" /> : null}
                <div className="mt-8">
                  <ButtonLink href={interestHref} size="lg" className="w-full">
                    Apply to attend
                  </ButtonLink>
                </div>
                <p className="mono-label mt-5 text-center">Every request is reviewed</p>
              </aside>

              <div className="rounded-2xl border border-line bg-ink-card/60 p-7">
                <p className="mono-label">Who is in the room</p>
                <ul className="mt-4 flex flex-col divide-y divide-line">
                  {hkAudience.map((x) => (
                    <li key={x} className="flex items-center gap-3 py-3 text-paper/90 first:pt-0 last:pb-0">
                      <Icon name="check" size={16} className="shrink-0 text-gold" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 05 Partners at our conferences */}
      <Section id="partners" bordered tone="raised">
        <Container>
          <SectionHeader
            title={
              <>
                Partners <span className="serif-accent">at our conferences</span>
              </>
            }
            action={
              <ButtonLink href="#use-cases" variant="outline" icon="arrow-down">
                See use cases
              </ButtonLink>
            }
          />
          <LogoWall items={logos(hkWallLogos)} className="reveal mt-12" />
        </Container>
      </Section>

      {/* 06 Speakers */}
      <Section id="speakers" bordered>
        <Container>
          <SectionHeader
            title={
              <>
                Speakers <span className="serif-accent">at our conferences</span>
              </>
            }
            action={
              <>
                <ButtonLink href="/speakers" variant="outline">
                  See all speakers
                </ButtonLink>
                <ButtonLink href="/speakers/nominate">Nominate a speaker</ButtonLink>
              </>
            }
          />
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {speakers.map((s) => (
              <li key={s.slug} className="reveal">
                <SpeakerCard speaker={toSpeakerCard(s)} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 07 Category ownership, as on the Abu Dhabi page */}
      <section id="categories" aria-labelledby="categories-title" className="relative overflow-hidden border-t border-line bg-ink-raised py-20 sm:py-24 lg:py-32">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(209_182_121/0.07),transparent_65%)]" />
        <div className="relative border-y border-line bg-paper/[0.02] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="overflow-hidden py-4">
            <ul aria-label="The questions behind the categories" className="flex w-max motion-safe:animate-[af-marquee_80s_linear_infinite] hover:[animation-play-state:paused]">
              {[...hkRotatingQuestions, ...hkRotatingQuestions].map((q, i) => (
                <li
                  key={`${q}-${i}`}
                  aria-hidden={i >= hkRotatingQuestions.length}
                  className="flex items-center gap-8 pr-8 text-2xl font-light tracking-tight text-paper md:text-4xl lg:text-5xl"
                >
                  <span aria-hidden className="size-2 flex-none rounded-full bg-gold" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Container className="relative mt-12 md:mt-16">
          <Eyebrow>Category ownership</Eyebrow>
          <h2 id="categories-title" className="display mt-5 text-[length:var(--text-display-md)]">
            Where does <span className="serif-accent">your company fit?</span>
          </h2>
          <div className="mt-12">
            <CategoryRing
              categories={categoryViews()}
              intro="Twelve conversations, each with room for one company to lead it. Choose a category to see who it is for and who held it in Singapore."
              agendaLabel="Choose a category"
              enquireHref={booking.partnership.url}
            />
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-gold/40 bg-gold/[0.05] p-6 md:flex-row md:items-center md:p-8">
            <p className="display-tight text-2xl sm:text-3xl">Which category should your company own?</p>
            <ButtonLink href={booking.partnership.url}>Claim your category</ButtonLink>
          </div>
        </Container>
      </section>

      {/* How we help you achieve your goals, as on the Abu Dhabi page */}
      <Section id="how-we-help" bordered>
        <Container>
          <div className="max-w-5xl">
            <span aria-hidden className="block h-px w-10 bg-gold" />
            <h2 className="display mt-5 text-[length:var(--text-display-md)]">How we help you achieve your goals</h2>
            <p className="display-tight mt-4 text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-light text-paper/90">What can your partnership look like?</p>
          </div>
          <PartnershipShowcase items={hkInclusions} />
        </Container>
      </Section>

      {/* 13 Use cases */}
      {etoro ? (
        <Section id="use-cases" bordered tone="raised">
          <Container>
            <SectionHeader
              eyebrow="Use cases"
              title={
                <>
                  What partners received <span className="serif-accent">in Singapore</span>
                </>
              }
              action={
                <ButtonLink href="/partners/use-cases" variant="outline">
                  All use cases
                </ButtonLink>
              }
            />
            <LogoWall items={logos(hkUseCaseLogos)} columns="wide" className="reveal mt-12" />
            <UseCaseCard useCase={etoro} featured className="reveal mt-6" />
            <div className="reveal mt-6 flex flex-col gap-5 rounded-2xl border border-gold/40 bg-gold/[0.05] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <p className="display-tight text-2xl sm:text-3xl">Want this list with your name on it?</p>
              <ButtonLink href={booking.partnership.url}>Book a partnership call</ButtonLink>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Where will you be in 2027: the series, with the button to the 2027 editions page */}
      <Section id="where-2027" bordered tone="deep" aria-labelledby="where-2027-title" className="isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_70%_at_20%_50%,rgb(209_182_121/0.14),transparent_70%)]" />
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:items-center lg:gap-16">
            <div className="reveal">
              <Eyebrow>Agentic Finance 2027</Eyebrow>
              <h2 id="where-2027-title" className="display mt-5 text-[length:var(--text-display-md)]">
                Where will you be in <span className="serif-accent [text-shadow:0_0_36px_rgb(209_182_121/0.35)]">2027?</span>
              </h2>
              <p className="lede mt-6 max-w-lg">Five cities, each during a major industry week. Hong Kong opens the series.</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/events/2027" size="lg">
                  See the 2027 editions
                </ButtonLink>
                <ButtonLink href="/events/2027/meetings" variant="outline" size="lg">
                  Tell us where you’ll be
                </ButtonLink>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {hkSeries.map((c, i) => (
                <li
                  key={c.city}
                  className={`reveal group relative overflow-hidden rounded-2xl border ${i === 0 ? 'col-span-2 aspect-[16/9] border-gold/60 sm:aspect-auto' : 'aspect-[4/3] border-line'}`}
                >
                  <Img
                    src={c.image.src}
                    alt=""
                    fill
                    sizes={i === 0 ? '(min-width: 1024px) 34vw, 100vw' : '(min-width: 1024px) 17vw, (min-width: 640px) 33vw, 50vw'}
                    position={c.image.position}
                    className="object-cover transition-transform duration-1000 ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                  />
                  <span aria-hidden className="scrim-bottom absolute inset-x-0 bottom-0 h-3/4" />
                  <span className="absolute inset-x-3 bottom-3 flex flex-col">
                    <span className="mono-label text-gold [text-shadow:0_1px_6px_rgb(0_0_0/0.8)]">{c.month}</span>
                    <span className={`font-semibold leading-tight [text-shadow:0_1px_6px_rgb(0_0_0/0.8)] ${i === 0 ? 'text-2xl' : 'text-base'}`}>{c.city}</span>
                    <span className="text-xs text-paper/75">{c.anchor}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* 08 Why Hong Kong */}
      <Section id="why-hk" bordered>
        <Container>
          <SectionHeader
            eyebrow="Why Hong Kong"
            title={
              <>
                Early February, <span className="serif-accent">global finance is in Hong Kong.</span>
              </>
            }
            lede={
              underOnePercent
                ? `10,000 people from 100+ countries come to Hong Kong for Consensus. Fewer than 1% of them, ${seats} hand-selected leaders, meet at the Agentic Finance Summit.`
                : '10,000 people from 100+ countries come to Hong Kong for Consensus. A small, hand-selected group of leaders meets at the Agentic Finance Summit.'
            }
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <figure className="reveal relative min-h-[320px] overflow-hidden rounded-2xl border border-line lg:row-span-2 lg:min-h-0">
              <Img src={hkPhotos.sunsetHarbour.src} alt={hkPhotos.sunsetHarbour.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" position={hkPhotos.sunsetHarbour.position} className="object-cover" />
            </figure>
            {week.map((e) => (
              <article
                key={e.title}
                className="reveal edge-gold relative flex flex-col gap-3 rounded-2xl border border-line bg-ink-card/70 p-7 transition-colors duration-500 hover:border-gold/50"
              >
                <span className="mono-label text-gold">{e.date}</span>
                <h3 className="display-tight text-2xl">{e.title}</h3>
                <p className="text-muted">{e.note}</p>
                {e.stat ? <p className="mt-auto pt-3 font-semibold text-paper/90">{e.stat}</p> : null}
                {e.href ? (
                  <TextLink href={e.href} className="min-h-11 self-start">
                    Official site
                  </TextLink>
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* 09 Consensus Hong Kong. One photo, the text and four figures on it. */}
      <section id="consensus" aria-labelledby="consensus-title" className="relative isolate overflow-hidden border-t border-line">
        <Img
          src={hkPhotos.goldenHour.src}
          alt={hkPhotos.goldenHour.alt}
          fill
          sizes="100vw"
          position="50% 60%"
          className="-z-20 object-cover"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        <Container className="py-24 sm:py-28 lg:py-36">
          <div className="reveal max-w-2xl">
            <Eyebrow>A Consensus Hong Kong week event</Eyebrow>
            <h2 id="consensus-title" className="display mt-5 text-[length:var(--text-display-md)]">
              10,000 attend Consensus.{' '}
              <span className="serif-accent">{underOnePercent ? 'The most relevant 1% meet with us.' : 'A hand-selected few meet with us.'}</span>
            </h2>
            <p className="lede mt-6 text-paper/85">
              {consensusHk.name} runs {consensusHk.dates} at the {consensusHk.venue}.
              {hkEvent.dayLabel ? ` We hold our room on its first day${hkEvent.venue ? `, at ${hkEvent.venue}` : ''}.` : ' We hold our room the same week.'}
            </p>
          </div>

          <dl className="reveal mt-14 grid grid-cols-2 overflow-hidden rounded-2xl border border-paper/15 bg-ink/55 backdrop-blur-md lg:grid-cols-4">
            {hkConsensusStats.map((m, i) => (
              <div
                key={m.label}
                className={[
                  'flex flex-col-reverse justify-between gap-4 p-6 sm:p-8',
                  i % 2 === 1 ? 'border-l border-paper/10' : '',
                  i >= 2 ? 'border-t border-paper/10 lg:border-t-0' : '',
                  i === 2 ? 'lg:border-l' : '',
                ].join(' ')}
              >
                <dt className="mono-label text-paper/75">{m.label}</dt>
                <dd className="serif-figure text-[clamp(2.4rem,1.9rem+1.8vw,3.5rem)] leading-none text-gold">{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <ButtonLink href={consensusHk.url} variant="outline">
              consensus-hongkong.coindesk.com
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* 16 Closing, centred */}
      <CtaBand
        centered
        eyebrow={`Agentic Finance Hong Kong · ${hkEvent.dayLabel ?? 'February 2027'}`}
        title="The people in the room are the point."
        body={`Every guest is selected. Every invitation is personal.${seats ? ` ${seats} seats only.` : ''} Every request is reviewed.`}
        actions={
          <>
            <ButtonLink href={interestHref} size="lg">
              Apply to attend
            </ButtonLink>
            <ButtonLink href={booking.partnership.url} variant="outline" size="lg">
              Book a partnership call
            </ButtonLink>
            <ButtonLink href="/speakers/nominate" variant="outline" size="lg">
              Nominate a speaker
            </ButtonLink>
          </>
        }
      />
      {/* 15 FAQ: last, right above the footer */}
      <Section id="faq" bordered tone="raised">
        <Container>
          <div className="mx-auto max-w-[900px]">
            <SectionHeader
              eyebrow="FAQ"
              title={
                <>
                  Common <span className="serif-accent">questions</span>
                </>
              }
              stacked
            />
            <Accordion className="mt-12" defaultOpen={[faqs[0].id]} items={faqs.map((f) => ({ id: f.id, title: f.q, content: <p>{f.a}</p> }))} />
          </div>
        </Container>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }}
        />
      </Section>
    </>
  );
}
