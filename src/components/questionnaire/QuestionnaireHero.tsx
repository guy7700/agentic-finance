import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container, Eyebrow } from '../ui/Layout';

/**
 * The header field for /2027 and /2027/thanks: plain navy with a soft gold
 * glow, no photograph.
 */
export function QuestionnaireHero({ eyebrow, children, className }: { eyebrow?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgb(209_182_121/0.17),transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[calc(var(--header-h)+8px)] -z-10 h-px w-[min(640px,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-bright/40 to-transparent"
      />
      <Container className="pt-[calc(var(--header-h)+44px)] sm:pt-[calc(var(--header-h)+64px)]">
        <div className="mx-auto max-w-3xl">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {children}
        </div>
      </Container>
    </div>
  );
}
