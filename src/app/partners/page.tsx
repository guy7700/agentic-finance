import type { Metadata } from 'next';
import { CompanyDirectory } from '@/components/partners/CompanyDirectory';
import { UseCaseCard } from '@/components/partners/UseCaseCard';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { Stats } from '@/components/ui/Stats';
import { booking } from '@/config/site';
import { getEdition } from '@/data/editions';
import { otherUseCases, useCases } from '@/data/partners';
import { companyDirectory } from '@/lib/companies';
import { pageMetadata } from '@/lib/seo';

/**
 * Partners (Tal's site structure, 23 Nov 2026): every company we have worked with,
 * filtered by Network group and by event, tagged Partner, Network member and Attended
 * (the user approved filters and tags on this page only). Case studies stay at
 * /partners/<company>. The walls by event (/partners/past-partners) and the use cases
 * (/partners/use-cases) moved here; the partnership call and the categories moved to
 * /network/companies.
 */

export const metadata: Metadata = pageMetadata({
  title: 'Partners: every company we have worked with',
  description:
    'Every company we have worked with at Agentic Finance: partners, Network members and the companies at our events, by Network group and by event.',
  path: '/partners',
});

export default function PartnersPage() {
  const { companies, events, groups } = companyDirectory();
  const singapore = getEdition('singapore-2026');
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Partners' }]}
        eyebrow="Partners"
        title="Every company we’ve worked with."
        lede="Partners, Network members and the companies at our events. Filter by Network group or by event."
        actions={
          <>
            <ButtonLink href="/network/companies#book-a-call">{booking.partnership.label}</ButtonLink>
            <ButtonLink href="#case-studies" variant="outline" icon="arrow-down">
              Case studies
            </ButtonLink>
          </>
        }
      />

      <Section className="!pt-12">
        <Container>
          <h2 className="sr-only">Companies</h2>
          <CompanyDirectory companies={companies} events={events} groups={groups} />
        </Container>
      </Section>

      <Section bordered tone="raised" id="case-studies">
        <Container>
          <SectionHeader
            eyebrow="Case studies"
            title="What partners received."
            lede="Four partners, four different objectives. From a title partnership with a CEO keynote and an F1 simulator, to a single executive seat in the category that mattered most."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <UseCaseCard useCase={useCases[0]} featured className="sm:col-span-2 xl:col-span-4" />
            {[...useCases.slice(1), ...otherUseCases].map((u) => (
              <UseCaseCard key={u.slug} useCase={u} />
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-subtle">
            Use cases describe what each partner received at our events, as documented by More &amp; More.
          </p>
          {singapore?.metrics ? <Stats items={singapore.metrics} size="md" className="mt-14" source={`${singapore.name} · ${singapore.dateLabel}`} /> : null}
        </Container>
      </Section>

      <CtaBand
        title="Want this list with your name on it?"
        body={`Start with a ${booking.partnership.minutes}-minute call.`}
        actions={
          <>
            <ButtonLink href="/network/companies#book-a-call" size="lg">
              {booking.partnership.label}
            </ButtonLink>
            <ButtonLink href="/network" variant="outline" size="lg">
              Join the Network
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
