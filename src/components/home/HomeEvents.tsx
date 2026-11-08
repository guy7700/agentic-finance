import Link from 'next/link';
import type { PastEvent } from '@/data/events';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

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
