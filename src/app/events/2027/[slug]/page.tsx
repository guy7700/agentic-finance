import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EventLandingPage } from '@/components/editions/EventLandingPage';
import { eventDate, getUpcoming2027ByPath, upcoming2027 } from '@/data/upcoming-2027';
import { pageMetadata } from '@/lib/seo';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return upcoming2027.map((p) => ({ slug: p.path.replace('/events/2027/', '') }));
}

export async function generateMetadata({ params }: PageProps<'/events/2027/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const page = getUpcoming2027ByPath(`/events/2027/${slug}`);
  if (!page) return {};
  const d = eventDate(page);
  return pageMetadata({
    title: `${page.name}, ${d.medium}`,
    description: `${page.name}: ${d.long}, ${d.time}${d.provisional ? ' (provisional)' : ''}, during ${page.context}. ${page.attendees ? `Up to ${page.attendees} curated attendees. ` : ''}Invitation only.`,
    path: page.path,
    noindex: !page.published,
  });
}

/** Every 2027 event page uses the Hong Kong template, filled with its own event record. */
export default async function Upcoming2027Route({ params }: PageProps<'/events/2027/[slug]'>) {
  const { slug } = await params;
  const page = getUpcoming2027ByPath(`/events/2027/${slug}`);
  if (!page) notFound();
  return <EventLandingPage event={page} />;
}
