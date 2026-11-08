import Link from 'next/link';
import { formatPostDate, type DailyPost } from '@/lib/daily';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

export type PostCardVariant = 'default' | 'feature' | 'compact';

/** Where the soft gold light sits in the fallback visual, varied per post so a page of them never repeats. */
const GLOWS = ['88% 0%', '0% 100%', '100% 100%', '12% 0%'];

function glowFor(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return GLOWS[h % GLOWS.length];
}

/**
 * The post's image when we own or license one. Otherwise a designed panel:
 * navy and gold, with the source name and date set in type. Never a stock or
 * event photo, which would imply a link to the story that does not exist.
 */
function PostVisual({ post, variant, sizes }: { post: DailyPost; variant: PostCardVariant; sizes: string }) {
  if (post.image) {
    return (
      <Img
        src={post.image.src}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
      />
    );
  }
  return (
    <div
      aria-hidden
      className={cn('absolute inset-0 flex flex-col justify-between', variant === 'compact' ? 'p-3' : 'p-5 sm:p-7')}
      style={{
        background: `radial-gradient(120% 95% at ${glowFor(post.slug)}, rgb(209 182 121 / 0.24), transparent 62%), linear-gradient(155deg, var(--color-ink-raised), var(--color-ink-card))`,
      }}
    >
      <span className="hairline-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_75%)]" />
      {variant === 'compact' ? null : (
        <span className="relative flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-gold-bright">
          <span className="h-px w-6 bg-gold-bright/60" />
          {formatPostDate(post)}
        </span>
      )}
      <span
        className={cn(
          'serif-figure relative block leading-[0.95] [overflow-wrap:anywhere]',
          variant === 'compact' ? 'text-lg' : variant === 'feature' ? 'text-[clamp(2.5rem,1.6rem+3vw,4.5rem)]' : 'text-[clamp(2rem,1.6rem+1.4vw,2.75rem)]',
        )}
      >
        {post.sourceName}
      </span>
    </div>
  );
}

type PostCardProps = {
  post: DailyPost;
  headingLevel?: 'h2' | 'h3';
  className?: string;
  /** "feature" leads a listing with a large image; "compact" is a small row for tight spaces such as the home hero. */
  variant?: PostCardVariant;
};

/** A daily post in a list: an image (or a designed fallback), date and source, our headline, the summary and a link to the source. */
export function PostCard({ post, headingLevel = 'h3', className, variant = 'default' }: PostCardProps) {
  const H = headingLevel;
  const meta = (
    <p className={cn('mono-label', variant === 'compact' && 'text-[10px]')}>
      <time dateTime={post.date}>{formatPostDate(post)}</time> · {post.sourceName}
    </p>
  );
  const title = (
    <Link href={`/blog/${post.slug}`} className="transition-colors after:absolute after:inset-0 after:z-[1] after:rounded-2xl group-hover:text-gold">
      {post.title}
    </Link>
  );

  if (variant === 'compact') {
    return (
      <article
        className={cn(
          'edge-gold group relative flex items-center gap-4 rounded-2xl border border-line bg-ink-card p-3 pr-4 transition-colors duration-500 before:z-[2] hover:border-gold/60',
          className,
        )}
      >
        <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl border border-line sm:w-28">
          <PostVisual post={post} variant="compact" sizes="112px" />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5 py-1">
          {meta}
          <H className="line-clamp-3 text-[15px] font-medium leading-snug">{title}</H>
        </div>
      </article>
    );
  }

  const feature = variant === 'feature';
  return (
    <article
      className={cn(
        'edge-gold group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-card transition-colors duration-500 before:z-[2] hover:border-gold/60',
        feature && 'md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]',
        className,
      )}
    >
      <div className={cn('relative aspect-[16/9] overflow-hidden border-b border-line', feature && 'md:aspect-auto md:min-h-[380px] md:border-b-0 md:border-r')}>
        <PostVisual
          post={post}
          variant={variant}
          sizes={feature ? '(min-width: 768px) 55vw, 100vw' : '(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw'}
        />
      </div>
      <div className={cn('flex flex-1 flex-col p-6 sm:p-7', feature && 'lg:p-10')}>
        {meta}
        <H className={cn('mt-3 font-medium leading-snug', feature ? 'text-2xl sm:text-3xl' : 'text-xl')}>{title}</H>
        <p className={cn('mt-3 text-[15px] font-light leading-relaxed text-muted', feature ? 'line-clamp-5 sm:text-base' : 'line-clamp-3')}>{post.summary}</p>
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
      </div>
    </article>
  );
}
