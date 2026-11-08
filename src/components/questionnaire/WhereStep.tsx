'use client';

import { useRef, type KeyboardEvent } from 'react';
import { eventCategories, eventCities, eventOptionLabel, eventRegions, events2027, type Event2027 } from '@/config/events-2027';
import { cn } from '@/lib/cn';
import { CardChip, Chip, toggle } from './Chips';
import { MAX, NOT_SURE, citiesIn, type Answers } from './lib';

export type WhereTab = 'events' | 'cities' | 'regions';

const TABS: { id: WhereTab; label: string }[] = [
  { id: 'events', label: 'Events' },
  { id: 'cities', label: 'Cities' },
  { id: 'regions', label: 'Regions' },
];

const inputClass =
  'h-12 w-full rounded-lg border border-line-strong bg-paper/[0.03] px-4 text-[15px] font-light text-paper placeholder:text-subtle transition-colors focus:border-gold focus:outline-none focus-visible:outline-none';

type WhereStepProps = {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  tab: WhereTab;
  onTab: (tab: WhereTab) => void;
  errorId?: string;
};

/** Event label with its date picked out in gold; the text reads exactly as eventOptionLabel. */
function EventLabel({ event }: { event: Event2027 }) {
  const label = eventOptionLabel(event);
  if (!label.startsWith(event.dateLabel)) return <>{label}</>;
  return (
    <>
      <span className="font-medium text-gold-bright">{event.dateLabel}</span>
      <span className="text-paper/90">{label.slice(event.dateLabel.length)}</span>
    </>
  );
}

/**
 * Step 2: three quick ways to say where you will be (events, cities, regions),
 * as tabs, plus a free-text line and "Not sure yet".
 */
export function WhereStep({ answers, update, tab, onTab, errorId }: WhereStepProps) {
  const tabRefs = useRef<Record<WhereTab, HTMLButtonElement | null>>({ events: null, cities: null, regions: null });
  const counts: Record<WhereTab, number> = {
    events: answers.events.length,
    cities: answers.cities.length,
    regions: answers.regions.length,
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = TABS.length - 1;
    const next =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    onTab(TABS[next].id);
    tabRefs.current[TABS[next].id]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Answer by" className="grid grid-cols-3 gap-1 rounded-full border border-line-strong bg-ink p-1">
        {TABS.map((t, i) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`q-tab-${t.id}`}
              aria-controls={`q-panel-${t.id}`}
              aria-selected={on}
              aria-describedby={errorId}
              tabIndex={on ? 0 : -1}
              onClick={() => onTab(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 sm:gap-2 sm:tracking-[0.18em]',
                on ? 'bg-gold text-ink' : 'text-paper/80 hover:text-gold',
              )}
            >
              {t.label}
              {counts[t.id] ? (
                <span
                  className={cn(
                    'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] leading-5 tracking-normal',
                    on ? 'bg-ink text-gold' : 'bg-gold/20 text-gold-bright',
                  )}
                >
                  <span className="sr-only">, </span>
                  {counts[t.id]}
                  <span className="sr-only"> picked</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="q-panel-events" aria-labelledby="q-tab-events" hidden={tab !== 'events'} className="mt-6">
        {eventCategories.map((category) => {
          const items = events2027.filter((e) => e.category === category);
          if (!items.length) return null;
          return (
            <fieldset key={category} className="mt-7 first:mt-0">
              <legend className="mono-label">{category}</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {items.map((e) => (
                  <CardChip
                    key={e.id}
                    name="events"
                    value={e.id}
                    checked={answers.events.includes(e.id)}
                    onChange={(on) => update({ events: toggle(answers.events, e.id, on) })}
                  >
                    <EventLabel event={e} />
                  </CardChip>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>

      <div role="tabpanel" id="q-panel-cities" aria-labelledby="q-tab-cities" hidden={tab !== 'cities'} className="mt-6">
        <fieldset>
          <legend className="sr-only">Cities</legend>
          <div className="flex flex-wrap gap-2">
            {eventCities.map((c) => (
              <Chip key={c} name="cities" value={c} checked={answers.cities.includes(c)} onChange={(on) => update({ cities: toggle(answers.cities, c, on) })}>
                {c}
              </Chip>
            ))}
          </div>
        </fieldset>
      </div>

      <div role="tabpanel" id="q-panel-regions" aria-labelledby="q-tab-regions" hidden={tab !== 'regions'} className="mt-6">
        <fieldset>
          <legend className="sr-only">Regions</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {eventRegions.map((r) => (
              <CardChip key={r} name="regions" value={r} checked={answers.regions.includes(r)} onChange={(on) => update({ regions: toggle(answers.regions, r, on) })}>
                <span className="block text-[16px] font-medium text-paper">{r}</span>
                <span className="mt-0.5 block text-[13px] font-light text-muted">{citiesIn(r).join(', ')}</span>
              </CardChip>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-7 grid gap-4 border-t border-line pt-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="flex flex-col gap-2">
          <label htmlFor="q-other-event" className="text-sm font-semibold text-paper">
            Somewhere else? Tell us where
          </label>
          <input
            id="q-other-event"
            name="other_event"
            type="text"
            maxLength={MAX.other}
            value={answers.other_event}
            onChange={(e) => update({ other_event: e.target.value })}
            placeholder="An event, a city or a month"
            className={inputClass}
          />
        </div>
        <Chip name="not_sure" value={NOT_SURE} checked={answers.not_sure} onChange={(on) => update({ not_sure: on })} className="h-12 justify-center">
          {NOT_SURE}
        </Chip>
      </div>
    </div>
  );
}
