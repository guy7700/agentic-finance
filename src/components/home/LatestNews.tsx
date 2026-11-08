import { NEWS_MAX_AGE_MS, getLatestNews, postTime, type DailyPost } from '@/lib/daily';
import { PostCard } from '../blog/PostCard';
import { ButtonLink } from '../ui/Button';
import { Container, SectionHeader } from '../ui/Layout';
import { FreshOnly } from './FreshOnly';

const publishedAt = (p: DailyPost) => new Date(postTime(p)).toISOString();

/**
 * The three newest daily posts, right under the hero. A post leaves the block
 * once it is two weeks old, and the block hides when none is left.
 */
export function LatestNews() {
  const posts = getLatestNews();
  if (!posts.length) return null;
  return (
    <FreshOnly publishedAt={publishedAt(posts[0])} maxAgeMs={NEWS_MAX_AGE_MS}>
      <section aria-labelledby="latest-news" className="border-b border-line bg-ink-deep">
        <Container className="py-14 sm:py-20">
          <SectionHeader
            id="latest-news"
            eyebrow="Agentic finance"
            title={
              <>
                Latest <span className="serif-accent">news</span>
              </>
            }
            size="md"
            action={
              <ButtonLink href="/blog" variant="outline">
                All news
              </ButtonLink>
            }
          />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {posts.map((p) => (
              <FreshOnly key={p.slug} publishedAt={publishedAt(p)} maxAgeMs={NEWS_MAX_AGE_MS}>
                <li>
                  <PostCard post={p} />
                </li>
              </FreshOnly>
            ))}
          </ul>
        </Container>
      </section>
    </FreshOnly>
  );
}
