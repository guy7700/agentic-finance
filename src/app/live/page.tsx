import type { Metadata } from 'next';
import Link from 'next/link';
import { PostCard } from '@/components/blog/PostCard';
import { LiveEntry, LiveNav } from '@/components/live/LiveNav';
import { NewsletterForm } from '@/components/live/NewsletterForm';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { liveSchedule } from '@/data/live';
import { formatPostDate, getPosts } from '@/lib/daily';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Live: agentic finance news, X Spaces, webinars and newsletter',
  description: 'Agentic Finance between events: the day’s news on AI agents in finance, X Spaces, webinars and a monthly newsletter.',
  path: '/live',
});

/** Live as a media desk (Tal's review, 26 Nov 2026): the lead story, the latest news, the next X Spaces, webinars and the newsletter. */
export default function LivePage() {
  const [lead, ...latest] = getPosts();
  const spaces = liveSchedule.spaces.filter((s) => s.status === 'upcoming');
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Live' }]}
        eyebrow="Live"
        title="Agentic finance, as it happens."
        lede="The day’s news on AI agents in finance, live conversations on X, webinars and a monthly newsletter."
        footer={<LiveNav current="overview" />}
      />

      <Section className="!pt-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            {lead ? (
              <article className="edge-gold relative flex flex-col rounded-2xl border border-line-strong bg-ink-card p-7 sm:p-10">
                <p className="mono-label text-gold">
                  Lead story · <time dateTime={lead.date}>{formatPostDate(lead)}</time> · {lead.sourceName}
                </p>
                <h2 className="display-tight mt-5 text-[clamp(1.8rem,1.3rem+1.8vw,2.8rem)]">
                  <Link href={`/live/news/${lead.slug}`} className="hover:text-gold">
                    {lead.title}
                  </Link>
                </h2>
                <p className="lede mt-5">{lead.summary}</p>
                <p className="mt-5 border-l-2 border-gold pl-4 text-paper/85">
                  <span className="mono-label mr-2 text-gold">Why it matters</span>
                  {lead.whyItMatters}
                </p>
                <div className="mt-auto flex flex-wrap gap-3 pt-8">
                  <ButtonLink href={`/live/news/${lead.slug}`}>Read our summary</ButtonLink>
                  <ButtonLink href={lead.sourceUrl} variant="outline">
                    Original at {lead.sourceName.split(' (')[0]}
                  </ButtonLink>
                </div>
              </article>
            ) : null}
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-line bg-ink-card p-6">
                <p className="mono-label">Latest</p>
                <ul className="mt-3 flex flex-col divide-y divide-line">
                  {latest.slice(0, 5).map((p) => (
                    <li key={p.slug} className="py-3">
                      <p className="mono-label">
                        <time dateTime={p.date}>{formatPostDate(p)}</time> · {p.sourceName.split(' (')[0]}
                      </p>
                      <Link href={`/live/news/${p.slug}`} className="mt-1 block font-semibold leading-snug hover:text-gold">
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/live/news" className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold hover:text-gold-bright">
                  News archive <Icon name="arrow-right" size={14} />
                </Link>
              </div>
              <div className="rounded-2xl border border-gold/40 bg-gold/[0.05] p-6">
                <p className="mono-label text-gold">Monthly newsletter</p>
                <p className="mt-2 text-lg font-semibold">Receive the latest insights every month.</p>
                <div className="mt-4">
                  <NewsletterForm compact />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <SectionHeader
            eyebrow="X Spaces"
            title="Live conversations on X."
            lede="Upcoming dates are provisional and confirmed here first."
            action={
              <ButtonLink href="/live/spaces" variant="outline">
                X Spaces
              </ButtonLink>
            }
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {spaces.map((s) => (
              <li key={s.id}>
                <LiveEntry item={s} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <SectionHeader
            eyebrow="News"
            title="More from the news desk."
            action={
              <ButtonLink href="/live/news" variant="outline">
                All news
              </ButtonLink>
            }
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latest.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Link href="/live/webinars" className="group rounded-2xl border border-line bg-ink-card p-7 transition-colors hover:border-gold/60">
              <p className="mono-label flex items-center gap-2">
                <Icon name="play" size={14} className="text-gold" />
                Webinars
              </p>
              <p className="mt-3 text-xl font-semibold group-hover:text-gold">Sessions with the people putting agents to work in finance.</p>
              <p className="mt-2 text-muted">New sessions are announced here and in the monthly newsletter.</p>
            </Link>
            <Link href="/about/brand#videos" className="group rounded-2xl border border-line bg-ink-card p-7 transition-colors hover:border-gold/60">
              <p className="mono-label flex items-center gap-2">
                <Icon name="play" size={14} className="text-gold" />
                From our stages
              </p>
              <p className="mt-3 text-xl font-semibold group-hover:text-gold">Recaps and films from Singapore, Paris and Abu Dhabi.</p>
              <p className="mt-2 text-muted">Watch the editions in the video library.</p>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
