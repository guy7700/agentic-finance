import Link from 'next/link';
import { contacts, externalLinks, navigation, primaryActions, site, social } from '@/config/site';
import { nextEdition2027 } from '@/data/upcoming-2027';
import { ButtonLink } from '../ui/Button';
import { Icon, type IconName } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container } from '../ui/Layout';
import { SmartLink } from '../ui/SmartLink';
import { Logo } from './Logo';

export const socialIcon: Record<string, IconName> = { LinkedIn: 'linkedin', X: 'x', Instagram: 'instagram', Telegram: 'telegram', Website: 'globe' };

/**
 * The footer, on the revised structure (Tal's review, 26 Nov 2026): Events, Network, Partners,
 * Speakers, Live, Index, About and Contact, with Terms & Conditions linked on its own line, the
 * next event's attendance link, and the social icons.
 */
export function SiteFooter() {
  const next = nextEdition2027();
  return (
    <footer className="border-t border-line bg-ink-deep">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="max-w-sm text-[15px] font-light leading-relaxed text-muted">
              Where the leaders of AI and the financial world meet. Produced by More &amp; More.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={primaryActions.partner.href} size="sm" icon={null}>
                {primaryActions.partner.label}
              </ButtonLink>
              <ButtonLink href={`${next.path}#join`} size="sm" variant="outline" icon={null}>
                Apply to attend {next.city}
              </ButtonLink>
            </div>
            <ul className="flex items-center gap-2" aria-label="Social media">
              {social.map((s) => (
                <li key={s.href}>
                  <SmartLink
                    href={s.href}
                    aria-label={s.label}
                    className="flex size-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon name={socialIcon[s.short] ?? 'globe'} size={16} />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {navigation.map((group) => (
              <div key={group.id}>
                <h2 className="mono-label font-semibold text-gold-bright">
                  <Link href={group.href} className="hover:text-gold-bright">
                    {group.label}
                  </Link>
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.items
                    .filter((item) => group.id !== 'about' || item.href !== '/about/contact')
                    .map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="text-[15px] font-light text-paper/80 transition-colors hover:text-gold">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="mono-label font-semibold text-gold-bright">
                <Link href="/about/contact" className="hover:text-gold-bright">
                  Contact
                </Link>
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5 text-[15px] font-light text-paper/80">
                <li>
                  <Link href="/about/contact" className="hover:text-gold">
                    Contact us
                  </Link>
                </li>
                <li>
                  <a href={`mailto:${contacts.partnerships}`} className="hover:text-gold">
                    {contacts.partnerships}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contacts.general}`} className="hover:text-gold">
                    {contacts.general}
                  </a>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-gold">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-[13px] text-subtle md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <SmartLink href={externalLinks.moreAndMore} className="inline-flex items-center gap-3 opacity-80 transition-opacity hover:opacity-100">
              <span className="mono-label">Produced by</span>
              <Img src="/brand/more-and-more-logo-white.svg" alt="More & More" width={120} height={28} className="h-6 w-auto" />
            </SmartLink>
            <p>© {site.copyrightYear} More &amp; More.</p>
          </div>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link href="/terms" className="hover:text-gold">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-gold">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/photo-credits" className="hover:text-gold">
                Photo credits
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
