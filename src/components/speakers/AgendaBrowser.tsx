'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

export type AgendaPerson = { slug: string; name: string; title: string; organization: string; photo: string; hasProfile: boolean; moderator?: boolean };

export type AgendaSession = {
  id: string;
  stage: 'af' | 'odds';
  start: string;
  end: string;
  format: string;
  title: string;
  summary: string;
  note?: string;
  linkTo?: string;
  people: AgendaPerson[];
};

type AgendaBrowserProps = {
  sessions: AgendaSession[];
  stages: { id: 'af' | 'odds'; name: string; detail: string; host?: string }[];
  timezone: string;
};

const FORMATS = ['Keynote', 'Panel', 'One-on-one'] as const;

function matchesFormat(format: string, filter: string) {
  if (!filter) return true;
  return format.toLowerCase().includes(filter.toLowerCase());
}

/**
 * Historical run of show. Stage tabs, format filter and search; every session
 * keeps its legacy anchor id (e.g. #af-1530) so old deep links still land.
 */
export function AgendaBrowser({ sessions, stages, timezone }: AgendaBrowserProps) {
  const [stage, setStage] = useState<'all' | 'af' | 'odds'>('all');
  const [format, setFormat] = useState('');
  const [q, setQ] = useState('');

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sessions
      .filter((s) => stage === 'all' || s.stage === stage)
      .filter((s) => matchesFormat(s.format, format))
      .filter(
        (s) =>
          !needle ||
          [s.title, s.summary, ...s.people.flatMap((p) => [p.name, p.organization])].join(' ').toLowerCase().includes(needle),
      )
      .sort((a, b) => a.start.localeCompare(b.start) || a.stage.localeCompare(b.stage));
  }, [sessions, stage, format, q]);

  const stageName = (id: 'af' | 'odds') => stages.find((s) => s.id === id)?.name ?? id;

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Stage" className="flex flex-wrap gap-2">
          {[{ id: 'all' as const, name: 'Both stages' }, ...stages].map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={stage === s.id}
              onClick={() => setStage(s.id)}
              className={cn(
                'h-10 rounded-full border px-4 text-[13px] font-semibold transition-colors',
                stage === s.id ? 'border-gold bg-gold text-ink' : 'border-line-strong hover:border-gold hover:text-gold',
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div role="group" aria-label="Format" className="flex flex-wrap gap-2">
            {['', ...FORMATS].map((f) => (
              <button
                key={f || 'all'}
                type="button"
                aria-pressed={format === f}
                onClick={() => setFormat(f)}
                className={cn(
                  'h-10 rounded-full border px-3.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors',
                  format === f ? 'border-paper bg-paper text-ink' : 'border-line-strong text-muted hover:text-paper',
                )}
              >
                {f || 'All formats'}
              </button>
            ))}
          </div>
          <label className="relative block sm:w-64">
            <span className="sr-only">Search the agenda</span>
            <Icon name="search" size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sessions or people"
              className="h-10 w-full rounded-full border border-line-strong bg-ink-card pl-10 pr-4 text-sm placeholder:text-subtle focus:border-gold focus:outline-none"
            />
          </label>
        </div>
      </div>

      <h2 className="sr-only">Run of show</h2>
      <p aria-live="polite" className="mono-label mt-6">
        {visible.length} {visible.length === 1 ? 'entry' : 'entries'} · All times {timezone}
      </p>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line-strong p-10 text-center text-muted">
          No sessions match. Try another stage, format or search term.
        </p>
      ) : (
        <ol className="mt-6 flex flex-col">
          {visible.map((s) => {
            const isBlock = s.people.length === 0;
            return (
              <li
                key={s.id}
                id={s.id}
                className={cn(
                  'grid grid-cols-1 gap-4 border-t border-line py-7 sm:grid-cols-[140px_minmax(0,1fr)] lg:grid-cols-[160px_minmax(0,1fr)_minmax(0,380px)] lg:gap-8',
                  isBlock && 'py-5 opacity-80',
                )}
              >
                <div className="flex flex-row items-baseline gap-3 sm:flex-col sm:gap-1.5">
                  <span className="font-mono text-lg text-paper">
                    {s.start}
                    <span className="text-muted">–{s.end}</span>
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[10.5px] uppercase tracking-[0.1em]',
                      s.stage === 'af' ? 'text-gold' : 'text-[#9fb6e8]',
                    )}
                  >
                    {stageName(s.stage)}
                  </span>
                </div>
                <div>
                  <p className="mono-label">{s.format}</p>
                  <h3 className={cn('mt-2 font-bold leading-snug', isBlock ? 'text-lg text-paper/85' : 'text-xl sm:text-[22px]')}>{s.title}</h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{s.summary}</p>
                  {s.note ? <p className="mt-3 text-sm text-gold">{s.note}</p> : null}
                  {s.linkTo ? (
                    <a href={`#${s.linkTo}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-bright">
                      Go to the session <Icon name="arrow-right" size={14} />
                    </a>
                  ) : null}
                </div>
                {s.people.length ? (
                  <ul className="flex flex-col gap-3 sm:col-start-2 lg:col-start-auto">
                    {s.people.map((p) => {
                      const inner = (
                        <>
                          <span className="relative size-11 shrink-0 overflow-hidden rounded-full border border-line bg-ink-raised">
                            <Img src={p.photo} alt="" fill sizes="44px" position="50% 20%" className="object-cover" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[15px] font-semibold leading-tight">
                              {p.name}
                              {p.moderator ? <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.08em] text-gold">Moderator</span> : null}
                            </span>
                            <span className="block truncate text-[13px] text-muted">
                              {p.title}, {p.organization}
                            </span>
                          </span>
                        </>
                      );
                      return (
                        <li key={p.slug}>
                          {p.hasProfile ? (
                            <Link href={`/speakers/${p.slug}`} className="group flex items-center gap-3 rounded-lg hover:text-gold">
                              {inner}
                            </Link>
                          ) : (
                            <span className="flex items-center gap-3">{inner}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
