import type { Metadata } from 'next';
import { LogoWall, type LogoItem } from '@/components/partners/LogoWall';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking } from '@/config/site';
import { editions } from '@/data/editions';
import { editionOrganizations, getOrganization } from '@/data/partners';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Past partners',
  description: 'The partners and organisations that took part in each Agentic Finance edition.',
  path: '/partners/past-partners',
});

/** Every organisation at an edition, in one wall with no categories. */
const orgsFor = (edition: string): LogoItem[] =>
  editionOrganizations
    .filter((r) => r.edition === edition)
    .map((r) => getOrganization(r.org))
    .filter((o) => o !== undefined);

export default function PastPartnersPage() {
  const withRecords = editions.filter((e) => editionOrganizations.some((r) => r.edition === e.slug));
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Partners', href: '/partners' }, { label: 'Past partners' }]}
        eyebrow="By edition"
        title="Partners and organisations."
        lede="The organisations that took part in each Agentic Finance edition."
        actions={<ButtonLink href="/partners/use-cases" variant="outline">Partner use cases</ButtonLink>}
      />
      {withRecords.map((e) => (
        <Section key={e.slug} className="!pt-12">
          <Container>
            <SectionHeader eyebrow={`${e.status === 'completed' ? 'Archive' : 'Edition'} · ${e.dateLabel}`} title={e.shortName} size="md" />
            <LogoWall items={orgsFor(e.slug)} linkOut className="mt-10" />
          </Container>
        </Section>
      ))}
      <Section bordered tone="raised">
        <Container>
          <SectionHeader
            eyebrow="Abu Dhabi 2026"
            title="Partners will be announced as they confirm."
            lede="No more than eight strategic positions. Partners for Abu Dhabi are not listed until their participation is confirmed."
            action={<ButtonLink href="/partners/book-a-call">{booking.partnership.label}</ButtonLink>}
          />
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
