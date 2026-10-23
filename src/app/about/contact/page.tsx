import type { Metadata } from 'next';
import { ContactForm } from '@/components/forms/ContactForm';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { SmartLink } from '@/components/ui/SmartLink';
import { booking, contacts, social } from '@/config/site';
import { editions } from '@/data/editions';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description: 'Contact the Agentic Finance team about attendance, partnerships, speaking or press.',
  path: '/about/contact',
});

const ROUTES: { title: string; body: string; href: string; label: string; icon: IconName }[] = [
  { title: 'Attend', body: 'Invitation requests for the next edition.', href: '/invitation', label: 'Request an invitation', icon: 'door' },
  { title: 'Partner', body: `A ${booking.partnership.minutes}-minute call with the partnerships team.`, href: '/partners/book-a-call', label: 'Book a call', icon: 'handshake' },
  { title: 'Speak', body: 'Put yourself or someone else forward.', href: '/speakers/nominate', label: 'Nominate a speaker', icon: 'mic' },
  { title: 'Press', body: 'Interviews, imagery and the brand kit.', href: '/media/press', label: 'Press resources', icon: 'spark' },
];

export default function ContactPage() {
  const editionOptions = editions.map((e) => ({ slug: e.slug, label: e.shortName }));
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Contact' }]}
        eyebrow="Talk to the team"
        title="Contact."
        lede="Choose the route that fits, or send a message below. Every enquiry reaches a person."
      />
      <Section className="!pt-12">
        <Container>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ROUTES.map((r) => (
              <li key={r.title}>
                <SmartLink href={r.href} className="group flex h-full flex-col gap-3 rounded-2xl border border-line p-6 hover:border-gold/60">
                  <Icon name={r.icon} size={22} className="text-gold" />
                  <span className="text-xl font-bold">{r.title}</span>
                  <span className="text-sm text-muted">{r.body}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-gold">
                    {r.label}
                    <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <ContactForm editions={editionOptions} />
            <aside className="flex flex-col gap-4">
              <div className="rounded-2xl border border-line p-6">
                <p className="mono-label">Direct</p>
                <ul className="mt-4 flex flex-col gap-4 text-[15px]">
                  <li>
                    <span className="block text-sm text-muted">General and press</span>
                    <a href={`mailto:${contacts.general}`} className="font-semibold text-gold">
                      {contacts.general}
                    </a>
                  </li>
                  <li>
                    <span className="block text-sm text-muted">Partnerships</span>
                    <a href={`mailto:${contacts.partnerships}`} className="font-semibold text-gold">
                      {contacts.partnerships}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-line p-6">
                <p className="mono-label">More &amp; More</p>
                <p className="mt-3 text-[15px] text-paper/90">Tel Aviv · Dubai</p>
                <p className="text-sm text-muted">Sun–Thu, 9am–6pm Gulf Standard Time</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {social.map((s) => (
                    <li key={s.href}>
                      <SmartLink href={s.href} className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
                        {s.short}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
