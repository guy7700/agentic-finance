'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import type { GalleryImage } from '@/data/types';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

type Collection = { id: string; label: string; short: string };
type Tag = { id: string; label: string };

type GalleryProps = {
  images: GalleryImage[];
  collections: readonly Collection[];
  tags?: readonly Tag[];
  /** Hide filters (e.g. single-edition embeds). */
  filters?: boolean;
  initialCollection?: string;
};

/**
 * Editorial masonry grid with a native <dialog> lightbox: focus is trapped and
 * Escape closes for free; arrow keys move between photos.
 */
export function Gallery({ images, collections, tags = [], filters = true, initialCollection = '' }: GalleryProps) {
  const [collection, setCollection] = useState(initialCollection);
  const [tag, setTag] = useState('');
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const visible = useMemo(
    () => images.filter((i) => (!collection || i.edition === collection) && (!tag || i.tags.includes(tag))),
    [images, collection, tag],
  );

  const open = (i: number, el: HTMLElement) => {
    returnFocus.current = el;
    setIndex(i);
  };

  const close = useCallback(() => setIndex(null), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (index !== null && !d.open) {
      d.showModal();
      document.documentElement.dataset.scrollLock = 'true';
    }
    if (index === null && d.open) {
      d.close();
    }
    if (index === null) {
      delete document.documentElement.dataset.scrollLock;
      returnFocus.current?.focus();
    }
  }, [index]);

  // Close the lightbox if the route is hidden by Activity during navigation.
  useLayoutEffect(() => {
    const d = dialogRef.current;
    return () => {
      if (d?.open) d.close();
      delete document.documentElement.dataset.scrollLock;
    };
  }, []);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + visible.length) % visible.length)),
    [visible.length],
  );

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  const current = index !== null ? visible[index] : null;
  const collectionLabel = (id: string) => collections.find((c) => c.id === id)?.label ?? id;

  return (
    <div>
      {filters ? (
        <div className="flex flex-col gap-3 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Event" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {[{ id: '', short: 'All events' }, ...collections].map((c) => {
              const count = c.id ? images.filter((i) => i.edition === c.id).length : images.length;
              return (
                <button
                  key={c.id || 'all'}
                  type="button"
                  aria-pressed={collection === c.id}
                  onClick={() => setCollection(c.id)}
                  className={cn(
                    'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition-colors',
                    collection === c.id ? 'border-gold bg-gold text-ink' : 'border-line-strong hover:border-gold hover:text-gold',
                  )}
                >
                  {c.short}
                  <span className={cn('font-mono text-[11px]', collection === c.id ? 'text-ink/70' : 'text-subtle')}>{count}</span>
                </button>
              );
            })}
          </div>
          {tags.length ? (
            <div role="group" aria-label="Moment" className="flex flex-wrap gap-2">
              {[{ id: '', label: 'All moments' }, ...tags].map((t) => (
                <button
                  key={t.id || 'all'}
                  type="button"
                  aria-pressed={tag === t.id}
                  onClick={() => setTag(t.id)}
                  className={cn(
                    'h-9 rounded-full border px-3.5 font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors',
                    tag === t.id ? 'border-paper bg-paper text-ink' : 'border-line-strong text-muted hover:text-paper',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {filters ? (
        <p aria-live="polite" className="mono-label mt-6">
          {visible.length} {visible.length === 1 ? 'photo' : 'photos'}
        </p>
      ) : null}

      {visible.length ? (
        <ul className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
          {visible.map((img, i) => (
            <li key={img.id} className="break-inside-avoid">
              <figure>
                <button
                  type="button"
                  onClick={(e) => open(i, e.currentTarget)}
                  className="group relative block w-full overflow-hidden rounded-xl border border-line bg-ink-raised"
                  style={{ aspectRatio: `${img.width} / ${img.height}` }}
                >
                  <Img
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                  />
                  <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink/70 text-paper opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Icon name="expand" size={16} />
                  </span>
                  <span className="sr-only">Open photo: {img.caption ?? img.alt}</span>
                </button>
                {img.caption ? (
                  <figcaption className="mt-2.5 text-[13px] leading-snug text-muted">
                    {img.caption}
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">
                      {collectionLabel(img.edition)}
                    </span>
                  </figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-2xl border border-dashed border-line-strong p-10 text-center text-muted">
          No photos in this view yet. Try another event or moment.
        </p>
      )}

      <dialog
        ref={dialogRef}
        onClose={close}
        onKeyDown={onKeyDown}
        aria-label={current ? `Photo: ${current.caption ?? current.alt}` : 'Photo viewer'}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink-deep/96 p-0 text-paper backdrop:bg-ink-deep/90"
      >
        {current ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8">
              <p className="font-mono text-xs text-muted">
                {(index ?? 0) + 1} / {visible.length}
              </p>
              <button
                type="button"
                onClick={close}
                className="flex size-11 items-center justify-center rounded-full border border-line-strong hover:border-gold hover:text-gold"
              >
                <Icon name="close" size={18} />
                <span className="sr-only">Close photo viewer</span>
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20">
              <div className="relative h-full w-full">
                <Img key={current.id} src={current.src} alt={current.alt} fill sizes="100vw" quality={85} className="object-contain" />
              </div>
              <button
                type="button"
                onClick={() => step(-1)}
                className="absolute left-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-ink/70 backdrop-blur-sm hover:border-gold hover:text-gold sm:left-6"
              >
                <Icon name="chevron-left" size={20} />
                <span className="sr-only">Previous photo</span>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-ink/70 backdrop-blur-sm hover:border-gold hover:text-gold sm:right-6"
              >
                <Icon name="chevron-right" size={20} />
                <span className="sr-only">Next photo</span>
              </button>
            </div>
            <div className="px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 text-center sm:px-8">
              <p className="mx-auto max-w-2xl text-[15px] text-paper/90">{current.caption ?? current.alt}</p>
              <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-subtle">{collectionLabel(current.edition)}</p>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
