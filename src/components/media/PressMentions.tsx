import { pressMentions } from '@/data/media';
import type { PressMention } from '@/data/types';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

const kindLabel: Record<PressMention['kind'], string> = {
  mention: 'Press mention',
  recap: 'Conference recap',
};

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const formatDate = (d: string) => dateFormat.format(new Date(`${d}T00:00:00Z`));

/**
 * Layout-only cards shown until real coverage is added to `pressMentions`.
 * Every unknown fact is marked [TBC]; nothing here is a real mention.
 */
const PLACEHOLDERS: PressMention['kind'][] = ['mention', 'mention', 'recap'];

function MentionCard({ m, headingLevel: H }: { m: PressMention; headingLevel: 'h2' | 'h3' }) {
  return (
    <article className="edge-gold group relative flex h-full flex-col rounded-2xl border border-line bg-ink-card p-6 transition-colors duration-500 hover:border-gold/60 sm:p-7">
      <div className="relative flex h-12 items-center">
        {m.logo ? (
          <Img src={m.logo} alt={m.outlet} fill sizes="200px" className="object-contain object-left opacity-85 transition-opacity group-hover:opacity-100" />
        ) : (
          <span className="serif-figure text-3xl leading-none text-paper">{m.outlet}</span>
        )}
      </div>
      <p className="mono-label mt-6">
        {kindLabel[m.kind]} · <time dateTime={m.date}>{formatDate(m.date)}</time>
      </p>
      <H className="mt-3 text-xl font-medium leading-snug">
        <a
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors after:absolute after:inset-0 after:rounded-2xl group-hover:text-gold"
        >
          {m.headline}
          <span className="sr-only"> ({m.outlet}, opens in a new tab)</span>
        </a>
      </H>
      <span
        aria-hidden
        className="mt-auto flex items-center gap-1.5 pt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-bright transition-colors group-hover:text-paper"
      >
        Read on {m.outlet}
        <Icon name="arrow-up-right" size={14} />
      </span>
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

/**
 * "Agentic Finance in the Press": outlet, headline, date and the original
 * link for each piece of coverage. Until real coverage is confirmed it shows
 * three placeholder cards marked [TBC], so the layout is ready for real items.
 */
export function PressMentions({ limit, headingLevel = 'h3', className }: { limit?: number; headingLevel?: 'h2' | 'h3'; className?: string }) {
  const items = limit ? pressMentions.slice(0, limit) : pressMentions;
  return (
    <ul className={cn('grid gap-4 md:grid-cols-3', className)}>
      {items.length
        ? items.map((m) => (
            <li key={m.id}>
              <MentionCard m={m} headingLevel={headingLevel} />
            </li>
          ))
        : PLACEHOLDERS.map((kind, i) => (
            <li key={i}>
              <PlaceholderCard kind={kind} />
            </li>
          ))}
    </ul>
  );
}
