import type { Event2027 } from '@/config/events-2027';
import type { UpcomingEvent } from '@/data/events';
import type { Edition, EditionStatus, ImageAsset } from '@/data/types';

/**
 * Calendar helpers for the home page events calendar. Pure and server-safe: no
 * data imports, no clock reads except `localToday`, which only the client calls.
 *
 * Our own next event and its Gala come from the published date lines in
 * src/data ("Friday 4 December 2026", weekday checked). The 2027 events come
 * from src/config/events-2027.ts: `start`/`end` place an event on its days;
 * without them it is "to be confirmed" and never lands on a day.
 */

/** 'YYYY-MM' */
export type YearMonth = string;
/** 'YYYY-MM-DD' */
export type IsoDay = string;

export const MONTH_NAMES: readonly string[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Weekdays in grid order: weeks start on Monday. */
export const WEEKDAYS: readonly string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const pad = (n: number) => String(n).padStart(2, '0');

export function toYearMonth(year: number, month: number): YearMonth {
  return `${year}-${pad(month)}`;
}

export function parseYearMonth(ym: YearMonth): { year: number; month: number } {
  const [y, m] = ym.split('-').map(Number);
  return { year: y, month: m };
}

export function shiftMonth(ym: YearMonth, delta: number): YearMonth {
  const { year, month } = parseYearMonth(ym);
  const index = year * 12 + (month - 1) + delta;
  return toYearMonth(Math.floor(index / 12), (index % 12) + 1);
}

export function clampMonth(ym: YearMonth, first: YearMonth, last: YearMonth): YearMonth {
  if (ym < first) return first;
  if (ym > last) return last;
  return ym;
}

/** "December 2026" */
export function monthLabel(ym: YearMonth): string {
  const { year, month } = parseYearMonth(ym);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

/** "Dec 2026" */
export function shortMonthLabel(ym: YearMonth): string {
  const { year, month } = parseYearMonth(ym);
  return `${MONTH_NAMES[month - 1].slice(0, 3)} ${year}`;
}

/** Day numbers of a month in Monday-first weeks; null pads the first and last week. */
export function monthWeeks(ym: YearMonth): (number | null)[][] {
  const { year, month } = parseYearMonth(ym);
  const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const days = daysInMonth(ym);
  const cells: (number | null)[] = [...Array<null>(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function daysInMonth(ym: YearMonth): number {
  const { year, month } = parseYearMonth(ym);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function isoDay(ym: YearMonth, day: number): IsoDay {
  return `${ym}-${pad(day)}`;
}

/** Parts of an ISO day, computed in UTC so server and client agree. */
export function dayParts(iso: IsoDay): { day: number; weekday: string; monthName: string; year: number } {
  const [y, m, d] = iso.split('-').map(Number);
  const weekday = WEEKDAYS[(new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7];
  return { day: d, weekday, monthName: MONTH_NAMES[m - 1], year: y };
}

/** "Friday 4 December 2026" */
export function dayLabel(iso: IsoDay): string {
  const p = dayParts(iso);
  return `${p.weekday} ${p.day} ${p.monthName} ${p.year}`;
}

/** Every day from `start` to `end`, both included. */
export function eachDay(start: IsoDay, end: IsoDay): IsoDay[] {
  const out: IsoDay[] = [];
  const d = new Date(`${start}T00:00:00Z`);
  for (let guard = 0; guard < 400; guard++) {
    const iso = d.toISOString().slice(0, 10);
    if (iso > end) break;
    out.push(iso);
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
}

/** Today on the visitor's clock. Client only: call after hydration. */
export function localToday(): IsoDay {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const DAY_RE = new RegExp(`\\b(${WEEKDAYS.join('|')})\\s+(\\d{1,2})\\s+(${MONTH_NAMES.join('|')})\\s+(\\d{4})\\b`);
const TIME_RE = /\b\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}(?:\s+[A-Z]{2,4}\b)?/;
const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
/** A short date label such as "18-22 Jan" or "6 Oct". */
const SHORT_LABEL_RE = /^(\d{1,2})(?:-(\d{1,2}))?\s+([A-Z][a-z]{2})$/;

function isRealDay(iso: string): boolean {
  if (!ISO_RE.test(iso)) return false;
  const d = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}

/**
 * Finds a full date line such as "Friday 4 December 2026" inside `text`.
 * Throws when the weekday does not match the date, so a typo in the data
 * fails loudly instead of moving an event to the wrong day.
 */
export function parseDayText(text: string): { iso: IsoDay; text: string } | undefined {
  const m = DAY_RE.exec(text);
  if (!m) return undefined;
  const [match, weekday, d, monthName, y] = m;
  const iso = `${y}-${pad(MONTH_NAMES.indexOf(monthName) + 1)}-${pad(Number(d))}`;
  if (!isRealDay(iso)) throw new Error(`Event calendar: "${match}" is not a real date.`);
  if (dayParts(iso).weekday !== weekday) {
    throw new Error(`Event calendar: "${match}" names the wrong weekday.`);
  }
  return { iso, text: match };
}

export type CalendarEvent = {
  id: string;
  /** Our Summit, our Gala, or an event from the 2027 menu. */
  kind: 'summit' | 'gala' | 'event';
  /** Agentic Finance's own event. */
  ours: boolean;
  name: string;
  /** Name without its parenthetical, for a calendar cell. */
  short: string;
  /** Exact first day. Set only when the data names the days. */
  start?: IsoDay;
  /** Exact last day; equals `start` for a one-day event. */
  end?: IsoDay;
  /** Month of `start`, or the best-known month of an event to be confirmed. Absent when unknown. */
  month?: YearMonth;
  /** Date line exactly as published. */
  dateLabel: string;
  /** Calendar year of the event, for labels that leave it out ("21-22 Apr"). */
  year: number;
  time?: string;
  city: string;
  country?: string;
  venue?: string;
  region?: string;
  /** Small mono label on cards: the 2027 category, or "Agentic Finance". */
  label: string;
  line?: string;
  href: string;
  /** Link label. */
  cta: string;
  /** City photograph. Absent means a placeholder tile with the city name. */
  image?: ImageAsset;
  status: EditionStatus;
  badge?: string;
  /** The next event itself. */
  featured: boolean;
};

/** True when the event has exact days and sits on the grid. */
export const isDated = (e: CalendarEvent): e is CalendarEvent & { start: IsoDay; end: IsoDay; month: YearMonth } =>
  e.start !== undefined && e.end !== undefined;

/** Questionnaire link that preselects the event. */
export const questionnaireHref = (id: string) => `/2027?event=${encodeURIComponent(id)}`;

export const QUESTIONNAIRE_CTA = 'Tell us if you’ll be there';

const MONTH_ABBR = MONTH_NAMES.map((m) => m.slice(0, 3));

/**
 * Builds the calendar entries: our next event and its Gala first (from
 * src/data/events.ts and src/data/editions.ts), then every event of the 2027
 * menu (src/config/events-2027.ts), in date order. Events to be confirmed
 * follow, ordered by their best-known month, unknown months last.
 */
export function buildCalendarEvents({
  nextEvent,
  editions,
  events,
  year,
}: {
  nextEvent: UpcomingEvent;
  editions: Edition[];
  /** `events2027` */
  events: Event2027[];
  /** `EVENTS_YEAR` */
  year: number;
}): CalendarEvent[] {
  const bySlug = new Map(editions.map((e) => [e.slug, e]));
  const ours: CalendarEvent[] = [];

  const nextEdition = bySlug.get(nextEvent.id);
  const summit = parseDayText(nextEvent.date);
  if (!summit) throw new Error(`Event calendar: the next event needs a full date, got "${nextEvent.date}".`);
  ours.push({
    id: nextEvent.id,
    kind: 'summit',
    ours: true,
    name: nextEvent.name,
    short: 'Summit',
    start: summit.iso,
    end: summit.iso,
    month: summit.iso.slice(0, 7),
    dateLabel: nextEvent.date,
    year: Number(summit.iso.slice(0, 4)),
    time: nextEvent.time,
    city: nextEvent.city,
    country: nextEdition?.country,
    venue: nextEvent.venue,
    label: 'Agentic Finance',
    line: nextEvent.line,
    href: nextEvent.href,
    cta: 'Event page',
    image: nextEdition?.image,
    status: 'upcoming',
    badge: 'Next event',
    featured: true,
  });

  const gala = nextEdition?.experiences?.find((x) => x.id === 'gala');
  const galaDay = gala ? parseDayText(gala.when) : undefined;
  if (gala && galaDay) {
    const noteDay = nextEvent.note ? parseDayText(nextEvent.note) : undefined;
    if (noteDay && noteDay.iso !== galaDay.iso) {
      throw new Error(`Event calendar: Gala date "${galaDay.text}" does not match the note "${noteDay.text}".`);
    }
    if (galaDay.iso === summit.iso) {
      throw new Error('Event calendar: the Summit and the Gala must be on different days.');
    }
    const invitation = gala.points.find((p) => /invitation/i.test(p));
    ours.push({
      id: `${nextEvent.id}-gala`,
      kind: 'gala',
      ours: true,
      name: gala.name,
      short: gala.name,
      start: galaDay.iso,
      end: galaDay.iso,
      month: galaDay.iso.slice(0, 7),
      dateLabel: galaDay.text,
      year: Number(galaDay.iso.slice(0, 4)),
      time: TIME_RE.exec(gala.when)?.[0],
      city: nextEvent.city,
      country: nextEdition?.country,
      label: 'Agentic Finance',
      line: invitation ? `${invitation.replace(/\.$/, '')}.` : gala.summary,
      href: gala.href ?? `/editions/${nextEvent.id}/gala`,
      cta: 'Gala details',
      status: 'upcoming',
      badge: 'Invitation only',
      featured: false,
    });
  }

  const menu: CalendarEvent[] = events.map((e) => {
    if ((e.start === undefined) !== (e.end === undefined)) {
      throw new Error(`Event calendar: ${e.id} needs both start and end, or neither.`);
    }
    if (e.start !== undefined && e.end !== undefined) {
      if (!isRealDay(e.start) || !isRealDay(e.end)) throw new Error(`Event calendar: ${e.id} has a date that is not a real day.`);
      if (e.end < e.start) throw new Error(`Event calendar: ${e.id} ends before it starts.`);
      // When the label is a plain "18-22 Jan", it must agree with start and end.
      const m = SHORT_LABEL_RE.exec(e.dateLabel);
      if (m) {
        const [, from, to = from, mon] = m;
        const ok =
          Number(from) === Number(e.start.slice(8)) &&
          Number(to) === Number(e.end.slice(8)) &&
          MONTH_ABBR.indexOf(mon) + 1 === Number(e.start.slice(5, 7)) &&
          e.start.slice(5, 7) === e.end.slice(5, 7);
        if (!ok) throw new Error(`Event calendar: ${e.id} label "${e.dateLabel}" does not match ${e.start} to ${e.end}.`);
      }
    }
    if (e.month !== undefined && !(Number.isInteger(e.month) && e.month >= 1 && e.month <= 12)) {
      throw new Error(`Event calendar: ${e.id} has month ${e.month}; use 1 to 12.`);
    }
    const month = e.start ? e.start.slice(0, 7) : e.month ? toYearMonth(year, e.month) : undefined;
    return {
      id: e.id,
      kind: 'event',
      ours: false,
      name: e.name,
      short: e.name.replace(/\s*\([^)]*\)/g, '').trim() || e.name,
      start: e.start,
      end: e.end,
      month,
      dateLabel: e.dateLabel,
      year: e.start ? Number(e.start.slice(0, 4)) : year,
      city: e.city,
      region: e.region,
      label: e.category,
      href: questionnaireHref(e.id),
      cta: QUESTIONNAIRE_CTA,
      image: e.image,
      status: 'planned',
      featured: false,
    };
  });

  // Dated events by first day (ties keep the config order); then the rest by month.
  const key = (e: CalendarEvent) => e.start ?? (e.month ? `${e.month}-99` : '9999-99-99');
  const all = [...ours, ...menu];
  const ids = new Set<string>();
  for (const e of all) {
    if (ids.has(e.id)) throw new Error(`Event calendar: duplicate event id "${e.id}".`);
    ids.add(e.id);
  }
  return all.sort((a, b) => {
    if (isDated(a) !== isDated(b)) return isDated(a) ? -1 : 1;
    const ka = key(a);
    const kb = key(b);
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });
}

/**
 * Default navigable range: one month of lead-in before the first event, through
 * December of the last event's year.
 */
export function calendarRange(events: CalendarEvent[]): { first: YearMonth; last: YearMonth } {
  const months = events.flatMap((e) => (e.month ? [e.month] : [])).sort();
  const ends = events.flatMap((e) => (e.end ? [e.end.slice(0, 7)] : []));
  const lastMonth = [...months, ...ends].sort().at(-1) ?? months[0];
  return { first: shiftMonth(months[0], -1), last: `${lastMonth.slice(0, 4)}-12` };
}
