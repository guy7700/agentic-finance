import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SpeakerCard } from '@/components/speakers/SpeakerCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Section } from '@/components/ui/Layout';
import { SmartLink } from '@/components/ui/SmartLink';
import { getEdition } from '@/data/editions';
import { getSpeaker, profiledSpeakers, sessionsForSpeaker, speakerAppearances, stageLabels } from '@/lib/content';
import { absoluteUrl } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';
import { toSpeakerCard } from '@/lib/speaker-cards';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return profiledSpeakers().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<'/speakers/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const s = getSpeaker(slug);
  if (!s?.bio) return {};
  return pageMetadata({
    title: `${s.name}, ${s.organization}`,
    description: `${s.name}, ${s.title} at ${s.organization}. ${s.bio.split('. ')[0]}.`,
    path: `/speakers/${s.slug}`,
    image: s.photo,
    imageAlt: s.photoAlt,
    type: 'profile',
  });
}

const linkMeta: Record<string, { label: string; icon: IconName }> = {
  x: { label: 'X', icon: 'x' },
  linkedin: { label: 'LinkedIn', icon: 'linkedin' },
  website: { label: 'Website', icon: 'globe' },
  instagram: { label: 'Instagram', icon: 'instagram' },
};

export default async function SpeakerPage({ params }: PageProps<'/speakers/[slug]'>) {
  const { slug } = await params;
  const s = getSpeaker(slug);
  if (!s?.bio) notFound();

  const appearances = speakerAppearances(s);
  const sessions = sessionsForSpeaker(s.slug);
  const firstName = s.name.split(' ')[0];
  const related = profiledSpeakers()
    .filter((o) => o.slug !== s.slug && o.expertise.some((x) => s.expertise.slice(0, 2).includes(x)))
    .slice(0, 5);
  const isPastOnly = s.editions.every((e) => getEdition(e)?.status === 'completed');

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="hairline-grid absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <Container className="pb-16 pt-[calc(var(--header-h)+40px)]">
          <Breadcrumbs items={[{ label: 'Speakers', href: '/speakers' }, { label: s.name }]} />
          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-ink-raised">
              <Img src={s.photo} alt={s.photoAlt} fill preload sizes="(min-width: 1024px) 420px, 100vw" position="50% 18%" className="object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-wrap gap-2">
                {appearances.map((a) =>
                  a.href ? (
                    <Link key={a.label} href={a.href} className="rounded-full border border-gold/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-gold hover:bg-gold/10">
                      Speaker · {a.label}
                    </Link>
                  ) : (
                    <span key={a.label} className="rounded-full border border-line-strong px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                      Speaker at {a.label}
                    </span>
                  ),
                )}
              </div>
              <h1 className="display mt-6 text-[length:var(--text-display-md)]">{s.name}</h1>
              <p className="mt-4 text-xl text-paper/90">{s.title}</p>
              <div className="mt-3 flex items-center gap-4">
                {s.logo ? (
                  <span className="relative h-8 w-36">
                    <Img src={s.logo} alt={s.organization} fill sizes="144px" className="object-contain object-left" />
                  </span>
                ) : null}
                <span className={s.logo ? 'sr-only' : 'font-mono text-sm uppercase tracking-[0.08em] text-gold'}>{s.organization}</span>
              </div>
              {s.orgNote ? <p className="mt-2 text-sm text-muted">{s.orgNote}</p> : null}
              {Object.keys(s.links).length ? (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {Object.entries(s.links).map(([k, href]) =>
                    href ? (
                      <li key={k}>
                        <SmartLink
                          href={href}
                          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold"
                        >
                          <Icon name={linkMeta[k]?.icon ?? 'globe'} size={15} />
                          {linkMeta[k]?.label ?? 'Link'}
                        </SmartLink>
                      </li>
                    ) : null,
                  )}
                </ul>
              ) : null}

              <div className="mt-10 max-w-2xl border-t border-line pt-8">
                <h2 className="mono-label">About {firstName}</h2>
                <div className="prose-af mt-4 text-[17px]">
                  <p>{s.bio}</p>
                </div>
              </div>
              {s.expertise.length ? (
                <div className="mt-8">
                  <h2 className="mono-label">Areas of expertise</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.expertise.map((x) => (
                      <li key={x} className="rounded-full bg-ink-card px-3.5 py-1.5 text-sm text-paper/85">
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {sessions.length ? (
        <Section tone="raised" className="!py-16">
          <Container>
            <h2 className="display-tight text-3xl">Speaking</h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {sessions.map((x) => {
                const e = getEdition(x.edition);
                const others = x.speakers.filter((p) => p !== s.slug).map(getSpeaker).filter((p) => p !== undefined);
                return (
                  <li key={x.id} className="rounded-2xl border border-line bg-ink p-6">
                    <p className="flex flex-wrap gap-x-3 font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted">
                      <span>{e?.shortName}</span>
                      <span>
                        {x.start}–{x.end} SGT
                      </span>
                      <span className={x.stage === 'af' ? 'text-gold' : 'text-[#9fb6e8]'}>{stageLabels[x.stage].name}</span>
                      <span>{x.format}</span>
                    </p>
                    <h3 className="mt-3 text-xl font-bold leading-snug">
                      <Link href={`/editions/${x.edition}/agenda#${x.id}`} className="hover:text-gold">
                        {x.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{x.summary}</p>
                    {others.length ? (
                      <p className="mt-4 text-sm text-muted">
                        With{' '}
                        {others.map((o, i) => (
                          <span key={o.slug}>
                            {i > 0 ? ', ' : ''}
                            <Link href={`/speakers/${o.slug}`} className="text-paper/90 hover:text-gold">
                              {o.name}
                            </Link>
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>
      ) : null}

      {related.length ? (
        <Section bordered className="!py-16">
          <Container>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="display-tight text-3xl">Related speakers</h2>
              <ButtonLink href="/speakers" variant="ghost">All speakers</ButtonLink>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-5">
              {related.map((o) => (
                <li key={o.slug}>
                  <SpeakerCard speaker={toSpeakerCard(o)} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        title={isPastOnly ? 'Sit in the next room.' : undefined}
        body={isPastOnly ? `${s.name} spoke at a past edition. The next one is Abu Dhabi, December 2026.` : undefined}
        actions={
          <>
            <ButtonLink href="/invitation" size="lg">
              Request an invitation
            </ButtonLink>
            <ButtonLink href="/speakers/nominate" variant="outline" size="lg">
              Nominate a speaker
            </ButtonLink>
          </>
        }
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': `${absoluteUrl(`/speakers/${s.slug}`)}#person`,
          name: s.name,
          jobTitle: s.title,
          worksFor: { '@type': 'Organization', name: s.organization },
          image: absoluteUrl(s.photo),
          description: s.bio,
          sameAs: Object.values(s.links).filter(Boolean),
          knowsAbout: s.expertise,
        }}
      />
    </>
  );
}
