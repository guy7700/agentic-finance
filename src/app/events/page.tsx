import type { Metadata } from 'next';
import Link from 'next/link';
import { EventTabs } from '@/components/editions/EventTabs';
import { ApplyButton } from '@/components/events/ApplyButton';
import { PastEventCard } from '@/components/home/HomeSections';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { primaryActions } from '@/config/site';
import { pastEvents } from '@/data/events';
import { eventDate, nextEdition2027, upcoming2027 } from '@/data/upcoming-2027';
import { pageMetadata } from '@/lib/seo';

const next = nextEdition2027();

export const metadata: Metadata = pageMetadata({
  title: 'Our events: Agentic Finance worldwide',
  description: `Face-to-face gatherings around the world, alongside the industry's major weeks. Next: ${next.name}, ${eventDate(next).medium}. Then Cannes, Dubai, Miami, Paris and Singapore in 2027.`,
  path: '/events',
});

/**
 * Our Events (Tal's review, 26 Nov 2026): Upcoming (the 2027 editions, Hong Kong first) and Past
 * (all three past editions). No status tags, no fixed city count, no "three states".
 */
export default function EventsPage() {
  const d = eventDate(next);
  const later = upcoming2027.filter((e) => e !== next);

  const upcomingTab = (
    <>
      <article className="edge-gold relative isolate grid overflow-hidden rounded-2xl border border-gold/60 bg-ink-card lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="relative min-h-[300px]">
          <Img src={next.image.src} alt={next.image.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" position={next.image.position} className="object-cover" />
          <span className="absolute left-5 top-5 rounded-full bg-gold px-3 py-1.5 font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-ink">Next event</span>
        </div>
        <div className="flex flex-col p-7 sm:p-9">
          <p className="mono-label text-gold">During {next.context}</p>
          <h3 className="display mt-3 text-[clamp(2rem,1.5rem+1.8vw,3rem)]">{next.name}</h3>
          <ul className="mt-5 flex flex-col gap-2 text-paper/90">
            <li className="flex items-center gap-2.5">
              <Icon name="calendar" size={16} className="text-gold" />
              {d.long} · {d.time}
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="pin" size={16} className="text-gold" />
              {next.city}
            </li>
            <li className="flex items-center gap-2.5">
              <Icon name="users" size={16} className="text-gold" />
              {next.attendees ? `Up to ${next.attendees} curated attendees · ` : ''}Invitation only
            </li>
          </ul>
          <div className="mt-auto flex flex-wrap gap-3 pt-8">
            <ApplyButton event={next} />
            <ButtonLink href={next.path} variant="outline" size="lg">
              Event details
            </ButtonLink>
          </div>
        </div>
      </article>

      <div className="mt-14">
        <SectionHeader
          eyebrow="2027 Global Exposure"
          title="Our next editions."
          lede="Each edition runs alongside a major industry week. A date marked provisional is confirmed here first."
          action={
            <ButtonLink href="/events/2027" variant="outline">
              Where are we heading in 2027?
            </ButtonLink>
          }
          size="md"
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {later.map((e) => {
            const ed = eventDate(e);
            return (
              <li key={e.slug}>
                <Link href={e.path} className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-line p-5 transition-colors hover:border-gold/60">
                  <Img src={e.image.src} alt="" fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw" position={e.image.position} className="-z-20 object-cover transition-transform duration-1000 group-hover:scale-[1.05]" />
                  <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-gold-bright">
                    {ed.medium}
                    {ed.provisional ? ' · Provisional' : ''}
                  </span>
                  <span className="mt-1 text-2xl font-semibold">{e.city}</span>
                  <span className="mt-1 text-sm text-paper/80">During {e.context}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );

  const pastTab = (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pastEvents.map((e) => (
          <li key={e.id}>
            <PastEventCard event={e} />
          </li>
        ))}
      </ul>
      <p className="mt-8 text-muted">
        Selected recent editions from a broader track record of more than 100 events organised by More &amp; More.{' '}
        <Link href="/about/more-and-more" className="text-gold hover:text-gold-bright">
          About us
        </Link>
      </p>
    </>
  );

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Events' }]}
        eyebrow="Events"
        title="Our Events"
        lede="We organise face-to-face gatherings around the world, at least 15 a year: invitation-only summits, closed-door dinners and side events alongside the industry’s major weeks."
        actions={
          <>
            <ButtonLink href={`${next.path}#join`}>Apply to attend {next.city}</ButtonLink>
            <ButtonLink href={primaryActions.partner.href} variant="outline">
              {primaryActions.partner.label}
            </ButtonLink>
          </>
        }
      />

      <Section className="!pt-14">
        <Container>
          <h2 className="sr-only">Upcoming and past events</h2>
          <EventTabs
            label="Events"
            tabs={[
              { id: 'upcoming', label: 'Upcoming', count: upcoming2027.length, content: upcomingTab },
              { id: 'past', label: 'Past', count: pastEvents.length, content: pastTab },
            ]}
          />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
