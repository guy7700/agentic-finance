'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import type { CategoryView } from './CategoryExplorer';

// Twelve cards run clockwise around a 2 x 2 centre panel, as on the Abu Dhabi page.
const RING = [
  'lg:col-start-1 lg:row-start-1',
  'lg:col-start-2 lg:row-start-1',
  'lg:col-start-3 lg:row-start-1',
  'lg:col-start-4 lg:row-start-1',
  'lg:col-start-4 lg:row-start-2',
  'lg:col-start-4 lg:row-start-3',
  'lg:col-start-4 lg:row-start-4',
  'lg:col-start-3 lg:row-start-4',
  'lg:col-start-2 lg:row-start-4',
  'lg:col-start-1 lg:row-start-4',
  'lg:col-start-1 lg:row-start-3',
  'lg:col-start-1 lg:row-start-2',
];

/**
 * Category ownership as a ring: twelve cards around one panel that explains the
 * selected category. Before a choice, the panel invites one.
 */
export function CategoryRing({ categories, intro, agendaLabel, enquireHref }: { categories: CategoryView[]; intro: string; agendaLabel: string; enquireHref: string }) {
  const [active, setActive] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const current = categories.find((c) => c.id === active);

  const select = (id: string) => {
    setActive(id);
    // On one-column layouts the panel sits above the cards: bring it into view.
    if (!window.matchMedia('(min-width: 1024px)').matches) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:grid-rows-[repeat(4,minmax(150px,auto))] lg:gap-4">
      {categories.slice(0, 12).map((c, i) => {
        const on = c.id === active;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={on}
            aria-controls="category-panel"
            onClick={() => select(c.id)}
            className={cn(
              'group relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold md:p-5',
              RING[i],
              on ? 'border-gold/70 bg-gold/[0.08]' : 'border-line bg-ink/80 hover:-translate-y-0.5 hover:border-line-strong',
            )}
          >
            <span
              className={cn(
                'flex size-9 items-center justify-center rounded-lg font-mono text-xs transition-colors',
                on ? 'bg-gold text-ink' : 'bg-gold/15 text-gold-bright group-hover:bg-gold/25',
              )}
            >
              {c.number}
            </span>
            <span className={cn('text-[15px] font-semibold leading-snug md:text-base', on ? 'text-gold-bright' : 'text-paper')}>{c.name}</span>
            <span className="hidden text-xs font-light leading-relaxed text-paper/60 sm:block">{c.covers}</span>
          </button>
        );
      })}

      <div
        ref={panelRef}
        id="category-panel"
        aria-live="polite"
        className="relative col-span-2 min-h-[320px] scroll-mt-28 overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-br from-[#221E14] via-[#0F1522] to-ink max-lg:order-first sm:col-span-3 lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-2"
      >
        <div aria-hidden className="absolute left-1/2 top-1/2 size-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(209_182_121/0.14),transparent_60%)]" />
        <div aria-hidden className="absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10" />

        {current ? (
          <div key={current.id} className="relative flex h-full flex-col p-7 motion-safe:animate-[af-fade-in_0.5s_ease-out] sm:p-9">
            <span className="flex size-12 items-center justify-center rounded-xl bg-gold font-mono text-sm text-ink">{current.number}</span>
            <h3 className="mt-5 text-2xl font-semibold uppercase leading-tight tracking-tight md:text-3xl">{current.name}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-paper/85">
              <span className="text-paper/60">For </span>
              {current.covers}
            </p>
            {current.inSingapore ? (
              <p className="mt-3 text-[15px] leading-relaxed text-paper/85">
                <span className="mr-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-bright">In Singapore</span>
                {current.inSingapore}
              </p>
            ) : null}
            {current.sessionList[0] ? (
              <p className="mt-4 text-xs font-medium text-paper/60">
                On the Singapore agenda: <span className="text-paper/85">{current.sessionList[0].title}</span>
              </p>
            ) : null}
            <a href={enquireHref} target="_blank" rel="noopener noreferrer" className="group/l mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-gold hover:text-gold-bright">
              Claim {current.name}
              <Icon name="arrow-right" size={16} className="transition-transform duration-500 group-hover/l:translate-x-1" />
            </a>
          </div>
        ) : (
          <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
            <p className="eyebrow">Agentic Finance</p>
            <p className="display-tight mt-5 max-w-md text-[clamp(1.25rem,1rem+0.8vw,1.6rem)] text-paper/90">{intro}</p>
            <p className="mono-label mt-6">{agendaLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}
