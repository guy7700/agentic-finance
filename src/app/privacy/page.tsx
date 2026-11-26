import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy',
  description: 'Agentic Finance is produced by More & More. Its privacy policy covers this site and its forms.',
  path: '/privacy',
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <PageHero
      size="md"
      crumbs={[{ label: 'Privacy' }]}
      eyebrow="Legal"
      title="Privacy."
      lede="Agentic Finance is produced by More & More. The More & More privacy policy covers this site and its forms."
      actions={<ButtonLink href="https://mnm.live/privacy">Read the privacy policy</ButtonLink>}
    />
  );
}
