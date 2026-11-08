import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Img } from '../ui/Img';

/** The Agentic Finance logo, the same file as on mnm.live/agentic-finance-abu-dhabi. */
export const LOGO_SRC = '/brand/agentic-finance-logo-blue.svg';
// The file's viewBox is 323.938 x 174.340.
const RATIO = 323.938 / 174.34;

export function Logo({ compact, className, onNavigate }: { compact?: boolean; className?: string; onNavigate?: () => void }) {
  const height = compact ? 36 : 46;
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn('inline-flex shrink-0 items-center rounded-sm transition-opacity hover:opacity-85', className)}
      aria-label="Agentic Finance, home"
    >
      <Img src={LOGO_SRC} alt="" width={Math.round(height * RATIO)} height={height} preload={!compact} />
    </Link>
  );
}
