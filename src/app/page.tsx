import type { Metadata } from 'next';
import { NextEventCard, PastEventCard, PlannedEventList } from '@/components/home/HomeEvents';
import { HomeHero } from '@/components/home/HomeHero';
import { LatestNews } from '@/components/home/LatestNews';
import { EtoroZengoStory } from '@/components/partners/EtoroZengoStory';
import { PartnerLogoStrip } from '@/components/partners/PartnerLogoStrip';
import { UseCaseCard } from '@/components/partners/UseCaseCard';
import { QuestionsEditorial } from '@/components/program/QuestionsEditorial';
import { SpeakerCard } from '@/components/speakers/SpeakerCard';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { externalLinks, primaryActions, site } from '@/config/site';
import { getCurrentEdition } from '@/data/editions';
import { nextEvent, pastEvents, plannedEvents } from '@/data/events';
import { featuredOnStage, getOrganization, otherUseCases, useCases } from '@/data/partners';
import { strategicQuestions } from '@/data/program';
import { getSession, getSpeaker } from '@/lib/content';
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

const FEATURED_SPEAKERS = [
  'yoni-assia',
  'mark-willis',
  'scott-lawin',
  'stani-kulechov',
  'johann-eid',
  'anton-ruddenklau',
  'yoshi-yokokawa',
  'megan-otway',
  'itai-turbahn',
  'joanna-ossinger',
];

export default function HomePage() {
  const next = getCurrentEdition();
  const featured = FEATURED_SPEAKERS.map(getSpeaker).filter((s) => s !== undefined).map((s) => toSpeakerCard(s));
  const onStage = featuredOnStage.map(getOrganization).filter((o) => o !== undefined);
  // eToro leads through the eToro and Zengo story; every other use case follows.
  const cases = [...useCases.filter((u) => u.slug !== 'etoro'), ...otherUseCases];
  const questions = strategicQuestions.map((q) => ({ ...q, sessionTitle: q.session ? getSession(q.session)?.title : undefined }));

  return (
    <>
      <HomeHero next={next} />

      <LatestNews />

      {/* Events: upcoming first, then the record */}
      <Section id="events">
        <Container>
          <SectionHeader title={<>Upcoming <span className="serif-accent">events</span></>} action={<ButtonLink href="/editions" variant="outline">All editions</ButtonLink>} />
          <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <NextEventCard event={nextEvent} />
            <PlannedEventList events={plannedEvents} />
          </div>
          <h3 className="display mt-20 text-[length:var(--text-display-sm)]">
            Past <span className="serif-accent">events</span>
          </h3>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((e) => (
              <li key={e.id}>
                <PastEventCard event={e} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Use cases */}
      <Section bordered tone="raised" id="use-cases">
        <Container>
          <SectionHeader
            title={<>Use <span className="serif-accent">cases</span></>}
            lede="What partners got from our events."
            action={<ButtonLink href="/partners/use-cases" variant="outline">All use cases</ButtonLink>}
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

      {/* Main themes */}
      <Section bordered id="questions">
        <Container>
          <SectionHeader title={<>Main <span className="serif-accent">themes</span></>} action={<ButtonLink href="/program/questions" variant="outline">Explore the themes</ButtonLink>} />
          <div className="mt-14">
            <QuestionsEditorial questions={questions} variant="compact" />
          </div>
        </Container>
      </Section>

      {/* Speakers */}
      <Section bordered tone="raised" id="speakers">
        <Container>
          <SectionHeader
            title={<>Speakers at <span className="serif-accent">our events</span></>}
            lede="Abu Dhabi speakers are announced as each one confirms."
            action={
              <>
                <ButtonLink href="/speakers" variant="outline">All speakers</ButtonLink>
                <ButtonLink href="/speakers/nominate" variant="outline">Nominate a speaker</ButtonLink>
              </>
            }
          />
          <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-5">
            {featured.map((s) => (
              <li key={s.slug}>
                <SpeakerCard speaker={s} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Partner logo strip */}
      <Section bordered aria-labelledby="partners-heading" className="!py-16 sm:!py-20">
        <Container>
          <h2 id="partners-heading" className="sr-only">
            Organisations on our stages
          </h2>
          <PartnerLogoStrip items={onStage} />
        </Container>
      </Section>

      {/* About: who, goals, what is next */}
      <Section bordered id="about">
        <Container>
          <h2 className="display text-[length:var(--text-display-md)]">
            About <span className="serif-accent">Agentic Finance</span>
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="eyebrow">Who is behind it</h3>
              <p className="mt-4 text-lg font-light leading-relaxed text-paper/90">
                Agentic Finance is produced by{' '}
                <a href={externalLinks.moreAndMore} target="_blank" rel="noopener noreferrer" className="link-underline text-gold hover:text-gold-bright">
                  More &amp; More
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                , which runs curated summits and side events across technology and finance.
              </p>
            </div>
            <div>
              <h3 className="eyebrow">Our goal</h3>
              <p className="mt-4 text-lg font-light leading-relaxed text-paper/90">
                Bring the decision-makers, founders, investors and regulators shaping how AI agents change finance into one room.
              </p>
            </div>
            <div>
              <h3 className="eyebrow">What is next</h3>
              <p className="mt-4 text-lg font-light leading-relaxed text-paper/90">
                Abu Dhabi on 4 December 2026. In 2027: Hong Kong, Dubai, Paris, Rio de Janeiro and Singapore.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={`${nextEvent.name} · ${next.dateLabel}`}
        title={<>Join us in <span className="serif-accent">Abu Dhabi</span></>}
        body={`${next.guestCount} curated guests. By invitation only.`}
        actions={
          <>
            <ButtonLink href={primaryActions.invitation.href} size="lg">
              {primaryActions.invitation.label}
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
