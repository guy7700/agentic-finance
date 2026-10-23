import Link from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { asset, isExternal } from '@/lib/paths';

type SmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
  /** Treat as a static file (download) rather than a route. */
  file?: boolean;
};

/**
 * Internal routes use next/link (base path aware); external URLs open in a new
 * tab with safe rel attributes; files under /public get the base path prefix.
 */
export function SmartLink({ href, children, file, ...rest }: SmartLinkProps) {
  if (file) {
    return (
      <a href={asset(href)} {...rest}>
        {children}
      </a>
    );
  }
  if (isExternal(href)) {
    const isMail = href.startsWith('mailto:') || href.startsWith('tel:');
    return (
      <a href={href} {...(isMail ? {} : { target: '_blank', rel: 'noopener noreferrer' })} {...rest}>
        {children}
        {isMail ? null : <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
