import type { CategoryView } from '@/components/partners/CategoryExplorer';
import { categories, useCases } from '@/data/partners';
import { topics } from '@/data/program';
import { getSession } from './content';

/** The twelve categories with the topics, Singapore sessions and use cases each links to. */
export function categoryViews(): CategoryView[] {
  return categories.map((c, i) => ({
    ...c,
    number: String(i + 1).padStart(2, '0'),
    topics: topics.filter((t) => t.category === c.id).map((t) => ({ slug: t.slug, name: t.name })),
    sessionList: c.sessions
      .map((id) => getSession(id))
      .filter((s) => s !== undefined)
      .map((s) => ({ id: s.id, title: s.title, format: s.format })),
    useCases: useCases.filter((u) => u.categories[0] === c.id).map((u) => ({ slug: u.slug, partner: u.partner })),
  }));
}
