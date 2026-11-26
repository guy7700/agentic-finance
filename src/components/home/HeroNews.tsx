import Link from 'next/link';
import type { ReactNode } from 'react';
import { HERO_NEWS_FRESH_MS, formatPostDate, postTime, type DailyPost } from '@/lib/daily';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { FreshOnly } from './FreshOnly';

const publishedAt = (p: DailyPost) => new Date(postTime(p)).toISOString();

/**
 * The 3 latest industry stories inside the hero: date, source, our headline and a
 * link to the original. When nothing is new in 7 days, the fallback (the next
 * event) takes their place.
 */
export function HeroNews({ posts, fallback }: { posts: DailyPost[]; fallback: ReactNode }) {
  return (
    <FreshOnly publishedAt={publishedAt(posts[0])} maxAgeMs={HERO_NEWS_FRESH_MS} fallback={fallback}>
      <section
        aria-labelledby="hero-news"
        className="edge-gold relative rounded-2xl border border-line-strong bg-ink-card/80 p-5 backdrop-blur-md sm:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="hero-news" className="eyebrow">
            Latest news
          </h2>
          <Link href="/live/news" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/80 transition-colors hover:text-gold">
            All news
          </Link>
        </div>
        <ul className="mt-4 flex flex-col divide-y divide-line">
          {posts.map((p) => (
            <li key={p.slug} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              {p.image ? (
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                  <Img src={p.image.src} alt={p.image.alt} fill sizes="64px" className="object-cover" />
                </div>
              ) : null}
              <div className="min-w-0">
                <p className="mono-label">
                  <time dateTime={p.date}>{formatPostDate(p)}</time> · {p.sourceName}
                </p>
                <h3 className="mt-1.5 text-[17px] font-medium leading-snug">
                  <Link href={`/live/news/${p.slug}`} className="transition-colors hover:text-gold">
                    {p.title}
                  </Link>
                </h3>
                <a
                  href={p.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-bright transition-colors hover:text-paper"
                >
                  Original article
                  <Icon name="arrow-up-right" size={12} />
                  <span className="sr-only"> at {p.sourceName} (opens in a new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </FreshOnly>
  );
}
