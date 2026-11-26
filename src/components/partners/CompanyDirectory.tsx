'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CompanyEntry, DirectoryEvent, DirectoryGroup } from '@/lib/companies';
import { cn } from '@/lib/cn';
import { Img } from '../ui/Img';

const ALL = '';
const TBC = 'tbc';

const inGroup = (c: CompanyEntry, g: string) => !g || (g === TBC ? !c.group : c.group === g);
const inEvent = (c: CompanyEntry, e: string) => !e || c.events.includes(e);

type Props = { companies: CompanyEntry[]; events: DirectoryEvent[]; groups: DirectoryGroup[] };

/**
 * Every company we have worked with, filtered by Network group and by event. The
 * filters stay in the URL (?group=&event=) with history.replaceState, so a filtered
 * view can be shared. Under the grid, one line per event names the companies that
 * only sent a team.
 */
export function CompanyDirectory({ companies, events, groups }: Props) {
  const [group, setGroup] = useState(ALL);
  const [event, setEvent] = useState(ALL);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from the shareable URL */
    setGroup(p.get('group') ?? ALL);
    setEvent(p.get('event') ?? ALL);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const p = new URLSearchParams(window.location.search);
    for (const [k, v] of [['group', group], ['event', event]] as const) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    const qs = p.toString();
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`);
  }, [group, event, hydrated]);

  const shown = useMemo(() => companies.filter((c) => inGroup(c, group) && inEvent(c, event)), [companies, group, event]);
  const groupLabel = (g?: string) => groups.find((x) => x.value === g)?.label;
  const lines = events.filter((e) => (!event || e.id === event) && e.teams.length);

  const groupChips = [
    { value: ALL, label: 'All' },
    ...groups.map((g) => ({ value: g.value as string, label: g.label })),
    ...(companies.some((c) => !c.group) ? [{ value: TBC, label: 'Other' }] : []),
  ].map((g) => ({ ...g, count: companies.filter((c) => inGroup(c, g.value) && inEvent(c, event)).length }));
  const eventChips = [{ id: ALL, label: 'All events' }, ...events].map((e) => ({
    ...e,
    count: companies.filter((c) => inGroup(c, group) && inEvent(c, e.id)).length,
  }));

  return (
    <div>
      <div className="flex flex-col gap-5">
        <FilterRow label="Network group">
          {groupChips.map((g) => (
            <Chip key={g.value || 'all'} active={group === g.value} onClick={() => setGroup(g.value)} count={g.count}>
              {g.label}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Event">
          {eventChips.map((e) => (
            <Chip key={e.id || 'all'} active={event === e.id} onClick={() => setEvent(e.id)} count={e.count}>
              {e.label}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'company' : 'companies'}
      </p>

      {shown.length ? (
        <ul className="mt-4 grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {shown.map((c) => (
            <li key={c.id} className="flex flex-col border-b border-r border-line p-5">
              <Link href={c.href} className="group flex h-16 items-center justify-center rounded-lg transition-colors hover:bg-ink-card" aria-label={`${c.name}, company page`}>
                <Logo company={c} />
              </Link>
              <Link href={c.href} className={c.logo ? 'mt-4 text-sm font-semibold text-paper/90 hover:text-gold' : 'sr-only'}>
                {c.name}
              </Link>
              {groupLabel(c.group) ? <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">{groupLabel(c.group)}</p> : null}
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Relationship">
                {c.relationshipLabel ? <Tag tone={c.partner ? 'gold' : undefined}>{c.relationshipLabel}</Tag> : null}
                {c.networkMember ? <Tag>Network member</Tag> : null}
              </ul>
              <Link href={c.href} className="mt-auto pt-4 text-sm font-semibold text-gold hover:underline">
                {c.caseStudy ? 'Company page and case study' : 'Company page'}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-2xl border border-line p-8 text-muted">No companies match these filters yet.</p>
      )}

      {lines.length ? (
        <dl className="mt-10 flex flex-col gap-4 border-t border-line pt-8">
          {lines.map((e) => (
            <div key={e.id}>
              <dt className="mono-label">Teams attending from · {e.label}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-paper/85">{e.teams.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

function Logo({ company }: { company: CompanyEntry }) {
  return company.logo ? (
    <span className="relative block h-11 w-full">
      <Img src={company.logo} alt="" fill sizes="200px" className="object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
    </span>
  ) : (
    <span aria-hidden="true" className="text-lg font-semibold text-paper/85">{company.name}</span>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-5">
      <p className="mono-label shrink-0 sm:w-36 sm:pt-3">{label}</p>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}

function Chip({ active, onClick, count, children }: { active: boolean; onClick: () => void; count: number; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors',
        active ? 'border-gold bg-gold/10 text-gold' : 'border-line-strong text-paper/85 hover:border-gold hover:text-gold',
      )}
    >
      {children}
      <span className={cn('font-mono text-xs', active ? 'text-gold' : 'text-muted')}>{count}</span>
    </button>
  );
}

function Tag({ tone, children }: { tone?: 'gold' | 'tbc'; children: ReactNode }) {
  return (
    <li
      className={cn(
        'rounded-full border px-2.5 py-0.5 text-[11.5px]',
        tone === 'gold' ? 'border-gold/60 text-gold' : tone === 'tbc' ? 'border-dashed border-line-strong text-muted' : 'border-line-strong text-paper/80',
      )}
    >
      {children}
    </li>
  );
}
