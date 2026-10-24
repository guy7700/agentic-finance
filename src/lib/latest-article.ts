import fs from 'node:fs';
import path from 'node:path';

export type LatestArticle = {
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  generatedAt: string;
};

/** Older than this, the block is hidden rather than showing stale news. */
export const ARTICLE_MAX_AGE_MS = 3 * 24 * 60 * 60 * 1000;

/**
 * Today's article, written by scripts/latest-article.mjs before the build.
 * Missing, malformed or stale at build time means no block.
 */
export function getLatestArticle(): LatestArticle | null {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'src/data/latest-article.json'), 'utf8');
    const a = JSON.parse(raw) as LatestArticle;
    const age = Date.now() - Date.parse(a.publishedAt);
    if (!a.title || !a.summary || !a.url.startsWith('https://') || !(age < ARTICLE_MAX_AGE_MS)) return null;
    return a;
  } catch {
    return null;
  }
}
