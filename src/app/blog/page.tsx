import type { Metadata } from 'next';
import { BlogList } from '@/components/blog/BlogList';
import { PageHero } from '@/components/ui/PageHero';
import { absoluteUrl } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';

const meta = pageMetadata({
  title: 'AI agents in finance: daily news',
  description: 'One story a day on AI agents in finance: banking, payments, trading and markets. Our summary, why it matters, and a link to the source.',
  path: '/blog',
});

// The RSS feed stays available to feed readers through this <link>; there is no on-page RSS button.
export const metadata: Metadata = {
  ...meta,
  alternates: { ...meta.alternates, types: { 'application/rss+xml': absoluteUrl('/rss.xml') } },
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Blog' }]}
        eyebrow="Today in agentic finance"
        title="AI agents in finance, one story a day."
        lede="Our own summary of each story, why it matters, and a link to the original."
      />
      <BlogList page={1} />
    </>
  );
}
