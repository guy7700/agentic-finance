import Link from 'next/link';
import { cn } from '@/lib/cn';

/**
 * Wordmark lockup from the navigation spec: AGENTIC FINANCE in gold, with the
 * "BY MORE & MORE" producer line in mono beneath it.
 */
export function Logo({ compact, className, onNavigate }: { compact?: boolean; className?: string; onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn('group inline-flex flex-col gap-0.5 rounded-sm text-gold', className)}
      aria-label="Agentic Finance by More & More, home"
    >
      <span
        className={cn(
          'font-extrabold uppercase leading-none tracking-[0.04em] transition-colors group-hover:text-gold-bright',
          compact ? 'text-[17px]' : 'text-[19px] lg:text-[20px]',
        )}
        style={{ fontStretch: '112%' }}
      >
        Agentic Finance
      </span>
      {!compact ? (
        <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.06em] text-muted">By More &amp; More</span>
      ) : null}
    </Link>
  );
}
