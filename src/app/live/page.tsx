import type { Metadata } from 'next';
import Link from 'next/link';
import { PostCard } from '@/components/blog/PostCard';
import { LiveNav } from '@/components/live/LiveNav';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section, SectionHeader } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { getPosts } from '@/lib/daily';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Live: news, X Spaces, webinars and newsletter',
  description: 'Agentic Finance between events: daily news on AI agents in finance, X Spaces, webinars and the newsletter.',
  path: '/live',
});

const PLACEHOLDERS = [
  { label: 'X Spaces', href: '/live/spaces' },
  { label: 'Webinars', href: '/live/webinars' },
  { label: 'Newsletter', href: '/live/newsletter' },
];

/**
 * Live (Tal's site structure, 23 Nov 2026): news, X Spaces, webinars and the
 * newsletter. News is the former blog. The other three have no content yet.
 */
export default function LivePage() {
  const latest = getPosts().slice(0, 3);
  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Live' }]}
        eyebrow="Live"
        title="Live."
        lede="News, X Spaces, webinars and the newsletter."
        footer={<LiveNav current="overview" />}
      />

      <Section className="!pt-12">
        <Container>
          <SectionHeader
            eyebrow="News"
            title="Today in agentic finance."
            action={<ButtonLink href="/live/news" variant="outline">All news</ButtonLink>}
          />
          {latest.length ? (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p) => (
                <li key={p.slug}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="lede mt-8">The first daily post is on its way.</p>
          )}
        </Container>
      </Section>

      <Section bordered tone="raised">
        <Container>
          <ul className="grid gap-4 md:grid-cols-3">
            {PLACEHOLDERS.map((x) => (
              <li key={x.href}>
                <Link
                  href={x.href}
                  className="flex min-h-40 flex-col justify-between rounded-2xl border border-dashed border-line-strong bg-ink-card p-6 transition-colors hover:border-gold"
                >
                  <span className="text-xl font-semibold">{x.label}</span>
                  <span className="mono-label">[TBC]</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
