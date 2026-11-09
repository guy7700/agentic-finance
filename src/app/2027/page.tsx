import type { Metadata } from 'next';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { Questionnaire } from '@/components/questionnaire/Questionnaire';
import { QuestionnaireHero } from '@/components/questionnaire/QuestionnaireHero';
import { Container } from '@/components/ui/Layout';
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

export default function Questionnaire2027Page() {
  return (
    <>
      <MetaPixel />
      <QuestionnaireHero eyebrow="More & More · 2027">
        <h1 id="q-title" className="display-hero mt-5 text-[length:var(--text-display-lg)]">
          Where will you be in <span className="serif-accent">2027?</span>
        </h1>
        <p className="lede mt-6 max-w-2xl">Tell us where you will be and who you want to meet. We set up the meetings before you land.</p>
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
