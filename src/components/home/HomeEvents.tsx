import Link from 'next/link';
import { primaryActions } from '@/config/site';
import type { PastEvent, UpcomingEvent } from '@/data/events';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { StatusBadge } from '../ui/StatusBadge';

/** The next event: date first, then place, one line, the Gala note and the sign-up CTA. */
export function NextEventCard({ event: e }: { event: UpcomingEvent }) {
  const [weekday, day, month, year] = e.date.split(' ');
  return (
    <article className="edge-gold relative flex h-full flex-col rounded-2xl border border-gold-bright/30 bg-ink-card p-6 shadow-[0_30px_80px_-30px_rgb(209_182_121/0.3)] sm:p-8">
      <StatusBadge status="upcoming" label="Next event" className="self-start" />
      <p className="mt-8 flex items-end gap-4">
        <span className="sr-only">{e.date}</span>
        <span aria-hidden className="serif-figure text-[clamp(4.25rem,3.2rem+4.2vw,6.75rem)] leading-[0.75]">
          {day}
        </span>
        <span aria-hidden className="pb-1 text-[11px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-gold-bright">
          {month} {year}
          <br />
          {weekday}
        </span>
      </p>
      <h3 className="mt-7 font-serif text-[clamp(2rem,1.6rem+1.6vw,2.75rem)] font-medium italic leading-[1.05] text-gold">{e.name}</h3>
      <dl className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5 text-[15px] font-light">
        {e.time ? (
          <div className="flex gap-3">
            <dt className="sr-only">Time</dt>
            <Icon name="calendar" size={18} className="mt-0.5 shrink-0 text-gold-bright" aria-hidden />
            <dd className="text-paper/90">{e.time}</dd>
          </div>
        ) : null}
        <div className="flex gap-3">
          <dt className="sr-only">Place</dt>
          <Icon name="pin" size={18} className="mt-0.5 shrink-0 text-gold-bright" aria-hidden />
          <dd className="text-paper/90">{[e.venue, e.city].filter(Boolean).join(', ')}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="sr-only">Guests</dt>
          <Icon name="users" size={18} className="mt-0.5 shrink-0 text-gold-bright" aria-hidden />
          <dd className="text-paper/90">{e.line}</dd>
        </div>
      </dl>
      {e.note ? <p className="mt-4 text-sm text-muted">{e.note}</p> : null}
      <div className="mt-auto pt-8">
        <ButtonLink href={e.href} size="lg" className="w-full sm:w-auto">
          {primaryActions.invitation.label}
        </ButtonLink>
      </div>
    </article>
  );
}

/** Later events as a dated list, each linking to its own page. */
export function PlannedEventList({ events }: { events: UpcomingEvent[] }) {
  return (
    <div className="edge-gold relative flex h-full flex-col rounded-2xl border border-line bg-ink-card/60 p-6 sm:p-8">
      <h3 className="eyebrow">2027 calendar</h3>
      <ol className="mt-4 flex flex-col border-t border-line">
        {events.map((e) => (
          <li key={e.id} className="border-b border-line">
            <Link href={e.href} className="group flex min-h-16 items-center justify-between gap-4 py-4">
              <span>
                <span className="block text-lg font-medium leading-snug transition-colors group-hover:text-gold">{e.name}</span>
                <span className="mt-0.5 block text-sm font-light text-muted">
                  {e.date} · {e.line}
                </span>
              </span>
              <Icon name="arrow-right" size={18} className="shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Past events: photo, date and city, headline figures. */
export function PastEventCard({ event: e }: { event: PastEvent }) {
  return (
    <Link href={e.href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-card transition-colors duration-500 hover:border-gold/60">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Img
          src={e.image.src}
          alt={e.image.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          position={e.image.position}
          className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="mono-label">
          {e.date} · {e.city}
        </p>
        <h4 className="mt-2 text-xl font-medium leading-snug transition-colors group-hover:text-gold">{e.name}</h4>
        {e.venue ? <p className="mt-1 text-sm font-light text-muted">{e.venue}</p> : null}
        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-4">
          {e.facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{f.label}</dt>
              <dd className="serif-figure text-[28px] leading-tight">{f.value}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/85 transition-colors group-hover:text-gold">
          More about this event
          <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
