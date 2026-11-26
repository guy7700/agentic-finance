import type { Metadata } from 'next';
import { PartnershipInquiryForm } from '@/components/forms/PartnershipInquiryForm';
import { BookingEmbed } from '@/components/partners/BookingEmbed';
import { LogoMarqueeRows } from '@/components/partners/LogoWall';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container, Section } from '@/components/ui/Layout';
import { booking, contacts } from '@/config/site';
import { trackRecord } from '@/data/about';
import { organizations } from '@/data/partners';
import { upcoming2027 } from '@/data/upcoming-2027';
import { companyHref } from '@/lib/companies';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Partner with us: book a partnership call',
  description:
    'Put your company in front of the leaders of finance and AI at Agentic Finance. Request partnership information or book a 30-minute call with the team.',
  path: '/partners/book-a-call',
});

/**
 * Partners → Book a Partnership Call (Tal's review, 26 Nov 2026): a short headline, the enquiry
 * form and the booking calendar both on the first screen, then logos of the companies at our
 * events. No packages, price tiers or topics: the goal is a conversation with the team.
 */
export default function BookPartnershipCallPage() {
  const logos = organizations.filter((o) => o.logo).map((o) => ({ ...o, href: companyHref(o.id) }));
  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink-deep">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_20%,rgb(209_182_121/0.14),transparent_70%)]" />
        </div>
        <Container className="pb-10 pt-[calc(var(--header-h)+32px)]">
          <Breadcrumbs items={[{ label: 'Partners', href: '/partners' }, { label: 'Book a partnership call' }]} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <p className="eyebrow">Partner with us</p>
              <h1 className="display mt-5 text-[clamp(2.2rem,1.5rem+2.8vw,4rem)]">
                Meet the people who decide <span className="serif-accent">the future of finance.</span>
              </h1>
              <p className="lede mt-5 max-w-xl text-paper/85">
                Stage, curated meetings and visibility in front of banks, investors and the companies building agentic finance, at every edition
                worldwide.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="#book" size="lg" icon="calendar">
                  Book a partnership meeting
                </ButtonLink>
                <ButtonLink href="#request" variant="outline" size="lg" icon="arrow-down">
                  Request partnership information
                </ButtonLink>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {trackRecord.map((m) => (
                <div key={m.label} className="flex flex-col-reverse gap-1 bg-ink/80 p-5">
                  <dt className="text-sm text-muted">{m.label}</dt>
                  <dd className="serif-figure text-[clamp(1.9rem,1.5rem+1vw,2.6rem)] leading-none text-gold">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </header>

      <section aria-label="Companies at our events" className="border-b border-line bg-ink-deep py-8">
        <Container wide>
          <LogoMarqueeRows items={logos} />
        </Container>
      </section>

      <Section className="!pt-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div id="request" className="edge-gold relative min-w-0 rounded-2xl border border-gold/40 bg-ink-card p-6 sm:p-8">
              <p className="eyebrow">Request partnership information</p>
              <h2 className="display-tight mt-3 text-[clamp(1.6rem,1.3rem+1vw,2.2rem)]">Tell us what you want to achieve.</h2>
              <p className="mt-2 text-muted">Name, email and company. The rest is optional.</p>
              <div className="mt-7">
                <PartnershipInquiryForm events={upcoming2027.map((e) => e.city)} />
              </div>
            </div>
            <div id="book" className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+24px)]">
              <BookingEmbed open url={booking.partnership.url} minutes={booking.partnership.minutes} title="Book a partnership meeting" />
              <p className="flex items-center gap-2 px-1 text-sm text-muted">
                <Icon name="mail" size={16} className="text-gold" />
                Prefer email?{' '}
                <a href={`mailto:${contacts.partnerships}`} className="font-semibold text-gold hover:text-gold-bright">
                  {contacts.partnerships}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
