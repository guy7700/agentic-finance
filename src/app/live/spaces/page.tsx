import type { Metadata } from 'next';
import { LiveEntry, LiveNav } from '@/components/live/LiveNav';
import { NewsletterForm } from '@/components/live/NewsletterForm';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { liveChannels, liveSchedule } from '@/data/live';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'X Spaces: live conversations on agentic finance',
  description: 'Agentic Finance X Spaces: live conversations with the people putting AI agents to work in finance. Upcoming dates for January 2027.',
  path: '/live/spaces',
});

const VALUE = [
  { title: 'Practitioners, not panels', body: 'Founders, bankers, investors and regulators speaking about what they are building and deciding.' },
  { title: 'Between the events', body: 'The conversations of our summits continue on X, open to anyone who wants to listen.' },
  { title: 'Ask on air', body: 'Listeners can request to speak and put their questions to the guests.' },
];

export default function LiveXSpacesPage() {
  const upcoming = liveSchedule.spaces.filter((s) => s.status === 'upcoming');
  const past = liveSchedule.spaces.filter((s) => s.status === 'past');
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Live', href: '/live' }, { label: 'X Spaces' }]}
        eyebrow="Live · X Spaces"
        title="X Spaces."
        lede="Live audio conversations on X about AI agents in finance, with the people building and regulating them."
        actions={<ButtonLink href={liveChannels.x}>Follow on X</ButtonLink>}
        footer={<LiveNav current="spaces" />}
      />
      <Section className="!pt-12">
        <Container>
          <SectionHeader eyebrow="Upcoming" title="Next episodes." lede="Provisional dates, confirmed here and on X before each episode." size="md" />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {upcoming.map((s) => (
              <li key={s.id}>
                <LiveEntry item={s} />
              </li>
            ))}
          </ul>
          {past.length ? (
            <>
              <SectionHeader eyebrow="Archive" title="Past episodes." size="md" className="mt-16" />
              <ul className="mt-8 grid gap-4 md:grid-cols-2">
                {past.map((s) => (
                  <li key={s.id}>
                    <LiveEntry item={s} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </Container>
      </Section>
      <Section bordered tone="raised">
        <Container>
          <SectionHeader title="Why listen." size="md" />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {VALUE.map((v) => (
              <li key={v.title} className="rounded-2xl border border-line bg-ink-card/60 p-6">
                <p className="text-lg font-semibold">{v.title}</p>
                <p className="mt-2 leading-relaxed text-muted">{v.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 rounded-2xl border border-gold/40 bg-gold/[0.05] p-6 sm:p-8">
            <p className="text-lg font-semibold">Receive the latest insights every month, with every episode as it is confirmed.</p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
