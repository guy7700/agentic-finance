'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import { videoKindLabels as videoKindLabel } from '@/data/media';
import type { Video } from '@/data/types';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { VideoPlayer } from './VideoPlayer';
import { YouTubeEmbed } from './YouTubeEmbed';

export type VideoView = Video & { editionLabel: string; speakerNames: string[] };

const chip = (on: boolean) =>
  cn(
    'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition-colors',
    on ? 'border-gold bg-gold text-ink' : 'border-line-strong hover:border-gold hover:text-gold',
  );

const count = (on: boolean) => cn('font-mono text-[11px]', on ? 'text-ink/70' : 'text-subtle');

/**
 * Featured player plus a list grouped by edition, filterable by edition and
 * by type. The type filter only shows when there is more than one type.
 */
export function VideoLibrary({ videos, note }: { videos: VideoView[]; note?: ReactNode }) {
  const [edition, setEdition] = useState('');
  const [kind, setKind] = useState('');
  const [selected, setSelected] = useState(videos[0]?.id);
  const uid = useId();

  const editions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const v of videos) if (!seen.has(v.edition)) seen.set(v.edition, v.editionLabel);
    return Array.from(seen, ([id, label]) => ({ id, label }));
  }, [videos]);
  const kinds = useMemo(() => Array.from(new Set(videos.map((v) => v.kind))), [videos]);

  const list = videos.filter((v) => (!edition || v.edition === edition) && (!kind || v.kind === kind));
  const groups = editions.map((e) => ({ ...e, items: list.filter((v) => v.edition === e.id) })).filter((g) => g.items.length);
  const current = videos.find((v) => v.id === selected) ?? videos[0];

  if (!current) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div>
        {current.youtubeId ? (
          <YouTubeEmbed key={current.id} id={current.youtubeId} poster={current.poster} title={current.title} duration={current.duration} />
        ) : (
          <VideoPlayer key={current.id} eager src={current.src} poster={current.poster} title={current.title} duration={current.duration} hasAudio={current.hasAudio} />
        )}
        <div className="mt-6">
          <p className="mono-label">
            {current.editionLabel} · {videoKindLabel[current.kind]} · {current.duration}
            {current.hasAudio ? '' : ' · No audio'}
          </p>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{current.title}</h2>
          <p className="mt-3 max-w-2xl font-light leading-relaxed text-muted">{current.description}</p>
          {current.speakerNames.length ? (
            <p className="mt-3 text-sm text-muted">
              Featuring <span className="text-paper/85">{current.speakerNames.join(', ')}</span>
            </p>
          ) : null}
          {current.youtubeId ? (
            <p className="mt-3 text-sm text-subtle">Plays from YouTube.</p>
          ) : current.external ? (
            <p className="mt-3 text-sm text-subtle">Streams from the More &amp; More website.</p>
          ) : null}
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-5">
          <div>
            <p id={`${uid}-edition`} className="mono-label">
              Edition
            </p>
            <div role="group" aria-labelledby={`${uid}-edition`} className="mt-2.5 flex flex-wrap gap-2">
              {[{ id: '', label: 'All editions' }, ...editions].map((e) => (
                <button key={e.id || 'all'} type="button" aria-pressed={edition === e.id} onClick={() => setEdition(e.id)} className={chip(edition === e.id)}>
                  {e.label}
                  <span className={count(edition === e.id)}>{e.id ? videos.filter((v) => v.edition === e.id).length : videos.length}</span>
                </button>
              ))}
            </div>
          </div>
          {kinds.length > 1 ? (
            <div>
              <p id={`${uid}-type`} className="mono-label">
                Type
              </p>
              <div role="group" aria-labelledby={`${uid}-type`} className="mt-2.5 flex flex-wrap gap-2">
                {['', ...kinds].map((k) => (
                  <button
                    key={k || 'all'}
                    type="button"
                    aria-pressed={kind === k}
                    onClick={() => setKind(k)}
                    className={cn(
                      'h-9 rounded-full border px-3.5 font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors',
                      kind === k ? 'border-paper bg-paper text-ink' : 'border-line-strong text-muted hover:text-paper',
                    )}
                  >
                    {k ? videoKindLabel[k as Video['kind']] : 'All types'}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <p aria-live="polite" className="sr-only">
          {list.length} {list.length === 1 ? 'video' : 'videos'}
        </p>

        {groups.length ? (
          <div className="mt-8 flex flex-col gap-8 border-t border-line pt-6">
            {groups.map((g) => (
              <section key={g.id} aria-labelledby={`${uid}-${g.id}`}>
                <h3 id={`${uid}-${g.id}`} className="eyebrow">
                  {g.label} · {g.items.length} {g.items.length === 1 ? 'video' : 'videos'}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {g.items.map((v) => {
                    const on = v.id === current.id;
                    return (
                      <li key={v.id}>
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() => setSelected(v.id)}
                          className={cn(
                            'group flex w-full gap-4 rounded-xl border p-3 text-left transition-colors',
                            on ? 'border-gold/70 bg-gold/[0.06]' : 'border-line hover:border-line-strong hover:bg-ink-card',
                          )}
                        >
                          <span className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-ink-raised sm:w-36">
                            <Img src={v.poster} alt="" fill sizes="144px" className="object-cover" />
                            <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
                              <Icon name="play" size={20} className="text-paper" />
                            </span>
                          </span>
                          <span className="flex min-w-0 flex-col gap-1 py-0.5">
                            <span className={cn('text-[15px] font-semibold leading-snug', on && 'text-gold')}>{v.title}</span>
                            <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-subtle">
                              {videoKindLabel[v.kind]} · {v.duration}
                              {v.youtubeId ? ' · YouTube' : ''}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-line-strong p-6 text-center text-sm text-muted">
            No videos in this view yet. Try another edition or type.
          </p>
        )}

        {note ? <div className="mt-6 rounded-xl border border-dashed border-line-strong p-5 text-sm leading-relaxed text-muted">{note}</div> : null}
      </div>
    </div>
  );
}
