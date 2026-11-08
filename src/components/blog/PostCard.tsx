import Link from 'next/link';
import { formatPostDate, type DailyPost } from '@/lib/daily';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';

/** A daily post in a list: date and source, our headline, the summary and a link to the source. */
export function PostCard({ post, headingLevel = 'h3', className }: { post: DailyPost; headingLevel?: 'h2' | 'h3'; className?: string }) {
  const H = headingLevel;
  return (
    <article
      className={cn(
        'edge-gold group relative flex h-full flex-col rounded-2xl border border-line bg-ink-card p-6 transition-colors duration-500 hover:border-gold/60 sm:p-7',
        className,
      )}
    >
      <p className="mono-label">
        <time dateTime={post.date}>{formatPostDate(post)}</time> · {post.sourceName}
      </p>
      <H className="mt-3 text-xl font-medium leading-snug">
        <Link href={`/blog/${post.slug}`} className="transition-colors after:absolute after:inset-0 after:rounded-2xl group-hover:text-gold">
          {post.title}
        </Link>
      </H>
      <p className="mt-3 line-clamp-3 text-[15px] font-light leading-relaxed text-muted">{post.summary}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-5 gap-y-2 pt-5 text-[11px] font-semibold uppercase tracking-[0.18em]">
        <span aria-hidden className="flex items-center gap-1.5 text-paper/85 transition-colors group-hover:text-gold">
          Read the post
          <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-1" />
        </span>
        <a
          href={post.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex items-center gap-1.5 text-gold-bright transition-colors hover:text-paper"
        >
          {post.sourceName}
          <Icon name="arrow-up-right" size={14} />
          <span className="sr-only"> (source, opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
