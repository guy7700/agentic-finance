'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import type { PartnershipCategory } from '@/data/types';
import { cn } from '@/lib/cn';
import { buttonClasses } from '../ui/Button';
import { Icon } from '../ui/Icon';

export type CategoryView = PartnershipCategory & {
  number: string;
  topics: { slug: string; name: string }[];
  sessionList: { id: string; title: string; format: string }[];
  useCases: { slug: string; partner: string }[];
};

/**
 * Twelve categories, one selected at a time (tabs pattern with a 4×3 grid of
 * tabs). ?category=<id> preselects a category and stays in sync for sharing.
 */
export function CategoryExplorer({ categories, positions }: { categories: CategoryView[]; positions: number }) {
  const [active, setActive] = useState(categories[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const synced = useRef(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('category');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the shareable URL
    if (id && categories.some((c) => c.id === id)) setActive(id);
    synced.current = true;
  }, [categories]);

  const select = (id: string) => {
    setActive(id);
    if (!synced.current) return;
    const url = new URL(window.location.href);
    url.searchParams.set('category', id);
    window.history.replaceState(window.history.state, '', url);
  };

  const current = categories.find((c) => c.id === active) ?? categories[0];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const cols = window.matchMedia('(min-width: 1024px)').matches ? 4 : window.matchMedia('(min-width: 640px)').matches ? 3 : 2;
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
    let next: number | undefined;
    if (e.key in moves) next = Math.min(categories.length - 1, Math.max(0, i + moves[e.key]));
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = categories.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    select(categories[next].id);
    tabRefs.current[categories[next].id]?.focus();
  };

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] xl:gap-14">
      <h2 className="sr-only">Partnership categories</h2>
      <div>
        <div role="tablist" aria-label="Partnership categories" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => {
            const on = c.id === current.id;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  tabRefs.current[c.id] = el;
                }}
                id={`${uid}-tab-${c.id}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => select(c.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  'group flex min-h-[112px] flex-col justify-between rounded-xl border p-4 text-left transition-colors duration-300',
                  on ? 'border-gold bg-gold/[0.09]' : 'border-line hover:border-line-strong hover:bg-ink-card',
                )}
              >
                <span className={cn('font-mono text-[11px]', on ? 'text-gold' : 'text-subtle')}>{c.number}</span>
                <span className={cn('text-[15px] font-bold leading-tight sm:text-base', on ? 'text-gold' : 'text-paper')}>{c.name}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-5 flex items-start gap-3 rounded-xl border border-line bg-ink-card/50 p-4 text-sm leading-relaxed text-muted">
          <Icon name="lock" size={18} className="mt-0.5 shrink-0 text-gold" />
          <span>
            Twelve conversations, and no more than <strong className="text-paper">{positions} strategic partner positions</strong> in Abu
            Dhabi overall. Categories are not slots: some will have a lead partner, some will not.
          </span>
        </p>
      </div>

      <div
        ref={panelRef}
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${current.id}`}
        tabIndex={0}
        className="self-start rounded-2xl border border-line bg-ink-card/60 p-6 sm:p-9 xl:sticky xl:top-[calc(var(--header-h)+32px)]"
      >
        <p className="eyebrow">Category {current.number} / 12</p>
        <h3 className="display-tight mt-4 text-[clamp(2rem,1.5rem+1.8vw,2.75rem)]">{current.name}</h3>
        <p className="mt-4 text-[17px] leading-relaxed text-paper/85">{current.covers}</p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="mono-label">Who belongs here</p>
            <ul className="mt-3 flex flex-col gap-2 text-[15px] text-muted">
              {current.companies.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <Icon name="check" size={16} className="mt-1 shrink-0 text-gold" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono-label">Conversations it leads</p>
            <ul className="mt-3 flex flex-col gap-2 text-[15px] text-muted">
              {current.conversations.map((x) => (
                <li key={x} className="flex gap-2.5">
                  <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-gold" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-gold/30 bg-gold/[0.05] p-5">
          <p className="mono-label text-gold">In Singapore 2026</p>
          <p className="mt-2 text-[15px] leading-relaxed text-paper/90">{current.inSingapore}</p>
          {current.sessionList.length ? (
            <ul className="mt-4 flex flex-col gap-2 border-t border-gold/20 pt-4">
              {current.sessionList.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/editions/singapore-2026/agenda#${s.id}`}
                    className="group inline-flex items-start gap-2 text-sm text-paper/80 hover:text-gold"
                  >
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-subtle">{s.format}</span>
                    <span>{s.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {current.useCases.length ? (
            <p className="mt-4 text-sm">
              <span className="text-muted">Use case: </span>
              {current.useCases.map((u, i) => (
                <span key={u.slug}>
                  {i > 0 ? ', ' : ''}
                  <Link href={`/partners/use-cases/${u.slug}`} className="font-semibold text-gold hover:text-gold-bright">
                    {u.partner}
                  </Link>
                </span>
              ))}
            </p>
          ) : null}
        </div>

        {current.topics.length ? (
          <p className="mt-6 text-sm text-muted">
            Programme topics:{' '}
            {current.topics.map((t, i) => (
              <span key={t.slug}>
                {i > 0 ? ' · ' : ''}
                <Link href={`/program/topics#${t.slug}`} className="text-paper/85 underline decoration-line-strong underline-offset-4 hover:text-gold">
                  {t.name}
                </Link>
              </span>
            ))}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
          <Link href={`/partners/book-a-call?category=${current.id}`} className={buttonClasses({ variant: 'gold' })}>
            Enquire about {current.name}
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
