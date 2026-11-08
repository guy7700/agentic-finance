import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { isExternal } from '@/lib/paths';
import { Icon, type IconName } from './Icon';
import { SmartLink } from './SmartLink';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold uppercase whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] focus-visible:outline-2 focus-visible:outline-offset-3 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  // As on the Abu Dhabi page: one solid gold pill with a soft glow; outlines
  // turn gold on hover.
  primary: 'glow-gold bg-gold text-ink hover:bg-gold-bright hover:shadow-[0_0_40px_rgb(209_182_121/0.5)]',
  outline: 'border border-paper/25 text-paper hover:border-gold hover:bg-gold hover:text-ink',
  ghost: 'text-paper hover:text-gold',
  dark: 'bg-ink-card text-paper border border-line-strong hover:border-gold hover:text-gold',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 text-[11px] tracking-[0.16em]',
  md: 'min-h-11 px-5 text-[11px] tracking-[0.18em]',
  lg: 'min-h-13 px-7 text-xs tracking-[0.2em]',
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName | null;
  className?: string;
  children: ReactNode;
};

export function buttonClasses({ variant = 'primary', size = 'md', className }: Omit<CommonProps, 'children' | 'icon'>) {
  return cn(base, variants[variant], sizes[size], className);
}

function ButtonIcon({ name }: { name: IconName }) {
  const moves = name === 'arrow-right' ? 'group-hover/btn:translate-x-0.5' : name === 'arrow-up-right' ? 'group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5' : '';
  return <Icon name={name} size={16} className={cn('shrink-0 transition-transform duration-300', moves)} />;
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: CommonProps & { href: string; 'aria-label'?: string; file?: boolean; download?: boolean | string }) {
  const resolvedIcon = icon === null ? null : (icon ?? (isExternal(href) ? 'arrow-up-right' : 'arrow-right'));
  return (
    <SmartLink href={href} className={buttonClasses({ variant, size, className })} {...rest}>
      <span>{children}</span>
      {resolvedIcon ? <ButtonIcon name={resolvedIcon} /> : null}
    </SmartLink>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon = null,
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      <span>{children}</span>
      {icon ? <ButtonIcon name={icon} /> : null}
    </button>
  );
}

/** Inline text link with an arrow, for secondary actions. */
export function TextLink({ href, children, className, icon }: { href: string; children: ReactNode; className?: string; icon?: IconName }) {
  const name = icon ?? (isExternal(href) ? 'arrow-up-right' : 'arrow-right');
  return (
    <SmartLink
      href={href}
      className={cn(
        'group/tl inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-bright',
        className,
      )}
    >
      <span className="link-underline">{children}</span>
      <Icon name={name} size={16} className="transition-transform duration-300 group-hover/tl:translate-x-0.5" />
    </SmartLink>
  );
}
