import type { EditionStatus } from '@/data/types';
import { cn } from '@/lib/cn';

const styles: Record<EditionStatus, { label: string; cls: string; dot: string }> = {
  upcoming: { label: 'Upcoming', cls: 'border-gold/60 bg-gold/10 text-gold', dot: 'bg-gold animate-pulse' },
  completed: { label: 'Archive', cls: 'border-line-strong bg-ink/60 text-muted', dot: 'bg-muted' },
  planned: { label: 'Planned', cls: 'border-paper/25 bg-ink/50 text-paper/80', dot: 'border border-paper/70 bg-transparent' },
};

export function StatusBadge({ status, label, className }: { status: EditionStatus; label?: string; className?: string }) {
  const s = styles[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] backdrop-blur-sm',
        s.cls,
        className,
      )}
    >
      <span aria-hidden className={cn('size-1.5 rounded-full', s.dot)} />
      {label ?? s.label}
    </span>
  );
}
