import { primaryActions } from '@/config/site';
import { consensusHk, hkConsensusStats, hkHeroVideo, hkPhotos, hkWeekEvents } from '@/data/af-hk';
import {
  landingAudience,
  landingFaqs,
  landingFormat,
  landingQuestions,
  landingSpeakerSlugs,
  landingStripLogos,
  landingUseCaseLogos,
  landingWallLogos,
  partnerInclusions,
} from '@/data/event-landing';
import { getOrganization, useCases } from '@/data/partners';
import { contextDates, eventDate, eventPlan, upcoming2027, type Upcoming2027 } from '@/data/upcoming-2027';
import { categoryViews } from '@/lib/category-views';
import { companyHref } from '@/lib/companies';
import { getSpeaker } from '@/lib/content';
import { absoluteUrl } from '@/lib/paths';
import { toSpeakerCard } from '@/lib/speaker-cards';
import { ApplyButton } from '../events/ApplyButton';
import { YouTubeBackground } from '../media/YouTubeBackground';
import { CategoryRing } from '../partners/CategoryRing';
import { LogoMarqueeRows, LogoWall, type LogoItem } from '../partners/LogoWall';
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

const partnerHref = primaryActions.partner.href;

function logos(ids: string[]): LogoItem[] {
  return ids
    .map((id) => getOrganization(id))
    .filter((o) => o !== undefined)
    .map((o) => ({ ...o, href: companyHref(o.id) }));
}

/**
 * One 2027 event page, on the Hong Kong template Tal approved (23 Nov 2026) with his
 * changes of 26 Nov: the attendance near the title, a shorter subtitle, the date and place
 * up front, two logo rows under the hero, and "How we help you achieve your goals" from the
 * Abu Dhabi page. Every fact comes from the event's own record; Hong Kong adds its Consensus
 * week and film.
 */
export function EventLandingPage({ event }: { event: Upcoming2027 }) {
  const isHk = event.slug === 'afhk';
  const d = eventDate(event);
  const anchorDates = contextDates(event);
  const plan = eventPlan(event);
  const faqs = landingFaqs(event);
  const etoro = useCases.find((u) => u.slug === 'etoro');
  const speakers = landingSpeakerSlugs.map((s) => getSpeaker(s)).filter((s) => s !== undefined);
  const week = isHk ? hkWeekEvents.filter((e) => e.date) : [];
  const keyFacts = [
    { value: d.short, label: `${d.weekday}${d.provisional ? ' · Provisional' : ''}` },
    { value: d.start, label: `To ${d.end} ${event.tz}` },
    event.attendees ? { value: String(event.attendees), label: 'Curated attendees, at most' } : { value: 'Invite', label: 'Only. No tickets' },
  ];

  return (
    <>
      {/* 01 Hero: name, attendance, one line, date and place, two actions */}
      <header id="hero" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-ink-deep">
          <Img src={event.image.src} alt="" fill preload sizes="100vw" position={event.image.position} className="object-cover opacity-55" />
          {isHk ? <YouTubeBackground id={hkHeroVideo.id} title={hkHeroVideo.title} className="absolute inset-0 opacity-50" /> : null}
          <div className="scrim-hero absolute inset-0" />
        </div>
        <Container className="flex min-h-[min(92svh,860px)] flex-col justify-center pb-14 pt-[calc(var(--header-h)+40px)]">
          <div className="max-w-3xl">
            <p className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-bright">
                <span aria-hidden className="size-1.5 rounded-full bg-gold" />
                {event.attendees ? `Up to ${event.attendees} curated attendees` : 'Invitation only'}
              </span>
              {event.attendees ? (
                <span className="rounded-full border border-paper/25 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-paper/80">Invitation only</span>
              ) : null}
            </p>
            <h1 className="display mt-6 text-[clamp(2.5rem,1.6rem+3.6vw,4.75rem)]">
              {event.name.replace(` ${event.city}`, '')} <span className="serif-accent">{event.city}</span>
            </h1>
            <p className="lede mt-5 max-w-xl text-paper/85">{event.subtitle}</p>
            <dl className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-paper/20 bg-ink/55 px-4 py-3 backdrop-blur-md">
                <Icon name="calendar" size={20} className="shrink-0 text-gold" />
                <div>
                  <dt className="sr-only">Date</dt>
                  <dd className="text-lg font-semibold leading-tight">{d.long}</dd>
                  <dd className="text-sm text-paper/75">
                    {d.time}
                    {d.provisional ? ' · Provisional date' : ''}
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-paper/20 bg-ink/55 px-4 py-3 backdrop-blur-md">
                <Icon name="pin" size={20} className="shrink-0 text-gold" />
                <div>
                  <dt className="sr-only">Location</dt>
                  <dd className="text-lg font-semibold leading-tight">{event.city}</dd>
                  <dd className="text-sm text-paper/75">During {event.context}</dd>
                </div>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <ApplyButton event={event} />
              <ButtonLink href={partnerHref} variant="outline" size="lg">
                Partner with us
              </ButtonLink>
            </div>
          </div>
        </Container>
      </header>

      {/* 02 Partner logos: two rows, moving in opposite directions */}
      <section aria-label="Partners and organisations at our conferences" className="border-y border-line bg-ink-deep py-8">
        <Container wide>
          <LogoMarqueeRows items={logos(landingStripLogos)} />
        </Container>
      </section>

      {/* 03 About the event: the programme and a photo, with the registration panel beside them */}
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
                An afternoon during {event.context}, built for the people who set agent strategy at banks, exchanges, payment networks and funds, and the
                meetings that move deals forward.
              </p>
              <dl className="reveal mt-8 grid grid-cols-3 border-y border-line py-6">
                {keyFacts.map((f, i) => (
                  <div key={f.label} className={`flex flex-col-reverse justify-end gap-2 ${i > 0 ? 'border-l border-line pl-4 sm:pl-8' : 'pr-4'}`}>
                    <dt className="mono-label">{f.label}</dt>
                    <dd className="serif-figure text-[clamp(1.75rem,1.3rem+1.6vw,3rem)] leading-none text-gold">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <ol className="reveal mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                {plan.map((p) => (
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
                    {landingFormat.map((x) => (
                      <li key={x} className="rounded-full border border-paper/20 bg-ink/60 px-3 py-1.5 text-[13px] text-paper/90 backdrop-blur-md">
                        {x}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </figure>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-5 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:self-start">
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
                <p className="mt-3 text-paper/80">
                  {d.long} · {d.time}
                </p>
                {!d.provisional ? <Countdown startsAt={event.startsAt} className="mt-8 border-y border-line py-6" /> : null}
                <div className="mt-8">
                  <ApplyButton event={event} className="w-full" />
                </div>
                <p className="mono-label mt-5 text-center">{event.luma ? 'Registration opens on Luma · Every request is reviewed' : 'Every request is reviewed'}</p>
              </aside>

              <div className="rounded-2xl border border-line bg-ink-card/60 p-7">
                <p className="mono-label">Who is in the room</p>
                <ul className="mt-4 flex flex-col divide-y divide-line">
                  {landingAudience.map((x) => (
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

      {/* 04 How we help you achieve your goals, as on the Abu Dhabi page */}
      <Section id="how-we-help" bordered tone="raised">
        <Container>
          <div className="max-w-5xl">
            <span aria-hidden className="block h-px w-10 bg-gold" />
            <h2 className="display mt-5 text-[length:var(--text-display-md)]">How we help you achieve your goals</h2>
            <p className="display-tight mt-4 text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-light text-paper/90">What can your partnership look like?</p>
          </div>
          <PartnershipShowcase items={partnerInclusions} />
          <div className="reveal mt-12 flex flex-col gap-5 rounded-2xl border border-gold/40 bg-gold/[0.05] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <p className="display-tight text-2xl sm:text-3xl">Want your company in the room in {event.city}?</p>
            <ButtonLink href={partnerHref}>Book a partnership call</ButtonLink>
          </div>
        </Container>
      </Section>

      {/* 05 Partners at our conferences */}
      <Section id="partners" bordered>
        <Container>
          <SectionHeader
            title={
              <>
                Partners <span className="serif-accent">at our conferences</span>
              </>
            }
            lede="Companies at our past events. Each one has its own page."
            action={
              <ButtonLink href="/partners" variant="outline">
                All partners
              </ButtonLink>
            }
          />
          <LogoWall items={logos(landingWallLogos)} className="reveal mt-12" />
        </Container>
      </Section>

      {/* 06 Speakers at our conferences */}
      <Section id="speakers" bordered tone="raised">
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
                  All speakers
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

      {/* 07 Category ownership */}
      <section id="categories" aria-labelledby="categories-title" className="relative overflow-hidden border-t border-line bg-ink py-20 sm:py-24 lg:py-28">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(209_182_121/0.07),transparent_65%)]" />
        <div className="relative border-y border-line bg-paper/[0.02] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="overflow-hidden py-4">
            <ul aria-label="The questions behind the categories" className="flex w-max motion-safe:animate-[af-marquee_80s_linear_infinite] hover:[animation-play-state:paused]">
              {[...landingQuestions, ...landingQuestions].map((q, i) => (
                <li
                  key={`${q}-${i}`}
                  aria-hidden={i >= landingQuestions.length}
                  className="flex items-center gap-8 pr-8 text-2xl font-light tracking-tight text-paper md:text-4xl"
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
              enquireHref={partnerHref}
            />
          </div>
        </Container>
      </section>

      {/* 08 Use case */}
      {etoro ? (
        <Section id="use-cases" bordered tone="raised">
          <Container>
            <SectionHeader
              eyebrow="Use case"
              title={
                <>
                  What partners received <span className="serif-accent">in Singapore</span>
                </>
              }
              action={
                <ButtonLink href="/partners#achievements" variant="outline">
                  Achievements of our partners
                </ButtonLink>
              }
            />
            <LogoWall items={logos(landingUseCaseLogos)} columns="wide" className="reveal mt-12" />
            <UseCaseCard useCase={etoro} featured className="reveal mt-6" />
          </Container>
        </Section>
      ) : null}

      {/* 09 2027 Global Exposure: every edition, this one highlighted */}
      <Section id="where-2027" bordered tone="deep" aria-labelledby="where-2027-title" className="isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_70%_at_20%_50%,rgb(209_182_121/0.14),transparent_70%)]" />
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)] lg:items-center lg:gap-16">
            <div className="reveal">
              <Eyebrow>2027 Global Exposure</Eyebrow>
              <h2 id="where-2027-title" className="display mt-5 text-[length:var(--text-display-md)]">
                Where will you be in <span className="serif-accent [text-shadow:0_0_36px_rgb(209_182_121/0.35)]">2027?</span>
              </h2>
              <p className="lede mt-6 max-w-lg">Each edition runs during a major industry week, from Asia to Europe, the Gulf and the Americas.</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/events" size="lg">
                  Our events
                </ButtonLink>
                <ButtonLink href="/events/2027/meetings" variant="outline" size="lg">
                  Tell us where you’ll be
                </ButtonLink>
              </div>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {upcoming2027.map((c) => {
                const here = c.slug === event.slug;
                const cd = eventDate(c);
                return (
                  <li key={c.slug} className={`reveal group relative aspect-[4/3] overflow-hidden rounded-2xl border ${here ? 'border-gold/70' : 'border-line'}`}>
                    <a href={c.path} className="absolute inset-0 z-10" aria-label={`${c.name}, ${cd.medium}`} aria-current={here ? 'page' : undefined} />
                    <Img
                      src={c.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 17vw, (min-width: 640px) 33vw, 50vw"
                      position={c.image.position}
                      className="object-cover transition-transform duration-1000 ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                    />
                    <span aria-hidden className="scrim-bottom absolute inset-x-0 bottom-0 h-3/4" />
                    <span className="absolute inset-x-3 bottom-3 flex flex-col">
                      <span className="mono-label text-gold [text-shadow:0_1px_6px_rgb(0_0_0/0.8)]">{cd.short}</span>
                      <span className="text-base font-semibold leading-tight [text-shadow:0_1px_6px_rgb(0_0_0/0.8)]">{c.city}</span>
                      <span className="text-xs text-paper/75">{c.context}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </Section>

      {/* 10 Why this city, and the week around it */}
      {isHk ? (
        <>
          <Section id="why-city" bordered>
            <Container>
              <SectionHeader
                eyebrow="Why Hong Kong"
                title={
                  <>
                    Early February, <span className="serif-accent">global finance is in Hong Kong.</span>
                  </>
                }
                lede={`10,000 people from 100+ countries come to Hong Kong for Consensus. Up to ${event.attendees} hand-selected leaders meet at Agentic Finance Hong Kong.`}
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

          <section id="consensus" aria-labelledby="consensus-title" className="relative isolate overflow-hidden border-t border-line">
            <Img src={hkPhotos.goldenHour.src} alt={hkPhotos.goldenHour.alt} fill sizes="100vw" position="50% 60%" className="-z-20 object-cover" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/60" />
            <Container className="py-24 sm:py-28 lg:py-32">
              <div className="reveal max-w-2xl">
                <Eyebrow>A Consensus Hong Kong week event</Eyebrow>
                <h2 id="consensus-title" className="display mt-5 text-[length:var(--text-display-md)]">
                  10,000 attend Consensus. <span className="serif-accent">A hand-selected few meet with us.</span>
                </h2>
                <p className="lede mt-6 text-paper/85">
                  {consensusHk.name} runs {consensusHk.dates} at the {consensusHk.venue}. We hold our room on its first day.
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
        </>
      ) : (
        <Section id="why-city" bordered>
          <Container>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
              <div className="reveal">
                <Eyebrow>Why {event.city}</Eyebrow>
                <h2 className="display mt-5 text-[length:var(--text-display-md)]">{event.tagline}</h2>
                <p className="lede mt-6 max-w-xl">{event.positioning}</p>
                <div className="mt-8 rounded-2xl border border-line bg-ink-card/70 p-6">
                  <p className="mono-label text-gold">{anchorDates || 'Same week'}</p>
                  <p className="mt-2 text-xl font-semibold">{event.context}</p>
                  <p className="mt-2 text-muted">
                    {event.name} is held during {event.context}, produced independently by More &amp; More.
                  </p>
                  {event.contextUrl ? (
                    <TextLink href={event.contextUrl} className="mt-3 min-h-11">
                      Official site
                    </TextLink>
                  ) : null}
                </div>
              </div>
              <figure className="reveal relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                <Img src={event.image.src} alt={event.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" position={event.image.position} className="object-cover" />
              </figure>
            </div>
          </Container>
        </Section>
      )}

      {/* 11 Closing */}
      <CtaBand
        centered
        eyebrow={`${event.name} · ${d.medium}${d.provisional ? ' · Provisional' : ''}`}
        title="The people in the room are the point."
        body={`Every guest is selected. Every invitation is personal.${event.attendees ? ` Up to ${event.attendees} curated attendees.` : ''}`}
        actions={
          <>
            <ApplyButton event={event} />
            <ButtonLink href={partnerHref} variant="outline" size="lg">
              Partner with us
            </ButtonLink>
            <ButtonLink href="/speakers/nominate" variant="outline" size="lg">
              Nominate a speaker
            </ButtonLink>
          </>
        }
      />

      {/* 12 FAQ, right above the footer */}
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
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: event.name,
              description: `${event.subtitle} During ${event.context}, ${event.city}.`,
              startDate: event.startsAt,
              endDate: event.endsAt,
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              location: { '@type': 'Place', name: event.city, address: { '@type': 'PostalAddress', addressLocality: event.city, addressCountry: event.country } },
              image: [absoluteUrl(event.image.src)],
              url: absoluteUrl(event.path),
              organizer: { '@type': 'Organization', name: 'More & More', url: 'https://mnm.live' },
              ...(event.attendees ? { maximumAttendeeCapacity: event.attendees } : {}),
              ...(event.luma ? { offers: { '@type': 'Offer', url: event.luma.url, price: 0, priceCurrency: 'USD', availability: 'https://schema.org/InStock' } } : {}),
            },
          ]}
        />
      </Section>
    </>
  );
}
