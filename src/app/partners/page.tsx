import type { Metadata } from 'next';
import Link from 'next/link';
import { UseCaseCard } from '@/components/partners/UseCaseCard';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { GroupIndex } from '@/components/ui/GroupIndex';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { Container, Eyebrow, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { Stats } from '@/components/ui/Stats';
import { booking } from '@/config/site';
import { getCurrentEdition, getEdition } from '@/data/editions';
import { categories, partnerBenefits, useCases } from '@/data/partners';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Partner with us',
  description:
    'No more than eight strategic partner positions at Agentic Finance Abu Dhabi. Own a category, take a seat on stage, and meet 500 hand-selected decision-makers through introductions arranged in advance.',
  path: '/partners',
});

const PROCESS = [
  { title: 'A 20-minute call', body: 'Tell us what your company wants to lead and who it needs to meet. We tell you honestly whether the room is right.' },
  { title: 'A proposal built around you', body: 'Category, stage, introductions, activation and the Gala, shaped around your objectives rather than a rate card.' },
  { title: 'Introductions before you land', body: 'We arrange the meetings with the decision-makers you name, ahead of the event.' },
  { title: 'Proof after the room', body: 'Photography, video, PR and social coverage of your presence, as Singapore partners received.' },
];

export default function PartnersPage() {
  const current = getCurrentEdition();
  const singapore = getEdition('singapore-2026');
  return (
    <>
      <PageHero
        crumbs={[{ label: 'Partners' }]}
        eyebrow={`Partnerships · ${current.name}`}
        title={
          <>
            Don’t sponsor a conference.
            <br />
            <span className="text-gold">Own the conversation.</span>
          </>
        }
        lede={`No more than ${current.partnerPositions} strategic partner positions in ${current.city}, each built around a seat on stage, introductions arranged before the event and the VIP Gala.`}
        image={{ src: '/images/singapore-2026/agentic-finance-backdrop.webp', alt: '' }}
        actions={
          <>
            <ButtonLink href="/partners/book-a-call" size="lg">
              {booking.partnership.label}
            </ButtonLink>
            <ButtonLink href="/partners/categories" variant="outline" size="lg">
              Find your category
            </ButtonLink>
          </>
        }
      />
      <GroupIndex group="partners" />

      <Section bordered tone="raised">
        <Container>
          <SectionHeader
            eyebrow="What a position includes"
            title={`${current.partnerPositions} strategic partners. No more.`}
            lede="A limited number of positions, so every partner is seen, introduced and remembered."
          />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {partnerBenefits.map((b, i) => (
              <li key={b.title} className="flex flex-col gap-3 bg-ink-raised p-6 sm:p-7">
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <span className="text-xl font-bold">{b.title}</span>
                <span className="text-[15px] leading-relaxed text-muted">{b.body}</span>
              </li>
            ))}
          </ul>
          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
            <div>
              <Eyebrow>Category ownership</Eyebrow>
              <h3 className="display-tight mt-4 text-3xl">Twelve conversations. Room for one company to lead each.</h3>
              <p className="mt-4 text-muted">
                Twelve thematic categories, not twelve available slots. With no more than {current.partnerPositions} positions overall,
                some categories will have a lead partner and some will not.
              </p>
              <TextLink href="/partners/categories" className="mt-5">
                Explore the categories
              </TextLink>
            </div>
            <ul className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/partners/categories?category=${c.id}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm text-paper/85 hover:border-gold hover:text-gold"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section bordered>
        <Container>
          <SectionHeader
            eyebrow="Evidence · Singapore 2026"
            title="What partners actually received."
            lede="Real activations from the first edition, partner by partner. No invented ROI figures; just what happened in the room."
            action={<ButtonLink href="/partners/use-cases" variant="outline">All use cases</ButtonLink>}
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <UseCaseCard useCase={useCases[0]} featured className="lg:col-span-3" />
            {useCases.slice(1).map((u) => (
              <UseCaseCard key={u.slug} useCase={u} />
            ))}
          </div>
          {singapore?.metrics ? <Stats items={singapore.metrics} size="md" className="mt-14" source={`${singapore.name} · ${singapore.dateLabel}`} /> : null}
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader eyebrow="How it works" title="It ends in a call, never a price list." />
              <ol className="mt-10 flex flex-col border-t border-line">
                {PROCESS.map((p, i) => (
                  <li key={p.title} className="grid grid-cols-[48px_minmax(0,1fr)] gap-4 border-b border-line py-6">
                    <span className="font-mono text-sm text-gold">0{i + 1}</span>
                    <span>
                      <span className="block text-lg font-bold">{p.title}</span>
                      <span className="mt-1 block leading-relaxed text-muted">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
                <Img src="/images/singapore-2026/etoro-networking.webp" alt="Guests meeting beside eToro’s stand in Singapore" fill sizes="(min-width: 1024px) 50vw, 100vw" position="50% 35%" className="object-cover" />
              </div>
              <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/[0.05] p-6 sm:p-8">
                <p className="text-xl font-bold">Ready when you are.</p>
                <p className="mt-2 text-muted">Twenty minutes with the partnerships team, or a short form if you prefer to write.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="/partners/book-a-call">Book the call</ButtonLink>
                  <ButtonLink href="/partners/book-a-call#enquiry" variant="outline" icon="arrow-down">
                    Send an enquiry
                  </ButtonLink>
                </div>
                <p className="mt-5 flex items-center gap-2 text-sm text-muted">
                  <Icon name="mail" size={16} />
                  Or email <a href="mailto:partners@mnm.live" className="text-gold">partners@mnm.live</a>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Eight positions. One conversation each."
        body="Talk to the partnerships team about the category your company should own in Abu Dhabi."
        image={{ src: '/images/singapore-2026/etoro-f1-simulator.webp', position: '45% 55%' }}
        actions={
          <>
            <ButtonLink href="/partners/book-a-call" size="lg">
              {booking.partnership.label}
            </ButtonLink>
            <ButtonLink href="/invitation" variant="outline" size="lg">
              Request an invitation
            </ButtonLink>
          </>
        }
      />
    </>
  );
}
