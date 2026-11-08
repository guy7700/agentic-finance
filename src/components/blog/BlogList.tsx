import Link from 'next/link';
import { BLOG_PAGE_SIZE, blogPageCount, getPosts } from '@/lib/daily';
import { cn } from '@/lib/cn';
import { Container, Section } from '../ui/Layout';
import { PostCard } from './PostCard';

export const blogPageHref = (page: number) => (page <= 1 ? '/blog' : `/blog/page/${page}`);

/** One page of the blog index, with numbered pagination. */
export function BlogList({ page }: { page: number }) {
  const posts = getPosts().slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE);
  const pages = blogPageCount();
  return (
    <Section>
      <Container>
        {posts.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="lede">The first daily post is on its way.</p>
        )}
        {pages > 1 ? (
          <nav aria-label="Blog pages" className="mt-14 flex flex-wrap items-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={blogPageHref(n)}
                aria-current={n === page ? 'page' : undefined}
                className={cn(
                  'inline-flex size-11 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                  n === page ? 'border-gold text-gold' : 'border-line-strong text-paper/85 hover:border-paper',
                )}
              >
                <span className="sr-only">Page </span>
                {n}
              </Link>
            ))}
          </nav>
        ) : null}
      </Container>
    </Section>
  );
}
