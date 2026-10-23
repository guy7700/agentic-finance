import type { Metadata } from 'next';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { externalLinks } from '@/config/site';
import { getCurrentEdition } from '@/data/editions';
import { audience } from '@/data/program';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Request an invitation',
  description:
    'Request an invitation to Agentic Finance Abu Dhabi, December 2026. Invitation only, no tickets: every request is reviewed for seniority, institutional relevance and fit.',
  path: '/invitation',
});

const STEPS = [
  { title: 'Request', body: 'Apply through the Abu Dhabi registration page. It takes a few minutes: who you are, your institution, and why you should be in the room.' },
  { title: 'Review', body: 'The team reads every request manually, for seniority, institutional relevance and fit with the room.' },
  { title: 'Invitation', body: 'Selected guests receive a personal invitation by email, with the date and venue once confirmed.' },
];

export default function InvitationPage() {
  const e = getCurrentEdition();
  const invitationUrl = e.invitationUrl ?? externalLinks.invitation;
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Editions', href: '/editions' }, { label: 'Request an invitation' }]}
        eyebrow={`${e.name} · ${e.dateLabel}`}
        title="Request an invitation."
        lede={`${e.guestCount} hand-selected guests. No tickets, no open registration. Tell us who you are, and the team will review your request.`}
        image={{ src: '/images/singapore-2026/curated-introductions.webp', alt: '', position: '50% 40%' }}
        actions={
          <>
            <ButtonLink href={invitationUrl} size="lg">
              Continue to the application
            </ButtonLink>
            <ButtonLink href="/program/who-gets-in" variant="outline" size="lg">
              Who gets in
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
                <p className="text-lg font-semibold">Already invited?</p>
                <p className="mt-2 leading-relaxed text-muted">
                  Verify your personal invitation with the code and the email address it was sent to, then complete your registration.
                </p>
                <TextLink href={externalLinks.verifyInvitation} className="mt-4">
                  Verify an invitation
                </TextLink>
              </div>
              <div className="rounded-2xl border border-line p-6 sm:p-8">
                <p className="text-lg font-semibold">The VIP Gala</p>
                <p className="mt-2 leading-relaxed text-muted">
                  A separate evening on Tuesday 8 December 2026 with its own guest list, by personal invitation only.
                </p>
                <TextLink href={`/editions/${e.slug}/gala`} className="mt-4">
                  About the Gala
                </TextLink>
              </div>
            </aside>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-ink-card/60 p-7 sm:flex-row sm:items-center sm:p-10">
            <div>
              <p className="display-tight text-2xl sm:text-3xl">Ready to apply?</p>
              <p className="mt-2 text-muted">The application opens on Luma, in a new tab.</p>
            </div>
            <ButtonLink href={invitationUrl} size="lg">
              Continue to the application
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
