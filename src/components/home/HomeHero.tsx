import Link from 'next/link';
import { primaryActions } from '@/config/site';
import type { Edition } from '@/data/types';
import { cn } from '@/lib/cn';
import { getLatestNews } from '@/lib/daily';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Container } from '../ui/Layout';
import { HeroNews } from './HeroNews';

/** The hero: the brief's headline, one line on what we do, the two actions and the latest industry news. */
export function HomeHero({ next }: { next: Edition }) {
  const news = getLatestNews();
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-line">
      {/* No photograph: a plain navy field with a soft gold glow. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink-deep">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_75%_20%,rgb(209_182_121/0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
      </div>

      <Container wide className="flex min-h-[min(92svh,900px)] flex-col justify-end pb-14 pt-[calc(var(--header-h)+56px)] sm:pb-20">
        <div className={cn('grid gap-12', news.length > 0 && 'lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:items-end')}>
          <div className="max-w-[1000px]">
            <Link href="#events" className="eyebrow group inline-flex flex-wrap items-center gap-x-3 gap-y-1 hover:text-gold-bright">
              <span className="size-1.5 animate-pulse rounded-full bg-gold shadow-[0_0_10px_rgb(209_182_121/0.55)]" aria-hidden />
              <span>Next · {next.city}</span>
              <span aria-hidden className="h-px w-8 bg-gold-bright/50" />
              <span className="text-paper/80">{next.dateLabel}</span>
              <Icon name="arrow-down" size={14} className="hidden transition-transform group-hover:translate-y-0.5 sm:block" />
            </Link>
            <h1 id="hero-title" className="display-hero mt-6 text-[clamp(2.4rem,1.4rem+3.4vw,4.5rem)] [text-shadow:0_2px_18px_rgb(0_0_0/0.6)]">
              AI Agents Are Rewriting Finance. <span className="serif-accent">We’re Bringing the Industry Together.</span>
            </h1>
            <p className="lede mt-7 max-w-2xl text-paper/85">Agentic Finance connects financial institutions, new decision-makers and innovators.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={primaryActions.invitation.href} size="lg">
                {primaryActions.invitation.label}
              </ButtonLink>
              <ButtonLink href={primaryActions.partner.href} variant="outline" size="lg">
                {primaryActions.partner.label}
              </ButtonLink>
            </div>
          </div>
          {news.length > 0 ? <HeroNews posts={news} /> : null}
        </div>
      </Container>
    </section>
  );
}
