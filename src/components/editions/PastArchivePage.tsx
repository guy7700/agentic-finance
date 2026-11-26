import Link from 'next/link';
import { Gallery } from '@/components/media/Gallery';
import { PressMentions } from '@/components/media/PressMentions';
import { YouTubeEmbed } from '@/components/media/YouTubeEmbed';
import { LogoWall } from '@/components/partners/LogoWall';
import { SpeakerCard } from '@/components/speakers/SpeakerCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Img } from '@/components/ui/Img';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { gallery, galleryCollections, galleryTags, videos } from '@/data/media';
import type { PastArchive } from '@/data/past-archives';
import { wallFor } from '@/data/partners';
import { companyHref } from '@/lib/companies';
import { speakers } from '@/lib/content';
import { toSpeakerCard } from '@/lib/speaker-cards';

/** An archive page for a past More & More edition: facts, film, speakers, companies, photos and press. */
export function PastArchivePage({ a }: { a: PastArchive }) {
  const film = videos.find((v) => a.videoIds.includes(v.edition) && v.youtubeId);
  const people = speakers.filter((s) => s.conferences?.includes(a.conferenceId)).map((s) => toSpeakerCard(s));
  const orgs = a.orgEdition ? wallFor(a.orgEdition).map((o) => ({ ...o, href: companyHref(o.id) })) : [];
  const photos = gallery.filter((g) => g.edition === a.galleryId);
  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10">
          <Img src={a.image.src} alt="" fill preload sizes="100vw" position={a.image.position} className="object-cover opacity-55" />
          <div className="scrim-hero absolute inset-0" />
        </div>
        <Container className="flex min-h-[min(70svh,640px)] flex-col justify-end pb-14 pt-[calc(var(--header-h)+40px)]">
          <Breadcrumbs items={[{ label: 'Events', href: '/events' }, { label: 'Past events', href: '/events#past' }, { label: a.name }]} />
          <p className="eyebrow mt-8">
            Past edition · {a.city} · {a.date}
          </p>
          <h1 className="display mt-4 max-w-4xl text-[clamp(2.3rem,1.6rem+2.8vw,4.25rem)]">{a.name}</h1>
          <p className="mono-label mt-4 text-paper/80">{a.where}</p>
          <p className="lede mt-5 max-w-2xl text-paper/85">{a.summary}</p>
          <dl className="mt-8 grid max-w-md grid-cols-3 border-t border-paper/15 pt-6">
            {a.facts.map((f, i) => (
              <div key={f.label} className={`flex flex-col-reverse gap-1 ${i > 0 ? 'border-l border-paper/15 pl-4' : ''}`}>
                <dt className="mono-label text-paper/75">{f.label}</dt>
                <dd className="serif-figure text-4xl leading-none text-gold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </header>

      {film?.youtubeId ? (
        <Section>
          <Container>
            <SectionHeader eyebrow="The film" title={film.title} size="md" />
            <YouTubeEmbed id={film.youtubeId} poster={film.poster} title={film.title} duration={film.duration} className="mt-8" />
          </Container>
        </Section>
      ) : null}

      {people.length ? (
        <Section bordered tone="raised">
          <Container>
            <SectionHeader title="Speakers" size="md" action={<ButtonLink href="/speakers" variant="outline">All speakers</ButtonLink>} />
            <ul className="mt-10 grid grid-cols-3 gap-x-3 gap-y-7 sm:grid-cols-4 lg:grid-cols-6">
              {people.map((s) => (
                <li key={s.slug}>
                  <SpeakerCard speaker={{ ...s, hasProfile: true }} compact />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {orgs.length ? (
        <Section bordered>
          <Container>
            <SectionHeader title="Companies on stage" size="md" />
            <LogoWall items={orgs} columns="wide" className="mt-10" />
            {a.companyPages?.length ? (
              <p className="mt-6 text-muted">
                Company page:{' '}
                {a.companyPages.map((c) => (
                  <Link key={c.href} href={c.href} className="font-semibold text-gold hover:text-gold-bright">
                    {c.label}
                  </Link>
                ))}
              </p>
            ) : null}
          </Container>
        </Section>
      ) : null}

      {photos.length ? (
        <Section bordered tone="raised">
          <Container>
            <SectionHeader title="Photos" size="md" action={<ButtonLink href="/about/brand#photos" variant="outline">All photos</ButtonLink>} />
            <div className="mt-10">
              <Gallery images={photos} collections={galleryCollections} tags={galleryTags} filters={false} />
            </div>
          </Container>
        </Section>
      ) : null}

      <Section bordered>
        <Container>
          <SectionHeader
            title="In the press"
            size="md"
            action={
              <ButtonLink href={a.caseStudy} variant="outline">
                More &amp; More case study
              </ButtonLink>
            }
          />
          <PressMentions editions={a.pressIds} className="mt-10" />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
