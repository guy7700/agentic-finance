/**
 * Pure helpers for the "Where will you be in 2027?" questionnaire (/2027):
 * reading the personal link, campaign tracking, validation, the payload the
 * Apps Script expects (apps-script/questionnaire-2027.gs) and browser storage.
 */
import {
  audienceSegments,
  channels,
  eventCities,
  eventOptionLabel,
  eventRegions,
  events2027,
  getEvent2027,
  type Event2027,
} from '@/config/events-2027';
import { clean } from '@/lib/forms';

/* ------------------------------------------------------------------ Types */

export type Answers = {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  /** Event ids. */
  events: string[];
  cities: string[];
  regions: string[];
  other_event: string;
  not_sure: boolean;
  audiences: string[];
  company_type: string;
  role_title: string;
  seniority: string;
  hq_country: string;
  hq_city: string;
  phone: string;
  linkedin: string;
  consent: boolean;
};

export type ErrorKey = 'first_name' | 'last_name' | 'email' | 'company' | 'where' | 'audience' | 'consent';
export type Errors = Partial<Record<ErrorKey, string>>;

export type Prefill = {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  /** Form fields that came from the link, in form order. */
  prefilled: string[];
};

export type Tracking = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  channel: string;
};

/** What the thank-you page shows. Kept in sessionStorage, never in the URL. */
export type ThanksSummary = {
  first_name: string;
  events: string[];
  cities: string[];
  regions: string[];
  other: string;
  not_sure: boolean;
  audiences: string[];
};

/* ------------------------------------------------------------- Constants */

export const NOT_SURE = 'Not sure yet';
export const THANKS_PATH = '/2027/thanks';

/** Personal fields in the link. Stripped from the address bar and from `source_url`. */
export const PII_PARAMS = ['first_name', 'last_name', 'name', 'fname', 'lname', 'email', 'company'] as const;
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

/** Lengths match the Apps Script's limits. */
export const MAX = { name: 100, email: 200, company: 200, short: 100, role: 200, other: 500, phone: 60, linkedin: 300 } as const;

const RATE_LIMIT_MS = 60_000;

const STORE = {
  tracking: 'af:q2027:tracking',
  prefill: 'af:q2027:prefill',
  summary: 'af:q2027:summary',
  lastSent: 'af:q2027:last-sent',
} as const;

/* ------------------------------------------------------------ Validation */

const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const isEmail = (v: string) => EMAIL.test(v.trim());

/** An unfilled merge tag ({{first_name}}, *|FNAME|*, %NAME%, [Name]) or markup counts as missing. */
const MERGE_TAG = /[{}|*%[\]<>]/;

function linkText(raw: string | null | undefined, max: number, kind: 'name' | 'company'): string {
  if (!raw) return '';
  const v = raw.replace(/\s+/g, ' ').trim();
  if (!v || v.length > max || MERGE_TAG.test(v)) return '';
  if (kind === 'name' && (/@|https?:|www\./i.test(v) || !/\p{L}/u.test(v))) return '';
  return v;
}

function linkEmail(raw: string | null | undefined): string {
  if (!raw) return '';
  // URLSearchParams turns an unencoded "+" into a space; an address never contains one.
  const v = raw.trim().replace(/ /g, '+');
  return v.length <= MAX.email && isEmail(v) ? v : '';
}

/** Required fields, at least one place, at least one audience, consent. Keys follow the form's order. */
export function validateAnswers(a: Answers): Errors {
  const e: Errors = {};
  if (!a.first_name.trim()) e.first_name = 'Please add your first name.';
  if (!a.last_name.trim()) e.last_name = 'Please add your last name.';
  if (!a.email.trim()) e.email = 'Please add your work email.';
  else if (!isEmail(a.email)) e.email = 'That email does not look right. Please check it.';
  if (!a.company.trim()) e.company = 'Please add your company.';
  const anyPlace = a.events.length + a.cities.length + a.regions.length > 0 || a.other_event.trim() !== '' || a.not_sure;
  if (!anyPlace) e.where = 'Pick at least one event, city or region, write where you will be, or tick Not sure yet.';
  if (a.audiences.length === 0) e.audience = 'Pick at least one group you want to meet.';
  if (!a.consent) e.consent = 'Please tick this box so we can contact you about the meetings.';
  return e;
}

export const errorLabels: Record<ErrorKey, string> = {
  first_name: 'First name',
  last_name: 'Last name',
  email: 'Work email',
  company: 'Company',
  where: 'Where you will be',
  audience: 'Who you want to meet',
  consent: 'Agreement to be contacted',
};

/* ------------------------------------------------------- Personal link */

export const emptyPrefill: Prefill = { first_name: '', last_name: '', email: '', company: '', prefilled: [] };

/**
 * Name, email and company from the personal link. Accepts first_name/last_name,
 * fname/lname, or a full `name` to split. Anything missing or invalid stays empty.
 */
export function parsePrefill(params: URLSearchParams): Prefill {
  let first = linkText(params.get('first_name') || params.get('fname'), MAX.name, 'name');
  let last = linkText(params.get('last_name') || params.get('lname'), MAX.name, 'name');
  if (!first && !last) {
    const full = linkText(params.get('name'), MAX.name * 2, 'name');
    if (full) {
      const [f, ...rest] = full.split(' ');
      first = f;
      last = rest.join(' ');
    }
  }
  const email = linkEmail(params.get('email'));
  const company = linkText(params.get('company'), MAX.company, 'company');
  const values = { first_name: first, last_name: last, email, company };
  const prefilled = (Object.keys(values) as (keyof typeof values)[]).filter((k) => values[k]);
  return { ...values, prefilled };
}

/** A stored prefill is re-checked: sessionStorage is not trusted input either. */
function revalidatePrefill(p: unknown): Prefill | null {
  if (!p || typeof p !== 'object') return null;
  const o = p as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  const params = new URLSearchParams();
  params.set('first_name', str(o.first_name));
  params.set('last_name', str(o.last_name));
  params.set('email', str(o.email));
  params.set('company', str(o.company));
  const next = parsePrefill(params);
  return next.prefilled.length ? next : null;
}

export const isCompletePrefill = (p: Prefill) => Boolean(p.first_name && p.last_name && p.email && p.company);

/* ------------------------------------------------------------- Tracking */

const SOCIAL_SOURCES = new Set([
  'linkedin', 'x', 'twitter', 'facebook', 'fb', 'instagram', 'ig', 'telegram', 'threads', 'tiktok', 'youtube', 'reddit', 'meta', 'bluesky',
]);
const SOCIAL_MEDIUMS = new Set(['social', 'social-media', 'social_media', 'organic_social', 'paid_social', 'paidsocial', 'social-organic', 'social-paid']);

const isChannel = (v: string): v is (typeof channels)[number] => (channels as readonly string[]).includes(v);

/** The `channel` param if valid, else inferred from the UTM source and medium. */
export function inferChannel(source: string, medium: string): string {
  const s = source.toLowerCase();
  const m = medium.toLowerCase();
  if (m === 'email' || s === 'email') return 'email';
  if (s === 'whatsapp' || m === 'whatsapp') return 'whatsapp';
  if (s === 'luma' || s === 'lu.ma' || m === 'luma') return 'luma';
  if (s === 'dm' || m === 'dm') return 'dm';
  if (SOCIAL_SOURCES.has(s) || SOCIAL_MEDIUMS.has(m)) return 'social';
  return '';
}

/** UTM values and channel: the link first, then what this tab saved earlier. */
export function parseTracking(params: URLSearchParams, stored: Partial<Tracking> | null): Tracking {
  // clean() returns '' for anything that is not a string.
  const from = (k: keyof Tracking) => ({ url: clean(params.get(k), MAX.short), saved: clean(stored?.[k], MAX.short) });
  const t = {} as Tracking;
  for (const k of UTM_KEYS) {
    const { url, saved } = from(k);
    t[k] = url || saved;
  }
  const ch = from('channel');
  const urlChannel = ch.url.toLowerCase();
  const savedChannel = ch.saved.toLowerCase();
  t.channel = isChannel(urlChannel) ? urlChannel : isChannel(savedChannel) ? savedChannel : inferChannel(t.utm_source, t.utm_medium);
  return t;
}

/** The page URL without the personal fields, for `source_url` and the address bar. */
export function withoutPii(href: string): string {
  try {
    const url = new URL(href);
    for (const k of PII_PARAMS) url.searchParams.delete(k);
    return url.toString();
  } catch {
    return '';
  }
}

/* --------------------------------------------------------------- Initial */

export type Initial = {
  prefill: Prefill;
  tracking: Tracking;
  /** Preselected from ?event=<id> (the home calendar's link). */
  event: Event2027 | null;
  /** The link carried personal fields that should leave the address bar. */
  hasPiiInUrl: boolean;
};

/** Client only: reads the address bar and this tab's sessionStorage. */
export function readInitial(): Initial {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = parsePrefill(params);
  const prefill = fromUrl.prefilled.length ? fromUrl : (revalidatePrefill(readJson('session', STORE.prefill)) ?? emptyPrefill);
  const tracking = parseTracking(params, readJson<Partial<Tracking>>('session', STORE.tracking));
  const event = getEvent2027(params.get('event') ?? '') ?? null;
  const hasPiiInUrl = PII_PARAMS.some((k) => params.has(k));
  return { prefill, tracking, event, hasPiiInUrl };
}

/** Keep tracking and the prefill for this tab, so a reload loses neither. */
export function persistInitial(init: Initial) {
  writeJson('session', STORE.tracking, init.tracking);
  if (init.prefill.prefilled.length) writeJson('session', STORE.prefill, init.prefill);
}

export function initialAnswers(init: Initial): Answers {
  return {
    first_name: init.prefill.first_name,
    last_name: init.prefill.last_name,
    email: init.prefill.email,
    company: init.prefill.company,
    events: init.event ? [init.event.id] : [],
    cities: [],
    regions: [],
    other_event: '',
    not_sure: false,
    audiences: [],
    company_type: '',
    role_title: '',
    seniority: '',
    hq_country: '',
    hq_city: '',
    phone: '',
    linkedin: '',
    consent: false,
  };
}

/* --------------------------------------------------------------- Payload */

/** Selected values in menu order, whatever order they were ticked in. */
const inOrder = <T extends string>(selected: string[], options: readonly T[]) => options.filter((o) => selected.includes(o));

export function selectedEvents(a: Answers) {
  return events2027.filter((e) => a.events.includes(e.id));
}

export type Payload = ReturnType<typeof buildPayload>;

export function buildPayload(a: Answers, ctx: { tracking: Tracking; prefilled: string[]; honeypot: string; elapsedMs: number }) {
  const events = selectedEvents(a);
  return {
    formType: 'Questionnaire 2027',
    first_name: clean(a.first_name, MAX.name),
    last_name: clean(a.last_name, MAX.name),
    email: a.email.trim().slice(0, MAX.email),
    company: clean(a.company, MAX.company),
    company_type: clean(a.company_type, MAX.short),
    role_title: clean(a.role_title, MAX.role),
    seniority: clean(a.seniority, MAX.short),
    hq_country: clean(a.hq_country, MAX.short),
    hq_city: clean(a.hq_city, MAX.short),
    events_selected: [...events.map(eventOptionLabel), ...(a.not_sure ? [NOT_SURE] : [])],
    event_ids: events.map((e) => e.id),
    cities_selected: inOrder(a.cities, eventCities),
    regions_selected: inOrder(a.regions, eventRegions),
    other_event: clean(a.other_event, MAX.other),
    audience_wanted: inOrder(a.audiences, audienceSegments),
    phone: clean(a.phone, MAX.phone),
    linkedin: clean(a.linkedin, MAX.linkedin),
    consent: true as const,
    utm_source: ctx.tracking.utm_source,
    utm_medium: ctx.tracking.utm_medium,
    utm_campaign: ctx.tracking.utm_campaign,
    utm_content: ctx.tracking.utm_content,
    channel: ctx.tracking.channel,
    prefilled: ctx.prefilled.join(','),
    source_url: withoutPii(window.location.href).slice(0, 500),
    website: ctx.honeypot,
    elapsed_ms: ctx.elapsedMs,
    submitted_at: new Date().toISOString(),
  };
}

export function toSummary(p: Payload, a: Answers): ThanksSummary {
  return {
    first_name: p.first_name,
    events: selectedEvents(a).map(eventOptionLabel),
    cities: p.cities_selected,
    regions: p.regions_selected,
    other: p.other_event,
    not_sure: a.not_sure,
    audiences: p.audience_wanted,
  };
}

/* --------------------------------------------------------------- Storage */

type Area = 'session' | 'local';
const area = (a: Area) => (a === 'session' ? window.sessionStorage : window.localStorage);

/** Storage can be blocked (private mode, settings), so every access is guarded. */
export function readJson<T>(a: Area, key: string): T | null {
  try {
    const raw = area(a).getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(a: Area, key: string, value: unknown) {
  try {
    area(a).setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: carry on without it */
  }
}

export function saveSummary(s: ThanksSummary) {
  writeJson('session', STORE.summary, s);
}

/** Raw string, so useSyncExternalStore gets a stable snapshot. */
export function readSummaryRaw(): string | null {
  try {
    return window.sessionStorage.getItem(STORE.summary);
  } catch {
    return null;
  }
}

export function parseSummary(raw: string | null): ThanksSummary | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Partial<ThanksSummary>;
    const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 60) : []);
    const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
    return {
      first_name: str(o.first_name, MAX.name),
      events: list(o.events),
      cities: list(o.cities),
      regions: list(o.regions),
      other: str(o.other, MAX.other),
      not_sure: o.not_sure === true,
      audiences: list(o.audiences),
    };
  } catch {
    return null;
  }
}

/** True when this browser sent the form less than a minute ago. */
export function sentRecently(): boolean {
  try {
    const last = Number(window.localStorage.getItem(STORE.lastSent) || 0);
    return last > 0 && Date.now() - last < RATE_LIMIT_MS;
  } catch {
    return false;
  }
}

export function markSent() {
  try {
    window.localStorage.setItem(STORE.lastSent, String(Date.now()));
  } catch {
    /* storage unavailable: the server still rate-limits */
  }
}

/** Cities that host at least one listed event in a region, for the region chips. */
export function citiesIn(region: string) {
  return [...new Set(events2027.filter((e) => e.region === region).map((e) => e.city))].sort((a, b) => a.localeCompare(b));
}
