import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Layout';
import { navigation } from '@/config/site';

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="hairline-grid absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <Container className="flex min-h-[80vh] flex-col justify-center pb-20 pt-[calc(var(--header-h)+60px)]">
        <p className="eyebrow">404 · Not on the guest list</p>
        <h1 className="display mt-6 text-[length:var(--text-display-lg)]">This page isn’t in the room.</h1>
        <p className="lede mt-6 max-w-xl">
          The page may have moved when Agentic Finance became a global series. The Singapore archive, speakers and agenda are all still here.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Go to the homepage</ButtonLink>
          <ButtonLink href="/editions/singapore-2026" variant="outline">
            Singapore 2026 archive
          </ButtonLink>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-8">
          {navigation.map((g) => (
            <li key={g.id}>
              <Link href={g.href} className="text-sm font-semibold text-paper/80 hover:text-gold">
                {g.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
