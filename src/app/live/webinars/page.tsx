import type { Metadata } from 'next';
import { LiveEntry, LiveNav } from '@/components/live/LiveNav';
import { NewsletterForm } from '@/components/live/NewsletterForm';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { liveSchedule } from '@/data/live';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Webinars on agentic finance',
  description: 'Agentic Finance webinars: sessions with the practitioners putting AI agents to work in finance, and recordings from our stages.',
  path: '/live/webinars',
});

const VALUE = [
  { title: 'Depth over hype', body: 'One topic per session, with the people running it in production: payments, trading, custody, compliance.' },
  { title: 'Questions answered', body: 'A live Q&A with every session, for the institutions deciding what to adopt.' },
  { title: 'Recordings', body: 'Every session is recorded and listed here once it has run.' },
];

export default function LiveWebinarsPage() {
  const upcoming = liveSchedule.webinars.filter((w) => w.status === 'upcoming');
  const past = liveSchedule.webinars.filter((w) => w.status === 'past');
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Live', href: '/live' }, { label: 'Webinars' }]}
        eyebrow="Live · Webinars"
        title="Webinars."
        lede="Online sessions with the practitioners putting AI agents to work in finance."
        footer={<LiveNav current="webinars" />}
      />
      <Section className="!pt-12">
        <Container>
          {upcoming.length ? (
            <>
              <SectionHeader eyebrow="Upcoming" title="Next sessions." size="md" />
              <ul className="mt-8 grid gap-4 md:grid-cols-2">
                {upcoming.map((w) => (
                  <li key={w.id}>
                    <LiveEntry item={w} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="grid gap-6 rounded-2xl border border-line bg-ink-card p-7 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
              <div>
                <p className="mono-label text-gold">Upcoming</p>
                <p className="display-tight mt-3 text-[clamp(1.5rem,1.2rem+1vw,2.1rem)]">New sessions are announced here and in the monthly newsletter.</p>
              </div>
              <NewsletterForm compact />
            </div>
          )}
          {past.length ? (
            <>
              <SectionHeader eyebrow="Archive" title="Past sessions." size="md" className="mt-16" />
              <ul className="mt-8 grid gap-4 md:grid-cols-2">
                {past.map((w) => (
                  <li key={w.id}>
                    <LiveEntry item={w} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </Container>
      </Section>
      <Section bordered tone="raised">
        <Container>
          <SectionHeader
            title="What a session gives you."
            size="md"
            action={
              <ButtonLink href="/about/brand#videos" variant="outline">
                Films from our stages
              </ButtonLink>
            }
          />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {VALUE.map((v) => (
              <li key={v.title} className="rounded-2xl border border-line bg-ink-card/60 p-6">
                <p className="text-lg font-semibold">{v.title}</p>
                <p className="mt-2 leading-relaxed text-muted">{v.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
