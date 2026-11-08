import { MONTH_NAMES, dayParts, isDated, parseYearMonth, type CalendarEvent, type YearMonth } from '@/lib/calendar';
import { cn } from '@/lib/cn';
import { isExternal } from '@/lib/paths';
import { Icon } from '../ui/Icon';
import { SmartLink } from '../ui/SmartLink';
import { StatusBadge } from '../ui/StatusBadge';
import { CityChip, EventCta, EventVisual, dateWithYear, plural } from './parts';

/** Events with exact days, grouped by month in date order. Events still to be confirmed live in the strip below. */
export function ListView({ uid, events }: { uid: string; events: CalendarEvent[] }) {
  const months: [YearMonth, CalendarEvent[]][] = [];
  for (const e of events) {
    if (!isDated(e)) continue;
    const group = months.find(([m]) => m === e.month);
    if (group) group[1].push(e);
    else months.push([e.month, [e]]);
  }
  return (
    <div className="flex flex-col gap-12">
      {months.map(([month, list]) => {
        const { year, month: n } = parseYearMonth(month);
        const headingId = `${uid}-list-${month}`;
        return (
          <div key={month}>
            <div className="flex items-center gap-4">
              <h3 id={headingId} className="display-tight text-[clamp(1.6rem,1.3rem+1.1vw,2.4rem)]">
                {MONTH_NAMES[n - 1]} <span className="serif-accent">{year}</span>
              </h3>
              <span aria-hidden className="h-px flex-1 bg-line" />
              <span className="mono-label">{plural(list.length, 'event')}</span>
            </div>
            <ol aria-labelledby={headingId} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((e) => (
                <li key={e.id} className="flex">
                  <ListCard event={e} />
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

/** Compact row on phones (photo beside the text, action below), photo card from 640px. */
function ListCard({ event: e }: { event: CalendarEvent }) {
  const place = [e.venue, e.city, e.country && e.country !== e.city ? e.country : undefined].filter(Boolean).join(', ');
  return (
    <article
      className={cn(
        'group relative grid w-full grid-cols-[7rem_minmax(0,1fr)] overflow-hidden rounded-2xl border bg-ink-card transition-colors duration-500 focus-within:border-gold/60 hover:border-gold/60 sm:flex sm:flex-col',
        e.featured ? 'edge-gold border-gold-bright/30 shadow-[0_30px_80px_-30px_rgb(209_182_121/0.3)]' : 'border-line',
      )}
    >
      <div className="relative min-h-36 overflow-hidden sm:aspect-[16/10] sm:min-h-0">
        <EventVisual event={e} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 112px" size="card" />
        <div className="hidden sm:block">
          {e.image ? <div aria-hidden className="scrim-bottom absolute inset-x-0 bottom-0 h-2/3" /> : null}
          {e.badge ? <StatusBadge status={e.status} label={e.badge} className="absolute left-4 top-4" /> : null}
          {e.image ? <CityChip event={e} overlay className="absolute bottom-4 left-4" /> : null}
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6 sm:pb-0">
        <p className="mono-label text-[10px] sm:text-[11px]">{e.ours && e.badge ? e.badge : e.label}</p>
        <h4 className="mt-1.5 text-lg font-medium leading-snug sm:mt-2 sm:text-xl">
          {e.ours ? (
            <SmartLink href={e.href} className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-gold">
              {e.name}
            </SmartLink>
          ) : (
            e.name
          )}
        </h4>
        <DateLine event={e} />
        <p className="mt-2 flex items-start gap-2 text-sm font-light text-paper/90 sm:text-[15px]">
          <Icon name="pin" size={16} className="mt-0.5 shrink-0 text-gold-bright" />
          <span>{place}</span>
        </p>
        {e.time ? <p className="mt-1 pl-6 text-sm font-light text-muted">{e.time}</p> : null}
        {e.line ? <p className="mt-2 text-sm font-light text-muted">{e.line}</p> : null}
      </div>
      <div className="col-span-2 border-t border-line px-4 py-3 sm:mt-auto sm:border-0 sm:px-6 sm:pb-6 sm:pt-6">
        {e.ours ? <LinkCue event={e} /> : <EventCta event={e} variant="outline" size="md" className="w-full sm:w-auto" />}
      </div>
    </article>
  );
}

function DateLine({ event: e }: { event: CalendarEvent }) {
  if (e.ours && e.start) {
    const p = dayParts(e.start);
    return (
      <p className="mt-3 flex items-end gap-3">
        <span className="sr-only">{e.dateLabel}</span>
        <span aria-hidden className="serif-figure text-[44px] leading-[0.75] sm:text-[56px]">
          {p.day}
        </span>
        <span aria-hidden className="pb-0.5 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-gold-bright sm:text-[11px]">
          {p.monthName} {p.year}
          <br />
          {p.weekday}
        </span>
      </p>
    );
  }
  return <p className="eyebrow mt-2.5">{dateWithYear(e)}</p>;
}

/** Visual cue only: the name link already covers the card. */
function LinkCue({ event: e }: { event: CalendarEvent }) {
  const external = isExternal(e.href);
  return (
    <span aria-hidden className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/85 transition-colors group-hover:text-gold">
      {e.cta}
      <Icon
        name={external ? 'arrow-up-right' : 'arrow-right'}
        size={16}
        className={cn('transition-transform duration-300', external ? 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5' : 'group-hover:translate-x-1')}
      />
    </span>
  );
}

/**
 * "Dates to be confirmed": events without exact days, by expected month,
 * unknown months last. Shown under both views. A swipeable row on phones.
 */
export function TbcStrip({ uid, events }: { uid: string; events: CalendarEvent[] }) {
  const list = events.filter((e) => !isDated(e));
  if (!list.length) return null;
  const headingId = `${uid}-tbc`;
  return (
    <div className="edge-gold relative rounded-2xl border border-line bg-ink-card/70 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h3 id={headingId} className="display-tight text-[clamp(1.4rem,1.2rem+0.8vw,2rem)]">
          Dates to be <span className="serif-accent">confirmed</span>
        </h3>
        <p className="mono-label">{plural(list.length, 'event')} · by expected month</p>
      </div>
      <ol
        aria-labelledby={headingId}
        className="no-scrollbar -mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-6 sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
      >
        {list.map((e) => (
          <li key={e.id} className="flex w-[84%] shrink-0 snap-start sm:w-auto">
            <TbcCard event={e} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function TbcCard({ event: e }: { event: CalendarEvent }) {
  return (
    <article className="group flex w-full flex-col gap-4 rounded-xl border border-line bg-ink/70 p-3 transition-colors duration-300 focus-within:border-gold/60 hover:border-gold/50 sm:p-4">
      <div className="flex gap-3.5">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg sm:size-24">
          <EventVisual event={e} sizes="96px" size="mini" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="eyebrow">{dateWithYear(e)}</p>
          <h4 className="mt-1.5 text-base font-medium leading-snug">{e.name}</h4>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-light text-paper/90">
            <Icon name="pin" size={14} className="shrink-0 text-gold-bright" />
            <span className="truncate">{e.city}</span>
          </p>
          <p className="mono-label mt-1.5 text-[10px]">{e.label}</p>
        </div>
      </div>
      <EventCta event={e} variant="outline" size="md" className="mt-auto w-full" />
    </article>
  );
}
