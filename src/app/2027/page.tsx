import type { Metadata } from 'next';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { Questionnaire } from '@/components/questionnaire/Questionnaire';
import { QuestionnaireHero } from '@/components/questionnaire/QuestionnaireHero';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Container } from '@/components/ui/Layout';
import { questionnaire2027 } from '@/config/events-2027';
import { pageMetadata } from '@/lib/seo';

// Campaign page reached from personal links: kept out of search and the sitemap.
export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Where will you be in 2027?',
    description: 'Tell us where you will be in 2027 and who you want to meet. We set up the meetings before you land.',
    path: '/2027',
  }),
  robots: { index: false, follow: false },
};

const POINTS: { icon: IconName; text: string }[] = [
  { icon: 'spark', text: 'Two minutes, one form.' },
  { icon: 'handshake', text: 'We arrange your meetings in each city.' },
  { icon: 'target', text: questionnaire2027.reward },
];

export default function Questionnaire2027Page() {
  return (
    <>
      <MetaPixel />
      <QuestionnaireHero eyebrow="More & More · 2027">
        <h1 id="q-title" className="display-hero mt-5 text-[length:var(--text-display-lg)]">
          Where will you be in <span className="serif-accent">2027?</span>
        </h1>
        <p className="lede mt-6 max-w-2xl">Tell us where you will be and who you want to meet. We set up the meetings before you land.</p>
        <ul className="mt-8 grid gap-2.5 sm:grid-cols-3 sm:gap-3">
          {POINTS.map((p) => (
            <li
              key={p.text}
              className="flex items-center gap-3 rounded-xl border border-line bg-ink-card/60 px-4 py-3 text-[14.5px] leading-snug text-paper/90 sm:items-start sm:py-4"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright">
                <Icon name={p.icon} size={16} />
              </span>
              <span className="sm:pt-1">{p.text}</span>
            </li>
          ))}
        </ul>
      </QuestionnaireHero>
      <section aria-label="Questionnaire" className="pb-16 pt-8 sm:pb-28 sm:pt-12">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Questionnaire />
          </div>
        </Container>
      </section>
    </>
  );
}
