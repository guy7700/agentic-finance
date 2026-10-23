'use client';

import Link from 'next/link';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import type { Edition } from '@/data/types';
import { cn } from '@/lib/cn';
import { buttonClasses } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { StatusBadge } from '../ui/StatusBadge';

type SeriesEdition = Pick<
  Edition,
  'slug' | 'name' | 'shortName' | 'city' | 'country' | 'year' | 'status' | 'dateLabel' | 'tagline' | 'summary' | 'image' | 'metrics' | 'facts' | 'context'
>;

const groupTitle: Record<Edition['status'], string> = {
  upcoming: 'Next',
  completed: 'Completed',
  planned: '2027 · Planned',
};

function actionsFor(e: SeriesEdition) {
  if (e.status === 'upcoming')
    return [
      { label: `Explore ${e.city}`, href: `/editions/${e.slug}`, variant: 'gold' as const },
      { label: 'Request an invitation', href: '/invitation', variant: 'outline' as const },
    ];
  if (e.status === 'completed')
    return [
      { label: 'Open the archive', href: `/editions/${e.slug}`, variant: 'gold' as const },
      { label: 'Watch the recap', href: '/media/video', variant: 'outline' as const },
    ];
  return [
    { label: `${e.city} 2027`, href: `/editions/${e.slug}`, variant: 'gold' as const },
    { label: 'Register interest', href: `/about/contact?topic=attendance&edition=${e.slug}`, variant: 'outline' as const },
  ];
}

/**
 * Interactive overview of the whole series. A vertical tab list (arrow keys,
 * Home/End) selects an edition; the panel shows its state and next action.
 */
export function GlobalSeries({ editions }: { editions: SeriesEdition[] }) {
  const [selected, setSelected] = useState(editions[0]?.slug);
  const tabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const uid = useId();
  const current = editions.find((e) => e.slug === selected) ?? editions[0];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | undefined;
    if (e.key in keys) next = (i + keys[e.key] + editions.length) % editions.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = editions.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    const slug = editions[next].slug;
    setSelected(slug);
    tabs.current[slug]?.focus();
  };

  const groups = (['upcoming', 'completed', 'planned'] as const).map((status) => ({
    status,
    items: editions.filter((e) => e.status === status),
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12">
      <div role="tablist" aria-orientation="vertical" aria-label="Agentic Finance editions" className="flex flex-col gap-6">
        {groups.map((g) =>
          g.items.length ? (
            <div key={g.status} role="presentation">
              <p role="presentation" className="mono-label mb-2">
                {groupTitle[g.status]}
              </p>
              <div role="presentation" className="flex flex-col border-t border-line">
                {g.items.map((e) => {
                  const i = editions.indexOf(e);
                  const active = e.slug === current.slug;
                  return (
                    <button
                      key={e.slug}
                      ref={(el) => {
                        tabs.current[e.slug] = el;
                      }}
                      role="tab"
                      type="button"
                      id={`${uid}-tab-${e.slug}`}
                      aria-selected={active}
                      aria-controls={`${uid}-panel`}
                      tabIndex={active ? 0 : -1}
                      onClick={() => setSelected(e.slug)}
                      onMouseEnter={() => setSelected(e.slug)}
                      onKeyDown={(ev) => onKey(ev, i)}
                      className={cn(
                        'group flex min-h-14 items-center justify-between gap-4 border-b border-line px-1 text-left transition-colors',
                        active ? 'text-paper' : 'text-paper/55 hover:text-paper',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className={cn(
                            'size-2 rounded-full transition-colors',
                            e.status === 'upcoming' && 'bg-gold',
                            e.status === 'completed' && 'bg-muted',
                            e.status === 'planned' && 'border border-paper/60',
                            active && 'ring-4 ring-gold/20',
                          )}
                        />
                        <span className={cn('text-xl font-bold sm:text-2xl', active && 'text-gold')} style={{ fontStretch: '108%' }}>
                          {e.city}
                        </span>
                        <span className="font-mono text-xs text-muted">{e.year}</span>
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
                        {e.status === 'planned' ? 'TBA' : e.dateLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null,
        )}
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${current.slug}`}
        className="relative isolate flex min-h-[520px] flex-col justify-end overflow-hidden rounded-2xl border border-line p-6 sm:p-10"
      >
        {editions.map((e) => (
          <Img
            key={e.slug}
            src={e.image.src}
            alt={e.slug === current.slug ? e.image.alt : ''}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            position={e.image.position}
            className={cn(
              '-z-20 object-cover transition-opacity duration-700',
              e.slug === current.slug ? 'opacity-75' : 'opacity-0',
            )}
          />
        ))}
        <span aria-hidden className="scrim-bottom absolute inset-0 -z-10" />
        <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
          <StatusBadge status={current.status} label={current.status === 'planned' ? 'Planned · Dates to be announced' : undefined} />
        </div>
        <p className="mono-label text-paper/75">
          {current.country}
          {current.context ? ` · ${current.context}` : ''}
        </p>
        <h3 className="display mt-3 text-[clamp(2.4rem,1.6rem+3vw,4.5rem)]">{current.name.replace('Agentic Finance ', '')}</h3>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-paper/85">{current.summary}</p>
        {current.metrics || current.facts ? (
          <dl className="mt-7 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 border-t border-paper/15 pt-5 sm:grid-cols-4">
            {(current.metrics ?? current.facts ?? []).slice(0, 4).map((m) => (
              <div key={m.label} className="flex flex-col-reverse">
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">{m.label}</dt>
                <dd className="text-2xl font-extrabold" style={{ fontStretch: '110%' }}>
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          {actionsFor(current).map((a) => (
            <Link key={a.href} href={a.href} className={buttonClasses({ variant: a.variant, size: 'md' })}>
              {a.label}
              <Icon name="arrow-right" size={18} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
