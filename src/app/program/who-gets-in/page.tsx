import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { audience } from '@/data/program';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Who gets in',
  description:
    'Agentic Finance is invitation-only. Every request is reviewed manually for institutional relevance, decision-making seniority and strategic fit. A request does not guarantee admission.',
  path: '/program/who-gets-in',
});

const CRITERIA = [
  {
    title: 'Institutional relevance',
    body: 'Your organisation is part of the decisions on the agenda: a bank, fund, exchange, payment network, regulator, or a company building the infrastructure they will run on.',
  },
  {
    title: 'Decision-making seniority',
    body: 'You set or approve strategy, allocate capital, own a product line or shape policy. The room works because everyone in it can say yes to something.',
  },
  {
    title: 'Strategic fit',
    body: 'Your presence makes the room better for everyone else: a perspective, a mandate or a relationship that other guests need.',
  },
  {
    title: 'Manual review',
    body: 'Every request is read by the programme team. There are no tickets, so there is no way around the review.',
  },
];

export default function WhoGetsInPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Program', href: '/program' }, { label: 'Who gets in' }]}
        eyebrow="Invitation only · Every request reviewed"
        title="The guest list is the product."
        lede="There are no tickets. Every guest is selected, and every invitation is personal. That is what makes the conversations worth having."
        actions={
          <>
            <ButtonLink href="/invitation">Request an invitation</ButtonLink>
            <ButtonLink href="/about/faq" variant="outline">Questions about access</ButtonLink>
          </>
        }
      />
      <Section className="!pt-14">
        <Container>
          <ol className="grid gap-4 md:grid-cols-2">
            {CRITERIA.map((c, i) => (
              <li key={c.title} className="rounded-2xl border border-line bg-ink-card/50 p-7 sm:p-9">
                <span className="font-mono text-sm text-gold">0{i + 1}</span>
                <h2 className="display-tight mt-4 text-3xl">{c.title}</h2>
                <p className="mt-4 leading-relaxed text-muted">{c.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-start gap-4 rounded-2xl border border-gold/40 bg-gold/[0.05] p-6 sm:p-8">
            <Icon name="lock" size={24} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="text-lg font-semibold">A request is not an invitation.</p>
              <p className="mt-2 leading-relaxed text-muted">
                Submitting a request does not guarantee admission. Seats are limited and the room is balanced as a whole, so qualified
                requests are sometimes declined. Invitations are personal and cannot be transferred.
              </p>
            </div>
          </div>
        </Container>
      </Section>
      <Section bordered tone="raised">
        <Container>
          <SectionHeader eyebrow="Who we invite" title="Five constituencies." />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {audience.map((a, i) => (
              <li key={a.label} className="flex flex-col gap-3 bg-ink-raised p-6">
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <span className="text-lg font-bold leading-snug">{a.label}</span>
                <span className="text-sm leading-relaxed text-muted">{a.detail}</span>
              </li>
            ))}
          </ul>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line p-7">
              <p className="text-lg font-semibold">Want to speak instead?</p>
              <p className="mt-2 text-muted">Speakers are curated separately. Nominate yourself or someone else.</p>
              <ButtonLink href="/speakers/nominate" variant="outline" className="mt-5">
                Nominate a speaker
              </ButtonLink>
            </div>
            <div className="rounded-2xl border border-line p-7">
              <p className="text-lg font-semibold">Representing a company?</p>
              <p className="mt-2 text-muted">Strategic partners receive a seat on stage, introductions and the VIP Gala.</p>
              <ButtonLink href="/partners" variant="outline" className="mt-5">
                Partnership options
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
