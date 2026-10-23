import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpeakerCard } from '@/components/speakers/SpeakerCard';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Img } from '@/components/ui/Img';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking } from '@/config/site';
import { editions, getEdition } from '@/data/editions';
import { speakers } from '@/data/speakers';
import { getSpeaker, isContentSession, sessionsForEdition, speakersForEdition, stageLabels } from '@/lib/content';
import { speakerThumb } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';
import { toSpeakerCard } from '@/lib/speaker-cards';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return editions.filter((e) => e.status !== 'planned').map((e) => ({ edition: e.slug }));
}

export async function generateMetadata({ params }: PageProps<'/editions/[edition]/speakers'>): Promise<Metadata> {
  const { edition: slug } = await params;
  const e = getEdition(slug);
  if (!e || e.status === 'planned') return {};
  return pageMetadata({
    title: `${e.shortName} speakers`,
    description:
      e.status === 'completed'
        ? `The speakers of ${e.name}, ${e.dateLabel}, with the sessions they spoke in.`
        : `Speakers for ${e.name}, announced one by one as each confirms. Nominate a speaker.`,
    path: `/editions/${e.slug}/speakers`,
  });
}

export default async function EditionSpeakersPage({ params }: PageProps<'/editions/[edition]/speakers'>) {
  const { edition: slug } = await params;
  const e = getEdition(slug);
  if (!e || e.status === 'planned') notFound();

  const lineup = speakersForEdition(e.slug);
  const crumbs = [{ label: 'Speakers', href: '/speakers' }, { label: e.shortName }];

  if (e.status === 'upcoming') {
    const past = speakers.filter((s) => s.editions.length > 0 && !s.editions.includes(e.slug) && s.hasProfile !== false);
    return (
      <>
        <PageHero
          crumbs={crumbs}
          eyebrow={`${e.name} · ${e.dateLabel}`}
          title={`Joining us in ${e.city}.`}
          lede="The programme is announced speaker by speaker, as each one confirms. A deliberately short list, chosen for what they decide rather than how often they speak."
          actions={
            <>
              <ButtonLink href="/speakers/nominate">Nominate a speaker</ButtonLink>
              <ButtonLink href={booking.speaker.url} variant="outline">
                {booking.speaker.label}
              </ButtonLink>
            </>
          }
        />
        <Section className="!pt-14">
          <Container>
            <h2 className="sr-only">Confirmed speakers</h2>
            {lineup.length ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:grid-cols-5">
                {lineup.map((s) => (
                  <li key={s.slug}>
                    <SpeakerCard speaker={toSpeakerCard(s)} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center sm:px-16">
                <p className="mono-label">Confirmed speakers · {e.shortName}</p>
                <p className="display-tight mx-auto mt-5 max-w-2xl text-[clamp(1.6rem,1.2rem+1.4vw,2.4rem)]">
                  The first names will be announced here as they confirm.
                </p>
                <p className="mx-auto mt-5 max-w-xl text-muted">
                  No speakers have been publicly announced for {e.city} yet. If someone belongs on this stage, including you, tell us.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <ButtonLink href="/speakers/nominate">Nominate a speaker</ButtonLink>
                  <ButtonLink href={`/editions/${e.slug}`} variant="outline">About {e.shortName}</ButtonLink>
                </div>
              </div>
            )}
          </Container>
        </Section>
        <Section bordered tone="raised">
          <Container>
            <SectionHeader
              eyebrow="Historical credibility"
              title="Speakers at our conferences."
              lede={`Leaders who have taken Agentic Finance stages before. They are shown for context and are not confirmed for ${e.city} unless announced above.`}
              action={<ButtonLink href="/speakers" variant="outline">Full directory</ButtonLink>}
            />
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-6">
              {past.slice(0, 18).map((s) => (
                <li key={s.slug}>
                  <SpeakerCard speaker={toSpeakerCard(s, { withTagline: true })} sizes="(min-width: 1024px) 15vw, 45vw" />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
        <CtaBand />
      </>
    );
  }

  const sessions = sessionsForEdition(e.slug).filter(isContentSession);
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={`${e.name} · ${e.dateLabel} · Archive`}
        title="The Singapore lineup."
        lede={`${lineup.length} speaker profiles from the banks, exchanges, funds, regulators and infrastructure providers who took the two Singapore stages.`}
        actions={
          <>
            <ButtonLink href={`/editions/${e.slug}/agenda`}>Browse the agenda</ButtonLink>
            <ButtonLink href="/speakers" variant="outline">All speakers</ButtonLink>
          </>
        }
      />
      <Section className="!pt-14">
        <Container>
          <h2 className="sr-only">Speakers</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {lineup.map((s) => (
              <li key={s.slug}>
                <SpeakerCard speaker={{ ...toSpeakerCard(s, { withTagline: true }), tags: [] }} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <Section bordered tone="raised" id="by-session">
        <Container>
          <SectionHeader eyebrow="By session" title="Who spoke where." action={<TextLink href={`/editions/${e.slug}/agenda`}>Full agenda</TextLink>} />
          <ol className="mt-12 grid gap-4 lg:grid-cols-2">
            {sessions.map((s) => (
              <li key={s.id} className="rounded-2xl border border-line bg-ink p-6">
                <p className="flex flex-wrap gap-x-3 font-mono text-[10.5px] uppercase tracking-[0.08em]">
                  <span>{s.start}–{s.end}</span>
                  <span className={s.stage === 'af' ? 'text-gold' : 'text-[#9fb6e8]'}>{stageLabels[s.stage].name}</span>
                  <span className="text-subtle">{s.format}</span>
                </p>
                <h3 className="mt-2 text-lg font-bold leading-snug">
                  <Link href={`/editions/${e.slug}/agenda#${s.id}`} className="hover:text-gold">
                    {s.title}
                  </Link>
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.speakers.map((slug) => {
                    const p = getSpeaker(slug);
                    if (!p) return null;
                    return (
                      <li key={slug}>
                        <Link href={`/speakers/${p.slug}`} className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-[13px] hover:border-gold hover:text-gold">
                          <span className="relative size-7 overflow-hidden rounded-full bg-ink-raised">
                            <Img src={speakerThumb(p.photo)} alt="" fill sizes="28px" position="50% 20%" className="object-cover" />
                          </span>
                          {p.name}
                          {s.moderator === slug ? <span className="font-mono text-[9.5px] uppercase text-gold">Mod</span> : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
