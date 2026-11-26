import Link from 'next/link';
import type { Metadata } from 'next';
import { EventCalendar } from '@/components/events/EventCalendar';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { EVENTS_YEAR, events2027 } from '@/config/events-2027';
import { primaryActions } from '@/config/site';
import { editions } from '@/data/editions';
import { nextEvent } from '@/data/events';
import { contextDates, eventDate, upcoming2027 } from '@/data/upcoming-2027';
import { buildCalendarEvents, type CalendarEvent } from '@/lib/calendar';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Where are we heading in 2027?',
  description: `Agentic Finance in 2027: ${upcoming2027.map((e) => e.city).join(', ')}, each during a major industry week, and the conferences we are watching around the world.`,
  path: '/events/2027',
});

/** Our 2027 editions as calendar entries, next to the industry's events. */
function ourEditions(): CalendarEvent[] {
  return upcoming2027.map((e) => {
    const d = eventDate(e);
    const day = e.startsAt.slice(0, 10) as CalendarEvent['start'];
    return {
      id: e.editionSlug,
      kind: 'summit',
      ours: true,
      name: e.name,
      short: 'Agentic Finance',
      start: day,
      end: day,
      month: e.startsAt.slice(0, 7) as CalendarEvent['month'],
      dateLabel: d.provisional ? `${d.medium} (provisional)` : d.long,
      year: 2027,
      time: d.time,
      city: e.city,
      country: e.country,
      label: 'Agentic Finance',
      line: `During ${e.context}.`,
      href: e.path,
      cta: 'Event page',
      image: e.image,
      status: 'planned',
      badge: d.provisional ? 'Provisional' : undefined,
      featured: false,
    };
  });
}

/**
 * The 2027 yearly overview (Tal, 26 Nov 2026: "Where are we heading in 2027?"): our editions,
 * the international conferences around them, and the questionnaire for suggesting where to meet.
 * It is not a second Events page: the editions link to their own pages.
 */
export default function Year2027Page() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Events', href: '/events' }, { label: '2027' }]}
        eyebrow="2027 Global Exposure"
        title={
          <>
            Where are we heading in <span className="text-gold">2027?</span>
          </>
        }
        lede="Our editions follow the industry’s major weeks, from Asia to Europe, the Gulf and the Americas. Here is the year: where we will be, and the conferences around us."
        actions={
          <>
            <ButtonLink href="/events/2027/meetings">Tell us where you’ll be</ButtonLink>
            <ButtonLink href={primaryActions.partner.href} variant="outline">
              {primaryActions.partner.label}
            </ButtonLink>
          </>
        }
      />

      <Section className="!pt-14">
        <Container>
          <SectionHeader eyebrow="Our editions" title="Six rooms, one year." lede="A date marked provisional is confirmed on the event’s page first." size="md" />
          <ol className="mt-10 flex flex-col border-t border-line">
            {upcoming2027.map((e, i) => {
              const d = eventDate(e);
              const anchor = contextDates(e);
              return (
                <li key={e.slug} className="border-b border-line">
                  <Link href={e.path} className="group grid items-center gap-4 py-5 sm:grid-cols-[56px_120px_minmax(0,1fr)_auto] sm:gap-6">
                    <span className="font-mono text-sm text-gold">0{i + 1}</span>
                    <span className="relative hidden aspect-[4/3] w-[120px] overflow-hidden rounded-lg border border-line sm:block">
                      <Img src={e.image.src} alt="" fill sizes="120px" position={e.image.position} className="object-cover" />
                    </span>
                    <span>
                      <span className="block text-xl font-semibold group-hover:text-gold">{e.name}</span>
                      <span className="mt-1 block text-[15px] text-muted">
                        During {e.context}
                        {anchor ? `, ${anchor}` : ''}
                      </span>
                    </span>
                    <span className="flex items-center gap-3 sm:justify-end">
                      <span className="text-right">
                        <span className="block font-mono text-[12px] uppercase tracking-[0.08em] text-paper/90">{d.medium}</span>
                        {d.provisional ? <span className="block font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold">Provisional</span> : null}
                      </span>
                      <Icon name="arrow-right" size={18} className="text-gold transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Container>
      </Section>

      <Section bordered tone="raised" id="calendar">
        <Container>
          <SectionHeader
            eyebrow="The 2027 calendar"
            title="The conferences around us."
            lede="The international events our community attends, with our own editions. Going to one of them? Tell us, and we set up meetings around it."
          />
          <EventCalendar
            events={buildCalendarEvents({ nextEvent, editions, events: events2027, year: EVENTS_YEAR, alsoOurs: ourEditions() })}
            className="mt-12"
          />
          <p className="mt-6 text-[13px] text-subtle">
            City photos:{' '}
            <Link href="/photo-credits" className="text-gold underline decoration-gold/40 underline-offset-4 hover:text-gold-bright">
              photo credits
            </Link>
            .
          </p>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <div className="flex flex-col gap-6 rounded-2xl border border-gold/40 bg-gold/[0.05] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <p className="display-tight text-[clamp(1.5rem,1.2rem+1vw,2.2rem)]">Where should we go next?</p>
              <p className="mt-2 max-w-xl text-muted">Suggest a city or a conference for an Agentic Finance edition, and tell us who you want to meet there.</p>
            </div>
            <ButtonLink href="/events/2027/meetings" size="lg">
              Tell us where you’ll be
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
