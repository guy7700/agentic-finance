import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gallery } from '@/components/media/Gallery';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { Container, Section } from '@/components/ui/Layout';
import { booking } from '@/config/site';
import { getEdition } from '@/data/editions';
import { galleryCollections } from '@/data/media';
import { categories, getUseCase, useCases } from '@/data/partners';
import { getSession, getSpeaker, stageLabels } from '@/lib/content';
import { speakerThumb } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return useCases.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: PageProps<'/partners/use-cases/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const u = getUseCase(slug);
  if (!u) return {};
  return pageMetadata({
    title: `${u.partner} at Agentic Finance Singapore`,
    description: `${u.positioning}. ${u.summary}`,
    path: `/partners/use-cases/${u.slug}`,
    image: u.photos[0]?.src,
    imageAlt: u.photos[0]?.alt,
  });
}

export default async function UseCasePage({ params }: PageProps<'/partners/use-cases/[slug]'>) {
  const { slug } = await params;
  const u = getUseCase(slug);
  if (!u) notFound();
  const edition = getEdition(u.edition);
  const hero = u.photos[0];
  const featured = u.deliverables.filter((d) => d.photo);
  const others = useCases.filter((x) => x.slug !== u.slug);

  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10">
          <Img src={hero.src} alt="" fill preload sizes="100vw" position={hero.position} className="object-cover opacity-60" />
          <div className="scrim-hero absolute inset-0" />
        </div>
        <Container className="flex min-h-[min(84svh,780px)] flex-col justify-end pb-14 pt-[calc(var(--header-h)+40px)]">
          <Breadcrumbs items={[{ label: 'Partners', href: '/partners' }, { label: 'Use cases', href: '/partners/use-cases' }, { label: u.partner }]} />
          <div className="mt-10 relative h-10 w-44 sm:h-12 sm:w-52">
            <Img src={u.logo} alt={u.partner} fill sizes="208px" className="object-contain object-left" />
          </div>
          <p className="eyebrow mt-6">
            {edition?.shortName} · {u.positioning}
          </p>
          <h1 className="display mt-5 max-w-4xl text-[length:var(--text-display-md)]">{u.partner} at Agentic Finance Singapore</h1>
          <p className="lede mt-6 max-w-2xl text-paper/85">{u.summary}</p>
          {u.lockup ? (
            <div className="mt-8 inline-flex w-fit items-center gap-4 rounded-xl border border-gold/40 bg-ink/70 px-5 py-3 backdrop-blur-md">
              <span className="mono-label text-gold">Title lockup</span>
              <span className="relative h-9 w-48">
                <Img src={u.lockup} alt="Agentic Finance by eToro lockup" fill sizes="192px" className="object-contain object-left" />
              </span>
            </div>
          ) : null}
        </Container>
      </header>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div>
              <h2 className="mono-label">On stage</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {u.people.map((p) => {
                  const s = getSpeaker(p.speaker);
                  if (!s) return null;
                  return (
                    <li key={p.speaker}>
                      <Link href={`/speakers/${s.slug}`} className="group flex items-center gap-4 rounded-2xl border border-line p-4 hover:border-gold/60">
                        <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-ink-raised">
                          <Img src={speakerThumb(s.photo)} alt="" fill sizes="64px" position="50% 20%" className="object-cover" />
                        </span>
                        <span>
                          <span className="block text-lg font-bold group-hover:text-gold">{s.name}</span>
                          <span className="block text-sm text-muted">{p.role}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <h2 className="mono-label mt-10">Sessions</h2>
              <ul className="mt-4 flex flex-col border-t border-line">
                {u.sessions.map((id) => {
                  const s = getSession(id);
                  if (!s) return null;
                  return (
                    <li key={id} className="border-b border-line">
                      <Link href={`/editions/${s.edition}/agenda#${s.id}`} className="group block py-4">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-gold">
                          {s.format} · {s.start} · {stageLabels[s.stage].name}
                        </span>
                        <span className="mt-1 block font-semibold leading-snug group-hover:text-gold">{s.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <h2 className="mono-label mt-10">Categories</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {u.categories.map((id) => {
                  const c = categories.find((x) => x.id === id);
                  return c ? (
                    <li key={id}>
                      <Link href={`/partners/categories?category=${id}`} className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
                        {c.name}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
            <div>
              <h2 className="display-tight text-3xl">What {u.partner} received</h2>
              <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {u.deliverables.map((d) => (
                  <li key={d.label} className="flex items-center gap-3 bg-ink p-4 text-[15px]">
                    <Icon name="check" size={18} className="shrink-0 text-gold" />
                    {d.label}
                  </li>
                ))}
              </ul>
              {featured.length ? (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {featured.map((d) => (
                    <li key={d.label}>
                      <figure>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line">
                          <Img src={d.photo!.src} alt={d.photo!.alt} fill sizes="(min-width: 1024px) 28vw, 100vw" position={d.photo!.position} className="object-cover" />
                        </div>
                        <figcaption className="mt-2 text-sm">
                          <span className="font-semibold">{d.label}</span>
                          <span className="block text-muted">{d.photo!.alt}</span>
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="display-tight text-3xl">In pictures</h2>
            <TextLink href="/media/gallery">Full gallery</TextLink>
          </div>
          <div className="mt-8">
            <Gallery
              images={u.photos.map((p, i) => ({ ...p, id: `${u.slug}-${i}`, edition: u.edition, tags: [], width: 1600, height: 1067, caption: p.alt }))}
              collections={galleryCollections}
              filters={false}
            />
          </div>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <h2 className="display-tight text-3xl">Other use cases</h2>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/partners/use-cases/${o.slug}`} className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-line p-5 hover:border-gold/60">
                  <span>
                    <span className="block text-lg font-bold">{o.partner}</span>
                    <span className="text-sm text-muted">{o.positioning}</span>
                  </span>
                  <Icon name="arrow-right" size={18} className="shrink-0 text-gold transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Partner with Agentic Finance Abu Dhabi"
        title="Want this list with your name on it?"
        body="No more than eight strategic positions in Abu Dhabi. Each one is built around your category, your stage and your introductions."
        image={{ src: hero.src, position: hero.position }}
        actions={
          <>
            <ButtonLink href="/partners/book-a-call" size="lg">
              {booking.partnership.label}
            </ButtonLink>
            <ButtonLink href="/partners/categories" variant="outline" size="lg">
              Find your category
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
