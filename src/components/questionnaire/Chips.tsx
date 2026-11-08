import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';

/** Visible focus for a label that wraps a visually hidden checkbox. */
const focusRing =
  'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold';

type ChipProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  className?: string;
  describedBy?: string;
};

/** Pill checkbox for short options (cities, audiences): gold border, gold fill and a check when on. */
export function Chip({ name, value, checked, onChange, children, className, describedBy }: ChipProps) {
  return (
    <label
      className={cn(
        'relative inline-flex min-h-11 cursor-pointer select-none items-center gap-2 rounded-full border px-4 py-2 text-[14.5px] leading-tight transition-colors duration-200',
        focusRing,
        checked ? 'border-gold bg-gold/15 text-gold-bright' : 'border-line-strong text-paper/85 hover:border-gold/60 hover:text-paper',
        className,
      )}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby={describedBy}
        className="sr-only"
      />
      <Icon name={checked ? 'check' : 'plus'} size={15} strokeWidth={checked ? 2.2 : 1.6} className={cn('shrink-0', checked ? 'text-gold' : 'text-subtle')} />
      <span>{children}</span>
    </label>
  );
}

/** Larger checkbox card for long options (events, regions): a box that fills gold when on. */
export function CardChip({ name, value, checked, onChange, children, className, describedBy }: ChipProps) {
  return (
    <label
      className={cn(
        'relative flex min-h-12 cursor-pointer select-none items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors duration-200',
        focusRing,
        checked ? 'border-gold bg-gold/15' : 'border-line bg-paper/[0.02] hover:border-gold/50',
        className,
      )}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby={describedBy}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          'mt-px flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-200',
          checked ? 'border-gold bg-gold text-ink' : 'border-line-strong',
        )}
      >
        {checked ? <Icon name="check" size={14} strokeWidth={2.4} /> : null}
      </span>
      <span className="min-w-0 text-[14.5px] leading-snug">{children}</span>
    </label>
  );
}

/** Toggle a value in a list. */
export const toggle = (list: string[], value: string, on: boolean) =>
  on ? (list.includes(value) ? list : [...list, value]) : list.filter((v) => v !== value);
