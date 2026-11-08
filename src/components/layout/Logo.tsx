import Link from 'next/link';
import type { CSSProperties } from 'react';
import { externalLinks } from '@/config/site';
import { cn } from '@/lib/cn';
import { asset } from '@/lib/paths';
import { Img } from '../ui/Img';

// The header marks: gold only where each brand uses it (the Agentic Finance head, the More & More M);
// The Odds is drawn wholly in gold. Width to height comes from each file's viewBox or pixels.
const AGENTIC_GOLD = { src: '/brand/agentic-finance-logo-gold.svg', width: 323.938, height: 174.34 };
const MORE_AND_MORE_GOLD = { src: '/brand/more-and-more-logo-gold-m.svg', width: 273.22, height: 61.88 };
const THE_ODDS = { src: '/brand/the-odds-logo.png', ratio: 1277 / 533 };

function BrandImg({ file, className }: { file: { src: string; width: number; height: number }; className?: string }) {
  return <Img src={file.src} alt="" width={Math.round(file.width)} height={Math.round(file.height)} className={cn('block w-auto shrink-0', className)} />;
}

/** The Odds in the site's gold: the file is used as a mask, so the mark takes the exact gold token. */
function GoldMark({ className }: { className?: string }) {
  const { src, ratio } = THE_ODDS;
  const url = `url("${asset(src)}")`;
  const style: CSSProperties = {
    aspectRatio: String(ratio),
    maskImage: url,
    WebkitMaskImage: url,
    maskSize: 'contain',
    WebkitMaskSize: 'contain',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskPosition: 'center',
  };
  return <span aria-hidden className={cn('block shrink-0 bg-gold forced-colors:bg-[CanvasText]', className)} style={style} />;
}

export function Logo({ compact, className, onNavigate }: { compact?: boolean; className?: string; onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn('inline-flex shrink-0 items-center rounded-sm transition-opacity hover:opacity-85', className)}
      aria-label="Agentic Finance, home"
    >
      <BrandImg file={AGENTIC_GOLD} className={compact ? 'h-9' : 'h-11'} />
    </Link>
  );
}

const lockupSize = 'h-5 min-[360px]:h-6 sm:h-7 xl:h-6 2xl:h-8';
const linkClass = 'shrink-0 rounded-sm transition-opacity hover:opacity-80';

/** Header lockup: Agentic Finance, More & More and The Odds at one height, in one gold. */
export function BrandLockup({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 min-[360px]:gap-3 sm:gap-4">
      <Link href="/" onClick={onNavigate} aria-label="Agentic Finance, home" className={linkClass}>
        <BrandImg file={AGENTIC_GOLD} className={lockupSize} />
      </Link>
      <span aria-hidden className="h-6 w-px shrink-0 bg-gold/30 sm:h-7" />
      <a href={externalLinks.moreAndMore} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <BrandImg file={MORE_AND_MORE_GOLD} className={lockupSize} />
        <span className="sr-only">More &amp; More (opens in a new tab)</span>
      </a>
      <span aria-hidden className="h-6 w-px shrink-0 bg-gold/30 sm:h-7" />
      <a href={externalLinks.theOddsSingapore} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <GoldMark className={lockupSize} />
        <span className="sr-only">The Odds: Prediction Markets Live (opens in a new tab)</span>
      </a>
    </div>
  );
}
