import Link from 'next/link';
import type { Organization } from '@/data/types';
import { cn } from '@/lib/cn';
import { Img } from '../ui/Img';
import { SmartLink } from '../ui/SmartLink';

/** `href`: the company's own page on this site, when it has one (Tal: a logo leads to the company page, not out). */
export type LogoItem = Organization & { note?: string; href?: string };

type LogoWallProps = {
  items: LogoItem[];
  columns?: 'wide' | 'dense';
  /** Show the organisation name and note under each logo. */
  labelled?: boolean;
  linkOut?: boolean;
  className?: string;
};

export function LogoWall({ items, columns = 'dense', labelled, linkOut, className }: LogoWallProps) {
  return (
    <ul
      className={cn(
        'grid border-l border-t border-line',
        columns === 'dense' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        className,
      )}
    >
      {items.map((o) => {
        const content = (
          <>
            <span className={cn('relative flex w-full items-center justify-center', columns === 'wide' ? 'h-16' : 'h-11')}>
              {o.logo ? (
                <Img
                  src={o.logo}
                  alt={labelled ? '' : o.name}
                  fill
                  sizes="200px"
                  className="object-contain opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                />
              ) : (
                <span className="text-sm font-semibold text-paper/80">{o.name}</span>
              )}
            </span>
            {labelled ? (
              <span className="mt-4 flex flex-col items-center gap-1 text-center">
                <span className="text-sm font-semibold text-paper/90">{o.name}</span>
                {o.note ? <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-gold">{o.note}</span> : null}
              </span>
            ) : null}
          </>
        );
        const cls = cn(
          'group flex h-full flex-col items-center justify-center border-b border-r border-line px-6 transition-colors hover:bg-ink-card',
          columns === 'wide' ? 'py-10' : 'py-8',
        );
        return (
          <li key={o.id}>
            {o.href ? (
              <Link href={o.href} className={cls} aria-label={labelled ? undefined : `${o.name}, company page`}>
                {content}
              </Link>
            ) : linkOut && o.url ? (
              <SmartLink href={o.url} className={cls} aria-label={labelled ? undefined : `${o.name} website`}>
                {content}
              </SmartLink>
            ) : (
              <div className={cls}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Slow, pausable logo marquee for homepage credibility rows. */
export function LogoMarquee({ items }: { items: LogoItem[] }) {
  const row = [...items, ...items];
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <ul className="flex w-max items-center gap-16 py-2 motion-safe:animate-[af-marquee_60s_linear_infinite] group-hover:[animation-play-state:paused]">
        {row.map((o, i) => (
          <li key={`${o.id}-${i}`} aria-hidden={i >= items.length} className="relative h-9 w-32 shrink-0">
            {o.logo ? <Img src={o.logo} alt={i >= items.length ? '' : o.name} fill sizes="128px" className="object-contain opacity-70" /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Two rows of logos moving in opposite directions (Tal's review, 26 Nov 2026), for the strip
 * under the home hero, the event pages and the partnership page. Fixed-size slots, so nothing
 * shifts while logos load; it pauses on hover and keeps still for visitors who ask for less
 * motion, where each row scrolls by hand instead. A logo with an `href` opens its company page.
 */
export function LogoMarqueeRows({ items, speed = 70, className }: { items: LogoItem[]; speed?: number; className?: string }) {
  const withLogo = items.filter((o) => o.logo);
  const half = Math.ceil(withLogo.length / 2);
  const rows = [withLogo.slice(0, half), withLogo.slice(half)].filter((r) => r.length);
  return (
    <div className={cn('flex flex-col gap-5 sm:gap-7', className)}>
      {rows.map((items, r) => {
        const row = [...items, ...items];
        return (
          <div
            key={r}
            className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] motion-reduce:overflow-x-auto"
          >
            <ul
              className="af-marquee-row flex w-max items-center gap-10 py-1 group-hover:[animation-play-state:paused] sm:gap-14"
              style={{ animation: `${r === 0 ? 'af-marquee' : 'af-marquee-reverse'} ${speed + r * 8}s linear infinite` }}
            >
              {row.map((o, i) => {
                const hidden = i >= items.length;
                const logo = (
                  <span className="relative block h-9 w-28 sm:h-10 sm:w-32">
                    <Img src={o.logo!} alt={hidden ? '' : o.name} fill sizes="128px" className={cn('object-contain opacity-75 transition-opacity duration-300 hover:opacity-100', o.invertLogo && 'invert')} />
                  </span>
                );
                return (
                  <li key={`${o.id}-${i}`} aria-hidden={hidden || undefined} className="shrink-0">
                    {o.href ? (
                      <Link href={o.href} tabIndex={hidden ? -1 : undefined} aria-label={hidden ? undefined : `${o.name}, company page`}>
                        {logo}
                      </Link>
                    ) : (
                      logo
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
