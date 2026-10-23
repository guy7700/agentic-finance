import type { Metadata } from 'next';
import { TopicExplorer } from '@/components/program/TopicExplorer';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { categories } from '@/data/partners';
import { topics } from '@/data/program';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Topics',
  description:
    'The 15 programme areas of Agentic Finance, from agentic trading, payments and commerce to wallets, identity, security, regulation, stablecoins, data, AI infrastructure and tokenisation.',
  path: '/program/topics',
});

export default function TopicsPage() {
  const views = topics.map((t) => ({ ...t, categoryName: categories.find((c) => c.id === t.category)?.name ?? t.category }));
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Program', href: '/program' }, { label: 'Topics' }]}
        eyebrow="Program · 15 areas"
        title="The topics."
        lede="Each area is framed by the commercial and institutional questions in front of the people who decide them. Every topic maps to a partnership category."
        actions={
          <>
            <ButtonLink href="/program/questions" variant="outline">The six questions</ButtonLink>
            <ButtonLink href="/speakers/nominate" variant="ghost">Nominate a speaker</ButtonLink>
          </>
        }
      />
      <Section className="!pt-14">
        <Container>
          <TopicExplorer topics={views} />
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
