'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { questionnaire2027 } from '@/config/events-2027';
import { contacts } from '@/config/site';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { parseSummary, readSummaryRaw } from './lib';

const noopSubscribe = () => () => {};
const serverSnapshot = () => null;

/**
 * The thank-you screen. Answers come from this tab's sessionStorage (never the
 * URL); without them it is a plain thank-you.
 */
export function ThanksContent() {
  const raw = useSyncExternalStore(noopSubscribe, readSummaryRaw, serverSnapshot);
  const summary = useMemo(() => parseSummary(raw), [raw]);
  const name = summary?.first_name.split(' ')[0] ?? '';

  const rows = summary
    ? [
        { label: 'Events', items: summary.events },
        { label: 'Somewhere else', items: summary.other ? [summary.other] : [] },
        { label: 'Who you would like to connect with', items: summary.audiences },
        { label: 'What you need', items: summary.more ? [summary.more] : [] },
      ].filter((r) => r.items.length)
    : [];

  return (
    <>
      <span className="glow-gold mt-8 flex size-14 items-center justify-center rounded-full bg-gold text-ink">
        <Icon name="check" size={26} strokeWidth={2.2} />
      </span>
      <h1 className="display-hero mt-7 text-[length:var(--text-display-md)]">
        {name ? (
          <>
            Thanks, <span className="serif-accent">{name}.</span>
          </>
        ) : (
          'Thanks.'
        )}
      </h1>
      <p className="lede mt-5 max-w-2xl">We have your answers. A confirmation email is on its way.</p>

      {rows.length ? (
        <section aria-labelledby="t-have" className="edge-gold relative mt-10 rounded-2xl border border-line bg-ink-card p-5 sm:p-8">
          <h2 id="t-have" className="text-[clamp(1.2rem,1.1rem+0.5vw,1.5rem)] font-normal leading-tight">
            Here is what we have:
          </h2>
          <dl className="mt-4 divide-y divide-line">
            {rows.map((r) => (
              <div key={r.label} className="grid gap-2.5 py-4 last:pb-0 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-6">
                <dt className="mono-label pt-1.5">{r.label}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {r.items.map((item) => (
                      <li key={item} className="whitespace-pre-line break-words rounded-lg border border-gold/35 bg-gold/10 px-3 py-1.5 text-[14px] leading-snug text-gold-bright">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section aria-label="What happens next" className="mt-6 rounded-2xl border border-gold/40 bg-gold/[0.05] p-5 sm:p-8">
        <p className="text-[17px] font-light leading-relaxed text-paper/90">
          <span className="font-semibold text-gold">Next:</span> within a few days we’ll come back with the institutions and people we can put you in
          front of in each city, and how we’d set up the meetings.
        </p>
        <p className="mt-5 text-[17px] font-light leading-relaxed text-paper/90">
          Want to move faster? Book 30 minutes with our founder, Tal Mor.
        </p>
        <div className="mt-5">
          <ButtonLink href={questionnaire2027.bookingUrl} size="lg">
            Book 30 minutes with Tal
          </ButtonLink>
        </div>
        <p className="mt-5 text-[13.5px] text-subtle">
          Anything to add? Email{' '}
          <a href={`mailto:${contacts.general}`} className="font-semibold text-gold underline-offset-4 hover:underline">
            {contacts.general}
          </a>
          .
        </p>
      </section>
    </>
  );
}
