import Link from 'next/link';
import type { Edition } from '@/data/types';
import { cn } from '@/lib/cn';

export type EditionSection = 'overview' | 'recap' | 'speakers' | 'agenda' | 'partners' | 'gala';

/**
 * The pages one event has, in menu order: each event keeps its own speakers,
 * agenda, partners and gala pages, like the old mnm.live event sites (Tal's
 * feedback, 24 Nov 2026). Only pages that exist are listed.
 */
export function editionSections(e: Edition): { id: EditionSection; label: string; href: string }[] {
  const live = e.status !== 'planned';
  const all: { id: EditionSection; label: string; href: string; on: boolean }[] = [
    { id: 'overview', label: 'Overview', href: e.path, on: true },
    { id: 'recap', label: 'Recap', href: `${e.path}/recap`, on: !!e.hasRecapPage },
    { id: 'speakers', label: 'Speakers', href: `${e.path}/speakers`, on: live },
    { id: 'agenda', label: 'Agenda', href: `${e.path}/agenda`, on: !!e.hasAgenda },
    { id: 'partners', label: 'Partners', href: `${e.path}/partners`, on: live },
    { id: 'gala', label: 'VIP Gala', href: `${e.path}/gala`, on: !!e.hasGala },
  ];
  return all.filter((s) => s.on).map(({ id, label, href }) => ({ id, label, href }));
}

/** The event's own menu: Overview · Recap · Speakers · Agenda · Partners · VIP Gala. */
export function EditionNav({ edition, current, className }: { edition: Edition; current: EditionSection; className?: string }) {
  return (
    <nav aria-label={`${edition.shortName} pages`} className={cn('flex flex-wrap gap-2', className)}>
      {editionSections(edition).map((s) => {
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
