import Link from 'next/link';
import { navigation } from '@/config/site';
import { cn } from '@/lib/cn';
import { Icon } from './Icon';
import { Container, Section } from './Layout';

/** Index of a navigation group's pages, used on section overview pages. */
export function GroupIndex({ group, exclude }: { group: string; exclude?: string }) {
  const g = navigation.find((x) => x.id === group);
  if (!g) return null;
  return (
    <Section className="!py-14">
      <Container>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {g.items
            .filter((i) => i.href !== exclude)
            .map((item, idx) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex h-full min-h-40 flex-col justify-between rounded-2xl border p-6 transition-colors',
                    item.cta ? 'border-gold/50 bg-gold/[0.06] hover:border-gold' : 'border-line hover:border-line-strong hover:bg-ink-card',
                  )}
                >
                  <span className="font-mono text-xs text-muted">0{idx + 1}</span>
                  <span>
                    <span className={cn('flex items-center justify-between gap-3 text-xl font-bold', item.cta && 'text-gold')}>
                      {item.label}
                      <Icon name="arrow-right" size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="mt-1.5 block text-sm text-muted">{item.description}</span>
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </Container>
    </Section>
  );
}
