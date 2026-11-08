import type { Metric } from '@/data/types';
import { cn } from '@/lib/cn';

export function Stats({ items, className, size = 'lg', source }: { items: Metric[]; className?: string; size?: 'lg' | 'md'; source?: string }) {
  return (
    <div className={className}>
      <dl className={cn('grid grid-cols-2 border-t border-line', items.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
        {items.map((m, i) => (
          <div
            key={m.label}
            className={cn(
              'flex flex-col-reverse gap-2 border-b border-line py-6 pr-4',
              i % 2 === 1 && 'border-l pl-5 lg:pl-6',
              i % 2 === 0 && i > 0 && 'lg:border-l lg:pl-6',
            )}
          >
            <dt className="mono-label">{m.label}</dt>
            <dd
              className={cn(
                !/\d/.test(m.value)
                  ? 'display text-[clamp(1.6rem,1.2rem+1.2vw,2.25rem)] leading-[1.15] text-paper'
                  : cn(
                      'serif-figure leading-none',
                      size === 'lg' ? 'text-[clamp(3rem,1.9rem+3.8vw,5.25rem)]' : 'text-[clamp(2.4rem,1.8rem+2.1vw,3.5rem)]',
                    ),
              )}
            >
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
      {source ? <p className="mono-label mt-4 normal-case tracking-normal text-subtle">{source}</p> : null}
    </div>
  );
}
