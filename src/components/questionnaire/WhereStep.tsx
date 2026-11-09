'use client';

import { type Event2027 } from '@/config/events-2027';
import { PhotoCard, toggle } from './Chips';
import { MAX, eventList, type Answers } from './lib';

const inputClass =
  'h-12 w-full rounded-lg border border-line-strong bg-paper/[0.03] px-4 text-[15px] font-light text-paper placeholder:text-subtle transition-colors focus:border-gold focus:outline-none focus-visible:outline-none';

type WhereStepProps = {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  errorId?: string;
};

/** The small square version of the event's city photo (public/assets/events/thumbs). */
const thumbOf = (e: Event2027) => e.image?.src.replace('/assets/events/', '/assets/events/thumbs/');

/** City, plus the days when they are confirmed. Unconfirmed dates are not shown. */
const eventMeta = (e: Event2027) => (e.start ? `${e.city} · ${e.dateLabel}` : e.city);

/**
 * Step 1: one flat list of the 2027 events, in calendar order, plus a free-text
 * line for anywhere else.
 */
export function WhereStep({ answers, update, errorId }: WhereStepProps) {
  return (
    <div>
      <fieldset aria-describedby={errorId} className="relative">
        <legend className="sr-only">Events</legend>
        {/* On a phone the list scrolls inside its own box, so the page stays short. */}
        <div className="grid max-h-[23rem] gap-1.5 overflow-y-auto overscroll-contain rounded-xl border border-line p-1.5 pb-8 sm:max-h-none sm:grid-cols-2 sm:gap-2 sm:overflow-visible sm:border-0 sm:p-0">
          {eventList.map((e) => (
            <PhotoCard
              key={e.id}
              name="events"
              value={e.id}
              checked={answers.events.includes(e.id)}
              onChange={(on) => update({ events: toggle(answers.events, e.id, on) })}
              photo={thumbOf(e)}
            >
              <span className="block font-medium text-paper">{e.name}</span>
              <span className="mt-0.5 block text-[12px] font-light text-muted">{eventMeta(e)}</span>
            </PhotoCard>
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-px bottom-px h-10 rounded-b-xl bg-gradient-to-t from-ink-card to-transparent sm:hidden" />
      </fieldset>

      <div className="mt-5 flex flex-col gap-2 border-t border-line pt-5">
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
    </div>
  );
}
