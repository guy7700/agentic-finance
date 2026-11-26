import Link from 'next/link';
import { cn } from '@/lib/cn';

export type LiveSection = 'overview' | 'news' | 'spaces' | 'webinars' | 'newsletter';

/** The Live pages (Tal's site structure, 23 Nov 2026): one overview, then one page per type. */
export const liveSections: { id: LiveSection; label: string; href: string }[] = [
  { id: 'overview', label: 'All', href: '/live' },
  { id: 'news', label: 'News', href: '/live/news' },
  { id: 'spaces', label: 'X Spaces', href: '/live/spaces' },
  { id: 'webinars', label: 'Webinars', href: '/live/webinars' },
  { id: 'newsletter', label: 'Newsletter', href: '/live/newsletter' },
];

export function LiveNav({ current, className }: { current: LiveSection; className?: string }) {
  return (
    <nav aria-label="Live" className={cn('flex flex-wrap gap-2', className)}>
      {liveSections.map((s) => {
        const on = s.id === current;
        return (
          <Link
            key={s.id}
            href={s.href}
            aria-current={on ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors',
              on ? 'border-gold bg-gold/10 text-gold-bright' : 'border-line-strong text-paper/85 hover:border-gold hover:text-gold',
            )}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** A Live programme entry: date block, title, time and summary. Provisional dates say so. */
export function LiveEntry({ item }: { item: import('@/data/live').LiveItem }) {
  return (
    <article className="flex gap-5 rounded-2xl border border-line bg-ink-card p-6">
      <span className="flex w-16 shrink-0 flex-col items-center self-start rounded-xl border border-gold/40 py-2">
        <span className="font-mono text-[11px] uppercase text-gold">{item.month}</span>
        <span className="serif-figure text-3xl leading-none">{item.day}</span>
      </span>
      <div>
        <p className="mono-label">
          {item.date} · {item.time}
          {item.provisional ? <span className="ml-2 rounded-full border border-gold/40 px-2 py-0.5 text-gold">Provisional</span> : null}
        </p>
        <h3 className="mt-2 text-xl font-semibold leading-snug">{item.title}</h3>
        <p className="mt-2 leading-relaxed text-muted">{item.summary}</p>
      </div>
    </article>
  );
}
