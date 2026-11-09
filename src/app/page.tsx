import type { Metadata } from 'next';
import Link from 'next/link';
import { EventCalendar } from '@/components/events/EventCalendar';
import { HomeHero } from '@/components/home/HomeHero';
import { CategoryCards, FormatTiles, HomePartners, MediaTeaser, PastEditions, QuestionnaireBand, WhoWeAre } from '@/components/home/HomeSections';
import { EtoroZengoStory } from '@/components/partners/EtoroZengoStory';
import { UseCaseCard } from '@/components/partners/UseCaseCard';
import { SpeakerCard } from '@/components/speakers/SpeakerCard';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { EVENTS_YEAR, events2027 } from '@/config/events-2027';
import { primaryActions, site } from '@/config/site';
import { editions, getCurrentEdition } from '@/data/editions';
import { nextEvent, pastEvents } from '@/data/events';
import { otherUseCases, useCases } from '@/data/partners';
import { buildCalendarEvents } from '@/lib/calendar';
import { getSpeaker } from '@/lib/content';
import { absoluteUrl } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';
import { toSpeakerCard } from '@/lib/speaker-cards';

// Primary keyword: "agentic finance".
export const metadata: Metadata = pageMetadata({
  title: 'Agentic Finance: AI agents in finance summits',
  description:
    'Agentic Finance brings together the banks, investors, regulators and builders putting AI agents to work in finance. Next: Abu Dhabi, 4 December 2026.',
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

/** Home page order as set in Tal's redesign brief. */
export default function HomePage() {
  const next = getCurrentEdition();
  const featured = FEATURED_SPEAKERS.map(getSpeaker).filter((s) => s !== undefined).map((s) => toSpeakerCard(s));
  // eToro leads through the eToro and Zengo story; every other use case follows.
  const cases = [...useCases.filter((u) => u.slug !== 'etoro'), ...otherUseCases];

  return (
    <>
      {/* 1. Hero with the latest industry news */}
      <HomeHero next={next} />

      {/* 2. Partners and organisations at our conferences */}
      <HomePartners />

      {/* 3. Upcoming events */}
      <Section bordered tone="raised" id="events">
        <Container>
          <SectionHeader
            title={
              <>
                Upcoming <span className="serif-accent">events</span>
              </>
            }
            action={
              <ButtonLink href="/editions" variant="outline">
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

      {/* Where will you be in 2027? (the questionnaire) */}
      <QuestionnaireBand />

      {/* 4. Past Editions */}
      <PastEditions events={pastEvents} />

      {/* 5. Who we are */}
      <WhoWeAre />

      {/* 6. Speakers */}
      <Section bordered id="speakers">
        <Container>
          <SectionHeader
            title={
              <>
                Speakers at <span className="serif-accent">Our Events</span>
              </>
            }
            lede="Abu Dhabi speakers are announced as each one confirms."
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

      {/* 7. Topics and categories */}
      <CategoryCards />

      {/* 8. Event formats and experience */}
      <FormatTiles />

      {/* 9. Use cases */}
      <Section bordered tone="raised" id="use-cases">
        <Container>
          <SectionHeader
            title={
              <>
                Use <span className="serif-accent">cases</span>
              </>
            }
            lede="What partners got from our events."
            action={
              <ButtonLink href="/partners/use-cases" variant="outline">
                All use cases
              </ButtonLink>
            }
          />
          <div className="mt-12">
            <EtoroZengoStory />
          </div>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cases.map((u) => (
              <li key={u.slug} className="flex">
                <UseCaseCard useCase={u} className="w-full" />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 10. Media, video gallery and press coverage */}
      <MediaTeaser />

      {/* 11. Direct Abu Dhabi CTA */}
      <CtaBand
        eyebrow={`${nextEvent.name} · ${next.dateLabel}`}
        title={
          <>
            Join us in <span className="serif-accent">Abu Dhabi</span>
          </>
        }
        body={`${next.guestCount} curated guests. By invitation only.`}
        actions={
          <>
            <ButtonLink href={nextEvent.href} size="lg">
              Join us in Abu Dhabi
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
          {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: nextEvent.name,
            description: `${nextEvent.line} ${nextEvent.time}, ${nextEvent.venue}, ${nextEvent.city}.`,
            startDate: next.startDate,
            endDate: next.endDate,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: {
              '@type': 'Place',
              name: `${nextEvent.venue}, ${nextEvent.city}`,
              address: { '@type': 'PostalAddress', addressLocality: nextEvent.city, addressCountry: 'AE' },
            },
            image: [absoluteUrl('/og-image.jpg')],
            url: nextEvent.href,
            organizer: { '@type': 'Organization', name: 'More & More', url: 'https://mnm.live' },
          },
        ]}
      />
    </>
  );
}
