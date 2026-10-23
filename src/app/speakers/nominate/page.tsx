import type { Metadata } from 'next';
import { NominationForm } from '@/components/forms/NominationForm';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { booking, contacts, externalLinks } from '@/config/site';
import { getCurrentEdition } from '@/data/editions';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Nominate a speaker',
  description:
    'Put forward a senior voice for the Agentic Finance stage, or nominate yourself. Every nomination is read; a nomination is not a confirmation.',
  path: '/speakers/nominate',
});

export default function NominatePage() {
  const e = getCurrentEdition();
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Speakers', href: '/speakers' }, { label: 'Nominate a speaker' }]}
        eyebrow={`Speaker nomination · ${e.name}`}
        title="Nominate a speaker."
        lede={`Put forward a senior voice for the stage, or nominate yourself: a short list of voices, in front of ${e.guestCount} hand-selected leaders in finance, ${e.city}, ${e.dateLabel}.`}
      />
      <Section className="!pt-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:gap-14">
            <NominationForm edition={e.shortName} />
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
                    'Abu Dhabi speakers are announced one by one, as each confirms.',
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
                  </a>{' '}
                  or use the{' '}
                  <a href={externalLinks.nominateLegacy} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold">
                    Abu Dhabi nomination page
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
