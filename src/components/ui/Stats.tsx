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
                'display text-paper',
                !/\d/.test(m.value)
                  ? 'text-[clamp(1.6rem,1.2rem+1.2vw,2.25rem)] leading-[1.15]'
                  : size === 'lg'
                    ? 'text-[clamp(2.5rem,1.6rem+3.2vw,4.5rem)]'
                    : 'text-[clamp(2rem,1.5rem+1.8vw,3rem)]',
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
