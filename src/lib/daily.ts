import fs from 'node:fs';
import path from 'node:path';

/**
 * Daily articles: one JSON file per article in src/content/daily/, written by
 * the Wire's "Add to website" action (format in docs/daily-article.md). Every
 * file is validated at build time; an invalid file fails the build with its
 * name, so nothing half-formed reaches the site.
 */
export type DailyPost = {
  title: string;
  slug: string;
  /** Publication date, YYYY-MM-DD. */
  date: string;
  /** Two to four sentences in our own words. */
  summary: string;
  /** One sentence. */
  whyItMatters: string;
  sourceName: string;
  sourceUrl: string;
  tags: string[];
  draft: boolean;
  /** Only images we own or license. */
  image?: { src: string; alt: string; credit?: string };
};

/** How many posts the home page news block lists. */
export const NEWS_COUNT = 3;
/** Posts older than this leave the home page news block; the blog keeps them. */
export const NEWS_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
export const BLOG_PAGE_SIZE = 12;

const DIR = path.join(process.cwd(), 'src/content/daily');

/** No em or en dashes in copy: spaced dashes become commas, others hyphens. */
const noLongDashes = (s: string) => s.replace(/\s+[—–]\s+/g, ', ').replace(/[—–]/g, '-');

function fail(file: string, msg: string): never {
  throw new Error(`src/content/daily/${file}: ${msg}`);
}

function text(file: string, entry: Record<string, unknown>, key: string, max: number): string {
  const v = entry[key];
  if (typeof v !== 'string' || !v.trim()) fail(file, `"${key}" is required`);
  if (v.length > max) fail(file, `"${key}" is longer than ${max} characters`);
  return noLongDashes(v.trim());
}

function parse(file: string): DailyPost {
  let entry: Record<string, unknown>;
  try {
    entry = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
  } catch (e) {
    fail(file, `not valid JSON (${(e as Error).message})`);
  }
  const slug = text(file, entry, 'slug', 90);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(file, '"slug" must be lowercase words joined by hyphens');
  if (slug === 'page') fail(file, '"page" is reserved for the blog pagination');
  const date = text(file, entry, 'date', 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) fail(file, '"date" must be YYYY-MM-DD');
  const sourceUrl = text(file, entry, 'sourceUrl', 600);
  if (!/^https:\/\/[^\s]+$/.test(sourceUrl)) fail(file, '"sourceUrl" must be an https:// link');
  const tags = entry.tags ?? [];
  if (!Array.isArray(tags) || tags.some((t) => typeof t !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t))) {
    fail(file, '"tags" must be a list of lowercase-hyphenated words');
  }
  if (entry.draft !== undefined && typeof entry.draft !== 'boolean') fail(file, '"draft" must be true or false');
  let image: DailyPost['image'];
  if (entry.image !== undefined) {
    const img = entry.image as Record<string, unknown>;
    if (typeof img?.src !== 'string' || !img.src.startsWith('/images/') || typeof img.alt !== 'string' || !img.alt.trim()) {
      fail(file, '"image" needs a "src" under /images/ and an "alt" text');
    }
    if (!fs.existsSync(path.join(process.cwd(), 'public', img.src))) fail(file, `image ${img.src} is not in public/`);
    image = { src: img.src, alt: noLongDashes(img.alt), credit: typeof img.credit === 'string' ? img.credit : undefined };
  }
  return {
    title: text(file, entry, 'title', 140),
    slug,
    date,
    summary: text(file, entry, 'summary', 900),
    whyItMatters: text(file, entry, 'whyItMatters', 300),
    sourceName: text(file, entry, 'sourceName', 80),
    sourceUrl,
    tags: tags as string[],
    draft: entry.draft === true,
    image,
  };
}

let cache: DailyPost[] | undefined;

/**
 * Published posts, newest first. Drafts and future-dated posts appear in
 * development only; the daily build publishes a post on its date.
 */
export function getPosts(): DailyPost[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.json')) : [];
  const all = files.map(parse);
  const seen = new Set<string>();
  for (const p of all) {
    if (seen.has(p.slug)) throw new Error(`src/content/daily: the slug "${p.slug}" is used twice`);
    seen.add(p.slug);
  }
  const dev = process.env.NODE_ENV !== 'production';
  cache = all
    .filter((p) => dev || (!p.draft && postTime(p) <= Date.now()))
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  return cache;
}

export function getPost(slug: string): DailyPost | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/** Midnight UTC of the post's date, as a timestamp. */
export const postTime = (p: DailyPost) => Date.parse(`${p.date}T00:00:00Z`);

/** The newest posts that are recent enough for the home page, up to NEWS_COUNT. */
export function getLatestNews(): DailyPost[] {
  return getPosts()
    .filter((p) => Date.now() - postTime(p) < NEWS_MAX_AGE_MS)
    .slice(0, NEWS_COUNT);
}

/** Two posts sharing the most tags, then the most recent. */
export function relatedPosts(post: DailyPost, count = 2): DailyPost[] {
  return getPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, shared: p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.shared - a.shared || b.p.date.localeCompare(a.p.date))
    .slice(0, count)
    .map((x) => x.p);
}

export function blogPageCount(): number {
  return Math.max(1, Math.ceil(getPosts().length / BLOG_PAGE_SIZE));
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatPostDate = (p: DailyPost) => dateFormat.format(new Date(postTime(p)));
