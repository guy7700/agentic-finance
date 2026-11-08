import type { Metadata } from 'next';
import { BlogList } from '@/components/blog/BlogList';
import { PageHero } from '@/components/ui/PageHero';
import { ButtonLink } from '@/components/ui/Button';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'AI agents in finance: daily news',
  description: 'One story a day on AI agents in finance: banking, payments, trading and markets. Our summary, why it matters, and a link to the source.',
  path: '/blog',
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Blog' }]}
        eyebrow="Today in agentic finance"
        title="AI agents in finance, one story a day."
        lede="Our own summary of each story, why it matters, and a link to the original."
        actions={<ButtonLink href="/rss.xml" file variant="outline" size="sm" icon={null}>RSS feed</ButtonLink>}
      />
      <BlogList page={1} />
    </>
  );
}
