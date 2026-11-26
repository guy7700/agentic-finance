import { booking } from '@/config/site';
import { contextDates, type Upcoming2027 } from '@/data/upcoming-2027';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { ButtonLink } from '../ui/Button';
import { CtaBand } from '../ui/CtaBand';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container, Section, SectionHeader } from '../ui/Layout';
import { StatusBadge } from '../ui/StatusBadge';

/**
 * One template for every /events/2027/<city> page except Hong Kong. It renders only the
 * fields the data file holds, so a page grows by adding data, not code.
 */
export function Upcoming2027Page({ page }: { page: Upcoming2027 }) {
  const dates = contextDates(page);
  const interestHref = `/about/contact?topic=attendance&edition=${page.slug}`;
  const isOdds = page.brand === 'the-odds';

  const facts = [
    { label: 'City', value: `${page.city}, ${page.country}` },
    { label: `During ${page.context}`, value: dates || 'Dates to follow' },
    { label: 'Format', value: isOdds ? 'Prediction markets stage' : 'Invitation only, no tickets' },
    { label: 'Producer', value: 'More & More' },
  ];

  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div className="absolute inset-0 -z-10">
          <Img src={page.image.src} alt="" fill preload sizes="100vw" position={page.image.position} className="object-cover opacity-65" />
          <div className="scrim-hero absolute inset-0" />
        </div>
        <Container className="flex min-h-[min(80svh,760px)] flex-col justify-end pb-16 pt-[calc(var(--header-h)+40px)]">
          <Breadcrumbs items={[{ label: 'Events', href: '/events' }, { label: '2027', href: '/events/2027' }, { label: page.name }]} />
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <StatusBadge status="planned" label="Planned · 2027" />
            <span className="mono-label text-paper/70">{page.city}</span>
          </div>
          <h1 className="display mt-6 text-[length:var(--text-display-lg)]">{page.name}</h1>
          <p className="display-tight mt-4 text-[clamp(1.3rem,1rem+1.2vw,2rem)] text-paper/90">{page.tagline}</p>
          <div className="mt-8 inline-flex max-w-xl items-start gap-3 rounded-xl border border-paper/20 bg-ink/60 p-4 text-sm text-paper/85 backdrop-blur-md">
            <Icon name="calendar" size={18} className="mt-0.5 shrink-0 text-gold" />
            <span>
              <strong className="text-paper">
                During {page.context}
                {dates ? `, ${dates}` : ''}.
              </strong>{' '}
              The exact day, venue and programme follow once confirmed.
            </span>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={interestHref} size="lg">
              {isOdds ? 'Register your interest' : 'Apply to attend'}
            </ButtonLink>
            <ButtonLink href={booking.partnership.url} variant="outline" size="lg">
              Partner with us
            </ButtonLink>
          </div>
        </Container>
      </header>

      <Section>
        <Container>
          <SectionHeader eyebrow={`Why ${page.city}`} title={page.tagline} lede={page.positioning} />
          <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-ink p-6">
                <dt className="mono-label">{f.label}</dt>
                <dd className="mt-3 text-lg font-semibold leading-snug">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <CtaBand
        eyebrow={`${page.city} · 2027`}
        title={`Be first to hear about ${page.name}.`}
        body="Register your interest as a guest, or start a conversation about partnering."
        actions={
          <>
            <ButtonLink href={interestHref} size="lg">
              {isOdds ? 'Register your interest' : 'Apply to attend'}
            </ButtonLink>
            <ButtonLink href={booking.partnership.url} variant="outline" size="lg">
              {booking.partnership.label}
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
