import type { Metadata } from 'next';
import { PressMentions } from '@/components/media/PressMentions';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { contacts, site } from '@/config/site';
import { getEdition } from '@/data/editions';
import { eventDate, nextEdition2027, upcoming2027 } from '@/data/upcoming-2027';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Press: Agentic Finance in the news',
  description: 'Agentic Finance and More & More in the press: coverage of Singapore 2026, The Odds in Paris and Web2 to Web3 in Abu Dhabi, with key facts and media contacts.',
  path: '/about/press',
});


export default function PressPage() {
  const next = nextEdition2027();
  const nd = eventDate(next);
  const sg = getEdition('singapore-2026')!;
  const facts = [
    ['What', 'Agentic Finance: an invitation-only summit series for the leaders shaping AI-native finance.'],
    ['Producer', 'More & More, a curated events and business-development company: 100+ events organised.'],
    ['First edition', `${sg.name}, ${sg.dateLabel}, ${sg.venue?.name}. An official side event of TOKEN2049 Singapore. ${sg.metrics?.map((m) => `${m.value} ${m.label.toLowerCase()}`).join(', ')}.`],
    ['Next edition', `${next.name}, ${nd.long}, during ${next.context}.${next.attendees ? ` Up to ${next.attendees} curated attendees.` : ''}`],
    ['2027', upcoming2027.map((e) => `${e.city} (${eventDate(e).monthYear.split(' ')[0]})`).join(', ')],
  ];

  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Press' }]}
        eyebrow="About · Press"
        title="Agentic Finance in the press."
        lede="Coverage of our events, key facts and the people to talk to. Logo files are on the Brand page."
        actions={
          <>
            <ButtonLink href={`mailto:${contacts.press}?subject=Agentic%20Finance%20media%20enquiry`} icon="mail">
              Email the press team
            </ButtonLink>
            <ButtonLink href="/about/contact?topic=press" variant="outline">
              Media enquiry form
            </ButtonLink>
          </>
        }
      />

      <Section className="!pt-12" id="in-the-press">
        <Container>
          <SectionHeader
            eyebrow="Press"
            title={
              <>
                Agentic Finance in the <span className="serif-accent">Press</span>
              </>
            }
            lede="Our press releases and the sites that published them, with a link to each article."
            size="md"
          />
          <PressMentions className="mt-10" />
          <p className="mt-8 font-light text-muted">
            Writing about the series or an edition? Send us the link and we will add it.{' '}
            <a href={`mailto:${contacts.press}`} className="font-semibold text-gold">
              {contacts.press}
            </a>
          </p>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <SectionHeader eyebrow="Fact sheet" title="Key facts." size="md" />
            <dl className="flex flex-col border-t border-line">
              {facts.map(([k, v]) => (
                <div key={k} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
                  <dt className="mono-label pt-0.5">{k}</dt>
                  <dd className="leading-relaxed text-paper/90">{v}</dd>
                </div>
              ))}
              <div className="grid gap-2 border-b border-line py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6">
                <dt className="mono-label pt-0.5">Media contact</dt>
                <dd>
                  <a href={`mailto:${contacts.press}`} className="font-semibold text-gold">
                    {contacts.press}
                  </a>
                  <span className="text-muted"> · {site.producer}</span>
                </dd>
              </div>
            </dl>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
