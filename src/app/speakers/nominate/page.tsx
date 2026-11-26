import type { Metadata } from 'next';
import { NominationForm } from '@/components/forms/NominationForm';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking, contacts } from '@/config/site';
import { nextEdition2027, upcoming2027 } from '@/data/upcoming-2027';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Nominate a speaker',
  description:
    'Put forward a senior voice for the Agentic Finance stage, or nominate yourself. Every nomination is read; a nomination is not a confirmation.',
  path: '/speakers/nominate',
});

/** Nominate a speaker (Tal approved it; 26 Nov 2026: the event first, a shorter subtitle). */
export default function NominatePage() {
  const e = nextEdition2027();
  const events = [...upcoming2027.map((x) => `${x.name} 2027`), 'Any upcoming event'];
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Speakers', href: '/speakers' }, { label: 'Nominate a speaker' }]}
        eyebrow="Speakers"
        title="Nominate a speaker."
        lede="Put forward a senior voice for our stage, or nominate yourself."
      />
      <Section className="!pt-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-14">
            <NominationForm events={events} defaultEvent={`${e.name} 2027`} />
            <aside className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h)+24px)] lg:self-start">
              <div className="rounded-2xl border border-gold/40 bg-gold/[0.05] p-6">
                <p className="eyebrow">Prefer to talk?</p>
                <p className="mt-3 text-lg font-semibold">A {booking.speaker.minutes}-minute introductory call</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  For speakers who would rather walk the programme team through their perspective directly.
                </p>
                <ButtonLink href={booking.speaker.url} variant="outline" className="mt-5 w-full">
                  Book a call
                </ButtonLink>
              </div>
              <div className="rounded-2xl border border-line p-6">
                <p className="text-lg font-semibold">How nominations work</p>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-muted">
                  {[
                    'Every nomination is read by the programme team.',
                    'Speakers are chosen for what they decide, not how often they speak.',
                    'Speakers are announced on each event’s page as they confirm.',
                    'A nomination is not a confirmation of a slot.',
                  ].map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Icon name="check" size={16} className="mt-0.5 shrink-0 text-gold" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line p-6 text-sm text-muted">
                <p>
                  Problems with the form? Email{' '}
                  <a href={`mailto:${contacts.general}`} className="font-semibold text-gold">
                    {contacts.general}
                  </a>
                  .
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
