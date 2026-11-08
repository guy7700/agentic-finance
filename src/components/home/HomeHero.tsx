import Link from 'next/link';
import { primaryActions } from '@/config/site';
import type { Edition } from '@/data/types';
import { AmbientVideo } from '../media/VideoPlayer';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container } from '../ui/Layout';

/** The category statement: one headline, one line, the two actions. */
export function HomeHero({ next }: { next: Edition }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <div className="absolute inset-0 -z-10">
        <Img
          src="/images/singapore-2026/summit-poster.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover opacity-55"
        />
        {next.heroVideo ? (
          <AmbientVideo src={next.heroVideo.src} className="absolute inset-0 h-full w-full object-cover opacity-55" />
        ) : null}
        <div className="scrim-hero absolute inset-0" />
        <div aria-hidden className="hairline-grid absolute inset-0 opacity-25 [mask-image:linear-gradient(to_bottom,transparent,black_40%,transparent)]" />
      </div>

      <Container wide className="flex min-h-[min(92svh,900px)] flex-col justify-end pb-14 pt-[calc(var(--header-h)+56px)] sm:pb-20">
        <div className="max-w-[1100px]">
          <Link href="#events" className="eyebrow group inline-flex flex-wrap items-center gap-x-3 gap-y-1 hover:text-gold-bright">
            <span className="size-1.5 animate-pulse rounded-full bg-gold shadow-[0_0_10px_rgb(209_182_121/0.55)]" aria-hidden />
            <span>Next · {next.city}</span>
            <span aria-hidden className="h-px w-8 bg-gold-bright/50" />
            <span className="text-paper/80">{next.dateLabel}</span>
            <Icon name="arrow-down" size={14} className="hidden transition-transform group-hover:translate-y-0.5 sm:block" />
          </Link>
          <h1 className="display-hero mt-6 text-[length:var(--text-display-xl)] [text-shadow:0_2px_18px_rgb(0_0_0/0.6)]">
            AI agents are
            <br />
            <span className="serif-accent">rewriting finance.</span>
          </h1>
          <p className="lede mt-7 max-w-2xl text-paper/85">The next big shift in finance is here. Meet the people deciding it.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={primaryActions.invitation.href} size="lg">
              {primaryActions.invitation.label}
            </ButtonLink>
            <ButtonLink href={primaryActions.partner.href} variant="outline" size="lg">
              {primaryActions.partner.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
