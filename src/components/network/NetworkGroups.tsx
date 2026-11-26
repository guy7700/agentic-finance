import Link from 'next/link';
import { networkPages } from '@/data/network';
import type { NetworkGroup } from '@/data/types';
import { Icon, type IconName } from '../ui/Icon';

/** One icon per group, so the five are told apart at a glance. */
export const groupIcon: Record<NetworkGroup, IconName> = {
  startup: 'spark',
  vc: 'chart',
  company: 'chip',
  institution: 'bank',
  ecosystem: 'globe',
};

/** "Who are you?": the five free ways into the Network, each to its own landing page and form. */
export function NetworkGroups({ compact }: { compact?: boolean }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {networkPages.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/network/${p.slug}#apply`}
            className={`edge-gold group relative flex h-full flex-col justify-between gap-5 rounded-2xl border border-line bg-ink-card/70 p-5 transition-colors duration-500 hover:border-gold/60 ${compact ? 'min-h-44' : 'min-h-56 sm:p-6'}`}
          >
            <span>
              <span className="flex size-11 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold-bright transition-colors group-hover:bg-gold group-hover:text-ink">
                <Icon name={groupIcon[p.audience]} size={20} />
              </span>
              <span className="mt-4 block text-lg font-semibold transition-colors group-hover:text-gold">{p.card.title}</span>
              {compact ? null : <span className="mt-2 block text-[15px] leading-relaxed text-muted">{p.card.line}</span>}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
              Join for free
              <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
