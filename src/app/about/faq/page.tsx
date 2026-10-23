import type { Metadata } from 'next';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { SmartLink } from '@/components/ui/SmartLink';
import { faqGroups } from '@/data/about';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'FAQ',
  description:
    'Answers about Agentic Finance invitations, registration, speaker nominations, partnerships, locations, media enquiries and the difference between editions.',
  path: '/about/faq',
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'About', href: '/about' }, { label: 'FAQ' }]}
        eyebrow="Access, invitations, partnerships"
        title="Common questions."
        lede="If your question is not here, the team is a message away."
        actions={<ButtonLink href="/about/contact" variant="outline">Contact the team</ButtonLink>}
        footer={
          <nav aria-label="FAQ sections">
            <ul className="flex flex-wrap gap-2">
              {faqGroups.map((g) => (
                <li key={g.id}>
                  <a href={`#faq-${g.id}`} className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />
      <Section className="!pt-10">
        <Container>
          <div className="flex flex-col gap-16">
            {faqGroups.map((g) => (
              <section key={g.id} id={`faq-${g.id}`} aria-labelledby={`faq-${g.id}-title`} className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-12">
                <h2 id={`faq-${g.id}-title`} className="display-tight text-2xl sm:text-3xl">
                  {g.title}
                </h2>
                <Accordion
                  items={g.items.map((f, i) => ({
                    id: `${g.id}-${i}`,
                    title: f.q,
                    content: (
                      <div>
                        <p className="leading-relaxed">{f.a}</p>
                        {f.links?.length ? (
                          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                            {f.links.map((l) => (
                              <li key={l.href}>
                                <SmartLink href={l.href} className="text-sm font-semibold text-gold hover:text-gold-bright">
                                  {l.label} →
                                </SmartLink>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ),
                  }))}
                />
              </section>
            ))}
          </div>
        </Container>
      </Section>
      <CtaBand />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqGroups.flatMap((g) =>
            g.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          ),
        }}
      />
    </>
  );
}
