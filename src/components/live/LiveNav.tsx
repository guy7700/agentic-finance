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

/** Body of a Live page that has no content yet: a [TBC] placeholder. */
export function LivePlaceholder({ what }: { what: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-ink-card p-8 sm:p-10">
      <span className="mono-label">{what} [TBC]</span>
    </div>
  );
}
