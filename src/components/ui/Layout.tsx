import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Container({ className, children, wide }: { className?: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-10', wide ? 'max-w-[1600px]' : 'max-w-[1360px]', className)}>
      {children}
    </div>
  );
}

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  tone?: 'base' | 'raised' | 'deep';
  bordered?: boolean;
  as?: ElementType;
  'aria-labelledby'?: string;
};

export function Section({ id, className, children, tone = 'base', bordered, as: Tag = 'section', ...rest }: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'relative py-20 sm:py-24 lg:py-32',
        tone === 'raised' && 'bg-ink-raised',
        tone === 'deep' && 'bg-ink-deep',
        bordered && 'border-t border-line',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, className, index }: { children: ReactNode; className?: string; index?: string }) {
  return (
    <p className={cn('eyebrow flex items-center gap-3', className)}>
      {index ? <span className="text-muted">{index}</span> : null}
      {index ? <span aria-hidden className="h-px w-6 bg-gold/60" /> : null}
      <span>{children}</span>
    </p>
  );
}

type SectionHeaderProps = {
  eyebrow?: ReactNode;
  index?: string;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
  className?: string;
  id?: string;
  size?: 'lg' | 'md';
  as?: 'h1' | 'h2';
  /** Keep the action under the title, for narrow columns. */
  stacked?: boolean;
};

export function SectionHeader({ eyebrow, index, title, lede, action, className, id, size = 'lg', as: H = 'h2', stacked }: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-8', !stacked && 'lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className="max-w-3xl">
        {eyebrow ? <Eyebrow index={index}>{eyebrow}</Eyebrow> : null}
        <H
          id={id}
          className={cn(
            'display mt-5',
            size === 'lg' ? 'text-[length:var(--text-display-md)]' : 'text-[length:var(--text-display-sm)]',
          )}
        >
          {title}
        </H>
        {lede ? <p className="lede mt-6 max-w-2xl">{lede}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-3">{action}</div> : null}
    </div>
  );
}

/** Thin gold-edged card shell used across the site. */
export function Card({ className, children, as: Tag = 'div' }: { className?: string; children: ReactNode; as?: ElementType }) {
  return <Tag className={cn('rounded-2xl border border-line bg-ink-card/60', className)}>{children}</Tag>;
}
