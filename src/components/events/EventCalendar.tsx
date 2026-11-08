'use client';

import { useId, useMemo, useState, useSyncExternalStore } from 'react';
import { calendarRange, clampMonth, localToday, type CalendarEvent, type YearMonth } from '@/lib/calendar';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { ListView, TbcStrip } from './ListView';
import { MonthView } from './MonthView';
import { plural } from './parts';

type View = 'calendar' | 'list';

export type EventCalendarProps = {
  /** Build with `buildCalendarEvents` from '@/lib/calendar'. */
  events: CalendarEvent[];
  /** 'YYYY-MM' to open on. Defaults to the month of the next event. */
  initialMonth?: YearMonth;
  /** First navigable month. Defaults to one month before the first event. */
  from?: YearMonth;
  /** Last navigable month. Defaults to December of the last event's year. */
  to?: YearMonth;
  className?: string;
};

// Client-only reads, through useSyncExternalStore so the static HTML and the
// first client render agree (server snapshot: null).
const WIDE_QUERY = '(min-width: 768px)';
const subscribeWide = (onChange: () => void) => {
  const mq = window.matchMedia(WIDE_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};
const getWide = () => window.matchMedia(WIDE_QUERY).matches;
const getNull = () => null;
const noopSubscribe = () => () => {};

/**
 * Upcoming events as a monthly calendar with a spotlight card, or as a photo
 * list. Our own next event and its Gala come first, then the 2027 events from
 * src/config/events-2027.ts. Events without exact days never sit on a day:
 * they are listed under their month in the calendar and in the "Dates to be
 * confirmed" strip under both views.
 *
 * Wide screens default to the calendar, phones to the list, until the visitor
 * picks a view. Heading levels: month headings are h3, event names h4. Place it
 * under a section h2.
 */
export function EventCalendar(props: EventCalendarProps) {
  if (props.events.length === 0) {
    return <p className="font-light text-muted">New dates are announced here first.</p>;
  }
  return <EventCalendarInner {...props} />;
}

function EventCalendarInner({ events, initialMonth, from, to, className }: EventCalendarProps) {
  const uid = useId();
  const range = useMemo(() => calendarRange(events), [events]);
  const first = from ?? range.first;
  const last = to ?? range.last;
  const startMonth = initialMonth ?? events.find((e) => e.featured)?.month ?? events.find((e) => e.month)?.month ?? first;

  const [month, setMonth] = useState<YearMonth>(() => clampMonth(startMonth, first, last));
  const [pinned, setPinned] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [slide, setSlide] = useState<-1 | 0 | 1>(0);
  const [choice, setChoice] = useState<View | null>(null);

  const wide = useSyncExternalStore(subscribeWide, getWide, getNull);
  const today = useSyncExternalStore(noopSubscribe, localToday, getNull);

  // null until hydrated: both views are in the HTML and CSS shows the right one.
  const view: View | null = choice ?? (wide === null ? null : wide ? 'calendar' : 'list');
  const cityCount = new Set(events.map((e) => e.city)).size;

  const goMonth = (m: YearMonth, pin?: string) => {
    const target = clampMonth(m, first, last);
    if (target !== month) setSlide(target > month ? 1 : -1);
    setMonth(target);
    setPinned(pin ?? null);
    setPreview(null);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="mono-label flex items-center gap-2">
          <Icon name="pin" size={14} className="text-gold-bright" />
          {plural(events.length, 'event')} in {plural(cityCount, 'city', 'cities')}
        </p>
        <ViewToggle view={view} onChange={setChoice} />
      </div>

      {view !== 'list' ? (
        <div className={view === null ? 'hidden md:block' : undefined}>
          <MonthView
            uid={uid}
            events={events}
            month={month}
            first={first}
            last={last}
            today={today}
            pinned={pinned}
            preview={preview}
            slide={slide}
            onMonth={goMonth}
            onPin={(id) => {
              setPinned(id);
              setPreview(null);
            }}
            onPreview={setPreview}
          />
        </div>
      ) : null}

      {view !== 'calendar' ? (
        <div className={view === null ? 'md:hidden' : undefined}>
          <ListView uid={uid} events={events} />
        </div>
      ) : null}

      <TbcStrip uid={uid} events={events} />
    </div>
  );
}

function ViewToggle({ view, onChange }: { view: View | null; onChange: (v: View) => void }) {
  const options: { value: View; label: string; icon: 'calendar' | 'menu'; auto: string }[] = [
    { value: 'calendar', label: 'Calendar', icon: 'calendar', auto: 'md:bg-gold md:text-ink' },
    { value: 'list', label: 'List', icon: 'menu', auto: 'max-md:bg-gold max-md:text-ink' },
  ];
  return (
    <div role="group" aria-label="View events as" className="inline-flex rounded-full border border-line-strong bg-ink-card p-1">
      {options.map((o) => {
        const on = view === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={view === null ? undefined : on}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300',
              on ? 'bg-gold text-ink' : 'text-paper/80 hover:text-gold',
              view === null && o.auto,
            )}
          >
            <Icon name={o.icon} size={16} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
