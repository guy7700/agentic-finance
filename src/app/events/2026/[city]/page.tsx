import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CompletedEdition } from '@/components/editions/CompletedEdition';
import { PlannedEdition } from '@/components/editions/PlannedEdition';
import { UpcomingEdition } from '@/components/editions/UpcomingEdition';
import { JsonLd } from '@/components/ui/JsonLd';
import { cityParams, getEditionByPath } from '@/data/editions';
import type { Edition } from '@/data/types';
import { absoluteUrl } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return cityParams(2026);
}

export async function generateMetadata({ params }: PageProps<'/events/2026/[city]'>): Promise<Metadata> {
  const { city } = await params;
  const e = getEditionByPath(`/events/2026/${city}`);
  if (!e) return {};
  // Primary keywords: "fintech conference Abu Dhabi" for the next edition, "finance AI summit" for the archive.
  const title =
    e.status === 'upcoming'
      ? `Fintech conference ${e.city}: Agentic Finance Summit`
      : e.status === 'completed'
        ? `Finance AI summit: ${e.name} ${e.year}`
        : `${e.name} ${e.year}${e.context ? `, during ${e.context}` : ''}`;
  const description =
    e.status === 'upcoming'
      ? `${e.name}: an invitation-only fintech conference on AI agents in finance. ${e.dateLabel}, ${e.venue?.name}. ${e.guestCount} curated guests.`
      : e.status === 'completed'
        ? `The first Agentic Finance Summit, a finance AI summit in ${e.city} on ${e.dateLabel} during ${e.context}: ${(e.metrics ?? []).slice(0, 2).map((m) => `${m.value} ${m.label.toLowerCase()}`).join(' and ')}.`
        : `${e.name}: ${e.dateLabel}${e.context ? `, during ${e.context}` : ''}. AI agents in finance, with exact dates and venue to follow.`;
  return pageMetadata({
    title,
    // Link previews show the event itself; the search title keeps its keywords.
    socialTitle: e.status === 'planned' ? undefined : `${e.name} · ${e.dateLabel}`,
    description,
    path: `${e.path}`,
  });
}

function eventJsonLd(e: Edition) {
  if (e.status === 'planned') return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.name,
    description: e.summary,
    url: absoluteUrl(`${e.path}`),
    image: [absoluteUrl(e.image.src)],
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    ...(e.startDate ? { startDate: e.startDate, endDate: e.endDate } : {}),
    location: {
      '@type': 'Place',
      name: e.venue?.name ?? e.city,
      address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: e.country, ...(e.venue?.address ? { streetAddress: e.venue.address } : {}) },
    },
    organizer: { '@type': 'Organization', name: 'More & More', url: 'https://mnm.live' },
  };
}

export default async function EditionPage({ params }: PageProps<'/events/2026/[city]'>) {
  const { city } = await params;
  const e = getEditionByPath(`/events/2026/${city}`);
  if (!e) notFound();
  // An event without a confirmed start date is not eligible for Event rich results.
  const ld = e.startDate ? eventJsonLd(e) : null;
  return (
    <>
      {e.status === 'upcoming' ? <UpcomingEdition edition={e} /> : null}
      {e.status === 'completed' ? <CompletedEdition edition={e} /> : null}
      {e.status === 'planned' ? <PlannedEdition edition={e} /> : null}
      {ld ? <JsonLd data={ld} /> : null}
    </>
  );
}
