import { booking, contacts } from '@/config/site';
import { Icon } from '../ui/Icon';
import { Container, Section, SectionHeader } from '../ui/Layout';
import { BookingEmbed } from './BookingEmbed';

/**
 * The partnership call: the Google appointment booking, what the call covers and how
 * a partnership comes together. Moved from /partners/book-a-call and /partners
 * (Tal's site structure) to /network/companies#book-a-call.
 */

const AGENDA = [
  'What your company wants to lead, and who it needs to meet',
  'Which category fits, and whether it is still open',
  'Stage, introductions, activation and the VIP Gala',
  'Next steps and timing',
];

const PROCESS = [
  { title: 'A 30-minute call', body: 'Tell us what your company wants to lead and who it needs to meet. We tell you honestly whether the room is right.' },
  { title: 'A proposal built around you', body: 'Category, stage, introductions, activation and the Gala, shaped around your objectives rather than a rate card.' },
  { title: 'Introductions before you land', body: 'We arrange the meetings with the decision-makers you name, ahead of the event.' },
  { title: 'Proof after the room', body: 'Photography, video, PR and social coverage of your presence, as Singapore partners received.' },
];

export function PartnershipCall() {
  return (
    <Section bordered id="book-a-call">
      <Container>
        <SectionHeader
          eyebrow="Partnerships"
          title="Book a partnership call."
          lede={`${booking.partnership.minutes} minutes with the partnerships team. No price list, no deck to wade through: a conversation about what your company should own.`}
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <BookingEmbed url={booking.partnership.url} minutes={booking.partnership.minutes} title={`A ${booking.partnership.minutes}-minute partnership call`} />
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
              Prefer email?{' '}
              <a href={`mailto:${contacts.partnerships}`} className="font-semibold text-gold">
                {contacts.partnerships}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-16">
          <SectionHeader eyebrow="How it works" title="It ends in a call, never a price list." size="md" />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {PROCESS.map((p, i) => (
              <li key={p.title} className="rounded-2xl border border-line bg-ink-card/50 p-6">
                <span className="font-mono text-sm text-gold">0{i + 1}</span>
                <p className="mt-3 text-lg font-semibold">{p.title}</p>
                <p className="mt-2 leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
