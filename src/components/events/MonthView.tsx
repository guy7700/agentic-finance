import { useEffect, useRef, type PointerEvent, type Ref } from 'react';
import {
  MONTH_NAMES,
  WEEKDAYS,
  dayLabel,
  daysInMonth,
  eachDay,
  isDated,
  isoDay,
  monthLabel,
  monthWeeks,
  parseYearMonth,
  shiftMonth,
  shortMonthLabel,
  type CalendarEvent,
  type IsoDay,
  type YearMonth,
} from '@/lib/calendar';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { StatusBadge } from '../ui/StatusBadge';
import { Backdrop, CityChip, EventCta, EventVisual, dateWithYear, nameAndCity, plural, type BackdropLayer } from './parts';
import { useSwipe } from './use-swipe';

export type MonthViewProps = {
  uid: string;
  events: CalendarEvent[];
  month: YearMonth;
  first: YearMonth;
  last: YearMonth;
  today: IsoDay | null;
  /** Event the visitor clicked or reached by keyboard. */
  pinned: string | null;
  /** Event under the mouse: shown in the spotlight until the pointer leaves. */
  preview: string | null;
  /** Direction of the last month change, for the slide-in. */
  slide: -1 | 0 | 1;
  /** Go to a month, optionally pinning one of its events. */
  onMonth: (m: YearMonth, pin?: string) => void;
  onPin: (id: string) => void;
  onPreview: (id: string | null) => void;
};

type Dated = CalendarEvent & { start: IsoDay; end: IsoDay; month: YearMonth };
type DayEntry = { event: Dated; lane: number; first: boolean; last: boolean; n: number; total: number };
type MonthChip = { month: YearMonth; cities: string[]; ours: boolean; lead: CalendarEvent };
type SpotMode = 'preview' | 'selected' | 'month' | 'next' | 'previous';

/** Lanes shown in a day cell on wider screens and on phones. */
const LANES_WIDE = 2;
const LANES_PHONE = 3;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Stacks overlapping multi-day events in lanes, so an event keeps the same row
 * on every day it covers. Longer events take the upper lanes.
 */
function assignLanes(list: Dated[]): Map<string, number> {
  const sorted = [...list].sort((a, b) => (a.start !== b.start ? (a.start < b.start ? -1 : 1) : a.end > b.end ? -1 : a.end < b.end ? 1 : 0));
  const laneEnds: IsoDay[] = [];
  const lanes = new Map<string, number>();
  for (const e of sorted) {
    let lane = laneEnds.findIndex((end) => end < e.start);
    if (lane === -1) lane = laneEnds.push(e.end) - 1;
    else laneEnds[lane] = e.end;
    lanes.set(e.id, lane);
  }
  return lanes;
}

/**
 * The month grid with its spotlight. Hovering an event day (mouse) previews it
 * in the spotlight; clicking it, or reaching it with the keyboard, pins it.
 * Clicking a day again steps through its events. Swiping the grid left or
 * right on a touch screen changes the month; swiping the spotlight steps to the
 * next or previous event. The backdrop shows the spotlighted event's city.
 */
export function MonthView({ uid, events, month, first, last, today, pinned, preview, slide, onMonth, onPin, onPreview }: MonthViewProps) {
  const { year, month: monthNumber } = parseYearMonth(month);
  const monthName = MONTH_NAMES[monthNumber - 1];
  const headingId = `${uid}-month`;
  const spotId = `${uid}-spotlight`;
  const chipId = (m: YearMonth) => `${uid}-chip-${m}`;
  const chipList = useRef<HTMLUListElement>(null);
  const spotRef = useRef<HTMLElement>(null);

  const monthStart = isoDay(month, 1);
  const monthEnd = isoDay(month, daysInMonth(month));
  const datedHere = events.filter(isDated).filter((e) => e.start <= monthEnd && e.end >= monthStart);
  const tbcHere = events.filter((e) => !isDated(e) && e.month === month);
  const monthEvents: CalendarEvent[] = [...datedHere, ...tbcHere];

  const lanes = assignLanes(datedHere);
  const laneCount = Math.max(0, ...lanes.values()) + (lanes.size ? 1 : 0);
  const byDay = new Map<IsoDay, DayEntry[]>();
  for (const e of datedHere) {
    const days = eachDay(e.start, e.end);
    days.forEach((iso, i) => {
      if (iso < monthStart || iso > monthEnd) return;
      const entry: DayEntry = { event: e, lane: lanes.get(e.id) ?? 0, first: i === 0, last: i === days.length - 1, n: i + 1, total: days.length };
      byDay.set(iso, [...(byDay.get(iso) ?? []), entry].sort((a, b) => a.lane - b.lane));
    });
  }

  // One chip per month with events, led by its first event.
  const chips: MonthChip[] = [];
  for (const e of events) {
    if (!e.month || e.month < first || e.month > last) continue;
    const found = chips.find((x) => x.month === e.month);
    if (!found) chips.push({ month: e.month, cities: [e.city], ours: e.ours, lead: e });
    else {
      if (!found.cities.includes(e.city)) found.cities.push(e.city);
      found.ours ||= e.ours;
    }
  }
  chips.sort((a, b) => (a.month < b.month ? -1 : 1));
  const thisChip = chips.find((x) => x.month === month);
  const nextChip = chips.find((x) => x.month > month);
  const prevChip = [...chips].reverse().find((x) => x.month < month);

  // Every event with a month, in calendar order: the spotlight's previous/next.
  const sortKey = (e: CalendarEvent) => `${e.month}|${isDated(e) ? `0|${e.start}` : '1'}`;
  const order = events.filter((e) => e.month).sort((a, b) => (sortKey(a) < sortKey(b) ? -1 : sortKey(a) > sortKey(b) ? 1 : 0));

  const byId = new Map(events.map((e) => [e.id, e]));
  const previewed = preview ? byId.get(preview) : undefined;
  const pinnedEvent = pinned ? byId.get(pinned) : undefined;
  const fallback = thisChip?.lead ?? monthEvents[0] ?? nextChip?.lead ?? prevChip?.lead ?? events[0];
  const spot = previewed ?? pinnedEvent ?? fallback;
  const mode: SpotMode =
    previewed && previewed.id !== pinned
      ? 'preview'
      : pinnedEvent
        ? 'selected'
        : monthEvents.includes(spot)
          ? 'month'
          : spot.month && spot.month < month
            ? 'previous'
            : 'next';
  const spotIndex = order.findIndex((e) => e.id === spot.id);
  const stepPrev = spotIndex > 0 ? order[spotIndex - 1] : undefined;
  const stepNext = spotIndex >= 0 && spotIndex < order.length - 1 ? order[spotIndex + 1] : undefined;
  const spotDays = isDated(spot) ? new Set(eachDay(spot.start, spot.end)) : new Set<IsoDay>();

  // Same city photo wherever it is known, so the Gala sits on Abu Dhabi too.
  const cityPhoto = new Map<string, NonNullable<CalendarEvent['image']>>();
  for (const e of events) if (e.image && !cityPhoto.has(e.city)) cityPhoto.set(e.city, e.image);
  const photoOf = (e: CalendarEvent) => e.image ?? cityPhoto.get(e.city);
  // Only the spotlighted event's own city: its photo, or its name in serif while it has no photo.
  const photo = photoOf(spot);
  const backdrop: BackdropLayer = { key: photo ? `img:${photo.src}` : `city:${spot.city}`, image: photo, city: spot.city };

  const canPrev = month > first;
  const canNext = month < last;
  const prev = shiftMonth(month, -1);
  const next = shiftMonth(month, 1);

  const summary = monthEvents.length ? plural(monthEvents.length, 'event') : 'No events';

  // Keep the active month chip in view inside its scrolling row (never scrolls the page).
  useEffect(() => {
    const list = chipList.current;
    const chip = document.getElementById(`${uid}-chip-${month}`);
    if (!list || !chip || list.scrollWidth <= list.clientWidth) return;
    const left = chip.offsetLeft - list.offsetLeft - (list.clientWidth - chip.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, [uid, month]);

  /**
   * After a click or tap, bring the top of the spotlight (photo and name) into
   * view when it sits below the fold, as on phones, keeping the grid in sight.
   */
  const reveal = () => {
    const el = spotRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top > window.innerHeight - 160) {
      window.scrollBy({ top: top - window.innerHeight * 0.4, behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
  };

  const gridSwipe = useSwipe((dir) => {
    const m = dir > 0 ? next : prev;
    if (dir > 0 ? canNext : canPrev) onMonth(m);
  });
  const step = (target: CalendarEvent | undefined) => {
    if (target?.month) onMonth(target.month, target.id);
  };
  const spotSwipe = useSwipe((dir) => step(dir > 0 ? stepNext : stepPrev));

  const mouseOnly = (fn: () => void) => (e: PointerEvent) => {
    if (e.pointerType === 'mouse') fn();
  };

  return (
    <div className="edge-gold @container relative isolate overflow-hidden rounded-2xl border border-line-strong bg-ink-card p-2 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)] sm:p-6 lg:p-8">
      <Backdrop layer={backdrop} />

      {/* Month header */}
      <div className="flex items-center justify-between gap-3 px-2 pt-3 sm:px-0 sm:pt-0">
        <div aria-live="polite" aria-atomic="true" className="min-w-0">
          <h3 id={headingId} className="display-tight text-[clamp(1.6rem,1.3rem+1.1vw,2.4rem)] [text-shadow:0_2px_18px_rgb(0_0_0/0.6)]">
            {monthName} <span className="serif-accent">{year}</span>
          </h3>
          <p className="mono-label mt-1.5 text-paper/85">{summary}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <MonthButton dir="prev" target={monthLabel(prev)} enabled={canPrev} onClick={() => onMonth(prev)} />
          <MonthButton dir="next" target={monthLabel(next)} enabled={canNext} onClick={() => onMonth(next)} />
        </div>
      </div>

      {/* Jump to a month with events */}
      {chips.length > 1 ? (
        <div role="group" aria-label="Months with events" className="mt-5">
          <ul
            ref={chipList}
            className="no-scrollbar flex snap-x gap-2 overflow-x-auto px-2 pb-1 [mask-image:linear-gradient(to_right,black_calc(100%-32px),transparent)] sm:px-0 xl:[mask-image:none]"
            onPointerLeave={mouseOnly(() => onPreview(null))}
          >
            {chips.map((x) => {
              const on = x.month === month;
              const more = x.cities.length - 1;
              return (
                <li key={x.month} className="min-w-[88px] shrink-0 grow snap-start last:mr-6 xl:last:mr-0">
                  <button
                    id={chipId(x.month)}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onMonth(x.month)}
                    onPointerEnter={mouseOnly(() => onPreview(x.lead.id))}
                    onFocus={() => onPreview(x.lead.id)}
                    onBlur={() => onPreview(null)}
                    className={cn(
                      'relative flex min-h-12 w-full flex-col items-start justify-center gap-0.5 rounded-xl border px-3 py-1.5 text-left backdrop-blur-sm transition-colors duration-300',
                      on
                        ? 'border-gold bg-gold text-ink shadow-[0_0_24px_rgb(209_182_121/0.35)]'
                        : x.ours
                          ? 'border-gold/60 bg-gold/15 text-gold-bright hover:border-gold'
                          : 'border-paper/25 bg-ink/55 text-paper/90 hover:border-gold hover:text-gold',
                    )}
                  >
                    <span aria-hidden className={cn('font-mono text-[10px] font-semibold uppercase tracking-[0.16em]', on ? 'text-ink/75' : 'text-gold-bright')}>
                      {shortMonthLabel(x.month)}
                    </span>
                    <span className="flex items-center gap-1 whitespace-nowrap text-[13px] font-medium leading-tight">
                      <span>{x.cities[0]}</span>
                      {more ? (
                        <span aria-hidden className={cn('shrink-0 font-normal', on ? 'text-ink/70' : 'text-paper/65')}>
                          +{more}
                        </span>
                      ) : null}
                    </span>
                    <span className="sr-only">
                      {more ? ` and ${more} more` : ''}, {monthLabel(x.month)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
        {/* Month grid: swipe left or right on touch screens to change month */}
        <div>
          <div {...gridSwipe} onPointerLeave={mouseOnly(() => onPreview(null))} className="touch-pan-y">
            <table
              key={month}
              aria-labelledby={headingId}
              className={cn(
                'w-full table-fixed border-separate border-spacing-[2px] transition-[opacity,translate] duration-500 ease-[var(--ease-out-soft)] starting:opacity-0 motion-reduce:transition-none sm:border-spacing-1.5',
                slide > 0 && 'starting:translate-x-6',
                slide < 0 && 'starting:-translate-x-6',
              )}
            >
              <thead>
                <tr>
                  {WEEKDAYS.map((w) => (
                    <th
                      key={w}
                      scope="col"
                      className="pb-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/80 [text-shadow:0_1px_6px_rgb(0_0_0/0.9)] sm:pl-2 sm:text-left"
                    >
                      <span aria-hidden>{w.slice(0, 3)}</span>
                      <span className="sr-only">{w}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthWeeks(month).map((week, wi) => (
                  <tr key={wi}>
                    {week.map((d, di) => {
                      if (d === null) return <td key={di} className="p-0" />;
                      const iso = isoDay(month, d);
                      const entries = byDay.get(iso);
                      const isToday = today === iso;
                      const isPast = today !== null && iso < today;
                      return (
                        <td key={di} className="p-0 align-top" aria-current={isToday ? 'date' : undefined}>
                          {entries ? (
                            <EventDay
                              day={d}
                              iso={iso}
                              entries={entries}
                              laneCount={laneCount}
                              labelAll={di === 0 || d === 1}
                              isToday={isToday}
                              inSpot={spotDays.has(iso)}
                              spotId={spot.id}
                              active={entries.some((x) => x.event.id === pinned)}
                              controls={spotId}
                              onHover={() => onPreview(entries.find((x) => x.event.id === pinned)?.event.id ?? entries[0].event.id)}
                              onKeyboardFocus={() => {
                                if (!entries.some((x) => x.event.id === pinned)) onPin(entries[0].event.id);
                              }}
                              onActivate={() => {
                                const ids = entries.map((x) => x.event.id);
                                onPin(ids[(ids.indexOf(pinned ?? '') + 1) % ids.length]);
                                reveal();
                              }}
                            />
                          ) : (
                            <div
                              className={cn(
                                'flex h-12 w-full flex-col items-center justify-center rounded-lg border border-paper/15 bg-ink/15 [text-shadow:0_1px_6px_rgb(0_0_0/0.9)] sm:h-24 sm:items-start sm:justify-between sm:p-2 lg:h-[104px]',
                                isPast && 'opacity-40',
                                isToday && 'ring-1 ring-paper/70',
                              )}
                            >
                              <span className={cn('text-sm font-normal', isToday ? 'text-paper' : 'text-paper/90')}>{d}</span>
                              {isToday ? (
                                <>
                                  <span aria-hidden className="mono-label hidden text-[10px] text-paper sm:block">
                                    Today
                                  </span>
                                  <span className="sr-only">, today</span>
                                </>
                              ) : null}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key */}
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 px-2 text-xs font-light text-paper/85 [text-shadow:0_1px_6px_rgb(0_0_0/0.9)] sm:px-0">
            <li className="flex items-center gap-2">
              <span aria-hidden className="size-3 rounded-sm bg-gold" /> Agentic Finance
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="h-2.5 w-6 rounded-sm border border-gold/75 bg-ink/80" /> Event days
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden className="size-3 rounded-sm ring-1 ring-paper/70" /> Today
            </li>
            <li className="flex items-center gap-2 md:hidden">
              <Icon name="arrow-left" size={14} className="text-gold" /> Swipe for months <Icon name="arrow-right" size={14} className="text-gold" />
            </li>
          </ul>
        </div>

        {/* Spotlight */}
        <Spotlight
          ref={spotRef}
          id={spotId}
          uid={uid}
          event={spot}
          mode={mode}
          month={month}
          index={spotIndex}
          total={order.length}
          stepPrev={stepPrev}
          stepNext={stepNext}
          overlaps={isDated(spot) ? events.filter(isDated).filter((e) => e.id !== spot.id && e.start <= spot.end && e.end >= spot.start) : []}
          swipe={spotSwipe}
          onStep={step}
          onPin={onPin}
        />
      </div>

      {/* This month's events, including those still to be confirmed */}
      <div className="mt-6 border-t border-line px-2 pb-2 pt-6 sm:px-0 sm:pb-0">
        <p className="eyebrow">In {monthLabel(month)}</p>
        {monthEvents.length ? (
          <ul className="mt-4 grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {monthEvents.map((e) => (
              <li key={e.id} className="flex">
                <AgendaRow
                  event={e}
                  pinned={pinned === e.id}
                  inSpot={spot.id === e.id}
                  controls={spotId}
                  onHover={() => onPreview(e.id)}
                  onLeave={() => onPreview(null)}
                  onKeyboardFocus={() => onPin(e.id)}
                  onActivate={() => {
                    onPin(e.id);
                    reveal();
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
            <p className="font-light text-paper/85">No events this month.</p>
            {nextChip ? <GoToMonth chip={nextChip} forward onMonth={onMonth} /> : prevChip ? <GoToMonth chip={prevChip} forward={false} onMonth={onMonth} /> : null}
          </div>
        )}
      </div>
    </div>
  );
}

function GoToMonth({ chip, forward, onMonth }: { chip: MonthChip; forward: boolean; onMonth: (m: YearMonth) => void }) {
  return (
    <button
      type="button"
      onClick={() => onMonth(chip.month)}
      className="group inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-bright"
    >
      Go to {monthLabel(chip.month)}: {chip.cities.slice(0, 3).join(', ')}
      {chip.cities.length > 3 ? ` +${chip.cities.length - 3}` : ''}
      <Icon name={forward ? 'arrow-right' : 'arrow-left'} size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </button>
  );
}

function MonthButton({ dir, target, enabled, onClick }: { dir: 'prev' | 'next'; target: string; enabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={`${dir === 'prev' ? 'Previous' : 'Next'} month${enabled ? `: ${target}` : ''}`}
      aria-disabled={!enabled}
      onClick={enabled ? onClick : undefined}
      className={cn(
        'inline-flex size-11 items-center justify-center rounded-full border border-paper/30 bg-ink/55 text-paper backdrop-blur-sm transition-colors duration-300',
        enabled ? 'hover:border-gold hover:text-gold' : 'cursor-not-allowed opacity-35',
      )}
    >
      <Icon name={dir === 'prev' ? 'chevron-left' : 'chevron-right'} size={18} />
    </button>
  );
}

/* --------------------------------------------------------------- Day cell */

function EventDay({
  day,
  iso,
  entries,
  laneCount,
  labelAll,
  isToday,
  inSpot,
  spotId,
  active,
  controls,
  onHover,
  onKeyboardFocus,
  onActivate,
}: {
  day: number;
  iso: IsoDay;
  entries: DayEntry[];
  laneCount: number;
  /** First column or first day of the month: repeat the names of running events. */
  labelAll: boolean;
  isToday: boolean;
  inSpot: boolean;
  spotId: string;
  active: boolean;
  controls: string;
  onHover: () => void;
  onKeyboardFocus: () => void;
  onActivate: () => void;
}) {
  const featured = entries.some((x) => x.event.featured);
  const wideLanes = Math.min(laneCount, LANES_WIDE);
  const phoneLanes = Math.min(laneCount, LANES_PHONE);
  const hiddenWide = entries.filter((x) => x.lane >= LANES_WIDE).length;
  const hiddenPhone = entries.filter((x) => x.lane >= LANES_PHONE).length;
  const label = entries
    .map((x) => `${nameAndCity(x.event)}${x.total > 1 ? `, day ${x.n} of ${x.total}` : ''}`)
    .join('; ');
  const inLane = (lane: number) => entries.find((x) => x.lane === lane);

  return (
    <button
      type="button"
      aria-label={`${dayLabel(iso)}${isToday ? ', today' : ''}: ${label}`}
      aria-pressed={active}
      aria-controls={controls}
      onClick={onActivate}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') onHover();
      }}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) onKeyboardFocus();
      }}
      className={cn(
        'group/day relative flex h-12 w-full flex-col items-center rounded-lg border pt-1.5 text-left transition-[background-color,border-color,box-shadow] duration-300 sm:h-24 sm:items-stretch sm:p-1.5 lg:h-[104px]',
        featured
          ? 'border-gold bg-gold text-ink shadow-[0_0_24px_rgb(209_182_121/0.35)] hover:bg-gold-bright'
          : 'border-gold/60 bg-ink/40 text-paper [text-shadow:0_1px_6px_rgb(0_0_0/0.9)] hover:border-gold hover:bg-ink/60',
        inSpot && !featured && 'border-gold bg-ink/60',
        active ? (featured ? 'ring-2 ring-paper' : 'ring-2 ring-gold') : isToday && 'ring-1 ring-paper/70',
      )}
    >
      <span className="flex w-full items-start justify-center gap-1 sm:justify-between sm:px-0.5">
        <span className={cn('serif-figure text-xl leading-none lining-nums sm:text-[26px]', featured && 'text-ink')}>{day}</span>
        {hiddenWide ? (
          <span aria-hidden className={cn('hidden font-mono text-[10px] font-semibold sm:block', featured ? 'text-ink/80' : 'text-gold-bright')}>
            +{hiddenWide}
          </span>
        ) : null}
        {hiddenPhone ? (
          <span aria-hidden className={cn('absolute right-1 top-0.5 font-mono text-[9px] font-semibold sm:hidden', featured ? 'text-ink/80' : 'text-gold-bright')}>
            +{hiddenPhone}
          </span>
        ) : null}
      </span>
      {isToday ? (
        <span aria-hidden className="mono-label absolute right-2 top-2 hidden text-[9px] text-paper lg:block">
          Today
        </span>
      ) : null}

      {/* Wider screens: one labelled bar per lane, running across the event's days */}
      <span aria-hidden className="mt-auto hidden w-full flex-col gap-1 sm:flex">
        {Array.from({ length: wideLanes }, (_, lane) => {
          const x = inLane(lane);
          if (!x) return <span key={lane} className="h-[18px]" />;
          const strong = x.event.ours || x.event.id === spotId;
          return (
            <span
              key={lane}
              className={cn(
                'flex h-[18px] min-w-0 items-center text-[11px] font-medium leading-none [text-shadow:none]',
                featured
                  ? 'bg-ink/15 text-ink'
                  : strong
                    ? 'bg-gold text-ink'
                    : 'border-y border-gold/75 bg-ink/80 text-gold-bright backdrop-blur-sm',
                x.first ? 'rounded-l-[5px] pl-1.5' : '-ml-[7px] pl-2',
                x.last ? 'rounded-r-[5px] pr-1' : '-mr-[7px]',
                !featured && !strong && x.first && 'border-l',
                !featured && !strong && x.last && 'border-r',
              )}
            >
              {x.first || labelAll ? <span className="truncate">{x.event.short}</span> : null}
            </span>
          );
        })}
      </span>

      {/* Phones: thin bars */}
      <span aria-hidden className="absolute inset-x-0 bottom-1.5 flex flex-col gap-[3px] sm:hidden">
        {Array.from({ length: phoneLanes }, (_, lane) => {
          const x = inLane(lane);
          if (!x) return <span key={lane} className="h-[3px]" />;
          return (
            <span
              key={lane}
              className={cn(
                'h-[3px]',
                featured ? 'bg-ink/60' : x.event.ours || x.event.id === spotId ? 'bg-gold' : 'bg-gold-bright/60',
                x.first ? 'ml-2 rounded-l-full' : '-ml-px',
                x.last ? 'mr-2 rounded-r-full' : '-mr-px',
              )}
            />
          );
        })}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------- Spotlight */

const MODE_LABEL: Record<SpotMode, string> = {
  preview: 'Preview',
  selected: 'Selected',
  month: 'This month',
  next: 'Next up',
  previous: 'Last event',
};

function Spotlight({
  ref,
  id,
  uid,
  event: e,
  mode,
  month,
  index,
  total,
  stepPrev,
  stepNext,
  overlaps,
  swipe,
  onStep,
  onPin,
}: {
  ref: Ref<HTMLElement>;
  id: string;
  uid: string;
  event: CalendarEvent;
  mode: SpotMode;
  month: YearMonth;
  index: number;
  total: number;
  stepPrev?: CalendarEvent;
  stepNext?: CalendarEvent;
  overlaps: CalendarEvent[];
  swipe: ReturnType<typeof useSwipe>;
  onStep: (target: CalendarEvent | undefined) => void;
  onPin: (id: string) => void;
}) {
  const titleId = `${uid}-spotlight-title`;
  const place = [e.venue, e.city, e.country && e.country !== e.city ? e.country : undefined].filter(Boolean).join(', ');
  const outside = e.month !== month;

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={titleId}
      {...swipe}
      className="edge-gold relative flex touch-pan-y flex-col self-start overflow-hidden rounded-2xl border border-line-strong bg-ink-card/85 shadow-[0_30px_70px_-30px_rgb(0_0_0/0.95)] backdrop-blur-md md:flex-row xl:flex-col"
    >
      <div
        key={e.id}
        className="group relative aspect-[16/10] shrink-0 overflow-hidden motion-safe:animate-[af-fade-in_0.5s_ease-out] md:aspect-auto md:min-h-72 md:w-[44%] xl:aspect-[4/3] xl:min-h-0 xl:w-auto"
      >
        <EventVisual event={e} sizes="(min-width: 1280px) 360px, (min-width: 768px) 44vw, 100vw" />
        {e.image ? <div aria-hidden className="scrim-bottom absolute inset-x-0 bottom-0 h-1/2" /> : null}
        <div className="absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-ink/75 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-bright backdrop-blur-sm">
            <span aria-hidden className={cn('size-1.5 rounded-full', mode === 'preview' ? 'border border-gold' : 'bg-gold')} />
            {MODE_LABEL[mode]}
            {outside && e.month ? <span className="text-paper/80">· {shortMonthLabel(e.month)}</span> : null}
          </span>
          {e.badge ? <StatusBadge status={e.status} label={e.badge} className="bg-ink/70" /> : null}
        </div>
        <CityChip event={e} overlay className="absolute bottom-3 left-3" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        {e.label ? <p className="mono-label">{e.label}</p> : null}
        <h4 id={titleId} className="mt-2 text-[22px] font-medium leading-snug text-balance">
          {e.name}
        </h4>
        <p className="eyebrow mt-3">
          {dateWithYear(e)}
        </p>
        <p className="mt-3 flex items-start gap-2 text-[15px] font-light text-paper/90">
          <Icon name="pin" size={16} className="mt-1 shrink-0 text-gold-bright" />
          <span>
            {place}
            {e.region && e.region !== e.city ? <span className="text-muted"> · {e.region}</span> : null}
          </span>
        </p>
        {e.time ? <p className="mt-1.5 pl-6 text-sm font-light text-muted">{e.time}</p> : null}
        {e.line ? <p className="mt-3 text-sm font-light text-muted">{e.line}</p> : null}

        {overlaps.length ? (
          <div className="mt-4">
            <p className="mono-label">Same days</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {overlaps.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    aria-controls={id}
                    onClick={() => onPin(o.id)}
                    className="inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-full border border-paper/25 px-3.5 text-left text-xs font-medium text-paper/90 transition-colors hover:border-gold hover:text-gold"
                  >
                    <span className="truncate">{o.short}</span>
                    <span className="shrink-0 font-light text-muted">{o.dateLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-auto flex flex-col gap-3 pt-6">
          <EventCta event={e} className="w-full" />
          <div className="flex items-center justify-between gap-2">
            <StepButton dir="prev" target={stepPrev} onStep={onStep} />
            {index >= 0 ? (
              <span className="mono-label">
                {index + 1} / {total}
              </span>
            ) : null}
            <StepButton dir="next" target={stepNext} onStep={onStep} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StepButton({ dir, target, onStep }: { dir: 'prev' | 'next'; target?: CalendarEvent; onStep: (t: CalendarEvent | undefined) => void }) {
  const enabled = Boolean(target);
  return (
    <button
      type="button"
      aria-label={`${dir === 'prev' ? 'Previous' : 'Next'} event${target ? `: ${nameAndCity(target)}, ${target.dateLabel}` : ''}`}
      aria-disabled={!enabled}
      onClick={enabled ? () => onStep(target) : undefined}
      className={cn(
        'inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/90 transition-colors',
        enabled ? 'hover:text-gold' : 'cursor-not-allowed opacity-35',
        dir === 'next' && 'flex-row-reverse',
      )}
    >
      <Icon name={dir === 'prev' ? 'arrow-left' : 'arrow-right'} size={16} />
      <span aria-hidden>{dir === 'prev' ? 'Previous' : 'Next'}</span>
    </button>
  );
}

/* ------------------------------------------------------------- Agenda row */

function AgendaRow({
  event: e,
  pinned,
  inSpot,
  controls,
  onHover,
  onLeave,
  onKeyboardFocus,
  onActivate,
}: {
  event: CalendarEvent;
  pinned: boolean;
  inSpot: boolean;
  controls: string;
  onHover: () => void;
  onLeave: () => void;
  onKeyboardFocus: () => void;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pinned}
      aria-controls={controls}
      onClick={onActivate}
      onPointerEnter={(ev) => {
        if (ev.pointerType === 'mouse') onHover();
      }}
      onPointerLeave={(ev) => {
        if (ev.pointerType === 'mouse') onLeave();
      }}
      onFocus={(ev) => {
        if (ev.currentTarget.matches(':focus-visible')) onKeyboardFocus();
      }}
      className={cn(
        'group flex w-full items-center gap-3 rounded-xl border bg-ink/70 p-2.5 text-left backdrop-blur-sm transition-colors duration-300 hover:border-gold/60',
        inSpot ? 'border-gold' : e.ours ? 'border-gold-bright/40' : 'border-line',
        pinned && 'ring-1 ring-gold',
      )}
    >
      <span className="relative size-16 shrink-0 overflow-hidden rounded-lg">
        <EventVisual event={e} sizes="64px" size="mini" decorative />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="eyebrow">
          {e.dateLabel}
        </span>
        <span className="mt-1 truncate text-[15px] font-medium leading-snug text-paper">{e.name}</span>
        <span className="mt-1 truncate text-xs font-light text-muted">
          {e.label ? `${e.city} · ${e.label}` : e.city}
        </span>
      </span>
      <Icon name="chevron-right" size={16} className="shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-0.5" />
    </button>
  );
}
