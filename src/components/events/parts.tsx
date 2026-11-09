import { useState } from 'react';
import type { ImageAsset } from '@/data/types';
import type { CalendarEvent } from '@/lib/calendar';
import { cn } from '@/lib/cn';
import { isExternal } from '@/lib/paths';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { SmartLink } from '../ui/SmartLink';

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** The date as published, with the year when the label leaves it out: "21-22 Apr 2027", "Mid Nov · 2027", or just "2027". */
export function dateWithYear(e: CalendarEvent): string {
  if (!e.dateLabel) return String(e.year);
  if (/\d{4}/.test(e.dateLabel)) return e.dateLabel;
  return e.start ? `${e.dateLabel} ${e.year}` : `${e.dateLabel} · ${e.year}`;
}

/** The name, with the city when the name does not already say it. */
export function nameAndCity(e: CalendarEvent): string {
  return e.name.includes(e.city) ? e.name : `${e.name}, ${e.city}`;
}

/** tile: large photo card; card: thumbnail on phones, tile from 640px; thumb: medium; mini: up to 96px. */
type VisualSize = 'tile' | 'card' | 'thumb' | 'mini';

/**
 * The event's city photograph, or a placeholder tile with the city name when
 * there is none. Never a stand-in photo of somewhere else, never a logo.
 * `decorative` drops the alt text, for a photo inside a button or link that is
 * already named.
 */
export function EventVisual({
  event: e,
  sizes,
  size = 'tile',
  decorative,
}: {
  event: CalendarEvent;
  sizes: string;
  size?: VisualSize;
  decorative?: boolean;
}) {
  if (e.image) {
    return (
      <Img
        src={e.image.src}
        alt={decorative ? '' : e.image.alt}
        fill
        sizes={sizes}
        position={e.image.position}
        className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.04]"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden bg-[radial-gradient(circle_at_50%_40%,rgb(209_182_121/0.22),transparent_65%),linear-gradient(160deg,#0c1830,#050b18)] px-2 text-center"
    >
      <div
        className={cn(
          'hairline-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]',
          size !== 'tile' && '[background-size:18px_18px]',
        )}
      />
      {size === 'mini' ? (
        <>
          <Icon name="pin" size={14} className="relative text-gold" />
          <span className="relative line-clamp-2 font-serif text-[13px] font-medium italic leading-[1.05] text-gold">{e.city}</span>
        </>
      ) : (
        <>
          <span
            className={cn(
              'relative flex items-center justify-center rounded-full border border-gold/40 bg-ink/70 shadow-[0_0_30px_rgb(209_182_121/0.35)]',
              size === 'card' ? 'p-2 sm:p-2.5' : 'p-2.5',
            )}
          >
            <Icon name="pin" size={size === 'tile' ? 26 : 18} className="text-gold" />
          </span>
          <span
            className={cn(
              'relative font-serif font-medium italic leading-none text-gold',
              size === 'tile' ? 'text-[32px]' : size === 'card' ? 'line-clamp-2 text-lg leading-[1.05] sm:text-[32px] sm:leading-none' : 'text-lg',
            )}
          >
            {e.city}
          </span>
        </>
      )}
    </div>
  );
}

export function CityChip({ event: e, overlay, className }: { event: CalendarEvent; overlay?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]',
        e.ours ? 'border-gold/60 bg-gold/15 text-gold-bright' : 'border-paper/25 bg-ink/60 text-paper/90',
        overlay && 'bg-ink/75 backdrop-blur-sm',
        className,
      )}
    >
      <Icon name="pin" size={12} className="shrink-0" />
      <span className="truncate">{e.city}</span>
    </span>
  );
}

/**
 * The event's action as a button-styled link: "Tell us if you'll be there"
 * (/2027?event=<id>) for a 2027 event, the event page for our own. The label
 * may wrap on narrow cards.
 */
export function EventCta({
  event: e,
  variant = 'primary',
  size = 'md',
  className,
}: {
  event: CalendarEvent;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const external = isExternal(e.href);
  return (
    <SmartLink href={e.href} className={buttonClasses({ variant, size, className: cn('py-2.5', className) })}>
      <span className="whitespace-normal text-balance text-center leading-snug">
        {e.cta}
        {e.ours ? null : <span className="sr-only">: {e.name}</span>}
      </span>
      <Icon
        name={external ? 'arrow-up-right' : 'arrow-right'}
        size={16}
        className={cn(
          'shrink-0 transition-transform duration-300',
          external ? 'group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5' : 'group-hover/btn:translate-x-0.5',
        )}
      />
    </SmartLink>
  );
}

/* -------------------------------------------------------------- Backdrop */

export type BackdropLayer = { key: string; image?: ImageAsset; city: string };

/**
 * The faded city photograph behind the month view. It cross-fades: the last
 * city stays underneath while the new one fades in. A city without a photo
 * gets its name, large, on the navy ground instead of a borrowed photo.
 */
export function Backdrop({ layer }: { layer: BackdropLayer }) {
  // Remember the previous layer (React's "store information from previous renders" pattern).
  const [layers, setLayers] = useState<{ current: BackdropLayer; previous: BackdropLayer | null }>({ current: layer, previous: null });
  if (layers.current.key !== layer.key) setLayers({ current: layer, previous: layers.current });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {layers.previous ? <BackdropLayerView key={layers.previous.key} layer={layers.previous} /> : null}
      <BackdropLayerView key={layers.current.key} layer={layers.current} fadeIn={layers.previous !== null} />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-card/75 via-ink-card/15 to-ink-card/90" />
    </div>
  );
}

function BackdropLayerView({ layer, fadeIn }: { layer: BackdropLayer; fadeIn?: boolean }) {
  const fade = fadeIn && 'motion-safe:animate-[af-fade-in_0.8s_ease-out]';
  if (layer.image) {
    return (
      <div className={cn('absolute inset-0', fade)}>
        <Img src={layer.image.src} alt="" fill sizes="(min-width: 1360px) 1300px, 100vw" position={layer.image.position} className="object-cover opacity-90" />
      </div>
    );
  }
  // Long names get smaller type so the whole name fits the panel.
  const chars = Math.max(layer.city.length, 4);
  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_75%_20%,rgb(209_182_121/0.2),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgb(37_64_120/0.55),transparent_60%),linear-gradient(160deg,#0f1f3d,#050b18)]',
        fade,
      )}
    >
      <div className="hairline-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_60%_40%,black,transparent_80%)]" />
      <span
        className="absolute left-[3%] top-[min(30%,300px)] whitespace-nowrap bg-gradient-to-b from-gold-bright/40 to-gold/10 bg-clip-text pr-[0.15em] font-serif font-medium italic leading-[1.1] text-transparent"
        style={{ fontSize: `min(13rem, ${(180 / chars).toFixed(1)}cqw)` }}
      >
        {layer.city}
      </span>
    </div>
  );
}
