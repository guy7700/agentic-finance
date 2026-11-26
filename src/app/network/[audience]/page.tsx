import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NetworkForm, VenturePartnerButton } from '@/components/network/NetworkForm';
import { CategoryExplorer } from '@/components/partners/CategoryExplorer';
import { PartnershipCall } from '@/components/partners/PartnershipCall';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking } from '@/config/site';
import { getNetworkPage, networkPages, partnerSeats, startupCompetition, vcAfterJoin, venturePartner } from '@/data/network';
import { categoryViews } from '@/lib/category-views';
import { pageMetadata } from '@/lib/seo';

// Every valid path is generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return networkPages.map((p) => ({ audience: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/network/[audience]'>): Promise<Metadata> {
  const { audience } = await params;
  const p = getNetworkPage(audience);
  if (!p) return {};
  return pageMetadata({ title: `${p.title} · Agentic Finance Network`, description: p.lede, path: `/network/${p.slug}` });
}

export default async function NetworkAudiencePage({ params }: PageProps<'/network/[audience]'>) {
  const { audience } = await params;
  const p = getNetworkPage(audience);
  if (!p) notFound();

  const secondary = p.secondaryCta ? (
    p.secondaryCta.action === 'venture-partner' ? (
      <VenturePartnerButton label={p.secondaryCta.label} />
    ) : (
      <ButtonLink href={p.secondaryCta.href === 'booking' ? booking.partnership.url : (p.secondaryCta.href ?? '#apply')} variant="outline" size="lg">
        {p.secondaryCta.label}
      </ButtonLink>
    )
  ) : null;

  return (
    <>
      <PageHero
        crumbs={[{ label: 'Network', href: '/network' }, { label: p.card.title }]}
        eyebrow={p.eyebrow}
        title={p.title}
        lede={p.lede}
        actions={
          <>
            <ButtonLink href="#apply" size="lg">
              {p.primaryCta}
            </ButtonLink>
            {secondary}
          </>
        }
        footer={
          p.stats ? (
            <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {p.stats.map((s) => (
                <div key={s.label} className="bg-ink/80 p-5">
                  <dt className="display-tight text-3xl text-gold">{s.value}</dt>
                  <dd className="mt-1 text-sm text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          ) : undefined
        }
      />

      {p.audience === 'vc'
        ? p.whoIsIn.map((w) => (
            <Section key={w.label} className="!py-12" bordered>
              <Container>
                <p className="mono-label">{w.label}</p>
                <p className="mt-4 text-[17px] leading-relaxed text-paper/85">{w.names}</p>
              </Container>
            </Section>
          ))
        : null}

      <Section bordered tone="raised">
        <Container>
          <SectionHeader eyebrow={p.audience === 'vc' ? p.benefitsLede : 'Membership'} title={p.benefitsTitle} />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {p.benefits.map((b) => (
              <li key={b.title} className="flex flex-col gap-3 bg-ink-raised p-6">
                <span className="text-lg font-semibold leading-snug">{b.title}</span>
                <span className="leading-relaxed text-muted">{b.body}</span>
              </li>
            ))}
          </ul>
          {p.audience !== 'vc' && p.benefitsLede ? <p className="mt-8 text-[17px] text-paper/85">{p.benefitsLede}</p> : null}
        </Container>
      </Section>

      {p.audience === 'startup' ? (
        <Section bordered>
          <Container>
            <SectionHeader title={startupCompetition.title} lede={startupCompetition.intro} />
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {startupCompetition.steps.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-line bg-ink-card/50 p-6">
                  <span className="font-mono text-sm text-gold">0{i + 1}</span>
                  <p className="mt-3 text-lg font-semibold">{s.title}</p>
                  <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-muted">{startupCompetition.tracks}</p>
          </Container>
        </Section>
      ) : null}

      {p.audience === 'company' ? (
        <Section bordered>
          <Container>
            <SectionHeader title={partnerSeats.title} lede={partnerSeats.note} />
            <div className="mt-10 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[520px] text-left text-[15px]">
                <thead className="bg-ink-card">
                  <tr>
                    <th scope="col" className="p-4 font-semibold text-muted">
                      <span className="sr-only">Benefit</span>
                    </th>
                    {partnerSeats.columns.map((c) => (
                      <th key={c} scope="col" className="p-4 font-semibold text-gold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {partnerSeats.rows.map(([label, a, b]) => (
                    <tr key={label} className="border-t border-line">
                      <th scope="row" className="p-4 font-medium">
                        {label}
                      </th>
                      <td className="p-4 text-paper/85">{a}</td>
                      <td className="p-4 text-paper/85">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mono-label mt-10">Case studies</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {partnerSeats.caseStudies.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      {p.audience === 'company' ? (
        <Section bordered tone="raised" id="categories">
          <Container>
            <SectionHeader
              eyebrow="Category ownership"
              title="Twelve conversations. Room for one company to lead each."
              lede="Choose a category to see what it covers, who belongs in it, the conversations it leads and what happened in it in Singapore."
            />
            <div className="mt-12">
              <CategoryExplorer
                categories={categoryViews()}
                note={
                  <>
                    <strong className="text-paper">Not sure which category is yours?</strong> Most companies span two or three. The partnerships team
                    will help you pick the one you can credibly lead.
                  </>
                }
              />
            </div>
          </Container>
        </Section>
      ) : null}

      {p.audience !== 'vc' ? (
        <Section bordered>
          <Container>
            <SectionHeader title="Who is already in" size="md" />
            <dl className="mt-8 flex flex-col gap-6">
              {p.whoIsIn.map((w) => (
                <div key={w.label}>
                  <dt className="mono-label">{w.label}</dt>
                  <dd className="mt-2 text-[17px] leading-relaxed text-paper/85">{w.names}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>
      ) : null}

      <Section bordered tone="raised" id="apply">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeader eyebrow={p.form.eyebrow} title={p.form.title} lede={p.form.lede} />
            <div className="mt-10">
              <NetworkForm page={p} />
            </div>
          </div>
        </Container>
      </Section>

      {p.audience === 'company' ? <PartnershipCall /> : null}

      {p.audience === 'vc' ? (
        <>
          <Section bordered>
            <Container>
              <SectionHeader eyebrow="After you join" title="What lands in your inbox as a free member." />
              <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                {vcAfterJoin.map((b) => (
                  <li key={b.title} className="flex flex-col gap-3 bg-ink p-6">
                    <span className="text-lg font-semibold">{b.title}</span>
                    <span className="leading-relaxed text-muted">{b.body}</span>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
          <Section bordered tone="raised">
            <Container>
              <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                <SectionHeader eyebrow={venturePartner.eyebrow} title={venturePartner.title} lede={venturePartner.body} />
                <div>
                  <ul className="flex flex-col gap-3">
                    {venturePartner.points.map((x) => (
                      <li key={x} className="flex gap-3 text-paper/85">
                        <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold" />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <VenturePartnerButton label={venturePartner.button} variant="primary" className="mt-8" />
                  <p className="mt-3 text-sm text-subtle">{venturePartner.note}</p>
                </div>
              </div>
            </Container>
          </Section>
        </>
      ) : null}
    </>
  );
}
