'use client';

import { useEffect, useState } from 'react';

const UNITS = [
  { key: 'd', label: 'Days', ms: 86_400_000 },
  { key: 'h', label: 'Hours', ms: 3_600_000 },
  { key: 'm', label: 'Min', ms: 60_000 },
  { key: 's', label: 'Sec', ms: 1000 },
] as const;

/** Counts down to an ISO start time. Renders blank on the server so the static HTML never shows a stale number. */
export function Countdown({ startsAt, className }: { startsAt: string; className?: string }) {
  const target = new Date(startsAt).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null || Number.isNaN(target) || target <= now) return null;
  const left = target - now;
  // Each unit is the remainder of the larger one, so no value is reassigned during render.
  const parts = UNITS.map((u, i) => {
    const larger = i === 0 ? Infinity : UNITS[i - 1].ms;
    return { ...u, v: Math.floor((left % larger) / u.ms) };
  });

  return (
    <div role="timer" aria-label="Time until the summit" className={className}>
      <dl className="flex gap-6 sm:gap-8">
        {parts.map((p) => (
          <div key={p.key} className="flex flex-col-reverse gap-1">
            <dt className="mono-label">{p.label}</dt>
            <dd className="serif-figure text-4xl leading-none tabular-nums sm:text-5xl">{String(p.v).padStart(2, '0')}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
