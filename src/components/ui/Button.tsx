import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { isExternal } from '@/lib/paths';
import { Icon, type IconName } from './Icon';
import { SmartLink } from './SmartLink';

export type ButtonVariant = 'gold' | 'outline' | 'ghost' | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] focus-visible:outline-2 focus-visible:outline-offset-3 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  gold: 'bg-gold text-ink hover:bg-gold-bright shadow-[0_0_0_1px_rgb(212_175_90/0.4)] hover:shadow-[0_8px_32px_-8px_rgb(212_175_90/0.55)]',
  outline: 'border border-paper/90 text-paper hover:bg-paper hover:text-ink',
  ghost: 'text-paper hover:text-gold',
  dark: 'bg-ink text-paper border border-line-strong hover:border-gold hover:text-gold',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 text-[13px]',
  md: 'min-h-12 px-5 text-sm',
  lg: 'min-h-14 px-7 text-[15px]',
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName | null;
  className?: string;
  children: ReactNode;
};

export function buttonClasses({ variant = 'gold', size = 'md', className }: Omit<CommonProps, 'children' | 'icon'>) {
  return cn(base, variants[variant], sizes[size], className);
}

function ButtonIcon({ name }: { name: IconName }) {
  const moves = name === 'arrow-right' ? 'group-hover/btn:translate-x-0.5' : name === 'arrow-up-right' ? 'group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5' : '';
  return <Icon name={name} size={18} className={cn('shrink-0 transition-transform duration-300', moves)} />;
}

export function ButtonLink({
  href,
  variant = 'gold',
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
  variant = 'gold',
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
        'group/tl inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-gold-bright',
        className,
      )}
    >
      <span className="link-underline">{children}</span>
      <Icon name={name} size={16} className="transition-transform duration-300 group-hover/tl:translate-x-0.5" />
    </SmartLink>
  );
}
