import Link from 'next/link';
import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { booking } from '@/config/site';
import { editionsByStatus } from '@/data/editions';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: '2027 cities',
  description:
    'Agentic Finance becomes an international series in 2027: Hong Kong, Rio de Janeiro, Paris, Dubai and Singapore. Dates to be announced.',
  path: '/editions/2027',
});

export default function Series2027Page() {
  const cities = editionsByStatus('planned');
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Editions', href: '/editions' }, { label: '2027 cities' }]}
        eyebrow="The 2027 international series"
        title={
          <>
            Five cities.
            <br />
            <span className="text-gold">Dates to be announced.</span>
          </>
        }
        lede="After Singapore and Abu Dhabi, Agentic Finance becomes a permanent international series. Each city is announced with its date and venue once confirmed; until then, nothing here is a schedule."
        actions={
          <>
            <ButtonLink href="/about/contact?topic=attendance">Register interest</ButtonLink>
            <ButtonLink href="/partners/book-a-call" variant="outline">Partner across the series</ButtonLink>
          </>
        }
        footer={
          <ul className="flex flex-wrap gap-2">
            {cities.map((c) => (
              <li key={c.slug}>
                <a href={`#${c.slug}`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
                  <span aria-hidden className="size-1.5 rounded-full border border-paper/70" />
                  {c.city}
                </a>
              </li>
            ))}
          </ul>
        }
      />

      <div>
        {cities.map((c, i) => (
          <section key={c.slug} id={c.slug} aria-labelledby={`${c.slug}-title`} className="border-b border-line">
            <div className={`grid lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="relative min-h-[360px] overflow-hidden sm:min-h-[460px] lg:min-h-[620px]">
                <Img src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" position={c.image.position} className="object-cover" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent lg:bg-none" />
                <span className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.1em] text-paper/80">0{i + 1} / 05</span>
              </div>
              <div className="flex flex-col justify-center px-4 py-14 sm:px-10 lg:px-16 xl:px-24">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status="planned" label="Planned · 2027" />
                  <span className="mono-label">{c.country}</span>
                </div>
                <h2 id={`${c.slug}-title`} className="display mt-6 text-[length:var(--text-display-md)]">
                  {c.city}
                </h2>
                <p className="display-tight mt-3 text-xl text-gold sm:text-2xl">{c.tagline}</p>
                <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">{c.positioning}</p>
                <p className="mt-6 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.08em] text-paper/85">
                  <Icon name="calendar" size={16} className="text-gold" />
                  {c.dateLabel}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={`/about/contact?topic=attendance&edition=${c.slug}`}>Register interest</ButtonLink>
                  <Link href={`/editions/${c.slug}`} className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-semibold text-paper hover:text-gold">
                    {c.city} 2027 <Icon name="arrow-right" size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <Section tone="raised">
        <Container>
          <SectionHeader
            eyebrow="Series partnerships"
            title="One partner. Five rooms."
            lede="Category ownership can extend across the 2027 series, so a company leads the same conversation in every city. Positions are limited in each edition."
            action={
              <>
                <ButtonLink href="/partners/book-a-call">{booking.partnership.label}</ButtonLink>
                <ButtonLink href="/partners/categories" variant="outline">Partnership categories</ButtonLink>
              </>
            }
          />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
