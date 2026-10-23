import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CompletedEdition } from '@/components/editions/CompletedEdition';
import { PlannedEdition } from '@/components/editions/PlannedEdition';
import { UpcomingEdition } from '@/components/editions/UpcomingEdition';
import { JsonLd } from '@/components/ui/JsonLd';
import { editions, getEdition } from '@/data/editions';
import type { Edition } from '@/data/types';
import { absoluteUrl } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return editions.map((e) => ({ edition: e.slug }));
}

export async function generateMetadata({ params }: PageProps<'/editions/[edition]'>): Promise<Metadata> {
  const { edition: slug } = await params;
  const e = getEdition(slug);
  if (!e) return {};
  const title =
    e.status === 'completed' ? `${e.name} 2026 · Archive` : e.status === 'planned' ? `${e.city} 2027 · Planned edition` : `${e.name} · ${e.dateLabel}`;
  return pageMetadata({
    title,
    description: e.status === 'planned' ? `${e.positioning} Dates to be announced.` : e.summary,
    path: `/editions/${e.slug}`,
  });
}

function eventJsonLd(e: Edition) {
  if (e.status === 'planned') return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.name,
    description: e.summary,
    url: absoluteUrl(`/editions/${e.slug}`),
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

export default async function EditionPage({ params }: PageProps<'/editions/[edition]'>) {
  const { edition: slug } = await params;
  const e = getEdition(slug);
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
