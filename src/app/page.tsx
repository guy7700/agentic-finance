import type { Metadata } from 'next';
import { HomeHero } from '@/components/home/HomeHero';
import {
  EtoroStory,
  HomeLive,
  HomeLogoStrip,
  HomeNetwork,
  HomeSpeakers,
  NextEditions,
  PartnerBenefits,
  PastEditions,
  WhoWeAre,
} from '@/components/home/HomeSections';
import { JsonLd } from '@/components/ui/JsonLd';
import { site } from '@/config/site';
import { getEdition } from '@/data/editions';
import { nextEvent, pastEvents } from '@/data/events';
import { absoluteUrl } from '@/lib/paths';
import { getOgCard } from '@/lib/og/cards';
import { ogImage, pageMetadata } from '@/lib/seo';

// Primary keyword: "agentic finance".
export const metadata: Metadata = pageMetadata({
  title: 'Agentic Finance: where the leaders of AI and finance meet',
  description: `Invitation-only summits for financial institutions, investors and the companies building AI for finance. Next: ${nextEvent.name}, ${nextEvent.date.replace(/^[A-Z][a-z]+day /, '')}.`,
  path: '/',
});

// Sixteen speakers from every edition: two rows of eight on desktop.
const FEATURED_SPEAKERS = [
  'yoni-assia', 'mark-willis', 'scott-lawin', 'stani-kulechov', 'johann-eid', 'anton-ruddenklau', 'yoshi-yokokawa', 'itai-turbahn',
  'cj-hetherington', 'megan-otway', 'dan-sun', 'joanna-ossinger', 'ouriel-ohayon', 'omri-ross', 'ran-goldi', 'stephen-humenik',
];

/**
 * Home page, in the order of Tal's review (26 Nov 2026): hero with the next event and the featured
 * story, partner logos, the 2027 editions, past editions, speakers, the Network, what partners
 * receive, the eToro story, who we are and Live. The Index, media and closing band left the page:
 * the Index is in the menu, media and press under About.
 */
export default function HomePage() {
  const next = getEdition(nextEvent.id);
  const eventCard = getOgCard(nextEvent.href);

  return (
    <>
      <HomeHero />
      <HomeLogoStrip />
      <NextEditions />
      <PastEditions events={pastEvents} />
      <HomeSpeakers slugs={FEATURED_SPEAKERS} />
      <HomeNetwork />
      <PartnerBenefits />
      <EtoroStory />
      <WhoWeAre />
      <HomeLive />

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
                  image: [eventCard ? ogImage(eventCard).url : absoluteUrl(next?.image.src ?? '/og-image.jpg')],
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
