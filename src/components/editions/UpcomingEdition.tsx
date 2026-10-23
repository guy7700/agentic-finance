import Link from 'next/link';
import { booking, externalLinks, primaryActions } from '@/config/site';
import { faqGroups } from '@/data/about';
import type { Edition } from '@/data/types';
import { categories, partnerBenefits } from '@/data/partners';
import { strategicQuestions, topics } from '@/data/program';
import { speakers } from '@/data/speakers';
import { getEdition } from '@/data/editions';
import { toSpeakerCard } from '@/lib/speaker-cards';
import { AmbientVideo } from '../media/VideoPlayer';
import { SpeakerCard } from '../speakers/SpeakerCard';
import { Accordion } from '../ui/Accordion';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { ButtonLink, TextLink } from '../ui/Button';
import { CtaBand } from '../ui/CtaBand';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container, Eyebrow, Section, SectionHeader } from '../ui/Layout';
import { StatusBadge } from '../ui/StatusBadge';
import { Stats } from '../ui/Stats';

const ECOSYSTEM = [
  'Banks',
  'Sovereign wealth',
  'Asset managers',
  'Family offices',
  'Regulators',
  'Fintech',
  'Digital assets',
  'Institutional capital',
  'AI',
  'Government',
  'Global financial executives',
];

const PAST_SPEAKERS = ['yoni-assia', 'stani-kulechov', 'scott-lawin', 'johann-eid', 'mark-willis', 'yoshi-yokokawa', 'henri-arslanian', 'anton-ruddenklau'];

export function UpcomingEdition({ edition }: { edition: Edition }) {
  const singapore = getEdition('singapore-2026');
  const announced = speakers.filter((s) => s.editions.includes(edition.slug));
  const past = PAST_SPEAKERS.map((slug) => speakers.find((s) => s.slug === slug)).filter((s) => s !== undefined);
  const faqs = [...(faqGroups.find((g) => g.id === 'invitations')?.items ?? []).slice(1, 4), ...(faqGroups.find((g) => g.id === 'editions')?.items ?? []).slice(0, 2)];

  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10">
          <Img src={edition.image.src} alt="" fill preload sizes="100vw" className="object-cover opacity-50" />
          {edition.heroVideo ? (
            <AmbientVideo src={edition.heroVideo.src} className="absolute inset-0 h-full w-full object-cover opacity-45" />
          ) : null}
          <div className="scrim-hero absolute inset-0" />
        </div>
        <Container className="flex min-h-[min(96svh,920px)] flex-col justify-end pb-14 pt-[calc(var(--header-h)+40px)]">
          <Breadcrumbs items={[{ label: 'Editions', href: '/editions' }, { label: edition.shortName }]} />
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <StatusBadge status="upcoming" label={`Upcoming · ${edition.dateLabel}`} />
            <span className="mono-label text-paper/70">
              {edition.city} · {edition.country}
            </span>
          </div>
          <h1 className="display mt-6 max-w-5xl text-[length:var(--text-display-lg)]">{edition.name}</h1>
          <p className="display-tight mt-4 text-[clamp(1.4rem,1rem+1.4vw,2.2rem)] text-gold">{edition.tagline}</p>
          <p className="lede mt-6 max-w-2xl text-paper/80">{edition.summary}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={primaryActions.invitation.href} size="lg">
              Request an invitation
            </ButtonLink>
            <ButtonLink href="#partnerships" variant="outline" size="lg" icon="arrow-down">
              Explore partnerships
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm text-muted">
            Received a personal invitation?{' '}
            <a href={externalLinks.verifyInvitation} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold hover:text-gold-bright">
              Verify it here
            </a>
            .
          </p>
          <Stats items={edition.facts ?? []} size="md" className="mt-12 max-w-4xl" />
          <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.08em] text-subtle">Background film: Agentic Finance Singapore, October 2026</p>
        </Container>
      </header>

      {/* Two rooms */}
      <Section id="experiences">
        <Container>
          <SectionHeader
            eyebrow="Two rooms. One circle."
            title="The Summit and the VIP Gala."
            lede="Two distinct experiences with separate guest lists. The Summit date and venue are shared with invited guests as they are confirmed."
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {(edition.experiences ?? []).map((x, i) => (
              <article key={x.id} className={`flex flex-col rounded-2xl border p-7 sm:p-10 ${i === 0 ? 'border-gold/50 bg-gold/[0.05]' : 'border-line bg-ink-card/60'}`}>
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-gold">
                  <Icon name="calendar" size={14} />
                  {x.when}
                </p>
                <h3 className="display-tight mt-5 text-4xl">{x.name}</h3>
                <p className="mt-4 text-[17px] leading-relaxed text-paper/85">{x.summary}</p>
                <ul className="mt-6 flex flex-col gap-3 border-t border-line pt-6">
                  {x.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[15px] text-muted">
                      <Icon name="check" size={18} className="shrink-0 text-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
                {x.href ? (
                  <div className="mt-auto pt-8">
                    <ButtonLink href={x.href} variant={i === 0 ? 'gold' : 'outline'}>
                      {x.cta}
                    </ButtonLink>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Why Abu Dhabi */}
      <Section bordered tone="raised" id="why">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>Why {edition.city}</Eyebrow>
              <h2 className="display mt-5 text-[length:var(--text-display-sm)]">One island. The global financial industry is already there.</h2>
              <p className="lede mt-6">{edition.positioning}</p>
              <p className="mt-5 leading-relaxed text-muted">
                From the financial district on Al Maryah Island to the sovereign funds and regulators across the city, the capital
                already convenes the institutions shaping finance in the region. We curate the room where agentic finance gets decided.
              </p>
              <p className="mono-label mt-10">Concentrated in one city</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {ECOSYSTEM.map((x) => (
                  <li key={x} className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-paper/85">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                <Img src={edition.image.src} alt={edition.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mono-label mt-3">{edition.image.caption}</figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* Programme */}
      <Section bordered id="program">
        <Container>
          <SectionHeader
            eyebrow="The programme"
            title="The questions shaping finance."
            lede={`Agenda to be announced. The programme is built around six decisions and ${topics.length} areas, from agentic trading to tokenised capital markets.`}
            action={
              <>
                <ButtonLink href="/program/topics" variant="outline">All {topics.length} topics</ButtonLink>
                <ButtonLink href="/program/questions" variant="ghost">The six questions</ButtonLink>
              </>
            }
          />
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {strategicQuestions.map((q) => (
              <li key={q.number} className="bg-ink p-6 sm:p-8">
                <span className="font-mono text-xs text-gold">Q{q.number}</span>
                <p className="display-tight mt-3 text-2xl">{q.question}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Speakers */}
      <Section bordered tone="raised" id="speakers">
        <Container>
          <SectionHeader
            eyebrow={`Joining us in ${edition.city}`}
            title="Announced one by one."
            lede="The Abu Dhabi programme is announced speaker by speaker, as each one confirms. A deliberately short list, chosen for what they decide rather than how often they speak."
            action={
              <>
                <ButtonLink href={`/editions/${edition.slug}/speakers`} variant="outline">{edition.city} speakers</ButtonLink>
                <ButtonLink href="/speakers/nominate">Nominate a speaker</ButtonLink>
              </>
            }
          />
          {announced.length ? (
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
              {announced.map((s) => (
                <li key={s.slug}>
                  <SpeakerCard speaker={toSpeakerCard(s)} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-dashed border-line-strong p-7 sm:flex-row sm:items-center sm:p-10">
              <p className="max-w-2xl text-lg leading-relaxed text-paper/85">
                No Abu Dhabi speakers have been announced yet. The first names will appear here as they confirm.
              </p>
              <TextLink href="/speakers/nominate">Put a name forward</TextLink>
            </div>
          )}
          <div className="mt-16">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h3 className="display-tight text-2xl sm:text-3xl">Speakers at our conferences</h3>
              <TextLink href="/speakers">The full directory</TextLink>
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted">From past editions. Not confirmed for Abu Dhabi unless announced above.</p>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
              {past.map((s) => (
                <li key={s.slug}>
                  <SpeakerCard speaker={toSpeakerCard(s, { withTagline: true })} />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Partnerships */}
      <Section bordered id="partnerships">
        <Container>
          <SectionHeader
            eyebrow="Partnerships"
            title={`${edition.partnerPositions} strategic partners. No more.`}
            lede="A limited number of positions, so every partner is seen, introduced and remembered. Twelve categories to lead; no more than eight positions overall."
            action={
              <>
                <ButtonLink href="/partners/book-a-call">{booking.partnership.label}</ButtonLink>
                <ButtonLink href="/partners/categories" variant="outline">Partnership categories</ButtonLink>
              </>
            }
          />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {partnerBenefits.map((b, i) => (
              <li key={b.title} className="flex flex-col gap-3 bg-ink p-6 sm:p-7">
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <span className="text-xl font-bold">{b.title}</span>
                <span className="text-[15px] leading-relaxed text-muted">{b.body}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-10 flex flex-wrap gap-2">
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
        </Container>
      </Section>

      {/* Track record */}
      <Section bordered tone="raised" id="track-record">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
            <div>
              <Eyebrow>Our Abu Dhabi track record</Eyebrow>
              <h2 className="display mt-5 text-[length:var(--text-display-md)]">We have done Abu Dhabi before.</h2>
              <p className="lede mt-6">We know the city. We know the ecosystem. We know how to build the room.</p>
              <p className="mt-5 leading-relaxed text-muted">
                More &amp; More produced the Web2 to Web3 Summit in Abu Dhabi in 2025, with Hub71: founders, investors and officials in
                one room, and the meetings that came out of it. Agentic Finance Abu Dhabi is built by the same team, with the same
                relationships, on the same island.
              </p>
              {singapore?.metrics ? (
                <div className="mt-10 rounded-2xl border border-line p-6">
                  <p className="mono-label">And most recently · {singapore.shortName}</p>
                  <p className="mt-2 text-lg text-paper/90">
                    {singapore.metrics.map((m) => `${m.value} ${m.label.toLowerCase()}`).join(' · ')}
                  </p>
                  <TextLink href="/editions/singapore-2026" className="mt-4">
                    Open the Singapore archive
                  </TextLink>
                </div>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <figure className="col-span-2">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line">
                  <Img
                    src="/images/more-and-more/web2toweb3-session.webp"
                    alt="A seated session at the Web2 to Web3 Summit in Abu Dhabi, produced by More & More"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </figure>
              <figure className="col-span-2 sm:col-span-1">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                  <Img
                    src="/images/more-and-more/hub71-networking.jpg"
                    alt="Delegates networking at a More & More gathering at Hub71 in Abu Dhabi"
                    fill
                    sizes="(min-width: 1024px) 25vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </figure>
              <ul className="col-span-2 grid grid-cols-2 gap-px self-stretch overflow-hidden rounded-2xl border border-line bg-line sm:col-span-1">
                {['Stage sessions', 'Business meetings', 'Delegations', 'VIP gatherings'].map((x) => (
                  <li key={x} className="flex items-end bg-ink-raised p-4 text-sm font-semibold">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section bordered id="faq">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <SectionHeader stacked eyebrow="Common questions" title="Before you apply." action={<TextLink href="/about/faq">All questions</TextLink>} />
            <Accordion items={faqs.map((f, i) => ({ id: `faq-${i}`, title: f.q, content: <p className="leading-relaxed">{f.a}</p> }))} />
          </div>
        </Container>
      </Section>

      <CtaBand eyebrow={`${edition.name} · ${edition.dateLabel}`} />
    </>
  );
}
