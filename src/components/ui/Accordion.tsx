'use client';

import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type AccordionItem = { id: string; title: ReactNode; meta?: ReactNode; content: ReactNode };

type AccordionProps = {
  items: AccordionItem[];
  /** Allow more than one panel open at a time. */
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
  size?: 'md' | 'lg';
};

/**
 * Disclosure list following the WAI-ARIA accordion pattern: real buttons,
 * aria-expanded/aria-controls, and labelled regions. Gold +/− indicators match
 * the mobile navigation.
 */
export function Accordion({ items, multiple = true, defaultOpen = [], className, size = 'md' }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const uid = useId();

  const toggle = (id: string) =>
    setOpen((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : multiple ? [...cur, id] : [id]));

  return (
    <div className={cn('border-t border-line', className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const btnId = `${uid}-btn-${item.id}`;
        const panelId = `${uid}-panel-${item.id}`;
        return (
          <div key={item.id} className="border-b border-line">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className={cn(
                  'group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-gold',
                  size === 'lg' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl',
                )}
              >
                <span className="flex flex-1 flex-col gap-1 font-semibold leading-snug">
                  {item.meta ? <span className="mono-label">{item.meta}</span> : null}
                  <span>{item.title}</span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border text-xl leading-none text-gold transition-colors',
                    isOpen ? 'border-gold bg-gold/10' : 'border-line-strong group-hover:border-gold',
                  )}
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="pb-8 pr-12 text-muted"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
