import type { Metadata } from 'next';
import Link from 'next/link';
import { CompanyDirectory } from '@/components/partners/CompanyDirectory';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Img } from '@/components/ui/Img';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { primaryActions } from '@/config/site';
import { getOrganization, partnerAchievements } from '@/data/partners';
import { companyDirectory } from '@/lib/companies';
import { pageMetadata } from '@/lib/seo';

/**
 * Partners (Tal approved the overview, 26 Nov 2026): every company at our conferences, filtered by
 * group and by event, each card leading to its company page; then "Achievements of our partners"
 * in place of the repeated case-study previews. The booking page is /partners/book-a-call.
 */

export const metadata: Metadata = pageMetadata({
  title: 'Partners: the companies at our conferences',
  description:
    'The companies at Agentic Finance: title and event partners, the organisations on our stages, and what they achieved, from eToro’s acquisition of Zengo to its title partnership.',
  path: '/partners',
});

export default function PartnersPage() {
  const { companies, events, groups } = companyDirectory();
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Partners' }]}
        eyebrow="Partners"
        title="The companies at our conferences."
        lede="Partners and the organisations on our stages. Filter by group or by event, and open any company’s page."
        actions={
          <>
            <ButtonLink href={primaryActions.partner.href}>{primaryActions.partner.label}</ButtonLink>
            <ButtonLink href="#achievements" variant="outline" icon="arrow-down">
              Achievements of our partners
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

      <Section bordered tone="raised" id="achievements">
        <Container>
          <SectionHeader
            eyebrow="Outcomes"
            title="Achievements of our partners."
            lede="What happened for companies around our rooms: acquisitions, partnerships and launches."
          />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {partnerAchievements.map((a) => (
              <li key={a.id}>
                <Link href={a.href} className="group grid h-full overflow-hidden rounded-2xl border border-line bg-ink-card transition-colors hover:border-gold/60 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <div className="relative min-h-[200px]">
                    <Img src={a.image.src} alt={a.image.alt} fill sizes="(min-width: 768px) 22vw, 100vw" position={a.image.position} className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex flex-col p-6">
                    <p className="mono-label text-gold">{a.when}</p>
                    <h3 className="mt-2 text-xl font-semibold leading-snug group-hover:text-gold">{a.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">{a.body}</p>
                    <ul className="mt-auto flex flex-wrap items-center gap-4 pt-5">
                      {a.orgs.map((id) => {
                        const o = getOrganization(id);
                        return o?.logo ? (
                          <li key={id} className="relative h-6 w-20">
                            <Img src={o.logo} alt={o.name} fill sizes="80px" className="object-contain object-left opacity-80" />
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        title="Want your company in the room?"
        body="Start with a 30-minute call with the team."
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
