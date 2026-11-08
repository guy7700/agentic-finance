import { TextLink } from '../ui/Button';
import { LogoWall, type LogoItem } from './LogoWall';

type PartnerLogoStripProps = {
  items: LogoItem[];
  label?: string;
  caption?: string;
  link?: { href: string; label: string } | null;
  className?: string;
};

/**
 * The partner logo strip: a label, an evenly aligned grid of uncropped logos
 * and a caption. Self-contained so it can move to other pages (the Abu Dhabi
 * page) unchanged.
 */
export function PartnerLogoStrip({
  items,
  label = 'Organisations represented on our stages',
  caption = 'Logos show organisations whose executives spoke at our events. They are not all sponsors; verified partners are listed separately.',
  link = { href: '/partners/past-partners', label: 'Partners and organisations by edition' },
  className,
}: PartnerLogoStripProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <p className="mono-label">{label}</p>
        {link ? <TextLink href={link.href}>{link.label}</TextLink> : null}
      </div>
      <LogoWall items={items} className="mt-5" />
      {caption ? <p className="mt-4 text-[13px] text-subtle">{caption}</p> : null}
    </div>
  );
}
