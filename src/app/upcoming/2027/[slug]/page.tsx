import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AfHkPage } from '@/components/editions/AfHkPage';
import { Upcoming2027Page } from '@/components/editions/Upcoming2027Page';
import { contextDates, getUpcoming2027, upcoming2027 } from '@/data/upcoming-2027';
import { pageMetadata } from '@/lib/seo';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return upcoming2027.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/upcoming/2027/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const page = getUpcoming2027(slug);
  if (!page) return {};
  const dates = contextDates(page);
  return pageMetadata({
    title: page.brand === 'the-odds' ? `${page.name} 2027 · Prediction Markets Live` : `${page.name} 2027, during ${page.context}`,
    description: `${page.name}: during ${page.context}${dates ? `, ${dates}` : ''}. The exact day, venue and programme follow once confirmed.`,
    path: `/upcoming/2027/${page.slug}`,
    noindex: !page.published,
  });
}

export default async function Upcoming2027Route({ params }: PageProps<'/upcoming/2027/[slug]'>) {
  const { slug } = await params;
  const page = getUpcoming2027(slug);
  if (!page) notFound();
  // The Hong Kong page is a full landing page; the others share the compact template.
  if (page.slug === 'afhk') return <AfHkPage page={page} />;
  return <Upcoming2027Page page={page} />;
}
