import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { networkOverview as o, networkPages } from '@/data/network';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'The Agentic Finance Network',
  description: o.lede,
  path: '/network',
});

/** /network/ (Tal's copy, page 1): what members get, and the five ways in. */
export default function NetworkPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Network' }]}
        eyebrow={o.eyebrow}
        title={o.title}
        lede={o.lede}
        actions={
          <ButtonLink href="#join" size="lg">
            Join the Network
          </ButtonLink>
        }
        footer={
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/80">
            {o.proof.map((x) => (
              <li key={x} className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full bg-gold" />
                {x}
              </li>
            ))}
          </ul>
        }
      />

      <Section bordered tone="raised">
        <Container>
          <SectionHeader eyebrow="Membership" title="What every member gets" />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {o.benefits.map((b) => (
              <li key={b.title} className="flex flex-col gap-3 bg-ink-raised p-6">
                <span className="text-lg font-semibold">{b.title}</span>
                <span className="leading-relaxed text-muted">{b.body}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section bordered id="join">
        <Container>
          <SectionHeader eyebrow="Join" title="Pick your side" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {networkPages.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/network/${p.slug}`}
                  className="group flex h-full min-h-64 flex-col justify-between gap-6 rounded-2xl border border-line bg-ink-card/50 p-6 transition-colors hover:border-gold"
                >
                  <span>
                    <span className="flex items-center justify-between gap-3 text-xl font-semibold group-hover:text-gold">
                      {p.card.title}
                      <Icon name="arrow-right" size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="mt-3 block leading-relaxed text-muted">{p.card.line}</span>
                  </span>
                  <span className="mono-label text-gold">{p.card.membership}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <SectionHeader title="Who is already in" lede="Companies and brands that have appeared at or partnered with our events:" size="md" />
          <p className="mt-6 text-[17px] leading-relaxed text-paper/85">{o.whoIsIn}</p>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <SectionHeader title="How it works" />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {o.steps.map((s, i) => (
              <li key={s} className="rounded-2xl border border-line bg-ink-card/50 p-6">
                <span className="font-mono text-sm text-gold">0{i + 1}</span>
                <p className="mt-3 leading-relaxed text-paper/90">{s}</p>
              </li>
            ))}
          </ol>
          <ButtonLink href="#join" size="lg" className="mt-10">
            Join the Network
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
