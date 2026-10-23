'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { asset } from '@/lib/paths';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

type VideoPlayerProps = {
  src: string;
  poster: string;
  title: string;
  duration?: string;
  hasAudio?: boolean;
  className?: string;
  /** Load the poster eagerly when the player is above the fold. */
  eager?: boolean;
};

/**
 * Click-to-play video: only the poster loads until the visitor asks for the
 * film. Native controls once playing; paused when the route is hidden.
 */
export function VideoPlayer({ src, poster, title, duration, hasAudio = true, className, eager }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const v = videoRef.current;
    return () => v?.pause();
  }, [playing]);

  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-2xl border border-line bg-ink-deep', className)}>
      {playing ? (
        <video
          ref={videoRef}
          src={asset(src)}
          poster={asset(poster)}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-contain"
          aria-label={title}
        >
          Your browser does not support embedded video.{' '}
          <a href={asset(src)} className="text-gold underline">
            Download the video
          </a>
          .
        </video>
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 block h-full w-full text-left">
          <Img src={poster} alt="" fill loading={eager ? 'eager' : undefined} sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-gold text-ink shadow-[0_0_0_10px_rgb(212_175_90/0.18)] transition-transform duration-500 group-hover:scale-105 sm:size-24">
              <Icon name="play" size={30} />
            </span>
          </span>
          <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-7">
            <span className="text-lg font-bold leading-tight sm:text-2xl">{title}</span>
            <span className="flex shrink-0 items-center gap-2 font-mono text-xs text-paper/80">
              <Icon name={hasAudio ? 'volume' : 'volume-off'} size={14} />
              {duration}
            </span>
          </span>
          <span className="sr-only">Play video: {title}</span>
        </button>
      )}
    </div>
  );
}

/**
 * Silent, looping background film (decorative). It only loads on wide screens,
 * once the page is idle, and never for visitors who prefer reduced motion or
 * have Data Saver on; everyone else sees the optimised poster image beneath it.
 * Paused whenever the route is hidden.
 */
export function AmbientVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (reduce || !wide || saveData) return;
    const start = () => setActive(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(start, 1200);
    return () => clearTimeout(t);
  }, []);

  useLayoutEffect(() => {
    const v = ref.current;
    if (!active || !v) return;
    v.play().catch(() => {});
    return () => v.pause();
  }, [active]);

  if (!active) return null;
  return (
    <video
      ref={ref}
      className={cn('motion-reduce:hidden motion-safe:animate-[af-fade-in_1.2s_ease-out]', className)}
      src={asset(src)}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
    />
  );
}
