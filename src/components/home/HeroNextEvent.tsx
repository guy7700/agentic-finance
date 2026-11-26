import { nextEvent } from '@/data/events';
import type { Edition } from '@/data/types';
import { ButtonLink } from '../ui/Button';

/** The next event, shown in the hero when there is no news from the last 7 days (Tal's homepage order). */
export function HeroNextEvent({ next }: { next: Edition }) {
  return (
    <section aria-labelledby="hero-next" className="edge-gold relative rounded-2xl border border-line-strong bg-ink-card/80 p-5 backdrop-blur-md sm:p-6">
      <h2 id="hero-next" className="eyebrow">
        Next event
      </h2>
      <p className="mt-4 text-xl font-medium leading-snug">{nextEvent.name}</p>
      <p className="mono-label mt-3">{nextEvent.date}</p>
      <p className="mt-1 text-sm text-muted">
        {[nextEvent.time, nextEvent.venue ? `${nextEvent.venue}, ${nextEvent.city}` : nextEvent.city].filter(Boolean).join(' · ')}
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-paper/85">{nextEvent.line}</p>
      <ButtonLink href={next.path} variant="outline" className="mt-5">
        More about this event
      </ButtonLink>
    </section>
  );
}
