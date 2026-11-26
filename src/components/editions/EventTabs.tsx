'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type EventTab = { id: string; label: string; count?: number; content: ReactNode };

/**
 * Upcoming and Past tabs on one page (Tal's site structure for /events/).
 * A link to /events/#past opens the second tab. Without JavaScript both
 * panels show, one after the other.
 */
export function EventTabs({ tabs, label }: { tabs: EventTab[]; label: string }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const uid = useId();

  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace('#', '');
      if (tabs.some((t) => t.id === id)) setActive(id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [tabs]);

  const select = (id: string) => {
    setActive(id);
    // Keep the choice in the address, so a shared link opens the same tab.
    const url = id === tabs[0]?.id ? window.location.pathname + window.location.search : `#${id}`;
    window.history.replaceState(null, '', url);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + delta + tabs.length) % tabs.length;
    select(tabs[next].id);
    tabRefs.current[tabs[next].id]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className="flex gap-2 border-b border-line">
        {tabs.map((t, i) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              id={`${uid}-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`${uid}-panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                '-mb-px inline-flex min-h-12 items-center gap-2 border-b-2 px-4 text-base font-semibold transition-colors sm:px-6 sm:text-lg',
                on ? 'border-gold text-paper' : 'border-transparent text-muted hover:text-paper',
              )}
            >
              {t.label}
              {t.count !== undefined ? <span className="font-mono text-xs font-normal text-muted">{t.count}</span> : null}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          id={`${uid}-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${t.id}`}
          hidden={t.id !== active}
          data-tabpanel=""
          className="pt-10 sm:pt-12"
        >
          {t.content}
        </div>
      ))}
      <noscript>
        <style>{'[data-tabpanel][hidden]{display:block!important}'}</style>
      </noscript>
    </div>
  );
}
