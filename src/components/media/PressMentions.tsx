import { galleryCollections, pressMentions } from '@/data/media';
import type { PressMention } from '@/data/types';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

const kindLabel: Record<PressMention['kind'], string> = {
  mention: 'Press mention',
  recap: 'Conference recap',
  release: 'Press release',
};

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const formatDate = (d: string) => dateFormat.format(new Date(`${d}T00:00:00Z`));

/** Best-known outlets first; any other outlet keeps its order after these. */
const OUTLET_ORDER = ['TradingView', 'Binance Square', 'CoinMarketCap', 'Business Insider', 'TheStreet', 'Benzinga', 'The Defiant'];
const rank = (outlet: string) => {
  const i = OUTLET_ORDER.indexOf(outlet);
  return i === -1 ? OUTLET_ORDER.length : i;
};

type Article = { outlet: string; url: string; date: string; headline: string };

/**
 * The articles for one entry. A release shows the sites that republished it, never
 * the wire it went out on; any other piece is its own single article.
 */
function articlesOf(m: PressMention): Article[] {
  if (m.kind === 'release' && m.pickups?.length) {
    return [...m.pickups]
      .sort((a, b) => rank(a.outlet) - rank(b.outlet))
      .map((p) => ({ outlet: p.outlet, url: p.url, date: p.date, headline: p.headline ?? m.headline }));
  }
  return [{ outlet: m.outlet, url: m.url, date: m.date, headline: m.headline }];
}

const eventLabel = (m: PressMention) => galleryCollections.find((c) => c.id === m.edition)?.label;

/** One outlet's article: the outlet name leads, the link is the whole tile. */
function ArticleLink({ a, shared }: { a: Article; shared: string }) {
  const ownHeadline = a.headline !== shared;
  return (
    <a
      href={a.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link flex h-full flex-col rounded-xl border border-gold/35 bg-gold/[0.06] px-3 py-3 transition-colors duration-300 hover:border-gold hover:bg-gold/15 focus-visible:border-gold sm:px-4"
    >
      <span className="text-[15px] font-semibold leading-tight text-paper sm:text-base">{a.outlet}</span>
      {ownHeadline ? <span className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-paper/75">{a.headline}</span> : null}
      <span className="mt-auto flex items-center justify-between gap-2 pt-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-gold-bright">
        <time dateTime={a.date}>{formatDate(a.date)}</time>
        <Icon
          name="arrow-up-right"
          size={15}
          className="shrink-0 text-gold transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
        />
      </span>
      <span className="sr-only">
        {ownHeadline ? '' : `: ${a.headline}`} (opens in a new tab)
      </span>
    </a>
  );
}

function MentionCard({ m, headingLevel: H }: { m: PressMention; headingLevel: 'h2' | 'h3' }) {
  const articles = articlesOf(m);
  const event = eventLabel(m);
  return (
    <article
      className={cn(
        'edge-gold relative overflow-hidden rounded-2xl border border-line bg-ink-card',
        m.image && 'lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]',
      )}
    >
      {m.image ? (
        <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-64">
          <Img
            src={m.image.src}
            alt={m.image.alt}
            fill
            sizes="(min-width: 1024px) 38vw, 100vw"
            position={m.image.position}
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-card/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink-card/60" />
        </div>
      ) : null}
      <div className="p-6 sm:p-7">
        {event ? <p className="mono-label">{event}</p> : null}
        <H className="mt-3 text-xl font-medium leading-snug sm:text-[22px]">{m.headline}</H>
        <p className="mt-2 text-sm text-muted">
          {kindLabel[m.kind]} · <time dateTime={m.date}>{formatDate(m.date)}</time>
          {m.kind === 'release' && articles.length > 1 ? ` · Published on ${articles.length} sites` : null}
        </p>
        <ul className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 xl:grid-cols-3">
          {articles.map((a) => (
            <li key={a.url}>
              <ArticleLink a={a} shared={m.headline} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function PlaceholderCard({ kind }: { kind: PressMention['kind'] }) {
  return (
    <article className="edge-gold relative flex h-full flex-col rounded-2xl border border-dashed border-line-strong bg-ink-card p-6 sm:p-7">
      <div className="flex h-12 items-center justify-center rounded-xl border border-dashed border-line-strong font-mono text-[10.5px] uppercase tracking-[0.16em] text-subtle">
        Outlet logo [TBC]
      </div>
      <p className="mono-label mt-6">{kindLabel[kind]} [TBC]</p>
      <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm">
        <dt className="text-subtle">Outlet</dt>
        <dd className="text-paper/85">[TBC]</dd>
        <dt className="text-subtle">Date</dt>
        <dd className="text-paper/85">[TBC]</dd>
      </dl>
      <p className="mt-4 text-xl font-medium leading-snug text-paper/70">Headline [TBC]</p>
      <p className="mt-auto flex items-center gap-1.5 pt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
        Original link [TBC]
        <Icon name="arrow-up-right" size={14} />
      </p>
    </article>
  );
}

/** Layout-only cards shown until real coverage is added to `pressMentions`. */
const PLACEHOLDERS: PressMention['kind'][] = ['mention', 'mention', 'recap'];

/**
 * "Agentic Finance in the Press": one card per story, newest first, with a photo
 * from the event and a highlighted link to every outlet that published it, best
 * known first. `limit` caps the number of stories, not articles.
 */
export function PressMentions({ limit, headingLevel = 'h3', className }: { limit?: number; headingLevel?: 'h2' | 'h3'; className?: string }) {
  const items = limit ? pressMentions.slice(0, limit) : pressMentions;
  if (!items.length) {
    return (
      <ul className={cn('grid gap-4 md:grid-cols-3', className)}>
        {PLACEHOLDERS.map((kind, i) => (
          <li key={i}>
            <PlaceholderCard kind={kind} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={cn('flex flex-col gap-5', className)}>
      {items.map((m) => (
        <li key={m.id}>
          <MentionCard m={m} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
