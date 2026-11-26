import Link from 'next/link';
import { YouTubeEmbed } from '@/components/media/YouTubeEmbed';
import { QuestionsEditorial } from '@/components/program/QuestionsEditorial';
import { TopicExplorer } from '@/components/program/TopicExplorer';
import { Accordion } from '@/components/ui/Accordion';
import { ButtonLink, TextLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Eyebrow, Section, SectionHeader } from '@/components/ui/Layout';
import { SmartLink } from '@/components/ui/SmartLink';
import { Stats } from '@/components/ui/Stats';
import { booking, externalLinks } from '@/config/site';
import { faqGroups, producerMetrics, producerServices, producerTimeline, seriesBrands } from '@/data/about';
import { categories } from '@/data/partners';
import { audience, formats, strategicQuestions, topics } from '@/data/program';
import { getSession, getSpeaker } from '@/lib/content';

/**
 * The sections of the one About page (Tal's site structure, 23 Nov 2026: who we
 * are, topics, formats, who it's for, team, FAQ). Each section is the content of a
 * page that had its own address until 25 Nov 2026, moved here word for word; its
 * old address forwards to the section's anchor (src/data/redirects.mjs).
 */

/** In-page index, in reading order. */
export const aboutSections = [
  { id: 'who-we-are', label: 'Who we are' },
  { id: 'more-and-more', label: 'More & More' },
  { id: 'event-series', label: 'Event series' },
  { id: 'program', label: 'Program' },
  { id: 'formats', label: 'Formats' },
  { id: 'who-its-for', label: 'Who it’s for' },
  { id: 'team', label: 'Team' },
  { id: 'faq', label: 'FAQ' },
];

export function AboutIndex() {
  return (
    <nav aria-label="On this page">
      <ul className="flex flex-wrap gap-2">
        {aboutSections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Who we are: why we convene this room (formerly the body of /about). */
export function WhoWeAreSection() {
  return (
    <Section bordered tone="raised" id="who-we-are">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Why we convene this room</Eyebrow>
            <h2 className="display mt-5 text-[length:var(--text-display-sm)]">The most valuable deals still happen in the room.</h2>
            <p className="mt-6 leading-relaxed text-muted">
              AI agents are entering trading, payments, custody and capital management faster than the rules, the infrastructure or the
              relationships around them. The people who will decide how that goes rarely sit in the same room. Agentic Finance exists to
              put them there: selectively, with time for the conversations that matter, and with introductions arranged in advance.
            </p>
            <Stats items={producerMetrics} size="md" className="mt-10" source="More & More track record, as published." />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
            <Img src="/images/singapore-2026/opening-keynote.webp" alt="Tal Mor of More & More opening the day on the Singapore stage" fill sizes="(min-width: 1024px) 50vw, 100vw" position="62% 35%" className="object-cover" />
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** The producer (formerly /about/more-and-more; its founder block is under Team). */
export function MoreAndMoreSection() {
  return (
    <>
      <Section bordered id="more-and-more">
        <Container>
          <SectionHeader
            eyebrow="The producer"
            title={
              <>
                More &amp; More.
                <br />
                <span className="text-gold">Where deals happen.</span>
              </>
            }
            lede="More & More creates curated side events, executive gatherings, VIP delegations and strategic business-development environments across global technology and institutional markets. The company is built around one idea: the most valuable deals still happen in the room."
            action={
              <>
                <ButtonLink href={externalLinks.moreAndMore}>Visit mnm.live</ButtonLink>
                <ButtonLink href={booking.partnership.url} variant="outline">
                  Book a call with the team
                </ButtonLink>
              </>
            }
          />
          <h3 className="eyebrow mt-16">What More &amp; More does</h3>
          <p className="display-tight mt-4 text-[clamp(1.6rem,1.2rem+1.2vw,2.25rem)]">Four ways into the room.</p>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {producerServices.map((s, i) => (
              <li key={s.name} className="flex flex-col gap-3 bg-ink p-7">
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <span className="text-xl font-semibold">{s.name}</span>
                <span className="leading-relaxed text-muted">{s.body}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div>
              <SectionHeader eyebrow="Track record" title="From Abu Dhabi to Singapore, and back." size="md" as="h3" />
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
          <blockquote className="mx-auto mt-20 max-w-4xl text-center">
            <p className="display-tight text-[clamp(1.6rem,1.1rem+1.8vw,2.75rem)]">
              “In an era of digital noise, the most valuable deals still happen in person. More &amp; More curates those rooms.”
            </p>
            <footer className="mono-label mt-6">Tal Mor, Founder &amp; CEO</footer>
          </blockquote>
        </Container>
      </Section>
    </>
  );
}

/** The More & More series (formerly /about/event-series). */
export function EventSeriesSection() {
  return (
    <Section bordered id="event-series">
      <Container>
        <SectionHeader
          eyebrow="The More & More ecosystem"
          title="Three brands. Three rooms."
          lede="More & More produces several curated series. They share a standard and a team, not an audience: each has its own programme, guest list and purpose."
        />
        <ol className="mt-12 flex flex-col gap-6">
          {seriesBrands.map((b, i) => (
            <li
              key={b.id}
              className={`grid overflow-hidden rounded-2xl border lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] ${b.id === 'agentic-finance' ? 'border-gold/50' : 'border-line'}`}
            >
              <div className={`relative ${b.youtube ? '' : 'min-h-[280px]'} ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                {b.youtube ? (
                  <YouTubeEmbed
                    id={b.youtube.id}
                    poster={b.image.src}
                    title={b.youtube.title}
                    duration={b.youtube.duration}
                    className="h-full rounded-none border-0 lg:absolute lg:inset-0 lg:aspect-auto"
                  />
                ) : (
                  <Img src={b.image.src} alt={b.image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                )}
                {b.id === 'agentic-finance' ? (
                  <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink">You are here</span>
                ) : null}
              </div>
              <div className="flex flex-col p-7 sm:p-10">
                <p className="eyebrow">{b.focus}</p>
                <h3 className="display-tight mt-4 text-[clamp(1.8rem,1.3rem+1.6vw,2.75rem)]">{b.name}</h3>
                <p className="mt-4 leading-relaxed text-paper/85">{b.summary}</p>
                <div className="mt-6 rounded-xl border border-line bg-ink-card/50 p-4">
                  <p className="mono-label">Relationship to Agentic Finance</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{b.relationship}</p>
                </div>
                <ul className="mt-6 flex flex-col gap-2">
                  {b.facts.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-muted">
                      <Icon name="check" size={16} className="mt-0.5 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                {b.href ? (
                  <div className="mt-auto pt-8">
                    <ButtonLink href={b.href} variant={b.id === 'agentic-finance' ? 'primary' : 'outline'}>
                      {b.linkLabel ?? 'Learn more'}
                    </ButtonLink>
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

/** The programme: the six questions and the 15 topics (formerly /program, /program/questions and /program/topics). */
export function ProgramSection() {
  const questions = strategicQuestions.map((q) => ({ ...q, sessionTitle: q.session ? getSession(q.session)?.title : undefined }));
  const views = topics.map((t) => ({ ...t, categoryName: categories.find((c) => c.id === t.category)?.name ?? t.category }));
  return (
    <>
      <Section bordered tone="raised" id="program">
        <Container>
          <SectionHeader
            eyebrow="Program"
            title="What the room is here to decide."
            lede="Not a survey of AI in finance. A programme built around the commercial and institutional decisions agents now force on banks, funds, exchanges, payment networks and regulators."
          />
          <div id="questions" className="mt-20">
            <SectionHeader
              as="h3"
              eyebrow="The questions shaping finance"
              title="Six questions. No easy answers."
              lede="These are not FAQ entries. Each is a decision someone in the room will have to make, and the reason they are in the room."
            />
            <div className="mt-12">
              <QuestionsEditorial questions={questions} />
            </div>
            <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <p className="mono-label pt-1">Related topics</p>
              <ul className="flex flex-wrap gap-2">
                {Array.from(new Set(strategicQuestions.flatMap((q) => q.topics))).map((slug) => {
                  const t = topics.find((x) => x.slug === slug);
                  return t ? (
                    <li key={slug}>
                      <Link href={`/about#${slug}`} className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
                        {t.name}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
            <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-ink-card/60 p-7 sm:flex-row sm:items-center sm:p-10">
              <p className="display-tight max-w-2xl text-2xl sm:text-3xl">Have an answer worth hearing? Put it on stage.</p>
              <ButtonLink href="/speakers/nominate">Nominate a speaker</ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section bordered id="topics">
        <Container>
          <SectionHeader
            eyebrow="Program · 15 areas"
            title="The topics."
            lede="Each area is framed by the commercial and institutional questions in front of the people who decide them. Every topic maps to a partnership category."
            action={<ButtonLink href="/speakers/nominate" variant="ghost">Nominate a speaker</ButtonLink>}
          />
          <div className="mt-12">
            <TopicExplorer topics={views} />
          </div>
        </Container>
      </Section>
    </>
  );
}

// Named in Tal's brief; photographs to be supplied.
const EXTRAS = ['Receptions', 'Food & beverages', 'Competitions'];

/** How a day works (formerly /program/formats). */
export function FormatsSection() {
  return (
    <Section bordered tone="raised" id="formats">
      <Container>
        <SectionHeader
          eyebrow="Formats"
          title={
            <>
              Event formats and <span className="serif-accent">experience</span>
            </>
          }
          lede="Curated meetings and private meeting rooms come first. Then keynotes, firesides, panels, networking and deal-making."
        />
        <ol className="mt-12 flex flex-col gap-6">
          {formats.map((f, i) => (
            <li key={f.id} className="grid overflow-hidden rounded-2xl border border-line bg-ink-card/50 lg:grid-cols-2">
              <div className={`relative min-h-[280px] lg:min-h-[400px] ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <Img src={f.image.src} alt={f.image.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" position={f.image.position} className="object-cover" />
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-12">
                <span className="font-mono text-sm text-gold">
                  0{i + 1} / 0{formats.length}
                </span>
                <h3 className="display-tight mt-4 text-[clamp(1.8rem,1.3rem+1.6vw,2.75rem)]">{f.name}</h3>
                <p className="mt-4 text-lg font-light text-paper/90">{f.summary}</p>
                <p className="mt-4 font-light leading-relaxed text-muted">{f.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[13px] text-subtle">All photography from Agentic Finance Singapore, 8 October 2026.</p>
        <h3 className="display mt-20 text-[length:var(--text-display-sm)]">
          Also part of the <span className="serif-accent">experience</span>
        </h3>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {EXTRAS.map((name) => (
            <li key={name} className="edge-gold relative flex min-h-48 flex-col justify-end rounded-2xl border border-dashed border-line-strong bg-ink-card p-6">
              <span className="mono-label">Photo [TBC]</span>
              <span className="mt-2 text-xl font-medium">{name}</span>
            </li>
          ))}
        </ul>
        <div className="mt-14 flex flex-wrap gap-3">
          <ButtonLink href="/events/2026/singapore/agenda" variant="outline">See a full run of show</ButtonLink>
          <ButtonLink href="/apply">Apply to attend</ButtonLink>
        </div>
      </Container>
    </Section>
  );
}

const CRITERIA = [
  {
    title: 'Institutional relevance',
    body: 'Your organisation is part of the decisions on the agenda: a bank, fund, exchange, payment network, regulator, or a company building the infrastructure they will run on.',
  },
  {
    title: 'Decision-making seniority',
    body: 'You set or approve strategy, allocate capital, own a product line or shape policy. The room works because everyone in it can say yes to something.',
  },
  {
    title: 'Strategic fit',
    body: 'Your presence makes the room better for everyone else: a perspective, a mandate or a relationship that other guests need.',
  },
  {
    title: 'Manual review',
    body: 'Every request is read by the programme team. There are no tickets, so there is no way around the review.',
  },
];

/** Who gets in (formerly /program/who-gets-in). */
export function WhoItsForSection() {
  return (
    <>
      <Section bordered id="who-its-for">
        <Container>
          <SectionHeader
            eyebrow="Invitation only · Every request reviewed"
            title="The guest list is the product."
            lede="There are no tickets. Every guest is selected, and every invitation is personal. That is what makes the conversations worth having."
            action={
              <>
                <ButtonLink href="/apply">Apply to attend</ButtonLink>
                <ButtonLink href="#faq" variant="outline">Questions about access</ButtonLink>
              </>
            }
          />
          <ol className="mt-12 grid gap-4 md:grid-cols-2">
            {CRITERIA.map((c, i) => (
              <li key={c.title} className="rounded-2xl border border-line bg-ink-card/50 p-7 sm:p-9">
                <span className="font-mono text-sm text-gold">0{i + 1}</span>
                <h3 className="display-tight mt-4 text-3xl">{c.title}</h3>
                <p className="mt-4 leading-relaxed text-muted">{c.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex items-start gap-4 rounded-2xl border border-gold/40 bg-gold/[0.05] p-6 sm:p-8">
            <Icon name="lock" size={24} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="text-lg font-semibold">A request is not an invitation.</p>
              <p className="mt-2 leading-relaxed text-muted">
                Submitting a request does not guarantee admission. Seats are limited and the room is balanced as a whole, so qualified
                requests are sometimes declined. Invitations are personal and cannot be transferred.
              </p>
            </div>
          </div>
        </Container>
      </Section>
      <Section bordered tone="raised">
        <Container>
          <SectionHeader eyebrow="Who we invite" title="Five constituencies." as="h3" />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {audience.map((a, i) => (
              <li key={a.label} className="flex flex-col gap-3 bg-ink-raised p-6">
                <span className="font-mono text-xs text-gold">0{i + 1}</span>
                <span className="text-lg font-semibold leading-snug">{a.label}</span>
                <span className="text-sm leading-relaxed text-muted">{a.detail}</span>
              </li>
            ))}
          </ul>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line p-7">
              <p className="text-lg font-semibold">Want to speak instead?</p>
              <p className="mt-2 text-muted">Speakers are curated separately. Nominate yourself or someone else.</p>
              <ButtonLink href="/speakers/nominate" variant="outline" className="mt-5">
                Nominate a speaker
              </ButtonLink>
            </div>
            <div className="rounded-2xl border border-line p-7">
              <p className="text-lg font-semibold">Representing a company?</p>
              <p className="mt-2 text-muted">Strategic partners receive a seat on stage, introductions and the VIP Gala.</p>
              <ButtonLink href="/partners" variant="outline" className="mt-5">
                Partnership options
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

/** The team: the founder (formerly on /about/more-and-more) and a slot for the rest of the team. */
export function TeamSection() {
  const tal = getSpeaker('tal-mor');
  return (
    <Section bordered id="team">
      <Container>
        <SectionHeader eyebrow="Team" title="The team." />
        {tal ? (
          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-line">
              <Img src="/images/more-and-more/tal-mor-founder.jpg" alt="Tal Mor, Founder and CEO of More & More, speaking on stage" fill sizes="(min-width: 1024px) 420px, 100vw" position="50% 25%" className="object-cover" />
            </div>
            <div>
              <Eyebrow>The force behind the vision</Eyebrow>
              <h3 className="display mt-5 text-[length:var(--text-display-sm)]">Tal Mor, Founder and CEO</h3>
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
        ) : null}
        <div className="mt-12 rounded-2xl border border-dashed border-line-strong bg-ink-card p-6">
          <span className="mono-label">Team profiles [TBC]</span>
        </div>
      </Container>
    </Section>
  );
}

/** Common questions (formerly /about/faq), with its FAQPage structured data. */
export function FaqSection() {
  return (
    <Section bordered tone="raised" id="faq">
      <Container>
        <SectionHeader
          eyebrow="Access, invitations, partnerships"
          title="Common questions."
          lede="If your question is not here, the team is a message away."
          action={<ButtonLink href="/about/contact" variant="outline">Contact the team</ButtonLink>}
        />
        <nav aria-label="FAQ sections" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {faqGroups.map((g) => (
              <li key={g.id}>
                <a href={`#faq-${g.id}`} className="inline-flex min-h-10 items-center rounded-full border border-line-strong px-4 text-sm hover:border-gold hover:text-gold">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-12 flex flex-col gap-16">
          {faqGroups.map((g) => (
            <section key={g.id} id={`faq-${g.id}`} aria-labelledby={`faq-${g.id}-title`} className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-12">
              <h3 id={`faq-${g.id}-title`} className="display-tight text-2xl sm:text-3xl">
                {g.title}
              </h3>
              <Accordion
                items={g.items.map((f, i) => ({
                  id: `${g.id}-${i}`,
                  title: f.q,
                  content: (
                    <div>
                      <p className="leading-relaxed">{f.a}</p>
                      {f.links?.length ? (
                        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                          {f.links.map((l) => (
                            <li key={l.href}>
                              <SmartLink href={l.href} className="text-sm font-semibold text-gold hover:text-gold-bright">
                                {l.label} →
                              </SmartLink>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ),
                }))}
              />
            </section>
          ))}
        </div>
      </Container>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqGroups.flatMap((g) =>
            g.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          ),
        }}
      />
    </Section>
  );
}
