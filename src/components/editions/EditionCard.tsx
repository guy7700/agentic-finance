import Link from 'next/link';
import type { Edition } from '@/data/types';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { StatusBadge } from '../ui/StatusBadge';

type EditionCardProps = {
  edition: Edition;
  index?: string;
  size?: 'feature' | 'standard' | 'compact';
  className?: string;
  sizes?: string;
};

/** Reusable card for any edition. Status decides the visual treatment. */
export function EditionCard({ edition, index, size = 'standard', className, sizes }: EditionCardProps) {
  const planned = edition.status === 'planned';
  return (
    <Link
      href={`/editions/${edition.slug}`}
      className={cn(
        'group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl border bg-ink-card transition-colors duration-500',
        edition.status === 'upcoming' ? 'border-gold/40 hover:border-gold' : 'border-line hover:border-line-strong',
        size === 'feature' && 'min-h-[460px] p-7 sm:min-h-[560px] sm:p-10',
        size === 'standard' && 'min-h-[380px] p-6 pt-20 sm:p-7 sm:pt-20',
        size === 'compact' && 'min-h-[300px] p-5 pt-20',
        className,
      )}
    >
      <Img
        src={edition.image.src}
        alt={edition.image.alt}
        fill
        sizes={sizes ?? (size === 'feature' ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 30vw, 100vw')}
        position={edition.image.position}
        className={cn(
          '-z-20 object-cover transition-[transform,filter,opacity] duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]',
          planned ? 'opacity-55 grayscale-[0.35] group-hover:opacity-75 group-hover:grayscale-0' : 'opacity-70 group-hover:opacity-85',
        )}
      />
      <span aria-hidden className="scrim-bottom absolute inset-0 -z-10" />
      <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-3 sm:inset-x-7 sm:top-7">
        <StatusBadge status={edition.status} />
        {index ? <span className="font-mono text-xs text-paper/70">{index}</span> : null}
      </div>
      <p className="mono-label text-paper/70">{edition.country}</p>
      <h3
        className={cn(
          'display mt-2',
          size === 'feature' ? 'text-[clamp(2.5rem,1.6rem+3.5vw,4.75rem)]' : size === 'standard' ? 'text-4xl' : 'text-[28px]',
        )}
      >
        {edition.city}
        <span className="text-gold"> {edition.year}</span>
      </h3>
      <p className={cn('mt-3 max-w-md text-paper/80', size === 'compact' ? 'text-sm' : 'text-[15px]')}>{edition.tagline}</p>
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-paper/15 pt-4">
        <span className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-paper/85">
          <Icon name="calendar" size={14} className="text-gold" />
          {edition.dateLabel}
        </span>
        <Icon name="arrow-right" size={18} className="text-gold transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
