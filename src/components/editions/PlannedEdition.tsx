import { booking } from '@/config/site';
import { editionsByStatus, getEdition } from '@/data/editions';
import { formats, strategicQuestions } from '@/data/program';
import type { Edition } from '@/data/types';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { ButtonLink, TextLink } from '../ui/Button';
import { CtaBand } from '../ui/CtaBand';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container, Eyebrow, Section, SectionHeader } from '../ui/Layout';
import { StatusBadge } from '../ui/StatusBadge';
import { Stats } from '../ui/Stats';
import { EditionCard } from './EditionCard';

export function PlannedEdition({ edition }: { edition: Edition }) {
  const singapore = getEdition('singapore-2026');
  const others = editionsByStatus('planned').filter((e) => e.slug !== edition.slug);
  const interestHref = `/about/contact?topic=attendance&edition=${edition.slug}`;

  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10">
          <Img src={edition.image.src} alt="" fill preload sizes="100vw" position={edition.image.position} className="object-cover opacity-65" />
          <div className="scrim-hero absolute inset-0" />
        </div>
        <Container className="flex min-h-[min(86svh,820px)] flex-col justify-end pb-16 pt-[calc(var(--header-h)+40px)]">
          <Breadcrumbs items={[{ label: 'Editions', href: '/editions' }, { label: '2027 cities', href: '/editions/2027' }, { label: edition.city }]} />
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <StatusBadge status="planned" label="Planned · 2027" />
            <span className="mono-label text-paper/70">{edition.country}</span>
          </div>
          <h1 className="display mt-6 text-[length:var(--text-display-lg)]">
            {edition.city} <span className="text-gold">2027</span>
          </h1>
          <p className="display-tight mt-4 text-[clamp(1.3rem,1rem+1.2vw,2rem)] text-paper/90">{edition.tagline}</p>
          <p className="lede mt-6 max-w-2xl text-paper/80">{edition.positioning}</p>
          <div className="mt-8 inline-flex max-w-xl items-start gap-3 rounded-xl border border-paper/20 bg-ink/60 p-4 text-sm text-paper/85 backdrop-blur-md">
            <Icon name="calendar" size={18} className="mt-0.5 shrink-0 text-gold" />
            <span>
              <strong className="text-paper">Dates to be announced.</strong> Venue, programme and speakers will be published when they are
              confirmed. Nothing on this page is a confirmed schedule.
            </span>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={interestHref} size="lg">
              Register interest
            </ButtonLink>
            <ButtonLink href="/partners/book-a-call" variant="outline" size="lg">
              Partner across the 2027 series
            </ButtonLink>
          </div>
        </Container>
      </header>

      <Section>
        <Container>
          <SectionHeader
            eyebrow={`What ${edition.city} will share with every edition`}
            title="Same standard. New city."
            lede="Each edition is its own curated room, with a guest list and programme built for its market. What stays constant is the format and the questions."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {formats.map((f, i) => (
              <li key={f.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-ink-card/50 p-6">
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <span className="text-lg font-bold leading-snug">{f.name}</span>
                <span className="text-sm leading-relaxed text-muted">{f.summary}</span>
              </li>
            ))}
          </ul>
          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div>
              <p className="mono-label">The six questions</p>
              <p className="mt-3 text-muted">The decisions every edition is built around.</p>
              <TextLink href="/program/questions" className="mt-4">
                Read the six questions
              </TextLink>
            </div>
            <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {strategicQuestions.map((q) => (
                <li key={q.number} className="bg-ink p-5">
                  <span className="font-mono text-xs text-gold">Q{q.number}</span>
                  <p className="mt-2 font-semibold leading-snug">{q.question}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {singapore?.metrics ? (
        <Section bordered tone="raised">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-end">
              <div>
                <Eyebrow>The standard we hold</Eyebrow>
                <h2 className="display mt-5 text-[length:var(--text-display-sm)]">What the first edition delivered.</h2>
                <p className="mt-5 text-muted">{singapore.summary}</p>
                <TextLink href="/editions/singapore-2026" className="mt-6">
                  The Singapore archive
                </TextLink>
              </div>
              <Stats items={singapore.metrics} size="md" source={`${singapore.name} · ${singapore.dateLabel}`} />
            </div>
          </Container>
        </Section>
      ) : null}

      <Section bordered>
        <Container>
          <SectionHeader
            eyebrow="The 2027 series"
            title="Four more cities."
            action={<ButtonLink href="/editions/2027" variant="outline">The 2027 series</ButtonLink>}
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((e) => (
              <li key={e.slug}>
                <EditionCard edition={e} size="compact" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        eyebrow={`${edition.city} 2027 · Dates to be announced`}
        title={`Be first to hear about ${edition.city}.`}
        body="Register your interest as a guest, or start a conversation about partnering across the 2027 series."
        image={{ src: edition.image.src, position: edition.image.position }}
        actions={
          <>
            <ButtonLink href={interestHref} size="lg">
              Register interest
            </ButtonLink>
            <ButtonLink href={booking.partnership.url} variant="outline" size="lg">
              {booking.partnership.label}
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
