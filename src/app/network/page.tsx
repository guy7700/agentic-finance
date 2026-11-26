import type { Metadata } from 'next';
import { NetworkGraphic } from '@/components/network/NetworkGraphic';
import { NetworkGroups } from '@/components/network/NetworkGroups';
import { LogoMarqueeRows } from '@/components/partners/LogoWall';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ButtonLink } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { networkOverview as o, networkPages } from '@/data/network';
import { organizations } from '@/data/partners';
import { companyHref } from '@/lib/companies';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'The Agentic Finance Network: free to join',
  description: o.lede,
  path: '/network',
});

const benefitIcon: IconName[] = ['handshake', 'chart', 'mail', 'card', 'target', 'door'];

/** /network/: what the Network is, what members get, and "Who are you?" to the five free forms. */
export default function NetworkPage() {
  const logos = organizations.filter((o) => o.logo).map((x) => ({ ...x, href: companyHref(x.id) }));
  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink-deep">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_15%_40%,rgb(209_182_121/0.12),transparent_70%)]" />
        </div>
        <Container className="pb-14 pt-[calc(var(--header-h)+32px)]">
          <Breadcrumbs items={[{ label: 'Network' }]} />
          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-bright">
                <Icon name="check" size={14} />
                Free to join
              </p>
              <h1 className="display mt-6 text-[clamp(2.2rem,1.5rem+2.8vw,4rem)]">
                The Agentic Finance <span className="serif-accent">Network</span>
              </h1>
              <p className="lede mt-5 max-w-xl text-paper/85">{o.lede}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="#who-are-you" size="lg" icon="arrow-down">
                  Join Our Network for Free
                </ButtonLink>
              </div>
              <ul className="mt-8 flex flex-col gap-2 text-sm text-paper/80">
                {o.proof.map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span aria-hidden className="size-1.5 rounded-full bg-gold" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <NetworkGraphic className="mx-auto w-full max-w-[520px]" labels={networkPages.map((p) => p.card.title)} />
          </div>
        </Container>
      </header>

      <Section bordered id="who-are-you" className="!py-16 sm:!py-20">
        <Container>
          <SectionHeader eyebrow="Join for free" title="Who are you?" lede="Five groups, one Network. Choose yours: the form takes a minute." />
          <div className="mt-10">
            <NetworkGroups />
          </div>
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <SectionHeader eyebrow="Membership" title="What every member gets" />
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {o.benefits.map((b, i) => (
              <li key={b.title} className="flex gap-4 rounded-2xl border border-line bg-ink-card/60 p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright">
                  <Icon name={benefitIcon[i % benefitIcon.length]} size={18} />
                </span>
                <span>
                  <span className="block text-lg font-semibold">{b.title}</span>
                  <span className="mt-1.5 block leading-relaxed text-muted">{b.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section bordered className="!py-16">
        <Container>
          <SectionHeader title="At our events" lede="Organisations that took part in our events. Each logo opens its company page." size="md" />
        </Container>
        <Container wide className="mt-10">
          <LogoMarqueeRows items={logos} />
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <SectionHeader title="How it works" />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {o.steps.map((s, i) => (
              <li key={s} className="rounded-2xl border border-line bg-ink-card/50 p-6">
                <span className="font-mono text-sm text-gold">0{i + 1}</span>
                <p className="mt-3 leading-relaxed text-paper/90">{s}</p>
              </li>
            ))}
          </ol>
          <ButtonLink href="#who-are-you" size="lg" className="mt-10" icon="arrow-up">
            Join Our Network for Free
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
