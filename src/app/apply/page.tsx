import type { Metadata } from 'next';
import Link from 'next/link';
import { ApplyButton } from '@/components/events/ApplyButton';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { audience } from '@/data/program';
import { editionsAfter, eventDate, nextEdition2027 } from '@/data/upcoming-2027';
import { pageMetadata } from '@/lib/seo';

const e = nextEdition2027();
const d = eventDate(e);

export const metadata: Metadata = pageMetadata({
  title: `Apply to attend ${e.name}`,
  description: `Apply to attend ${e.name}, ${d.long}, during ${e.context}. Invitation only: every application is reviewed for seniority and fit.`,
  path: '/apply',
});

const STEPS = [
  { title: 'Request', body: `Apply through the ${e.city} registration. It takes a few minutes: who you are, your institution, and why you should be in the room.` },
  { title: 'Review', body: 'The team reads every request manually, for seniority, institutional relevance and fit with the room.' },
  { title: 'Invitation', body: 'Selected guests receive a personal invitation by email.' },
];

/** Apply to attend (Tal's site structure: /apply/): the next event's application, opened in Luma's window. */
export default function InvitationPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Events', href: '/events' }, { label: 'Apply to attend' }]}
        eyebrow={`${e.name} · ${d.medium}`}
        title="Apply to attend."
        lede={`${e.attendees ? `Up to ${e.attendees} curated attendees. ` : ''}No tickets, no open registration. Tell us who you are, and the team will review your request.`}
        image={{ src: '/images/singapore-2026/curated-introductions.webp', alt: '', position: '50% 40%' }}
        actions={
          <>
            <ApplyButton event={e} />
            <ButtonLink href={e.path} variant="outline" size="lg">
              About {e.name}
            </ButtonLink>
          </>
        }
      />

      <Section>
        <Container>
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3 bg-ink p-7 sm:p-9">
                <span className="font-mono text-xs text-gold">Step 0{i + 1}</span>
                <span className="display-tight text-3xl">{s.title}</span>
                <span className="leading-relaxed text-muted">{s.body}</span>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <h2 className="display-tight text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)]">Who we invite</h2>
              <ul className="mt-6 flex flex-col border-t border-line">
                {audience.map((a) => (
                  <li key={a.label} className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:gap-6">
                    <span className="font-semibold sm:w-72 sm:shrink-0">{a.label}</span>
                    <span className="text-muted">{a.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="flex flex-col gap-4">
              <div className="rounded-2xl border border-gold/40 bg-gold/[0.05] p-6 sm:p-8">
                <Icon name="lock" size={22} className="text-gold" />
                <p className="mt-4 text-lg font-semibold">Requesting is not admission.</p>
                <p className="mt-2 leading-relaxed text-muted">
                  Submitting a request does not guarantee an invitation. Seats are limited and the guest list is curated for the room as a
                  whole.
                </p>
              </div>
              <div className="rounded-2xl border border-line p-6 sm:p-8">
                <p className="text-lg font-semibold">Later in 2027</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {editionsAfter(e).map((x) => (
                    <li key={x.slug}>
                      <Link href={x.path} className="flex items-baseline justify-between gap-4 text-paper/85 hover:text-gold">
                        <span>{x.city}</span>
                        <span className="mono-label">{eventDate(x).medium}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-ink-card/60 p-7 sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="display-tight text-2xl sm:text-3xl">Ready to apply?</p>
              <p className="mt-2 text-muted">The application opens on Luma, right on this page.</p>
            </div>
            <ApplyButton event={e} />
          </div>
        </Container>
      </Section>
    </>
  );
}
