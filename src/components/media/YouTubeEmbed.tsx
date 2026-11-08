'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

/**
 * Click-to-load YouTube player: nothing from YouTube loads until the visitor
 * presses play, and then only from the privacy-enhanced domain.
 */
export function YouTubeEmbed({
  id,
  poster,
  title,
  duration,
  className,
}: {
  id: string;
  poster: string;
  title: string;
  duration?: string;
  className?: string;
}) {
  const [on, setOn] = useState(false);
  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-2xl border border-line bg-ink-deep', className)}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 block h-full w-full text-left">
          <Img src={poster} alt="" fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-gold text-ink shadow-[0_0_0_10px_rgb(209_182_121/0.18)] transition-transform duration-500 group-hover:scale-105 sm:size-24">
              <Icon name="play" size={26} />
            </span>
          </span>
          <span className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-7">
            <span className="line-clamp-1 text-sm font-semibold leading-tight sm:line-clamp-none sm:text-2xl">{title}</span>
            {duration ? <span className="shrink-0 font-mono text-xs text-paper/80">{duration}</span> : null}
          </span>
          <span className="sr-only">Play video on YouTube: {title}</span>
        </button>
      )}
    </div>
  );
}
