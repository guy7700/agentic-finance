'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import type { Topic } from '@/data/types';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';

type TopicView = Topic & { categoryName: string };

/**
 * Fifteen programme areas. Desktop: a numbered index with a detail pane
 * (tabs pattern). Mobile: the same items as an accordion. Deep links via
 * #topic-slug open the matching topic.
 */
export function TopicExplorer({ topics }: { topics: TopicView[] }) {
  const [active, setActive] = useState(topics[0]?.slug);
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const uid = useId();

  useEffect(() => {
    const fromHash = () => {
      const slug = window.location.hash.replace('#', '');
      if (topics.some((t) => t.slug === slug)) {
        setActive(slug);
        setOpenMobile(slug);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [topics]);

  const current = topics.find((t) => t.slug === active) ?? topics[0];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const delta = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (!delta && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? topics.length - 1 : (i + delta + topics.length) % topics.length;
    setActive(topics[next].slug);
    tabRefs.current[topics[next].slug]?.focus();
  };

  return (
    <>
      <h2 className="sr-only">All topics</h2>
      {/* Desktop */}
      <div className="hidden gap-12 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div role="tablist" aria-orientation="vertical" aria-label="Programme topics" className="flex flex-col border-t border-line">
          {topics.map((t, i) => {
            const on = t.slug === current.slug;
            return (
              <button
                key={t.slug}
                ref={(el) => {
                  tabRefs.current[t.slug] = el;
                }}
                id={`${uid}-tab-${t.slug}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls={`${uid}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(t.slug)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  'group flex items-center gap-5 border-b border-line py-3.5 text-left transition-colors',
                  on ? 'text-gold' : 'text-paper/70 hover:text-paper',
                )}
              >
                <span className={cn('font-mono text-xs', on ? 'text-gold' : 'text-subtle')}>{t.number}</span>
                <span className="flex-1 text-[19px] font-semibold leading-tight">{t.name}</span>
                <Icon name="arrow-right" size={16} className={cn('transition-all', on ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0')} />
              </button>
            );
          })}
        </div>
        <div
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${current.slug}`}
          className="sticky top-[calc(var(--header-h)+32px)] self-start rounded-2xl border border-line bg-ink-card/60 p-10"
        >
          <TopicDetail topic={current} large />
        </div>
      </div>

      {/* Mobile */}
      <div className="border-t border-line lg:hidden">
        {topics.map((t) => {
          const open = openMobile === t.slug;
          return (
            <div key={t.slug} id={t.slug} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${uid}-m-${t.slug}`}
                  onClick={() => setOpenMobile(open ? null : t.slug)}
                  className="flex min-h-16 w-full items-center gap-4 py-3 text-left"
                >
                  <span className="font-mono text-xs text-subtle">{t.number}</span>
                  <span className="flex-1 text-lg font-semibold leading-snug">{t.name}</span>
                  <span aria-hidden className="w-6 text-center text-2xl leading-none text-gold">
                    {open ? '−' : '+'}
                  </span>
                </button>
              </h3>
              <div id={`${uid}-m-${t.slug}`} hidden={!open} className="pb-8">
                <TopicDetail topic={t} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function TopicDetail({ topic, large }: { topic: TopicView; large?: boolean }) {
  return (
    <div>
      {large ? (
        <>
          <p className="eyebrow">Topic {topic.number} / 15</p>
          <h3 className="display-tight mt-4 text-[40px]">{topic.name}</h3>
        </>
      ) : null}
      <p className={cn('leading-relaxed text-paper/85', large ? 'mt-6 text-lg' : 'text-[16px]')}>{topic.summary}</p>
      <p className="mono-label mt-8">The questions on the table</p>
      <ul className="mt-4 flex flex-col gap-3">
        {topic.questions.map((q) => (
          <li key={q} className="flex gap-3 text-[15px] leading-relaxed text-muted">
            <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-gold" />
            {q}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
        <Link
          href={`/partners/categories?category=${topic.category}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-bright"
        >
          Partnership category: {topic.categoryName}
          <Icon name="arrow-right" size={14} />
        </Link>
        <Link href="/speakers/nominate" className="inline-flex items-center gap-1.5 text-sm font-semibold text-paper/80 hover:text-gold">
          Nominate a speaker on this topic
          <Icon name="arrow-right" size={14} />
        </Link>
      </div>
    </div>
  );
}
