import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NetworkForm } from '@/components/network/NetworkForm';
import { NetworkGraphic } from '@/components/network/NetworkGraphic';
import { LogoWall } from '@/components/partners/LogoWall';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { primaryActions } from '@/config/site';
import { getNetworkPage, networkPages, startupCompetition, vcAfterJoin } from '@/data/network';
import { organizations } from '@/data/partners';
import { companyHref } from '@/lib/companies';
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
  return pageMetadata({ title: `${p.card.title}: join the Agentic Finance Network for free`, description: p.lede, path: `/network/${p.slug}` });
}

/**
 * One Network landing page per group (Tal's review, 26 Nov 2026): the first screen says joining
 * is free and holds the form (name, email, company); then logos, what we bring to this group,
 * and the supporting detail. Paid tiers are not part of this journey.
 */
export default async function NetworkAudiencePage({ params }: PageProps<'/network/[audience]'>) {
  const { audience } = await params;
  const p = getNetworkPage(audience);
  if (!p) notFound();
  const logos = organizations.filter((o) => o.group === p.audience).map((o) => ({ ...o, href: companyHref(o.id) }));

  return (
    <>
      {/* 1-2. Headline and the free form, together on the first screen */}
      <header className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink-deep">
          <NetworkGraphic className="absolute -right-24 top-10 h-[620px] w-[620px] opacity-40 sm:opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_15%_30%,rgb(209_182_121/0.12),transparent_70%)]" />
        </div>
        <Container className="pb-16 pt-[calc(var(--header-h)+32px)] sm:pb-20">
          <Breadcrumbs items={[{ label: 'Network', href: '/network' }, { label: p.card.title }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-0">
            <div className="lg:col-start-1 lg:row-start-1 lg:pt-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-bright">
                <Icon name="check" size={14} />
                Free to join
              </p>
              <h1 className="display mt-6 text-[clamp(2.1rem,1.5rem+2.4vw,3.6rem)]">{p.title}</h1>
              <p className="lede mt-5 max-w-xl text-paper/85">{p.lede}</p>
            </div>
            <div id="apply" className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start edge-gold relative rounded-2xl border border-gold/40 bg-ink-card/95 p-6 shadow-2xl backdrop-blur-md sm:p-8">
              <p className="eyebrow">{p.form.eyebrow}</p>
              <h2 className="display-tight mt-3 text-[clamp(1.6rem,1.3rem+1vw,2.2rem)]">{p.form.title}</h2>
              {p.form.lede ? <p className="mt-2 text-muted">{p.form.lede}</p> : null}
              <div className="mt-7">
                <NetworkForm page={p} />
              </div>
            </div>
            <div className="lg:col-start-1 lg:row-start-2">
              <ul className="mt-8 flex flex-col gap-3">
                {p.benefits.slice(0, 4).map((b) => (
                  <li key={b.title} className="flex gap-3 text-paper/90">
                    <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold" />
                    <span>
                      <strong className="font-semibold">{b.title}.</strong> <span className="text-muted">{b.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {p.stats ? (
                <dl className="mt-8 grid max-w-lg grid-cols-3 border-t border-line pt-6">
                  {p.stats.map((s, i) => (
                    <div key={s.label} className={`flex flex-col-reverse gap-1 ${i > 0 ? 'border-l border-line pl-4' : 'pr-4'}`}>
                      <dt className="text-[13px] leading-snug text-muted">{s.label}</dt>
                      <dd className="serif-figure text-3xl leading-none text-gold">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>
        </Container>
      </header>

      {/* 3. Logos and social proof */}
      <Section bordered className="!py-16">
        <Container>
          <SectionHeader title={p.logos.label} size="md" lede="Organisations that took part in our events. Each logo opens its company page." />
          <LogoWall items={logos} className="mt-10" />
          <dl className="mt-10 flex flex-col gap-6">
            {p.whoIsIn.map((w) => (
              <div key={w.label}>
                <dt className="mono-label">{w.label}</dt>
                <dd className="mt-2 text-[17px] leading-relaxed text-paper/85">{w.names}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* 4. What we bring to this group */}
      <Section bordered tone="raised">
        <Container>
          <SectionHeader eyebrow="Free membership" title={p.benefitsTitle} lede={p.benefitsLede} />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {p.benefits.map((b) => (
              <li key={b.title} className="flex flex-col gap-3 bg-ink-raised p-6">
                <span className="text-lg font-semibold leading-snug">{b.title}</span>
                <span className="leading-relaxed text-muted">{b.body}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href="#apply" size="lg" icon="arrow-up">
              {p.primaryCta}
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* 5. Supporting information */}
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

      {p.audience === 'vc' ? (
        <Section bordered>
          <Container>
            <SectionHeader eyebrow="After you join" title="What lands in your inbox as a member." />
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
      ) : null}

      <Section bordered className="!py-14">
        <Container>
          <div className="flex flex-col gap-6 rounded-2xl border border-line bg-ink-card/60 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div>
              <p className="text-lg font-semibold">Joining as someone else?</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {networkPages
                  .filter((x) => x.slug !== p.slug)
                  .map((x) => (
                    <li key={x.slug}>
                      <Link href={`/network/${x.slug}#apply`} className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
                        {x.card.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-muted">Looking for exposure at our events?</p>
              <Link href={primaryActions.partner.href} className="mt-1 inline-flex min-h-11 items-center gap-2 font-semibold text-gold hover:text-gold-bright">
                Partner with us <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
