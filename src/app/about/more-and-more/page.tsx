import type { Metadata } from 'next';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { Img } from '@/components/ui/Img';
import { Container, Eyebrow, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { Stats } from '@/components/ui/Stats';
import { booking, externalLinks } from '@/config/site';
import { producerMetrics, producerServices, producerTimeline } from '@/data/about';
import { getSpeaker } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'More & More',
  description:
    'More & More creates curated side events, executive gatherings, VIP delegations and business-development environments. 100+ events organised, 250+ deals and introductions, $50M+ sponsorship value facilitated.',
  path: '/about/more-and-more',
});

export default function MoreAndMorePage() {
  const tal = getSpeaker('tal-mor');
  return (
    <>
      <PageHero
        crumbs={[{ label: 'About', href: '/about' }, { label: 'More & More' }]}
        eyebrow="The producer"
        title={
          <>
            More &amp; More.
            <br />
            <span className="text-gold">Where deals happen.</span>
          </>
        }
        lede="More & More creates curated side events, executive gatherings, VIP delegations and strategic business-development environments across global technology and institutional markets. The company is built around one idea: the most valuable deals still happen in the room."
        image={{ src: '/images/more-and-more/about-mnm.jpg', alt: '' }}
        actions={
          <>
            <ButtonLink href={externalLinks.moreAndMore}>Visit mnm.live</ButtonLink>
            <ButtonLink href={booking.partnership.url} variant="outline">
              Book a call with the team
            </ButtonLink>
          </>
        }
        footer={<Stats items={producerMetrics} size="md" source="Track record as published by More & More." />}
      />

      <Section>
        <Container>
          <SectionHeader eyebrow="What More & More does" title="Four ways into the room." />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {producerServices.map((s, i) => (
              <li key={s.name} className="flex flex-col gap-3 bg-ink p-7">
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <span className="text-xl font-bold">{s.name}</span>
                <span className="leading-relaxed text-muted">{s.body}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {tal ? (
        <Section bordered tone="raised">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center">
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-line">
                <Img src="/images/more-and-more/tal-mor-founder.jpg" alt="Tal Mor, Founder and CEO of More & More, speaking on stage" fill sizes="(min-width: 1024px) 420px, 100vw" position="50% 25%" className="object-cover" />
              </div>
              <div>
                <Eyebrow>The force behind the vision</Eyebrow>
                <h2 className="display mt-5 text-[length:var(--text-display-sm)]">Tal Mor, Founder and CEO</h2>
                <div className="prose-af mt-6 text-[17px]">
                  <p>{tal.bio}</p>
                  <p>
                    He led Israel’s largest blockchain events, including Blockchain Expert Conference 2025, with more than 1,200 participants,
                    all built around one goal: creating rooms where business gets done.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href="/speakers/tal-mor" variant="outline">Speaker profile</ButtonLink>
                  {tal.links.linkedin ? (
                    <ButtonLink href={tal.links.linkedin} variant="ghost">
                      LinkedIn
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section bordered>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div>
              <SectionHeader eyebrow="Track record" title="From Abu Dhabi to Singapore, and back." size="md" />
              <p className="mt-6 text-muted">
                Recent rooms produced by More &amp; More, leading to Agentic Finance. The full portfolio, including case studies, is on the
                More &amp; More site.
              </p>
              <TextLink href={externalLinks.moreAndMoreCaseStudies} className="mt-5">
                More &amp; More case studies
              </TextLink>
            </div>
            <ol className="border-t border-line">
              {producerTimeline.map((t) => (
                <li key={t.what} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-6">
                  <span className={`font-mono text-[11px] uppercase tracking-[0.08em] ${t.next ? 'text-gold' : 'text-muted'}`}>{t.when}</span>
                  <span>
                    <span className={`block text-lg font-semibold ${t.next ? 'text-gold' : ''}`}>{t.what}</span>
                    <span className="text-sm text-muted">{t.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {[
              { src: '/images/more-and-more/case-the-odds.webp', label: 'The Odds · Paris 2026', note: '200+ vetted attendees. Hosted at Connect Lounge, the Louvre.' },
              { src: '/images/more-and-more/case-web2toweb3.webp', label: 'Web2 to Web3 · Abu Dhabi 2025', note: '150 senior professionals. Co-produced with Hub71.' },
              { src: '/images/more-and-more/case-blockchain-expert.webp', label: 'Blockchain Expert Conference · Israel 2025', note: 'Approximately 1,200 participants.' },
            ].map((c) => (
              <figure key={c.label} className="overflow-hidden rounded-2xl border border-line bg-ink-card/50">
                <div className="relative aspect-[16/10]">
                  <Img src={c.src} alt={c.label} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="p-5">
                  <span className="block font-semibold">{c.label}</span>
                  <span className="mt-1 block text-sm text-muted">{c.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <blockquote className="mx-auto max-w-4xl text-center">
            <p className="display-tight text-[clamp(1.6rem,1.1rem+1.8vw,2.75rem)]">
              “In an era of digital noise, the most valuable deals still happen in person. More &amp; More curates those rooms.”
            </p>
            <footer className="mono-label mt-6">Tal Mor, Founder &amp; CEO</footer>
          </blockquote>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
