import Link from 'next/link';
import { contacts, externalLinks, navigation, primaryActions, site, social } from '@/config/site';
import { getCurrentEdition } from '@/data/editions';
import { ButtonLink } from '../ui/Button';
import { Icon, type IconName } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Container } from '../ui/Layout';
import { SmartLink } from '../ui/SmartLink';
import { Logo } from './Logo';

const socialIcon: Record<string, IconName> = { LinkedIn: 'linkedin', X: 'x', Instagram: 'instagram', Telegram: 'telegram' };

export function SiteFooter() {
  const current = getCurrentEdition();
  return (
    <footer className="border-t border-line bg-ink-deep">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="max-w-sm text-[15px] leading-relaxed text-muted">
              An invitation-only summit series for the leaders shaping AI-native finance. Produced by More &amp; More.
            </p>
            <div className="flex items-start gap-3 rounded-xl border border-line p-4">
              <span className="mt-1 size-2 shrink-0 animate-pulse rounded-full bg-gold" aria-hidden />
              <div className="text-sm">
                <p className="font-semibold text-paper">Next: {current.name}</p>
                <p className="text-muted">{current.dateLabel} · Summit and VIP Gala</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={primaryActions.invitation.href} size="sm" variant="outline" icon={null}>
                {primaryActions.invitation.label}
              </ButtonLink>
              <ButtonLink href={primaryActions.partner.href} size="sm" icon={null}>
                {primaryActions.partner.label}
              </ButtonLink>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {navigation.map((group) => (
              <div key={group.id}>
                <h2 className="mono-label text-gold">
                  <Link href={group.href} className="hover:text-gold-bright">
                    {group.label}
                  </Link>
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-[15px] text-paper/80 transition-colors hover:text-gold">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 grid gap-8 border-t border-line pt-10 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <SmartLink href={externalLinks.moreAndMore} className="inline-flex items-center gap-3 opacity-80 transition-opacity hover:opacity-100">
              <span className="mono-label">Produced by</span>
              <Img src="/brand/more-and-more-logo-white.svg" alt="More & More" width={120} height={28} className="h-6 w-auto" />
            </SmartLink>
            <a href={`mailto:${contacts.general}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold">
              <Icon name="mail" size={16} />
              {contacts.general}
            </a>
            <a href={`mailto:${contacts.partnerships}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold">
              <Icon name="handshake" size={16} />
              {contacts.partnerships}
            </a>
          </div>
          <ul className="flex items-center gap-2">
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

        <div className="mt-10 flex flex-col gap-3 text-[13px] text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.copyrightYear} More &amp; More. Agentic Finance is produced independently by More &amp; More.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em]">Invitation only · Every request reviewed</p>
        </div>
      </Container>
    </footer>
  );
}
