'use client';

import { useMemo, useState } from 'react';
import type { Video } from '@/data/types';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { VideoPlayer } from './VideoPlayer';

type VideoView = Video & { editionLabel: string; speakerNames: string[] };

const kindLabel: Record<Video['kind'], string> = {
  recap: 'Recap',
  highlights: 'Highlights',
  aftermovie: 'Aftermovie',
  session: 'Session',
};

/** Featured player plus a filterable list. Filters only show when they narrow. */
export function VideoLibrary({ videos }: { videos: VideoView[] }) {
  const [kind, setKind] = useState('');
  const [selected, setSelected] = useState(videos[0]?.id);
  const kinds = useMemo(() => Array.from(new Set(videos.map((v) => v.kind))), [videos]);
  const list = videos.filter((v) => !kind || v.kind === kind);
  const current = videos.find((v) => v.id === selected) ?? videos[0];

  if (!current) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div>
        <VideoPlayer key={current.id} eager src={current.src} poster={current.poster} title={current.title} duration={current.duration} hasAudio={current.hasAudio} />
        <div className="mt-6">
          <p className="mono-label">
            {current.editionLabel} · {kindLabel[current.kind]} · {current.duration}
            {current.hasAudio ? '' : ' · No audio'}
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{current.title}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">{current.description}</p>
          {current.speakerNames.length ? (
            <p className="mt-3 text-sm text-muted">
              Featuring <span className="text-paper/85">{current.speakerNames.join(', ')}</span>
            </p>
          ) : null}
          {current.external ? (
            <p className="mt-3 text-sm text-subtle">Streams from the More &amp; More website.</p>
          ) : null}
        </div>
      </div>

      <div>
        {kinds.length > 1 ? (
          <div role="group" aria-label="Video type" className="flex flex-wrap gap-2">
            {['', ...kinds].map((k) => (
              <button
                key={k || 'all'}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={cn(
                  'h-9 rounded-full border px-3.5 font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors',
                  kind === k ? 'border-gold bg-gold text-ink' : 'border-line-strong text-muted hover:text-paper',
                )}
              >
                {k ? kindLabel[k as Video['kind']] : 'All videos'}
              </button>
            ))}
          </div>
        ) : null}
        <ul className="mt-5 flex flex-col gap-3">
          {list.map((v) => {
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
                  <span className="relative aspect-video w-36 shrink-0 overflow-hidden rounded-lg bg-ink-raised">
                    <Img src={v.poster} alt="" fill sizes="144px" className="object-cover" />
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
                      <Icon name="play" size={20} className="text-paper" />
                    </span>
                  </span>
                  <span className="flex min-w-0 flex-col gap-1 py-0.5">
                    <span className={cn('text-[15px] font-semibold leading-snug', on && 'text-gold')}>{v.title}</span>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-subtle">
                      {kindLabel[v.kind]} · {v.duration}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 rounded-xl border border-dashed border-line-strong p-5 text-sm leading-relaxed text-muted">
          Full keynote and panel recordings from Singapore have not been published yet. They will appear here, filterable by
          speaker and session, as they are released.
        </div>
      </div>
    </div>
  );
}
