import Link from 'next/link';
import { primaryActions } from '@/config/site';
import { getEdition } from '@/data/editions';
import { eventDate, nextEdition2027 } from '@/data/upcoming-2027';
import { HERO_NEWS_FRESH_MS, formatPostDate, getHeroNews, postTime } from '@/lib/daily';
import { ApplyButton } from '../events/ApplyButton';
import { AmbientVideo } from '../media/VideoPlayer';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container } from '../ui/Layout';
import { FreshOnly } from './FreshOnly';

/** Darkens the top and the text side, then fades fully into --color-ink so the hero runs into the next section with no seam. */
const SCRIM = [
  'linear-gradient(to bottom, rgb(10 20 40 / 0.75) 0%, rgb(10 20 40 / 0.35) 30%, rgb(10 20 40 / 0.55) 70%, rgb(10 20 40 / 1) 100%)',
  'linear-gradient(to right, rgb(10 20 40 / 0.85) 0%, rgb(10 20 40 / 0.35) 60%, rgb(10 20 40 / 0.2) 100%)',
].join(', ');

/**
 * The hero (Tal's review, 26 Nov 2026): a short headline, the next event as a prominent card
 * beside it, and the latest Wire story as an editorial feature underneath (shown while it is
 * under 7 days old). The Singapore film runs behind, silent.
 */
export function HomeHero() {
  const next = nextEdition2027();
  const d = eventDate(next);
  const card = next.cardImage ?? next.image;
  const film = getEdition('singapore-2026')?.heroVideo;
  // The latest story while it is under 7 days old (checked at build time, and again in the browser by FreshOnly).
  const [fresh] = getHeroNews();

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink">
        {film ? <AmbientVideo src={film.src} allScreens className="absolute inset-0 h-full w-full object-cover opacity-35" /> : null}
        <div className="absolute inset-0" style={{ background: SCRIM }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_25%,rgb(209_182_121/0.12),transparent_70%)]" />
      </div>

      <Container wide className="pb-12 pt-[calc(var(--header-h)+40px)] sm:pb-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-center lg:gap-14">
          <div className="max-w-[760px]">
            <p className="eyebrow">Agentic Finance · by More &amp; More</p>
            <h1 id="hero-title" className="display-hero mt-5 text-[clamp(2.1rem,1.3rem+2.7vw,3.75rem)] [text-shadow:0_2px_18px_rgb(0_0_0/0.6)]">
              Agentic Finance, <span className="serif-accent">where the leaders of AI and the financial world meet.</span>
            </h1>
            <p className="lede mt-5 max-w-xl text-paper/85">
              Invitation-only summits worldwide for financial institutions, investors and the companies building AI for finance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ApplyButton event={next}>{`Apply to attend ${next.city}`}</ApplyButton>
              <ButtonLink href={primaryActions.partner.href} variant="outline" size="lg">
                {primaryActions.partner.label}
              </ButtonLink>
            </div>
          </div>

          {/* The next event: prominent, with its photo, date, place and attendance */}
          <article aria-labelledby="hero-next" className="edge-gold relative isolate overflow-hidden rounded-2xl border border-gold/60 bg-ink-card/80 shadow-2xl backdrop-blur-md">
            <div className="relative aspect-[16/9]">
              <Img src={card.src} alt={card.alt} fill preload sizes="440px" position={card.position} className="object-cover" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-card via-ink-card/10 to-transparent" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1.5 font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-ink shadow-lg">
                <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-ink" />
                Next event
              </span>
            </div>
            <div className="p-5 sm:p-6">
              <h2 id="hero-next" className="text-2xl font-semibold leading-tight">
                <Link href={next.path} className="hover:text-gold">
                  {next.name}
                </Link>
              </h2>
              <ul className="mt-4 flex flex-col gap-2 text-[15px] text-paper/90">
                <li className="flex items-center gap-2.5">
                  <Icon name="calendar" size={16} className="shrink-0 text-gold" />
                  {d.long} · {d.start} to {d.end} {next.tz}
                </li>
                <li className="flex items-center gap-2.5">
                  <Icon name="pin" size={16} className="shrink-0 text-gold" />
                  {next.city}, during {next.context}
                </li>
                <li className="flex items-center gap-2.5">
                  <Icon name="users" size={16} className="shrink-0 text-gold" />
                  {next.attendees ? `Up to ${next.attendees} curated attendees · ` : ''}Invitation only
                </li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <ApplyButton event={next} size="md" />
                <ButtonLink href={next.path} variant="outline" size="md">
                  Event details
                </ButtonLink>
              </div>
            </div>
          </article>
        </div>

        {/* The featured story, from the Agentic Finance Wire: an editorial feature, not a blog card */}
        {fresh ? (
          <FreshOnly publishedAt={new Date(postTime(fresh)).toISOString()} maxAgeMs={HERO_NEWS_FRESH_MS}>
            <article aria-labelledby="hero-story" className="mt-10 grid overflow-hidden rounded-2xl border border-line-strong bg-ink-deep/80 backdrop-blur-md sm:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_auto]">
              <div className="relative flex min-h-28 flex-col justify-between bg-[radial-gradient(ellipse_120%_90%_at_0%_0%,rgb(209_182_121/0.3),transparent_70%)] p-5">
                <span className="mono-label text-gold">Agentic Finance Wire</span>
                <span className="font-serif text-[15px] italic text-paper/85">
                  <time dateTime={fresh.date}>{formatPostDate(fresh)}</time>
                </span>
              </div>
              <div className="p-5 sm:p-6">
                <p className="mono-label">Featured story · {fresh.sourceName.split(' (')[0]}</p>
                <h2 id="hero-story" className="display-tight mt-2 text-[clamp(1.25rem,1.05rem+0.8vw,1.75rem)]">
                  <Link href={`/live/news/${fresh.slug}`} className="hover:text-gold">
                    {fresh.title}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted">{fresh.whyItMatters}</p>
              </div>
              <div className="flex items-center gap-4 border-t border-line px-5 py-4 sm:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:px-6">
                <Link href={`/live/news/${fresh.slug}`} className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-gold hover:text-gold-bright">
                  Read the story <Icon name="arrow-right" size={14} />
                </Link>
                <a
                  href={fresh.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-paper/70 hover:text-paper"
                >
                  Original <Icon name="arrow-up-right" size={12} />
                  <span className="sr-only"> at {fresh.sourceName} (opens in a new tab)</span>
                </a>
              </div>
            </article>
          </FreshOnly>
        ) : null}
      </Container>
    </section>
  );
}
