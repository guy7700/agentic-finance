'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Muted, looping YouTube film behind a hero. Nothing loads from YouTube until
 * the page is idle, and never for visitors who prefer reduced motion, have
 * Data Saver on, or are on a narrow screen: they keep the poster photo.
 * Uses the privacy-enhanced domain, like the site's other YouTube embeds.
 */
export function YouTubeBackground({ id, title, className }: { id: string; title: string; className?: string }) {
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wide = window.matchMedia('(min-width: 1024px)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (reduce || !wide || saveData) return;
    const start = () => setActive(true);
    if ('requestIdleCallback' in window) {
      const h = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(h);
    }
    const t = setTimeout(start, 1200);
    return () => clearTimeout(t);
  }, []);

  if (!active) return null;
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    loop: '1',
    playlist: id,
    playsinline: '1',
    modestbranding: '1',
    rel: '0',
    disablekb: '1',
    iv_load_policy: '3',
  });
  return (
    <div aria-hidden className={cn('pointer-events-none overflow-hidden transition-opacity duration-1000', ready ? 'opacity-100' : 'opacity-0', className)}>
      {/* Cover the box at 16:9, then overscan by 20% so YouTube's title bar and corner logo sit outside the frame. */}
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params.toString()}`}
        title={title}
        tabIndex={-1}
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        // Wait out YouTube's title card before fading in.
        onLoad={() => window.setTimeout(() => setReady(true), 3500)}
        className="absolute left-1/2 top-1/2 h-[max(100%,56.25vw)] w-[max(100%,177.78vh)] -translate-x-1/2 -translate-y-1/2 scale-[1.2] border-0"
      />
    </div>
  );
}
