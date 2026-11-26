import type { Metadata } from 'next';
import { WhoItsForSection } from '@/components/about/AboutSections';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { programFormats } from '@/data/formats';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Program: what happens at our events',
  description:
    'Side events, closed-door gatherings, hand-selected audiences, keynotes, panels, booths, interactive experiences, startup competitions and the Founders and Funders Dinner.',
  path: '/about/program',
});

/** Program (Tal's review, 26 Nov 2026): the formats and experiences of our events, not one past agenda. */
export default function ProgramPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Program' }]}
        eyebrow="About · Program"
        title="What happens at our events."
        lede="Every edition combines a hand-selected room, a programme on AI in finance, and the time and space to do business."
      />
      <Section className="!pt-12">
        <Container>
          <SectionHeader eyebrow="Formats and experiences" title="The ingredients of a room." size="md" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programFormats.map((f) => (
              <li key={f.title} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-card">
                {f.image ? (
                  <div className="relative aspect-[16/10]">
                    <Img src={f.image.src} alt={f.image.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" position={f.image.position} className="object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-[radial-gradient(ellipse_80%_80%_at_30%_20%,rgb(209_182_121/0.16),transparent_70%)]">
                    <span className="flex size-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold-bright">
                      <Icon name={f.icon} size={26} />
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <p className="text-lg font-semibold">{f.title}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <WhoItsForSection />
      <CtaBand />
    </>
  );
}
