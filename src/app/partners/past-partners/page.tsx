import type { Metadata } from 'next';
import { LogoWall, type LogoItem } from '@/components/partners/LogoWall';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking } from '@/config/site';
import { editions } from '@/data/editions';
import { editionOrganizations, getOrganization } from '@/data/partners';
import type { OrgRelationship } from '@/data/types';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Past partners',
  description:
    'Partners of Agentic Finance by edition, kept separate from the organisations represented on stage by speakers. eToro, Fireblocks, Alpaca and Limitless partnered Singapore 2026.',
  path: '/partners/past-partners',
});

const GROUPS: { id: string; title: string; relationships: OrgRelationship[]; note: string; columns: 'wide' | 'dense'; labelled: boolean }[] = [
  {
    id: 'partners',
    title: 'Partners',
    relationships: ['title-partner', 'partner'],
    note: 'Companies with a published partnership for this edition.',
    columns: 'wide',
    labelled: true,
  },
  {
    id: 'media',
    title: 'Media on stage',
    relationships: ['media'],
    note: 'Media organisations represented on stage.',
    columns: 'dense',
    labelled: true,
  },
  {
    id: 'public',
    title: 'Public sector on stage',
    relationships: ['public-sector'],
    note: 'Government and regulatory representatives who spoke.',
    columns: 'dense',
    labelled: true,
  },
  {
    id: 'on-stage',
    title: 'Organisations represented on stage',
    relationships: ['on-stage'],
    note: 'Represented by a speaker. This does not imply sponsorship or partnership.',
    columns: 'dense',
    labelled: false,
  },
];

export default function PastPartnersPage() {
  const withRecords = editions.filter((e) => editionOrganizations.some((r) => r.edition === e.slug));
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Partners', href: '/partners' }, { label: 'Past partners' }]}
        eyebrow="By edition"
        title="Past partners."
        lede="Partners are listed separately from the organisations whose executives spoke. Not every logo on this page is a sponsor, and we say which is which."
        actions={<ButtonLink href="/partners/use-cases" variant="outline">Partner use cases</ButtonLink>}
      />
      {withRecords.map((e) => (
        <Section key={e.slug} className="!pt-12">
          <Container>
            <SectionHeader eyebrow={`${e.status === 'completed' ? 'Archive' : 'Edition'} · ${e.dateLabel}`} title={e.shortName} size="md" />
            <div className="mt-10 flex flex-col gap-14">
              {GROUPS.map((g) => {
                const items: LogoItem[] = editionOrganizations
                  .filter((r) => r.edition === e.slug && g.relationships.includes(r.relationship))
                  .map((r) => {
                    const o = getOrganization(r.org);
                    return o ? { ...o, note: r.relationship === 'title-partner' ? 'Title Partner' : g.id === 'partners' ? r.note : undefined } : null;
                  })
                  .filter((o): o is NonNullable<typeof o> => o !== null);
                if (!items.length) return null;
                return (
                  <div key={g.id}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-xl font-bold">
                        {g.title} <span className="font-mono text-sm text-subtle">({items.length})</span>
                      </h3>
                      <p className="text-sm text-muted">{g.note}</p>
                    </div>
                    <LogoWall items={items} columns={g.columns} labelled={g.labelled} linkOut={g.id === 'partners'} className="mt-5" />
                  </div>
                );
              })}
            </div>
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
