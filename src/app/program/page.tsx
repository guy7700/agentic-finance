import type { Metadata } from 'next';
import Link from 'next/link';
import { QuestionsEditorial } from '@/components/program/QuestionsEditorial';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { GroupIndex } from '@/components/ui/GroupIndex';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { strategicQuestions, topics } from '@/data/program';
import { getSession } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Program',
  description: 'What the Agentic Finance room discusses and who belongs in it: 15 topics, six strategic questions, the formats, and how invitations are decided.',
  path: '/program',
});

export default function ProgramPage() {
  const questions = strategicQuestions.map((q) => ({ ...q, sessionTitle: q.session ? getSession(q.session)?.title : undefined }));
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Program' }]}
        eyebrow="Program"
        title="What the room is here to decide."
        lede="Not a survey of AI in finance. A programme built around the commercial and institutional decisions agents now force on banks, funds, exchanges, payment networks and regulators."
        image={{ src: '/images/singapore-2026/agentic-banking-panel.webp', alt: '', position: '30% 50%' }}
        actions={<ButtonLink href="/program/topics">The 15 topics</ButtonLink>}
      />
      <GroupIndex group="program" />
      <Section bordered tone="raised">
        <Container>
          <SectionHeader eyebrow="The six questions" title="Decisions, not panels." action={<ButtonLink href="/program/questions" variant="outline">Read them in full</ButtonLink>} />
          <div className="mt-12">
            <QuestionsEditorial questions={questions} variant="compact" />
          </div>
        </Container>
      </Section>
      <Section bordered>
        <Container>
          <SectionHeader eyebrow="Topics" title="Fifteen areas." action={<ButtonLink href="/program/topics" variant="outline">Explore the topics</ButtonLink>} />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
            {topics.map((t) => (
              <li key={t.slug}>
                <Link href={`/program/topics#${t.slug}`} className="group flex h-full min-h-28 flex-col justify-between gap-3 bg-ink p-5 transition-colors hover:bg-ink-card">
                  <span className="font-mono text-xs text-gold">{t.number}</span>
                  <span className="font-semibold leading-snug group-hover:text-gold">{t.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
