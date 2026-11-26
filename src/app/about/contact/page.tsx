import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/forms/ContactForm';
import { socialIcon } from '@/components/layout/SiteFooter';
import { Icon } from '@/components/ui/Icon';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { SmartLink } from '@/components/ui/SmartLink';
import { contacts, primaryActions, social } from '@/config/site';
import { upcoming2027 } from '@/data/upcoming-2027';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact the Agentic Finance team',
  description: 'Send the Agentic Finance team a message, or talk to us about a partnership. Every enquiry reaches a person.',
  path: '/about/contact',
});

/**
 * Contact (Tal's review, 26 Nov 2026): the enquiry form first, the partnership route beside it
 * with Guy's email, then the other contacts and the social icons. No office-location labels.
 */
export default function ContactPage() {
  const editionOptions = upcoming2027.map((e) => ({ slug: e.editionSlug, label: `${e.city} 2027` }));
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Contact' }]}
        eyebrow="Talk to the team"
        title="Contact us."
        lede="Send a message and the right person replies. For partnerships, go straight to the partnerships team."
      />
      <Section className="!pt-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-line bg-ink-card/60 p-6 sm:p-8">
              <p className="eyebrow">General enquiry</p>
              <div className="mt-6">
                <ContactForm editions={editionOptions} />
              </div>
            </div>
            <aside className="flex flex-col gap-4">
              <div className="edge-gold relative rounded-2xl border border-gold/50 bg-gold/[0.06] p-6 sm:p-7">
                <p className="mono-label flex items-center gap-2 text-gold">
                  <Icon name="handshake" size={16} />
                  Partnership enquiry
                </p>
                <p className="mt-3 text-xl font-semibold">Talk to us about partnering.</p>
                <p className="mt-2 text-sm text-muted">Stage, meetings and visibility at our events. Book a call, or email the partnerships team.</p>
                <div className="mt-5 flex flex-col gap-3">
                  <Link href={primaryActions.partner.href} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-xs font-semibold uppercase tracking-[0.18em] text-ink hover:bg-gold-bright">
                    Book a partnership call <Icon name="arrow-right" size={16} />
                  </Link>
                  <a href={`mailto:${contacts.partnerships}`} className="inline-flex items-center gap-2 font-semibold text-gold hover:text-gold-bright">
                    <Icon name="mail" size={16} />
                    {contacts.partnerships}
                  </a>
                </div>
              </div>
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
                    <span className="block text-sm text-muted">Speakers</span>
                    <Link href="/speakers/nominate" className="font-semibold text-gold">
                      Nominate a speaker
                    </Link>
                  </li>
                  <li>
                    <span className="block text-sm text-muted">Attending</span>
                    <Link href={primaryActions.invitation.href} className="font-semibold text-gold">
                      Apply to attend the next event
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-line p-6">
                <p className="mono-label">Follow More &amp; More</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {social.map((s) => (
                    <li key={s.href}>
                      <SmartLink
                        href={s.href}
                        aria-label={s.label}
                        className="flex size-12 items-center justify-center rounded-full border border-line-strong text-paper/85 transition-colors hover:border-gold hover:text-gold"
                      >
                        <Icon name={socialIcon[s.short] ?? 'globe'} size={18} />
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
