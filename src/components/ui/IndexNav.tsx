import Link from 'next/link';
import { cn } from '@/lib/cn';

const ITEMS = [
  { href: '/af100', label: 'Overview' },
  { href: '/af100/list', label: 'Agentic Finance 100' },
  { href: '/af100/map', label: 'Industry Map' },
  { href: '/af100/reports', label: 'Quarterly Reports' },
];

/** The Index pages' own menu. */
export function IndexNav({ current }: { current: string }) {
  return (
    <nav aria-label="Index" className="flex flex-wrap gap-2">
      {ITEMS.map((i) => (
        <Link
          key={i.href}
          href={i.href}
          aria-current={i.href === current ? 'page' : undefined}
          className={cn(
            'inline-flex min-h-10 items-center rounded-full border px-4 text-sm transition-colors',
            i.href === current ? 'border-gold bg-gold/10 text-gold-bright' : 'border-line-strong text-paper/85 hover:border-gold hover:text-gold',
          )}
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
