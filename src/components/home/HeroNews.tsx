import Link from 'next/link';
import { NEWS_MAX_AGE_MS, formatPostDate, postTime, type DailyPost } from '@/lib/daily';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { FreshOnly } from './FreshOnly';

const publishedAt = (p: DailyPost) => new Date(postTime(p)).toISOString();

/**
 * Recent industry stories inside the hero: date, source, our headline and a
 * link to the original. A story leaves once it is two weeks old.
 */
export function HeroNews({ posts }: { posts: DailyPost[] }) {
  return (
    <FreshOnly publishedAt={publishedAt(posts[0])} maxAgeMs={NEWS_MAX_AGE_MS}>
      <section
        aria-labelledby="hero-news"
        className="edge-gold relative rounded-2xl border border-line-strong bg-ink-card/80 p-5 backdrop-blur-md sm:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id="hero-news" className="eyebrow">
            Latest news
          </h2>
          <Link href="/blog" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/80 transition-colors hover:text-gold">
            All news
          </Link>
        </div>
        <ul className="mt-4 flex flex-col divide-y divide-line">
          {posts.map((p) => (
            <FreshOnly key={p.slug} publishedAt={publishedAt(p)} maxAgeMs={NEWS_MAX_AGE_MS}>
              <li className="flex gap-4 py-4 first:pt-0 last:pb-0">
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
                    <Link href={`/blog/${p.slug}`} className="transition-colors hover:text-gold">
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
            </FreshOnly>
          ))}
        </ul>
      </section>
    </FreshOnly>
  );
}
