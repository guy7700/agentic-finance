'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import type { DirectoryEntry } from '@/lib/speaker-cards';
import { cn } from '@/lib/cn';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { SpeakerCard } from './SpeakerCard';

type Option = { value: string; label: string; count: number };

type SpeakerDirectoryProps = {
  entries: DirectoryEntry[];
  events: Option[];
  cities: Option[];
  organizations: Option[];
  /** Copy for events with no announced speakers yet, keyed by event label. */
  emptyEvents?: Record<string, { title: string; body: string }>;
};

const ALL = '';

/**
 * Filterable speaker directory. Filters are mirrored into the query string
 * (?event=&city=&org=&q=) with history.replaceState, so a filtered view can be
 * shared without triggering navigation.
 */
export function SpeakerDirectory({ entries, events, cities, organizations, emptyEvents = {} }: SpeakerDirectoryProps) {
  const [q, setQ] = useState('');
  const [event, setEvent] = useState(ALL);
  const [city, setCity] = useState(ALL);
  const [org, setOrg] = useState(ALL);
  const [hydrated, setHydrated] = useState(false);
  const uid = useId();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from the shareable URL */
    setQ(p.get('q') ?? '');
    setEvent(p.get('event') ?? ALL);
    setCity(p.get('city') ?? ALL);
    setOrg(p.get('org') ?? ALL);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (event) p.set('event', event);
    if (city) p.set('city', city);
    if (org) p.set('org', org);
    const qs = p.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
    window.history.replaceState(window.history.state, '', url);
  }, [q, event, city, org, hydrated]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (!needle || e.search.includes(needle)) &&
        (!event || e.events.includes(event)) &&
        (!city || e.cities.includes(city)) &&
        (!org || e.organization === org),
    );
  }, [entries, q, event, city, org]);

  const active = Boolean(q || event || city || org);
  const reset = () => {
    setQ('');
    setEvent(ALL);
    setCity(ALL);
    setOrg(ALL);
  };
  const empty = event ? emptyEvents[event] : undefined;

  return (
    <div>
      <div className="sticky top-[var(--header-h)] z-20 -mx-4 border-y border-line bg-ink/92 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex flex-col gap-3">
          <div role="group" aria-label="Filter by event" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            <FilterChip active={!event} onClick={() => setEvent(ALL)} label="All editions" count={entries.length} />
            {events.map((o) => (
              <FilterChip key={o.value} active={event === o.value} onClick={() => setEvent(o.value)} label={o.label} count={o.count} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
            <label className="relative block">
              <span className="sr-only">Search speakers</span>
              <Icon name="search" size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, company, expertise"
                className="h-11 w-full rounded-full border border-line-strong bg-ink-card pl-10 pr-4 text-sm text-paper placeholder:text-subtle focus:border-gold focus:outline-none"
              />
            </label>
            <SelectFilter id={`${uid}-city`} label="City" value={city} onChange={setCity} options={cities} allLabel="All cities" />
            <SelectFilter id={`${uid}-org`} label="Organisation" value={org} onChange={setOrg} options={organizations} allLabel="All organisations" />
          </div>
        </div>
      </div>

      <h2 className="sr-only">Speaker directory</h2>
      <div className="mt-8 flex items-center justify-between gap-4">
        <p aria-live="polite" className="mono-label">
          {results.length} {results.length === 1 ? 'speaker' : 'speakers'}
          {active ? ' match your filters' : ' across the series'}
        </p>
        {active ? (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-bright">
            <Icon name="close" size={14} />
            Clear filters
          </button>
        ) : null}
      </div>

      {results.length ? (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((s) => (
            <li key={s.slug}>
              <SpeakerCard speaker={s} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong px-6 py-14 text-center sm:px-14">
          <p className="display-tight text-2xl sm:text-3xl">{empty?.title ?? 'No speakers match these filters.'}</p>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            {empty?.body ?? 'Try a different city or organisation, or clear the filters to see the full directory.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {empty ? (
              <ButtonLink href="/speakers/nominate">Nominate a speaker</ButtonLink>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-12 items-center rounded-full border border-paper/80 px-5 text-sm font-semibold hover:bg-paper hover:text-ink"
            >
              Show all speakers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition-colors',
        active ? 'border-gold bg-gold text-ink' : 'border-line-strong text-paper/85 hover:border-gold hover:text-gold',
      )}
    >
      {label}
      <span className={cn('font-mono text-[11px]', active ? 'text-ink/70' : 'text-subtle')}>{count}</span>
    </button>
  );
}

function SelectFilter({
  id,
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  allLabel: string;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-full border border-line-strong bg-ink-card pl-4 pr-9 text-sm text-paper focus:border-gold focus:outline-none"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label} ({o.count})
          </option>
        ))}
      </select>
      <Icon name="chevron-down" size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
    </div>
  );
}
