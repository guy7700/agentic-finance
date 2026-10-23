import type { Metadata } from 'next';
import Link from 'next/link';
import { QuestionsEditorial } from '@/components/program/QuestionsEditorial';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { strategicQuestions, topics } from '@/data/program';
import { getSession } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'The six questions',
  description:
    'Who controls the agent? Can an AI manage institutional capital? Who is liable when an autonomous transaction goes wrong? The six questions Agentic Finance is here to settle.',
  path: '/program/questions',
});

export default function QuestionsPage() {
  const questions = strategicQuestions.map((q) => ({ ...q, sessionTitle: q.session ? getSession(q.session)?.title : undefined }));
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Program', href: '/program' }, { label: 'The six questions' }]}
        eyebrow="The questions shaping finance"
        title="Six questions. No easy answers."
        lede="These are not FAQ entries. Each is a decision someone in the room will have to make, and the reason they are in the room."
      />
      <Section className="!pt-10">
        <Container>
          <h2 className="sr-only">The six questions</h2>
          <QuestionsEditorial questions={questions} />
          <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <p className="mono-label pt-1">Related topics</p>
            <ul className="flex flex-wrap gap-2">
              {Array.from(new Set(strategicQuestions.flatMap((q) => q.topics))).map((slug) => {
                const t = topics.find((x) => x.slug === slug);
                return t ? (
                  <li key={slug}>
                    <Link href={`/program/topics#${slug}`} className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
                      {t.name}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-ink-card/60 p-7 sm:flex-row sm:items-center sm:p-10">
            <p className="display-tight max-w-2xl text-2xl sm:text-3xl">Have an answer worth hearing? Put it on stage.</p>
            <ButtonLink href="/speakers/nominate">Nominate a speaker</ButtonLink>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
