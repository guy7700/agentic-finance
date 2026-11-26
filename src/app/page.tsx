import type { Metadata } from 'next';
import Link from 'next/link';
import { EventCalendar } from '@/components/events/EventCalendar';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeIndex, HomeLive, HomeNetwork, HomePartners, MediaTeaser, PastEditions, QuestionnaireBand, WhoWeAre } from '@/components/home/HomeSections';
import { SpeakerCard } from '@/components/speakers/SpeakerCard';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { EVENTS_YEAR, events2027 } from '@/config/events-2027';
import { primaryActions, site } from '@/config/site';
import { editions, getEdition } from '@/data/editions';
import { nextEvent, pastEvents } from '@/data/events';
import { buildCalendarEvents } from '@/lib/calendar';
import { getSpeaker } from '@/lib/content';
import { absoluteUrl } from '@/lib/paths';
import { getOgCard } from '@/lib/og/cards';
import { ogImage, pageMetadata } from '@/lib/seo';
import { toSpeakerCard } from '@/lib/speaker-cards';

// Primary keyword: "agentic finance".
export const metadata: Metadata = pageMetadata({
  title: 'Agentic Finance: AI agents in finance summits',
  description:
    `Agentic Finance brings together the banks, investors, regulators and builders putting AI agents to work in finance. Next: ${nextEvent.city}, ${nextEvent.date.replace(/^[A-Z][a-z]+day /, '')}.`,
  path: '/',
});

// Twelve speakers: two rows of six on desktop.
const FEATURED_SPEAKERS = [
  'yoni-assia',
  'mark-willis',
  'scott-lawin',
  'stani-kulechov',
  'johann-eid',
  'anton-ruddenklau',
  'yoshi-yokokawa',
  'itai-turbahn',
  'cj-hetherington',
  'megan-otway',
  'dan-sun',
  'joanna-ossinger',
];

/**
 * Home page in the order of Tal's site structure (23 Nov 2026): hero (news or the next event),
 * upcoming events, Network, Live, Index, past events, speakers and partner logos, who we are.
 * Moved off the home page: topics and categories (/network/companies#categories, /about#topics),
 * event formats (/about#formats), use cases and the eToro and Zengo story (/partners#case-studies).
 */
export default function HomePage() {
  // The next event (src/data/events.ts) and its edition, for the hero, the share card and the closing band.
  const next = getEdition(nextEvent.id);
  if (!next) throw new Error(`Home page: no edition for the next event "${nextEvent.id}".`);
  const eventCard = getOgCard(`${next.path}`);
  const featured = FEATURED_SPEAKERS.map(getSpeaker).filter((s) => s !== undefined).map((s) => toSpeakerCard(s));

  return (
    <>
      {/* 1. Hero: headline, next event, the 3 latest news items or the next event */}
      <HomeHero next={next} />

      {/* 2. Upcoming events, then the 2027 questionnaire */}
      <Section bordered tone="raised" id="events">
        <Container>
          <SectionHeader
            title={
              <>
                Upcoming <span className="serif-accent">events</span>
              </>
            }
            action={
              <ButtonLink href="/events" variant="outline">
                All Editions
              </ButtonLink>
            }
          />
          <EventCalendar events={buildCalendarEvents({ nextEvent, editions, events: events2027, year: EVENTS_YEAR })} className="mt-12" />
          <p className="mt-6 text-[13px] text-subtle">
            City photos:{' '}
            <Link href="/photo-credits" className="text-gold underline decoration-gold/40 underline-offset-4 hover:text-gold-bright">
              photo credits
            </Link>
            .
          </p>
        </Container>
      </Section>

      <QuestionnaireBand />

      {/* 3. Network: one card per audience, linking to its form */}
      <HomeNetwork />

      {/* 4. Live: latest X Space or webinar, newsletter signup */}
      <HomeLive />

      {/* 5. Index: AF100 preview */}
      <HomeIndex />

      {/* 6. Past events: recap films, then video, photos and press */}
      <PastEditions events={pastEvents} />
      <MediaTeaser />

      {/* 7. Speakers and partner logos */}
      <Section bordered id="speakers">
        <Container>
          <SectionHeader
            title={
              <>
                Speakers at <span className="serif-accent">Our Events</span>
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
          <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6">
            {featured.map((s) => (
              <li key={s.slug}>
                <SpeakerCard speaker={s} sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <HomePartners />

      {/* 8. Who we are, short, linking to /about */}
      <WhoWeAre />

      {/* Direct CTA for the next event */}
      <CtaBand
        eyebrow={`${nextEvent.name} · ${nextEvent.date}`}
        title={
          <>
            Join us in <span className="serif-accent">{nextEvent.city}</span>
          </>
        }
        body={nextEvent.line}
        actions={
          <>
            <ButtonLink href={nextEvent.href} size="lg">
              Join us in {nextEvent.city}
            </ButtonLink>
            <ButtonLink href={primaryActions.partner.href} variant="outline" size="lg">
              {primaryActions.partner.label}
            </ButtonLink>
          </>
        }
      />

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: site.name,
            url: absoluteUrl('/'),
            publisher: { '@id': `${absoluteUrl('/')}#organization` },
          },
          // An Event needs a start date; without one the home page describes only the site.
          ...(nextEvent.start
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'Event',
                  name: nextEvent.name,
                  description: `${nextEvent.line} ${[nextEvent.time, nextEvent.venue, nextEvent.city].filter(Boolean).join(', ')}.`,
                  startDate: nextEvent.start,
                  endDate: nextEvent.end,
                  eventStatus: 'https://schema.org/EventScheduled',
                  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                  location: {
                    '@type': 'Place',
                    name: [nextEvent.venue, nextEvent.city].filter(Boolean).join(', '),
                    address: { '@type': 'PostalAddress', addressLocality: nextEvent.city },
                  },
                  image: [eventCard ? ogImage(eventCard).url : absoluteUrl(next.image.src)],
                  url: nextEvent.href.startsWith('/') ? absoluteUrl(nextEvent.href) : nextEvent.href,
                  organizer: { '@type': 'Organization', name: 'More & More', url: 'https://mnm.live' },
                },
              ]
            : []),
        ]}
      />
    </>
  );
}
