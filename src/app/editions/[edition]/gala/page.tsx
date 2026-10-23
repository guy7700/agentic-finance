import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { editions, getEdition } from '@/data/editions';
import { pageMetadata } from '@/lib/seo';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return editions.filter((e) => e.hasGala).map((e) => ({ edition: e.slug }));
}

export async function generateMetadata({ params }: PageProps<'/editions/[edition]/gala'>): Promise<Metadata> {
  const { edition: slug } = await params;
  const e = getEdition(slug);
  if (!e?.hasGala) return {};
  return pageMetadata({
    title: `VIP Gala · ${e.shortName}`,
    description: 'An exclusive evening for approximately 200 invited senior leaders and strategic partners. Tuesday 8 December 2026, by personal invitation only.',
    path: `/editions/${e.slug}/gala`,
  });
}

const PILLARS = [
  { title: 'Executive networking', body: 'Seated, unhurried, and arranged so the right people share a table.' },
  { title: 'Private relationship building', body: 'Introductions made in advance, followed through in person.' },
  { title: 'Invitation-controlled access', body: 'A guest list of its own. Every invitation is personal and cannot be transferred.' },
  { title: 'The summit’s inner circle', body: 'Speakers, strategic partners and a selection of the summit’s senior guests.' },
];

export default async function GalaPage({ params }: PageProps<'/editions/[edition]/gala'>) {
  const { edition: slug } = await params;
  const e = getEdition(slug);
  if (!e?.hasGala) notFound();
  const gala = e.experiences?.find((x) => x.id === 'gala');

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Editions', href: '/editions' }, { label: e.shortName, href: `/editions/${e.slug}` }, { label: 'VIP Gala' }]}
        eyebrow={e.name}
        title="The VIP Gala."
        lede={gala?.summary}
        image={{ src: '/images/abu-dhabi-2026/al-maryah.webp', alt: '' }}
        actions={
          <>
            <ButtonLink href="/invitation">Request a summit invitation</ButtonLink>
            <ButtonLink href="/partners/book-a-call" variant="outline">Partner positions include the Gala</ButtonLink>
          </>
        }
      />
      <Section>
        <Container>
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {[
              { k: 'Date', v: 'Tuesday 8 December 2026', icon: 'calendar' as const },
              { k: 'Time and venue', v: 'Shared with invited guests', icon: 'pin' as const },
              { k: 'Guests', v: 'Approximately 200, by invitation', icon: 'users' as const },
            ].map((x) => (
              <div key={x.k} className="bg-ink p-7">
                <dt className="mono-label flex items-center gap-3">
                  <Icon name={x.icon} size={20} className="shrink-0 text-gold" />
                  {x.k}
                </dt>
                <dd className="mt-2 text-xl font-bold">{x.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
            <ul className="grid gap-4 sm:grid-cols-2">
              {PILLARS.map((p, i) => (
                <li key={p.title} className="rounded-2xl border border-line bg-ink-card/50 p-6">
                  <span className="font-mono text-xs text-gold">0{i + 1}</span>
                  <h2 className="mt-3 text-xl font-bold">{p.title}</h2>
                  <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-gold/40 bg-gold/[0.05] p-7 sm:p-10">
              <p className="eyebrow">Summit and Gala are separate</p>
              <p className="mt-4 text-lg leading-relaxed text-paper/90">
                The evening follows the Agentic Finance Summit. Its guest list is separate from the summit’s 500, and the Gala date is not
                the summit date: the summit’s own date and venue are shared with invited guests as they are confirmed.
              </p>
              <p className="mt-4 leading-relaxed text-muted">Not invited to the Gala? You can still request an invitation to the summit.</p>
              <div className="mt-8">
                <ButtonLink href="/invitation">Request a summit invitation</ButtonLink>
              </div>
            </div>
          </div>
          <figure className="mt-16">
            <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-line">
              <Img src="/images/more-and-more/hub71-networking.jpg" alt="Delegates networking at a More & More gathering at Hub71 in Abu Dhabi" fill sizes="100vw" className="object-cover" />
            </div>
            <figcaption className="mono-label mt-3">More &amp; More in Abu Dhabi: Web2 to Web3 Summit, 2025</figcaption>
          </figure>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
