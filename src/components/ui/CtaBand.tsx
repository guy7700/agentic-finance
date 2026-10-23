import type { ReactNode } from 'react';
import { primaryActions } from '@/config/site';
import { getCurrentEdition } from '@/data/editions';
import { ButtonLink } from './Button';
import { Img } from './Img';
import { Container, Eyebrow } from './Layout';

type CtaBandProps = {
  eyebrow?: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  image?: { src: string; position?: string };
};

/** Closing conversion band: invitation and partnership, always both. */
export function CtaBand({ eyebrow, title, body, actions, image }: CtaBandProps) {
  const current = getCurrentEdition();
  return (
    <section className="relative isolate overflow-hidden border-t border-line">
      <div className="absolute inset-0 -z-10">
        <Img
          src={image?.src ?? '/images/singapore-2026/networking-floor.webp'}
          alt=""
          fill
          sizes="100vw"
          position={image?.position ?? '45% 40%'}
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/70" />
      </div>
      <Container className="py-24 sm:py-32">
        <div className="max-w-3xl">
          <Eyebrow>{eyebrow ?? `${current.name} · ${current.dateLabel}`}</Eyebrow>
          <h2 className="display mt-6 text-[length:var(--text-display-md)]">
            {title ?? 'The people in the room are the point.'}
          </h2>
          <p className="lede mt-6">{body ?? 'Every guest is selected. Every invitation is personal. Every partner is introduced.'}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            {actions ?? (
              <>
                <ButtonLink href={primaryActions.invitation.href} size="lg">
                  {primaryActions.invitation.label}
                </ButtonLink>
                <ButtonLink href={primaryActions.partner.href} variant="outline" size="lg">
                  {primaryActions.partner.label}
                </ButtonLink>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
