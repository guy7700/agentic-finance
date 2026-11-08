import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/blog/PostCard';
import { ButtonLink } from '@/components/ui/Button';
import { Img } from '@/components/ui/Img';
import { JsonLd } from '@/components/ui/JsonLd';
import { Container, Section } from '@/components/ui/Layout';
import { PageHero } from '@/components/ui/PageHero';
import { primaryActions, site } from '@/config/site';
import { nextEvent } from '@/data/events';
import { formatPostDate, getPost, getPosts, relatedPosts } from '@/lib/daily';
import { absoluteUrl } from '@/lib/paths';
import { pageMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = getPosts().map((p) => ({ slug: p.slug }));
  // A static export needs at least one path; this one renders a 404 until the first post is published.
  return slugs.length ? slugs : [{ slug: 'first-post' }];
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return pageMetadata({
    title: p.title.length > 58 ? `${p.title.slice(0, 55).trimEnd()}...` : p.title,
    description: p.summary.length > 155 ? `${p.summary.slice(0, 152).trimEnd()}...` : p.summary,
    path: `/blog/${p.slug}`,
    image: p.image?.src,
    imageAlt: p.image?.alt,
    type: 'article',
  });
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const related = relatedPosts(p);

  return (
    <>
      <PageHero
        size="md"
        crumbs={[{ label: 'Blog', href: '/blog' }, { label: p.title }]}
        eyebrow={
          <>
            <time dateTime={p.date}>{formatPostDate(p)}</time> · {p.sourceName}
          </>
        }
        title={p.title}
      />

      <Section className="!pt-14 sm:!pt-16">
        <Container>
          <article className="max-w-3xl">
            {p.image ? (
              <figure className="mb-10">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line">
                  <Img src={p.image.src} alt={p.image.alt} fill sizes="(min-width: 768px) 48rem, 100vw" className="object-cover" />
                </div>
                {p.image.credit ? <figcaption className="mt-2 text-sm text-subtle">{p.image.credit}</figcaption> : null}
              </figure>
            ) : null}
            <p className="text-xl leading-relaxed text-paper/90">{p.summary}</p>
            <h2 className="eyebrow mt-10">Why it matters</h2>
            <p className="mt-3 text-lg leading-relaxed text-paper/90">{p.whyItMatters}</p>
            <p className="mt-10 border-t border-line pt-6 text-[15px] text-muted">
              Source:{' '}
              <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="link-underline font-semibold text-gold hover:text-gold-bright">
                read the original on {p.sourceName}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </article>

          <aside aria-labelledby="next-event" className="mt-16 max-w-3xl rounded-2xl border border-gold/40 bg-ink-raised p-6 sm:p-8">
            <p className="eyebrow">Next event</p>
            <h2 id="next-event" className="mt-3 text-2xl font-semibold">
              {nextEvent.name}
            </h2>
            <p className="mt-2 text-muted">
              {nextEvent.date}, {nextEvent.venue}, {nextEvent.city}. {nextEvent.line}
            </p>
            <div className="mt-6">
              <ButtonLink href={nextEvent.href}>{primaryActions.invitation.label}</ButtonLink>
            </div>
          </aside>
        </Container>
      </Section>

      {related.length ? (
        <Section bordered tone="raised">
          <Container>
            <h2 className="display text-[length:var(--text-display-sm)]">Related posts</h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <PostCard post={r} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.summary,
          datePublished: p.date,
          dateModified: p.date,
          url: absoluteUrl(`/blog/${p.slug}`),
          mainEntityOfPage: absoluteUrl(`/blog/${p.slug}`),
          ...(p.image ? { image: [absoluteUrl(p.image.src)] } : {}),
          keywords: p.tags.join(', '),
          author: { '@type': 'Organization', name: site.name, url: absoluteUrl('/') },
          publisher: { '@id': `${absoluteUrl('/')}#organization` },
          citation: { '@type': 'CreativeWork', name: p.sourceName, url: p.sourceUrl },
        }}
      />
    </>
  );
}
