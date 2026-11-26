import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditionNav } from '@/components/editions/EditionNav';
import { LogoWall } from '@/components/partners/LogoWall';
import { UseCaseCard } from '@/components/partners/UseCaseCard';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Eyebrow, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking } from '@/config/site';
import { cityParams, getEditionByPath } from '@/data/editions';
import { categories, otherUseCases, partnerBenefits, teamsAttending, useCases, wallFor } from '@/data/partners';
import { companyHref } from '@/lib/companies';
import { pageMetadata } from '@/lib/seo';

/**
 * Each event's own partners page (Tal's feedback, 24 Nov 2026): every organisation
 * that took part, in one wall with no categories or labels, the companies that only
 * sent a team, and the event's partner use cases. The list is the one behind
 * /partners (src/data/partners.ts). An upcoming event with no confirmed partners says
 * so and shows its partner offer, moved here from /partners (Tal's site structure).
 */

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return cityParams(2026, (e) => e.status !== 'planned');
}

const WORDS: Record<number, string> = { 8: 'Eight' };

export async function generateMetadata({ params }: PageProps<'/events/2026/[city]/partners'>): Promise<Metadata> {
  const { city } = await params;
  const e = getEditionByPath(`/events/2026/${city}`);
  if (!e) return {};
  const count = wallFor(e.slug).length;
  return pageMetadata({
    title: `${e.shortName} partners and organisations`,
    description: count
      ? `The ${count} partners and organisations that took part in ${e.name}, ${e.dateLabel}, and what partners received.`
      : `Partners of ${e.name}, ${e.dateLabel}. Partners are listed once their participation is confirmed.`,
    path: `${e.path}/partners`,
  });
}

export default async function EditionPartnersPage({ params }: PageProps<'/events/2026/[city]/partners'>) {
  const { city } = await params;
  const e = getEditionByPath(`/events/2026/${city}`);
  if (!e) notFound();
  const orgs = wallFor(e.slug);
  const cases = [...useCases, ...otherUseCases].filter((u) => u.edition === e.slug);
  const teams = teamsAttending(e.slug);
  const offer = e.status === 'upcoming' && e.partnerPositions ? e.partnerPositions : undefined;

  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Events', href: '/events' }, { label: e.shortName, href: e.path }, { label: 'Partners' }]}
        eyebrow={`${e.shortName} · Partners`}
        title="Partners and organisations."
        lede={orgs.length ? `The ${orgs.length} organisations that took part in ${e.shortName}.` : `Partners of ${e.shortName} are listed once their participation is confirmed.`}
        footer={<EditionNav edition={e} current="partners" />}
      />

      {orgs.length ? (
        <Section className="!pt-12">
          <Container>
            <LogoWall items={orgs.map((o) => ({ ...o, href: companyHref(o.id) }))} />
            {teams.length ? (
              <div className="mt-10 border-t border-line pt-8">
                <p className="mono-label">Teams attending from</p>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/85">{teams.map((o) => o.name).join(' · ')}</p>
              </div>
            ) : null}
          </Container>
        </Section>
      ) : (
        <Section className="!pt-12">
          <Container>
            <SectionHeader
              eyebrow={e.shortName}
              title="Partners will be announced as they confirm."
              lede={`${e.partnerPositions ? `No more than ${e.partnerPositions} strategic positions. ` : ''}Partners for ${e.city} are not listed until their participation is confirmed.`}
              action={
                <>
                  <ButtonLink href="/partners/book-a-call">{booking.partnership.label}</ButtonLink>
                  <ButtonLink href="/about/themes" variant="outline">Partnership categories</ButtonLink>
                </>
              }
            />
          </Container>
        </Section>
      )}

      {offer ? (
        <Section bordered tone="raised">
          <Container>
            <SectionHeader
              eyebrow={`Partnerships · ${e.name}`}
              title={
                <>
                  Don’t sponsor a conference.
                  <br />
                  <span className="text-gold">Own the conversation.</span>
                </>
              }
              lede={`No more than ${offer} strategic partner positions in ${e.city}, each built around a seat on stage, introductions arranged before the event and the VIP Gala.`}
            />
            <div className="mt-14">
              <Eyebrow>What a position includes</Eyebrow>
              <h3 className="display-tight mt-4 text-3xl">{offer} strategic partners. No more.</h3>
              <p className="mt-4 text-muted">A limited number of positions, so every partner is seen, introduced and remembered.</p>
            </div>
            <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {partnerBenefits.map((b, i) => (
                <li key={b.title} className="flex flex-col gap-3 bg-ink-raised p-6 sm:p-7">
                  <span className="font-mono text-xs text-gold">0{i + 1}</span>
                  <span className="text-xl font-semibold">{b.title}</span>
                  <span className="text-[15px] leading-relaxed text-muted">{b.body}</span>
                </li>
              ))}
            </ul>
            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
              <div>
                <Eyebrow>Category ownership</Eyebrow>
                <h3 className="display-tight mt-4 text-3xl">Twelve conversations. Room for one company to lead each.</h3>
                <p className="mt-4 text-muted">
                  Twelve thematic categories, not twelve available slots. With no more than {offer} positions overall, some categories will have a lead
                  partner and some will not.
                </p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/network/companies?category=${c.id}#categories`}
                      className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm text-paper/85 hover:border-gold hover:text-gold"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      ) : null}

      {cases.length ? (
        <Section bordered tone="raised">
          <Container>
            <SectionHeader eyebrow={`Use cases · ${e.shortName}`} title="What partners received." />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {cases.map((u) => (
                <UseCaseCard key={u.slug} useCase={u} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {offer ? (
        <CtaBand
          title={`${WORDS[offer] ?? offer} positions. One conversation each.`}
          body={`Talk to the partnerships team about the category your company should own in ${e.city}. Positions for ${e.city} are limited to ${(WORDS[offer] ?? String(offer)).toLowerCase()}. Start with a ${booking.partnership.minutes}-minute call.`}
          actions={
            <>
              <ButtonLink href="/partners/book-a-call" size="lg">
                {booking.partnership.label}
              </ButtonLink>
              <ButtonLink href="/apply" variant="outline" size="lg">
                Apply to attend
              </ButtonLink>
            </>
          }
        />
      ) : (
        <CtaBand />
      )}
    </>
  );
}
