import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';

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

/** The hidden checkbox inside each card. */
function Box({ name, value, checked, onChange, describedBy }: Omit<ChipProps, 'children' | 'className'>) {
  return (
    <input
      type="checkbox"
      name={name}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      aria-describedby={describedBy}
      className="sr-only"
    />
  );
}

/** Event option with a small city photo. The round marker on the photo turns gold with a check when picked. */
export function PhotoCard({ name, value, checked, onChange, children, className, describedBy, photo }: ChipProps & { photo?: string }) {
  return (
    <label
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-3 rounded-xl border p-2 pr-3 transition-colors duration-200',
        focusRing,
        checked ? 'border-gold bg-gold/15' : 'border-line bg-paper/[0.02] hover:border-gold/50',
        className,
      )}
    >
      <Box name={name} value={value} checked={checked} onChange={onChange} describedBy={describedBy} />
      <span
        aria-hidden
        className={cn(
          'relative size-12 shrink-0 overflow-hidden rounded-lg border bg-ink-card transition-colors duration-200 sm:size-14',
          checked ? 'border-gold' : 'border-line',
        )}
      >
        {photo ? <Img src={photo} alt="" fill sizes="56px" className="object-cover" /> : null}
        <span
          className={cn(
            'absolute left-1 top-1 flex size-[18px] items-center justify-center rounded-full border transition-colors duration-200',
            checked ? 'border-gold bg-gold text-ink' : 'border-paper/80 bg-ink/55',
          )}
        >
          {checked ? <Icon name="check" size={11} strokeWidth={2.8} /> : null}
        </span>
      </span>
      <span className="min-w-0 text-[13.5px] leading-snug">{children}</span>
    </label>
  );
}

/** Option card for who to connect with: a round marker and the name. The marker turns gold with a check when picked. */
export function ConnectCard({ name, value, checked, onChange, children, className, describedBy }: ChipProps) {
  return (
    <label
      className={cn(
        'relative flex min-h-14 cursor-pointer select-none items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors duration-200 sm:min-h-[60px] sm:gap-4 sm:px-5',
        focusRing,
        checked ? 'border-gold bg-gold/15' : 'border-line-strong bg-paper/[0.035] hover:border-gold/50',
        className,
      )}
    >
      <Box name={name} value={value} checked={checked} onChange={onChange} describedBy={describedBy} />
      <span
        aria-hidden
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full transition-colors duration-200 sm:size-6',
          checked ? 'bg-gold text-ink' : 'bg-paper/40',
        )}
      >
        {checked ? <Icon name="check" size={13} strokeWidth={2.6} /> : null}
      </span>
      <span className={cn('min-w-0 text-[14.5px] leading-snug sm:text-[16.5px]', checked ? 'text-gold-bright' : 'text-paper')}>{children}</span>
    </label>
  );
}

/** Toggle a value in a list. */
export const toggle = (list: string[], value: string, on: boolean) =>
  on ? (list.includes(value) ? list : [...list, value]) : list.filter((v) => v !== value);
