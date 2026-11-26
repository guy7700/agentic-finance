import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container, Section, SectionHeader } from '../ui/Layout';
import { asset } from '@/lib/paths';

const LOGOS = [
  { name: 'Agentic Finance logo, blue (as on the Abu Dhabi page)', file: '/brand/agentic-finance-logo-blue.svg', bg: 'bg-ink' },
  { name: 'Agentic Finance wordmark, gold', file: '/brand/agentic-finance-logo-gold.svg', bg: 'bg-ink' },
  { name: 'Agentic Finance logo', file: '/brand/agentic-finance-logo.svg', bg: 'bg-ink' },
  { name: 'More & More logo, white', file: '/brand/more-and-more-logo-white.svg', bg: 'bg-ink' },
];

/** Official logo files and colours (formerly on the press page). */
export function BrandKit() {
  return (
      <Section bordered tone="raised" id="brand-kit">
        <Container>
          <SectionHeader eyebrow="Brand kit" title="Logo files." lede="Official marks as used on our event sites. Please do not alter, recolour or crop them." size="md" />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {LOGOS.map((l) => (
              <li key={l.file} className="overflow-hidden rounded-2xl border border-line">
                <div className={`relative flex h-48 items-center justify-center p-8 ${l.bg}`}>
                  <span className="relative h-full w-full">
                    <Img src={l.file} alt={l.name} fill sizes="320px" className="object-contain" unoptimized />
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-line bg-ink-card p-4">
                  <span className="text-sm font-semibold">{l.name}</span>
                  <a href={asset(l.file)} download className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-gold-bright">
                    <Icon name="download" size={16} />
                    SVG
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { name: 'Navy', hex: '#0A1428', cls: 'bg-ink border border-line-strong' },
              { name: 'Ivory', hex: '#EDE6D3', cls: 'bg-ivory' },
              { name: 'Gold', hex: '#D1B679', cls: 'bg-gold' },
            ].map((c) => (
              <div key={c.hex} className="flex items-center gap-4 rounded-2xl border border-line p-4">
                <span className={`size-12 shrink-0 rounded-xl ${c.cls}`} />
                <span>
                  <span className="block font-semibold">{c.name}</span>
                  <span className="font-mono text-xs text-muted">{c.hex}</span>
                </span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Typography: Space Grotesk and Cormorant Garamond. For event photography, contact the press team.
          </p>
        </Container>
      </Section>

  );
}
