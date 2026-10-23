import Link from 'next/link';
import { primaryActions } from '@/config/site';
import type { Edition } from '@/data/types';
import { AmbientVideo } from '../media/VideoPlayer';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container } from '../ui/Layout';

export function HomeHero({ next, last }: { next: Edition; last: Edition }) {
  const gala = next.experiences?.find((x) => x.id === 'gala');
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

      <Container wide className="flex min-h-[min(100svh,980px)] flex-col justify-end pb-10 pt-[calc(var(--header-h)+56px)] sm:pb-14">
        <div className="max-w-[1100px]">
          <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>The Agentic Finance Summit Series</span>
            <span aria-hidden className="h-px w-8 bg-gold/60" />
            <span className="text-paper/70">Invitation only</span>
          </p>
          <h1 className="display mt-6 text-[length:var(--text-display-xl)]">
            Where finance’s
            <br />
            decision-makers <span className="text-gold">meet.</span>
          </h1>
          <p className="lede mt-7 max-w-2xl text-paper/80">
            A curated, international gathering of the institutions, capital allocators, regulators and builders shaping AI-native
            finance. Fewer seats, better conversations, introductions that lead somewhere.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={primaryActions.invitation.href} size="lg">
              {primaryActions.invitation.label}
            </ButtonLink>
            <ButtonLink href={primaryActions.partner.href} variant="outline" size="lg">
              {primaryActions.partner.label}
            </ButtonLink>
          </div>
        </div>

        <div className="mt-14 grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <Link
            href={`/editions/${next.slug}`}
            className="group flex flex-col justify-between gap-6 rounded-2xl border border-gold/50 bg-ink/70 p-6 backdrop-blur-md transition-colors hover:border-gold sm:flex-row sm:items-center sm:p-7"
          >
            <div>
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-gold">
                <span className="size-1.5 animate-pulse rounded-full bg-gold" aria-hidden />
                Next edition
              </p>
              <p className="mt-2 text-2xl font-extrabold sm:text-[28px]" style={{ fontStretch: '110%' }}>
                {next.name}
              </p>
              <p className="mt-1 text-[15px] text-muted">
                Summit · {next.dateLabel}
                {gala ? ` · VIP Gala · ${gala.when.replace('Abu Dhabi · ', '')}` : ''}
              </p>
            </div>
            <dl className="flex shrink-0 gap-6 sm:gap-8">
              {(next.facts ?? []).slice(0, 2).map((f) => (
                <div key={f.label} className="flex flex-col-reverse">
                  <dt className="max-w-[9rem] font-mono text-[10.5px] uppercase leading-tight tracking-[0.08em] text-muted">{f.label}</dt>
                  <dd className="text-3xl font-extrabold text-paper" style={{ fontStretch: '110%' }}>
                    {f.value}
                  </dd>
                </div>
              ))}
              <Icon name="arrow-right" size={22} className="self-center text-gold transition-transform group-hover:translate-x-1" />
            </dl>
          </Link>
          <Link
            href={`/editions/${last.slug}`}
            className="group flex items-center justify-between gap-6 rounded-2xl border border-line bg-ink/60 p-6 backdrop-blur-md transition-colors hover:border-line-strong sm:p-7"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">Previously · {last.shortName}</p>
              <p className="mt-2 text-[15px] leading-snug text-paper/85">
                {(last.metrics ?? []).map((m) => `${m.value} ${m.label.toLowerCase()}`).join(' · ')}
              </p>
              <p className="mt-1 text-[13px] text-subtle">
                {last.venue?.name} · {last.context}
              </p>
            </div>
            <Icon name="arrow-right" size={20} className="shrink-0 text-muted transition-all group-hover:translate-x-1 group-hover:text-paper" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
