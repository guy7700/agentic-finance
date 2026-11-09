import type { Metadata } from 'next';
import { Img } from '@/components/ui/Img';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { photoCredits } from '@/data/photo-credits';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Photo credits',
  description: 'Authors and licences of the city photos in the Agentic Finance events calendar.',
  path: '/photo-credits',
});

const linkClass = 'text-gold underline decoration-gold/40 underline-offset-4 hover:text-gold-bright';

export default function PhotoCreditsPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Photo credits' }]}
        title="Photo credits"
        lede="The city photos in our events calendar, with their authors and licences. Each photo is cropped and resized from the original."
        size="md"
      />
      <Section>
        <Container>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photoCredits.map((c) => (
              <li key={c.file} className="flex gap-4 rounded-xl border border-line bg-ink-card p-3">
                <div className="relative aspect-[16/9] w-28 shrink-0 overflow-hidden rounded-lg border border-line">
                  <Img src={`/assets/events/${c.file}`} alt="" fill sizes="112px" className="object-cover" />
                </div>
                <div className="min-w-0 text-[13.5px] leading-snug">
                  <p className="font-medium text-paper">{c.place}</p>
                  <p className="mt-0.5 text-muted">Photo: {c.author}</p>
                  <p className="mt-0.5 text-muted">
                    <a href={c.licenceUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {c.licence}
                    </a>
                    {' · '}
                    <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {c.sourceName}
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
