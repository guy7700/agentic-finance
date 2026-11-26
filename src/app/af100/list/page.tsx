import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { IndexNav } from '@/components/ui/IndexNav';
import { Img } from '@/components/ui/Img';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { af100 } from '@/data/index-initiatives';
import { categories } from '@/data/partners';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Agentic Finance 100: the top 100 companies in agentic finance',
  description: 'The Agentic Finance 100 ranks the top 100 companies in agentic finance, decided by a consortium of financial institutions, not by the companies being ranked.',
  path: '/af100/list',
});

export default function Af100ListPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Index', href: '/af100' }, { label: 'Agentic Finance 100' }]}
        eyebrow="Index · Agentic Finance 100"
        title="Agentic Finance 100."
        lede="The top 100 companies in agentic finance, ranked by the financial institutions that buy from and partner with them."
        footer={<IndexNav current="/af100/list" />}
      />
      <Section className="!pt-12">
        <Container>
          <SectionHeader eyebrow="Method" title="How the ranking is built." size="md" />
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {af100.method.map((m, i) => (
              <li key={m.title} className="rounded-2xl border border-line bg-ink-card/60 p-6">
                <span className="font-mono text-sm text-gold">0{i + 1}</span>
                <p className="mt-3 text-lg font-semibold">{m.title}</p>
                <p className="mt-2 leading-relaxed text-muted">{m.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {af100.results.length ? (
        <Section bordered tone="raised">
          <Container>
            <SectionHeader title="The ranking." size="md" />
            <ol className="mt-8 flex flex-col divide-y divide-line border-y border-line">
              {af100.results.map((r) => (
                <li key={r.rank} className="flex items-center gap-5 py-3">
                  <span className="serif-figure w-12 text-2xl text-gold">{r.rank}</span>
                  <span className="font-semibold">{r.company}</span>
                  <span className="ml-auto mono-label">{r.area}</span>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      ) : null}

      <Section bordered tone="raised">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeader eyebrow="The consortium" title="Ranked by institutions." size="md" />
              <p className="mt-5 leading-relaxed text-muted">
                The consortium is made up of financial institutions: banks, asset managers, exchanges and payment networks. Companies in the ranking
                have no seat on it. Members are named here as they join.
              </p>
              {af100.consortium.length ? (
                <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {af100.consortium.map((c) => (
                    <li key={c.name} className="flex h-20 items-center justify-center rounded-xl border border-line p-4">
                      {c.logo ? (
                        <span className="relative h-8 w-full">
                          <Img src={c.logo} alt={c.name} fill sizes="160px" className="object-contain" />
                        </span>
                      ) : (
                        <span className="font-semibold">{c.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/about/contact?topic=general">Join the consortium</ButtonLink>
                <ButtonLink href="/network/institutions" variant="outline">
                  Institutions in the Network
                </ButtonLink>
              </div>
            </div>
            <div>
              <SectionHeader eyebrow="The candidates" title="Twelve areas of agentic finance." size="md" />
              <ul className="mt-6 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.id} className="rounded-full border border-line-strong px-4 py-2 text-sm text-paper/85">
                    {c.name}
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-relaxed text-muted">Building in one of these areas? Put your company forward for the long list.</p>
              <ButtonLink href="/about/contact?topic=general" variant="outline" className="mt-5">
                Put a company forward
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
