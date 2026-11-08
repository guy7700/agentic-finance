import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogList, blogPageHref } from '@/components/blog/BlogList';
import { PageHero } from '@/components/ui/PageHero';
import { blogPageCount } from '@/lib/daily';
import { pageMetadata } from '@/lib/seo';

// Page 1 is /blog. Every later page is generated at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  const pages = Array.from({ length: blogPageCount() - 1 }, (_, i) => ({ page: String(i + 2) }));
  // A static export needs at least one path; "2" renders a 404 until the blog has a second page.
  return pages.length ? pages : [{ page: '2' }];
}

export async function generateMetadata({ params }: PageProps<'/blog/page/[page]'>): Promise<Metadata> {
  const { page } = await params;
  return pageMetadata({
    title: `AI agents in finance: daily news, page ${page}`,
    description: `Page ${page} of our daily posts on AI agents in finance: our summary, why it matters, and a link to the source.`,
    path: blogPageHref(Number(page)),
  });
}

export default async function BlogPagedPage({ params }: PageProps<'/blog/page/[page]'>) {
  const { page } = await params;
  const n = Number(page);
  if (!Number.isInteger(n) || n < 2 || n > blogPageCount()) notFound();
  return (
    <>
      <PageHero size="md" crumbs={[{ label: 'Blog', href: '/blog' }, { label: `Page ${n}` }]} title={`Daily posts, page ${n}.`} />
      <BlogList page={n} />
    </>
  );
}
