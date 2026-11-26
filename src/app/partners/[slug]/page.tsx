import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gallery } from '@/components/media/Gallery';
import { YouTubeEmbed } from '@/components/media/YouTubeEmbed';
import { SpeakerCard } from '@/components/speakers/SpeakerCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { primaryActions } from '@/config/site';
import { conferenceLabels, editionPath, getEdition } from '@/data/editions';
import { galleryCollections, videos } from '@/data/media';
import { networkPages } from '@/data/network';
import { categories, editionOrganizations, getUseCase, organizations, otherUseCases, useCases } from '@/data/partners';
import type { Organization, UseCase } from '@/data/types';
import { companyHref, companySlug, relationshipLabel } from '@/lib/companies';
import { getSession, getSpeaker, speakers, stageLabels } from '@/lib/content';
import { speakerThumb } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';
import { toSpeakerCard } from '@/lib/speaker-cards';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

/** One page per company (Tal's review, 26 Nov 2026): eToro, Fireblocks, Alpaca, Limitless and MME Legal keep their case-study addresses. */
export function generateStaticParams() {
  return organizations.map((o) => ({ slug: companySlug(o.id)! }));
}

function resolve(slug: string): { org: Organization; u?: UseCase } | undefined {
  const org = organizations.find((o) => companySlug(o.id) === slug);
  if (!org) return undefined;
  return { org, u: getUseCase(slug) };
}

const eventLabel = (id: string) => getEdition(id)?.shortName ?? conferenceLabels[id]?.label ?? id;
const eventHref = (id: string) =>
  getEdition(id)?.path ?? (id === 'the-odds-paris-2026' ? '/events/2026/the-odds-paris' : id === 'web2toweb3-abu-dhabi-2025' ? '/events/2025/web2-to-web3-abu-dhabi' : undefined);

export async function generateMetadata({ params }: PageProps<'/partners/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) return {};
  const { org, u } = r;
  const events = [...new Set(editionOrganizations.filter((x) => x.org === org.id && x.relationship !== 'attended').map((x) => eventLabel(x.edition)))];
  return pageMetadata({
    title: u ? `${org.name}: company page and case study` : `${org.name} at Agentic Finance`,
    description: u ? `${u.positioning}. ${u.summary}` : `${org.about ? `${org.about} ` : ''}${org.name} at our events: ${events.join(', ')}.`,
    path: `/partners/${slug}`,
  });
}

/**
 * A company page: the company first (what it does, its relationship with us), then its events,
 * the people it put on stage, its case study where there is one, and related companies.
 */
export default async function CompanyPage({ params }: PageProps<'/partners/[slug]'>) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) notFound();
  const { org, u } = r;
  const records = editionOrganizations.filter((x) => x.org === org.id && x.relationship !== 'attended');
  const relation = relationshipLabel(records.map((x) => x.relationship));
  const group = networkPages.find((p) => p.audience === org.group);
  const people = speakers.filter((s) => (org.logo && s.logo === org.logo) || s.organization === org.name).map((s) => toSpeakerCard(s));
  const related = organizations.filter((o) => o.group === org.group && o.id !== org.id && o.logo).slice(0, 12);
  const hero = u?.photos[0];
  const film = u ? videos.find((v) => v.edition === u.edition && v.youtubeId) : undefined;
  const featured = u ? u.deliverables.filter((d) => d.photo) : [];
  const edition = u ? getEdition(u.edition) : undefined;

  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10 bg-ink-deep">
          {hero ? <Img src={hero.src} alt="" fill preload sizes="100vw" position={hero.position} className="object-cover opacity-45" /> : null}
          <div className="scrim-hero absolute inset-0" />
        </div>
        <Container className={`flex flex-col justify-end pb-14 pt-[calc(var(--header-h)+40px)] ${hero ? 'min-h-[min(78svh,720px)]' : 'min-h-[420px]'}`}>
          <Breadcrumbs items={[{ label: 'Partners', href: '/partners' }, { label: org.name }]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
            <div>
              {org.logo ? (
                <div className="relative h-12 w-52 sm:h-14 sm:w-60">
                  <Img src={org.logo} alt={org.name} fill sizes="240px" className={`object-contain object-left ${org.invertLogo ? 'invert' : ''}`} />
                </div>
              ) : null}
              <h1 className={org.logo ? 'sr-only' : 'display text-[length:var(--text-display-md)]'}>{org.name}</h1>
              <ul className="mt-6 flex flex-wrap gap-2">
                {org.networkMember ? (
                  <li className="rounded-full border border-gold bg-gold/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-gold-bright">Agentic Finance Network Member</li>
                ) : null}
                {relation ? <li className="rounded-full border border-paper/25 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/85">{relation}</li> : null}
                {group ? <li className="rounded-full border border-paper/25 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/85">{group.card.title}</li> : null}
              </ul>
              {org.about ? <p className="lede mt-6 max-w-2xl text-paper/90">{org.about}</p> : null}
              {u ? <p className="mt-5 max-w-2xl text-paper/80">{u.summary}</p> : null}
              <div className="mt-8 flex flex-wrap gap-3">
                {org.url ? (
                  <ButtonLink href={org.url} variant="outline">
                    {org.name} website
                  </ButtonLink>
                ) : null}
                <ButtonLink href={primaryActions.partner.href}>{primaryActions.partner.label}</ButtonLink>
              </div>
            </div>
            <aside className="rounded-2xl border border-line bg-ink/70 p-6 backdrop-blur-md">
              <p className="mono-label">At our events</p>
              <ul className="mt-3 flex flex-col divide-y divide-line">
                {records.map((x) => {
                  const href = eventHref(x.edition);
                  const label = relationshipLabel([x.relationship]);
                  return (
                    <li key={x.edition + x.relationship} className="py-3">
                      {href ? (
                        <Link href={href} className="font-semibold hover:text-gold">
                          {eventLabel(x.edition)}
                        </Link>
                      ) : (
                        <span className="font-semibold">{eventLabel(x.edition)}</span>
                      )}
                      <span className="mt-0.5 block text-sm text-muted">{[label, x.note].filter(Boolean).join(' · ')}</span>
                    </li>
                  );
                })}
              </ul>
            </aside>
          </div>
          {u?.lockup ? (
            <div className="mt-8 inline-flex w-fit items-center gap-4 rounded-xl border border-gold/40 bg-ink/70 px-5 py-3 backdrop-blur-md">
              <span className="mono-label text-gold">Title lockup</span>
              <span className="relative h-9 w-48">
                <Img src={u.lockup} alt="Agentic Finance by eToro lockup" fill sizes="192px" className="object-contain object-left" />
              </span>
            </div>
          ) : null}
        </Container>
      </header>

      {org.offers?.length || org.audiences?.length || org.lookingFor?.length ? (
        <Section>
          <Container>
            <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
              {[
                { k: 'Products and solutions', v: org.offers },
                { k: 'Who they serve', v: org.audiences },
                { k: 'Who they want to meet', v: org.lookingFor },
              ]
                .filter((x) => x.v?.length)
                .map((x) => (
                  <div key={x.k} className="bg-ink p-6">
                    <dt className="mono-label">{x.k}</dt>
                    <dd className="mt-3 flex flex-col gap-1.5 text-paper/90">
                      {x.v!.map((i) => (
                        <span key={i}>{i}</span>
                      ))}
                    </dd>
                  </div>
                ))}
            </dl>
          </Container>
        </Section>
      ) : null}

      {!u && people.length ? (
        <Section bordered={!!(org.offers || org.audiences || org.lookingFor)}>
          <Container>
            <SectionHeader title={`On stage for ${org.name}`} size="md" />
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
              {people.map((s) => (
                <li key={s.slug}>
                  <SpeakerCard speaker={s} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {u ? (
        <Section>
          <Container>
            <SectionHeader eyebrow="Case study" title={`${u.partner} at ${u.event?.name ?? edition?.name}`} lede={u.positioning} size="md" />
            <div className="mt-12">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div>
              {u.people.length ? <h2 className="mono-label mb-5">On stage</h2> : null}
              <ul className="flex flex-col gap-4">
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
                          <span className="block text-lg font-semibold group-hover:text-gold">{s.name}</span>
                          <span className="block text-sm text-muted">{p.role}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {u.sessions.length ? <h2 className="mono-label mt-10">Sessions</h2> : null}
              <ul className={u.sessions.length ? 'mt-4 flex flex-col border-t border-line' : 'hidden'}>
                {u.sessions.map((id) => {
                  const s = getSession(id);
                  if (!s) return null;
                  return (
                    <li key={id} className="border-b border-line">
                      <Link href={`${editionPath(s.edition, 'agenda')}#${s.id}`} className="group block py-4">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-gold">
                          {s.format} · {s.start} · {stageLabels[s.stage].name}
                        </span>
                        <span className="mt-1 block font-semibold leading-snug group-hover:text-gold">{s.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {u.categories.length ? <h2 className="mono-label mt-10">Categories</h2> : null}
              <ul className="mt-4 flex flex-wrap gap-2">
                {u.categories.map((id) => {
                  const c = categories.find((x) => x.id === id);
                  return c ? (
                    <li key={id}>
                      <Link href="/about/themes" className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
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
            </div>
          </Container>
        </Section>
      ) : null}

      {u && u.photos.length ? (
        <Section bordered tone="raised">
          <Container>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="display-tight text-3xl">In pictures</h2>
              <TextLink href="/about/brand#photos">Full gallery</TextLink>
            </div>
            <div className="mt-8">
              <Gallery
                images={u.photos.map((p, i) => ({ ...p, id: `${u.slug}-${i}`, edition: p.edition ?? u.edition, tags: [], width: p.width ?? 1600, height: p.height ?? 1067, caption: p.caption ?? p.alt }))}
                collections={galleryCollections}
                filters={false}
              />
            </div>
          </Container>
        </Section>
      ) : null}

      {film?.youtubeId ? (
        <Section bordered>
          <Container>
            <h2 className="display-tight text-3xl">The event on video</h2>
            <YouTubeEmbed id={film.youtubeId} poster={film.poster} title={film.title} duration={film.duration} className="mt-8 max-w-4xl" />
          </Container>
        </Section>
      ) : null}

      {related.length ? (
        <Section bordered>
          <Container>
            <SectionHeader title={`More ${group ? group.card.title.toLowerCase() : 'companies'} at our events`} size="md" action={<ButtonLink href="/partners" variant="outline">All partners</ButtonLink>} />
            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {related.map((o) => (
                <li key={o.id}>
                  <Link href={companyHref(o.id)!} className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-line p-5 transition-colors hover:border-gold/60">
                    <span className="relative block h-10 w-full">
                      <Img src={o.logo!} alt="" fill sizes="160px" className="object-contain opacity-80 group-hover:opacity-100" />
                    </span>
                    <span className="text-center text-sm font-semibold group-hover:text-gold">{o.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {u ? (
              <div className="mt-10 flex flex-wrap gap-3">
                {[...useCases, ...otherUseCases]
                  .filter((x) => x.slug !== u.slug)
                  .map((x) => (
                    <Link key={x.slug} href={`/partners/${x.slug}`} className="inline-flex min-h-11 items-center gap-3 rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
                      <span className="relative h-5 w-16">
                        <Img src={x.logo} alt="" fill sizes="64px" className="object-contain object-left" />
                      </span>
                      {x.partner} case study
                    </Link>
                  ))}
              </div>
            ) : null}
          </Container>
        </Section>
      ) : null}

      <CtaBand
        title="Want your company in the room?"
        body="Stage, curated meetings and visibility at our next editions. Start with a 30-minute call."
        actions={
          <>
            <ButtonLink href={primaryActions.partner.href} size="lg">
              Book a partnership call
            </ButtonLink>
            <ButtonLink href={primaryActions.network.href} variant="outline" size="lg">
              {primaryActions.network.label}
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
