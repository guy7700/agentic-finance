'use client';

import { useState } from 'react';
import type { ImageAsset } from '@/data/types';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

export type ShowcaseItem = { title: string; body: string; proof: string; image: ImageAsset };

/**
 * "What can your partnership look like?", as on the Abu Dhabi page: a numbered
 * list beside one large photo that cross-fades to the selected item. On small
 * screens every item is a photo card, so nothing is hidden behind a click.
 */
export function PartnershipShowcase({ items }: { items: ShowcaseItem[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <>
      <div className="mt-12 hidden gap-12 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <ol className="divide-y divide-line border-y border-line">
          {items.map((it, i) => {
            const on = i === active;
            return (
              <li key={it.title}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex w-full items-start gap-5 py-5 text-left outline-none focus-visible:bg-paper/[0.03]"
                >
                  <span className={cn('mt-1 font-mono text-sm tabular-nums transition-colors', on ? 'text-gold' : 'text-subtle group-hover:text-gold')}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn('block text-xl font-semibold uppercase tracking-tight transition-colors', on ? 'text-paper' : 'text-paper/60 group-hover:text-paper')}>
                      {it.title}
                    </span>
                    <span
                      className={cn(
                        'grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-soft)]',
                        on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-2 text-[15px] font-light leading-relaxed text-paper/85">{it.body}</span>
                      </span>
                    </span>
                  </span>
                  <Icon name="arrow-right" size={16} className={cn('mt-1.5 shrink-0 transition-all', on ? 'translate-x-0 text-gold' : '-translate-x-1 text-subtle opacity-0 group-hover:opacity-100')} />
                </button>
              </li>
            );
          })}
        </ol>

        <div className="sticky top-[calc(var(--header-h)+40px)] self-start">
          <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-ink-deep shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
            {items.map((it, i) => (
              <div
                key={it.title}
                aria-hidden={i !== active}
                className={cn('absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out-soft)] motion-reduce:transition-none', i === active ? 'opacity-100' : 'opacity-0')}
              >
                <Img src={it.image.src} alt={it.image.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" position={it.image.position} className="object-cover" />
              </div>
            ))}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/20 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <span className="text-4xl font-semibold uppercase tracking-tight">{current.title}</span>
              <p className="mt-3 flex items-start gap-2 text-[13px] font-medium leading-snug text-gold-bright">
                <Icon name="check" size={16} className="mt-px shrink-0" />
                <span>Delivered: {current.proof}</span>
              </p>
            </figcaption>
          </figure>
        </div>
      </div>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:hidden">
        {items.map((it, i) => (
          <li key={it.title} className="overflow-hidden rounded-2xl border border-line bg-ink-card/60">
            <div className="relative aspect-[16/10]">
              <Img src={it.image.src} alt={it.image.alt} fill sizes="(min-width: 640px) 50vw, 100vw" position={it.image.position} className="object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
              <span className="absolute bottom-3 left-4 text-2xl font-semibold uppercase tracking-tight">
                <span className="mr-2 font-mono text-sm text-gold">{String(i + 1).padStart(2, '0')}</span>
                {it.title}
              </span>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-[15px] font-light leading-relaxed text-paper/90">{it.body}</p>
              <p className="flex items-start gap-2 text-[13px] font-medium leading-snug text-gold-bright">
                <Icon name="check" size={16} className="mt-px shrink-0" />
                <span>Delivered: {it.proof}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
