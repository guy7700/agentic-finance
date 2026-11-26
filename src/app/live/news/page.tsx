import type { Metadata } from 'next';
import { BlogList } from '@/components/blog/BlogList';
import { LiveNav } from '@/components/live/LiveNav';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/seo';

// No RSS feed: Tal's feedback (24 Nov 2026) removed /rss.xml.
export const metadata: Metadata = pageMetadata({
  title: 'AI agents in finance: daily news',
  description: 'One story a day on AI agents in finance: banking, payments, trading and markets. Our summary, why it matters, and a link to the source.',
  path: '/live/news',
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Live', href: '/live' }, { label: 'News' }]}
        eyebrow="Today in agentic finance"
        title="AI agents in finance, one story a day."
        lede="Our own summary of each story, why it matters, and a link to the original."
        footer={<LiveNav current="news" />}
      />
      <BlogList page={1} />
    </>
  );
}
