import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditionNav } from '@/components/editions/EditionNav';
import { LogoWall, type LogoItem } from '@/components/partners/LogoWall';
import { UseCaseCard } from '@/components/partners/UseCaseCard';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking } from '@/config/site';
import { cityParams, getEditionByPath } from '@/data/editions';
import { editionOrganizations, getOrganization, otherUseCases, useCases } from '@/data/partners';
import { pageMetadata } from '@/lib/seo';

/**
 * Each event's own partners page (Tal's feedback, 24 Nov 2026): every organisation
 * that took part, in one wall with no categories or labels, and the event's
 * partner use cases. An event with no confirmed partners says so.
 */

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return cityParams(2026, (e) => e.status !== 'planned');
}

const orgsFor = (edition: string): LogoItem[] =>
  editionOrganizations
    .filter((r) => r.edition === edition)
    .map((r) => getOrganization(r.org))
    .filter((o) => o !== undefined);

export async function generateMetadata({ params }: PageProps<'/events/2026/[city]/partners'>): Promise<Metadata> {
  const { city } = await params;
  const e = getEditionByPath(`/events/2026/${city}`);
  if (!e) return {};
  const count = orgsFor(e.slug).length;
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
  const orgs = orgsFor(e.slug);
  const cases = [...useCases, ...otherUseCases].filter((u) => u.edition === e.slug);

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
            <LogoWall items={orgs} linkOut />
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
                  <ButtonLink href="/partners/categories" variant="outline">Partnership categories</ButtonLink>
                </>
              }
            />
          </Container>
        </Section>
      )}

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

      <CtaBand />
    </>
  );
}
