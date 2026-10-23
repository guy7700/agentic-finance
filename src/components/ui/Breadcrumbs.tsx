import Link from 'next/link';
import { absoluteUrl } from '@/lib/paths';
import { JsonLd } from './JsonLd';

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: 'Agentic Finance', href: '/' }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="mono-label">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                {c.href && !last ? (
                  <Link href={c.href} className="transition-colors hover:text-gold">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={last ? 'page' : undefined} className={last ? 'text-paper/80' : undefined}>
                    {c.label}
                  </span>
                )}
                {!last ? <span aria-hidden className="text-line-strong">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: absoluteUrl(c.href) } : {}),
          })),
        }}
      />
    </>
  );
}
