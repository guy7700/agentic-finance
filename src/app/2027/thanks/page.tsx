import type { Metadata } from 'next';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { QuestionnaireHero } from '@/components/questionnaire/QuestionnaireHero';
import { ThanksContent } from '@/components/questionnaire/ThanksContent';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Thanks: where you will be in 2027',
    description: 'Thanks for telling us where you will be in 2027. We will come back with the meetings we can set up in each city.',
    path: '/2027/thanks',
  }),
  robots: { index: false, follow: false },
};

export default function Questionnaire2027ThanksPage() {
  return (
    <>
      <MetaPixel />
      <QuestionnaireHero eyebrow="More & More · 2027" className="pb-16 sm:pb-28">
        <ThanksContent />
      </QuestionnaireHero>
    </>
  );
}
