import type { Metadata } from 'next';
import { LiveNav } from '@/components/live/LiveNav';
import { NewsletterForm } from '@/components/live/NewsletterForm';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Newsletter: the month in agentic finance',
  description: 'Receive the latest insights on AI agents in finance every month: the stories that mattered, our events and the people to know.',
  path: '/live/newsletter',
});

/** Past issues, newest first, once they are sent: { title, date, href }. */
const ISSUES: { title: string; date: string; href: string }[] = [];

export default function LiveNewsletterPage() {
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Live', href: '/live' }, { label: 'Newsletter' }]}
        eyebrow="Live · Newsletter"
        title="Receive the latest insights every month."
        lede="The month in agentic finance: the stories that mattered, what is next at our events, and the people to know. One email a month."
        footer={<LiveNav current="newsletter" />}
      />
      <Section className="!pt-12">
        <Container>
          <div className="edge-gold relative rounded-2xl border border-gold/40 bg-ink-card p-7 sm:p-10">
            <p className="text-lg font-semibold">Subscribe</p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
          {ISSUES.length ? (
            <>
              <SectionHeader eyebrow="Archive" title="Past issues." size="md" className="mt-16" />
              <ul className="mt-8 flex flex-col divide-y divide-line border-y border-line">
                {ISSUES.map((i) => (
                  <li key={i.href} className="flex items-baseline justify-between gap-4 py-4">
                    <a href={i.href} className="font-semibold hover:text-gold">
                      {i.title}
                    </a>
                    <span className="mono-label">{i.date}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
