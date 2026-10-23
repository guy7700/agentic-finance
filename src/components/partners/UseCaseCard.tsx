import Link from 'next/link';
import type { UseCase } from '@/data/types';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

export function UseCaseCard({ useCase, featured, className }: { useCase: UseCase; featured?: boolean; className?: string }) {
  const photo = useCase.photos[0];
  return (
    <Link
      href={`/partners/use-cases/${useCase.slug}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-card/60 transition-colors duration-500 hover:border-gold/60',
        featured && 'lg:flex-row',
        className,
      )}
    >
      <div className={cn('relative aspect-[16/10] overflow-hidden', featured && 'lg:aspect-auto lg:w-[56%]')}>
        <Img
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={featured ? '(min-width: 1024px) 56vw, 100vw' : '(min-width: 1024px) 33vw, 100vw'}
          position={photo.position}
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full border border-paper/20 bg-ink/75 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-paper/90 backdrop-blur-sm">
          Singapore 2026
        </span>
      </div>
      <div className={cn('flex flex-1 flex-col p-6 sm:p-8', featured && 'lg:p-12')}>
        <div className="relative h-8 w-32">
          <Img src={useCase.logo} alt={useCase.partner} fill sizes="128px" className="object-contain object-left" />
        </div>
        <p className="eyebrow mt-6">{useCase.positioning}</p>
        <p className={cn('mt-4 leading-relaxed text-paper/85', featured ? 'text-lg' : 'text-[15px]')}>{useCase.summary}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {useCase.deliverables.slice(0, featured ? 8 : 4).map((d) => (
            <li key={d.label} className="rounded-full border border-line-strong px-3 py-1 text-[12.5px] text-muted">
              {d.label}
            </li>
          ))}
          {useCase.deliverables.length > (featured ? 8 : 4) ? (
            <li className="rounded-full px-1 py-1 text-[12.5px] text-subtle">+{useCase.deliverables.length - (featured ? 8 : 4)} more</li>
          ) : null}
        </ul>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold text-gold">
          Read the use case
          <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
