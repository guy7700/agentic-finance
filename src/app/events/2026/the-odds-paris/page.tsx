import type { Metadata } from 'next';
import { PastArchivePage } from '@/components/editions/PastArchivePage';
import { getPastArchive } from '@/data/past-archives';
import { pageMetadata } from '@/lib/seo';

const a = getPastArchive('the-odds-paris-2026')!;

export const metadata: Metadata = pageMetadata({
  title: `${a.name}, ${a.city} ${a.date}`,
  description: `${a.summary} ${a.facts.map((f) => `${f.value} ${f.label.toLowerCase()}`).join(', ')}.`,
  path: a.path,
});

export default function Page() {
  return <PastArchivePage a={a} />;
}
