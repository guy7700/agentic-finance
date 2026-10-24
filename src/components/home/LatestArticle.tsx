import { ARTICLE_MAX_AGE_MS, getLatestArticle } from '@/lib/latest-article';
import { Icon } from '../ui/Icon';
import { Container } from '../ui/Layout';
import { FreshOnly } from './FreshOnly';

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** One current article from the space, refreshed daily. Hidden when there is none. */
export function LatestArticle() {
  const a = getLatestArticle();
  if (!a) return null;
  return (
    <FreshOnly publishedAt={a.publishedAt} maxAgeMs={ARTICLE_MAX_AGE_MS}>
      <section aria-labelledby="latest-article" className="border-b border-line bg-ink-raised">
        <Container className="grid gap-4 py-10 sm:py-12 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
          <p className="eyebrow pt-1.5">In the news</p>
          <div className="max-w-4xl">
            <h2 id="latest-article" className="text-[clamp(1.3rem,1.1rem+0.8vw,1.75rem)] font-bold leading-snug">
              <a href={a.url} target="_blank" rel="noopener noreferrer" className="group inline hover:text-gold">
                {a.title}
                <Icon
                  name="arrow-up-right"
                  size={20}
                  className="ml-1.5 inline-block align-[-0.15em] text-gold transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
                <span className="sr-only"> (opens {a.source} in a new tab)</span>
              </a>
            </h2>
            <p className="mt-3 max-w-3xl text-[16.5px] leading-relaxed text-muted">{a.summary}</p>
            <p className="mono-label mt-4">
              {a.source} · <time dateTime={a.publishedAt}>{dateFormat.format(new Date(a.publishedAt))}</time>
            </p>
          </div>
        </Container>
      </section>
    </FreshOnly>
  );
}
