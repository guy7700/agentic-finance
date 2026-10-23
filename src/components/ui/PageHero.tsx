import type { ReactNode } from 'react';
import type { ImageAsset } from '@/data/types';
import { cn } from '@/lib/cn';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import { Img } from './Img';
import { Container, Eyebrow } from './Layout';

type PageHeroProps = {
  crumbs: Crumb[];
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  image?: ImageAsset;
  /** Optional strip rendered under the hero copy (stats, filters…). */
  footer?: ReactNode;
  size?: 'lg' | 'md';
};

export function PageHero({ crumbs, eyebrow, title, lede, actions, aside, image, footer, size = 'lg' }: PageHeroProps) {
  return (
    <header className={cn('relative isolate overflow-hidden border-b border-line', image ? 'min-h-[min(88vh,820px)]' : '')}>
      {image ? (
        <div className="absolute inset-0 -z-10">
          <Img src={image.src} alt="" fill preload sizes="100vw" position={image.position} className="object-cover opacity-70" />
          <div className="scrim-hero absolute inset-0" />
        </div>
      ) : (
        <div aria-hidden className="hairline-grid absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_70%)]" />
      )}
      <Container className={cn('flex flex-col pb-14 pt-[calc(var(--header-h)+40px)] sm:pb-20', image && 'min-h-[min(88vh,820px)] justify-end')}>
        <Breadcrumbs items={crumbs} />
        <div className={cn('mt-10 grid gap-10', aside ? 'lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end' : '')}>
          <div className="max-w-4xl">
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <h1
              className={cn(
                'display mt-5',
                size === 'lg' ? 'text-[length:var(--text-display-lg)]' : 'text-[length:var(--text-display-md)]',
              )}
            >
              {title}
            </h1>
            {lede ? <p className="lede mt-7 max-w-2xl">{lede}</p> : null}
            {actions ? <div className="mt-9 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {aside ? <div>{aside}</div> : null}
        </div>
        {footer ? <div className="mt-12">{footer}</div> : null}
      </Container>
    </header>
  );
}
