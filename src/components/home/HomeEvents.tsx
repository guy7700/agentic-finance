import Link from 'next/link';
import type { EventItem } from '@/data/events';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { StatusBadge } from '../ui/StatusBadge';

/** Upcoming events: the conversion cards. Date first, then time, place and access. */
export function UpcomingEventCard({ event: e }: { event: EventItem }) {
  const [weekday, day, month, year] = e.date.split(' ');
  return (
    <article className="flex w-full flex-col rounded-2xl border border-gold/50 bg-ink-raised p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatusBadge status="upcoming" />
        {e.access ? <span className="mono-label">{e.access}</span> : null}
      </div>
      <p className="mt-8 flex items-end gap-4">
        <span className="sr-only">{e.date}</span>
        <span aria-hidden className="display text-[clamp(4rem,3rem+4vw,6.5rem)] leading-[0.8] text-gold">
          {day}
        </span>
        <span aria-hidden className="pb-1 font-mono text-[13px] uppercase leading-snug tracking-[0.1em] text-paper/85">
          {month} {year}
          <br />
          {weekday}
        </span>
      </p>
      <h3 className="mt-7 text-2xl font-extrabold leading-tight sm:text-[28px]" style={{ fontStretch: '108%' }}>
        {e.name}
      </h3>
      <dl className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5 text-[15px]">
        {e.time ? (
          <div className="flex gap-3">
            <dt className="sr-only">Time</dt>
            <Icon name="calendar" size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden />
            <dd className="text-paper/90">{e.time}</dd>
          </div>
        ) : null}
        <div className="flex gap-3">
          <dt className="sr-only">Place</dt>
          <Icon name="pin" size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden />
          <dd className="text-paper/90">{e.place}</dd>
        </div>
        {e.facts.map((f) => (
          <div key={f.label} className="flex gap-3">
            <dt className="sr-only">{f.label}</dt>
            <Icon name="users" size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden />
            <dd className="text-paper/90">
              {f.value} {f.label.toLowerCase()}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto pt-8">
        <ButtonLink href={e.href} size="lg" className="w-full sm:w-auto">
          {e.cta}
        </ButtonLink>
      </div>
    </article>
  );
}

/** Past events: the proof. Photo, date and place, headline figures. */
export function PastEventCard({ event: e }: { event: EventItem }) {
  return (
    <Link href={e.href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-ink-card transition-colors hover:border-line-strong">
      {e.image ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Img
            src={e.image.src}
            alt={e.image.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            position={e.image.position}
            className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="mono-label">
          {e.date} · {e.place}
        </p>
        <h4 className="mt-2 text-xl font-bold leading-snug group-hover:text-gold">{e.name}</h4>
        {e.access ? <p className="mt-1 text-sm text-muted">{e.access}</p> : null}
        <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-line pt-4">
          {e.facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse">
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">{f.label}</dt>
              <dd className="text-xl font-extrabold" style={{ fontStretch: '110%' }}>
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-paper/85 group-hover:text-gold">
          {e.cta}
          <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
