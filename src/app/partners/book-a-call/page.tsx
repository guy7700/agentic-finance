import type { Metadata } from 'next';
import { PartnershipForm } from '@/components/forms/PartnershipForm';
import { BookingEmbed } from '@/components/partners/BookingEmbed';
import { Icon } from '@/components/ui/Icon';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking, contacts } from '@/config/site';
import { getCurrentEdition } from '@/data/editions';
import { categories } from '@/data/partners';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Book a partnership call',
  description:
    'Book a 20-minute call with the Agentic Finance partnerships team, or send a partnership enquiry. No public price list: every position is shaped around your category and introductions.',
  path: '/partners/book-a-call',
});

const AGENDA = [
  'What your company wants to lead, and who it needs to meet',
  'Which category fits, and whether it is still open',
  'Stage, introductions, activation and the VIP Gala',
  'Next steps and timing for Abu Dhabi',
];

export default function BookACallPage() {
  const e = getCurrentEdition();
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Partners', href: '/partners' }, { label: 'Book a partnership call' }]}
        eyebrow={`Partnerships · ${e.name}`}
        title="Book a partnership call."
        lede={`${booking.partnership.minutes} minutes with the partnerships team. No price list, no deck to wade through: a conversation about what your company should own in ${e.city}.`}
      />
      <Section className="!pt-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <BookingEmbed url={booking.partnership.url} minutes={booking.partnership.minutes} title="A 20-minute partnership call" />
            <div className="rounded-2xl border border-line p-6 sm:p-8">
              <p className="mono-label">What we will cover</p>
              <ul className="mt-4 flex flex-col gap-3">
                {AGENDA.map((x) => (
                  <li key={x} className="flex gap-3 text-[15px] text-paper/85">
                    <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold" />
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-5 text-sm text-muted">
                Positions are limited to {e.partnerPositions}. Prefer email?{' '}
                <a href={`mailto:${contacts.partnerships}`} className="font-semibold text-gold">
                  {contacts.partnerships}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
      <Section bordered tone="raised" id="enquiry">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div>
              <p className="eyebrow">Or write to us</p>
              <h2 className="display-tight mt-4 text-[clamp(1.8rem,1.3rem+1.6vw,2.6rem)]">Partnership enquiry</h2>
              <p className="mt-4 leading-relaxed text-muted">
                Tell us a little about your company and the category you want to own. The partnerships team reviews every enquiry and
                replies by email.
              </p>
            </div>
            <PartnershipForm
              categories={categories.map((c) => ({ id: c.id, name: c.name }))}
              bookingUrl={booking.partnership.url}
              bookingLabel={booking.partnership.label}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
