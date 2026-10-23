'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { NavGroup } from '@/config/site';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';
import { Img } from '../ui/Img';
import { Logo } from './Logo';

export type NavFeature = {
  kicker: string;
  title: string;
  text: string;
  href: string;
  image: { src: string; alt: string; position?: string };
};

type Actions = {
  invitation: { label: string; href: string };
  partner: { label: string; href: string };
};

type HeaderClientProps = {
  navigation: NavGroup[];
  actions: Actions;
  features: Record<string, NavFeature>;
};

function isActiveGroup(group: NavGroup, pathname: string) {
  if (pathname === group.href || pathname.startsWith(`${group.href}/`)) return true;
  return group.items.some((i) => !i.cta && (pathname === i.href || pathname.startsWith(`${i.href}/`)));
}

export function HeaderClient({ navigation, actions, features }: HeaderClientProps) {
  const rawPath = usePathname();
  // The static export uses trailing slashes; compare without them.
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/$/, '') : rawPath;
  const [openId, setOpenId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const uid = useId();

  // Close every menu when the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenId(null);
    setDrawerOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Outside click and Escape for the desktop panels.
  useEffect(() => {
    if (!openId) return;
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenId(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const id = openId;
        setOpenId(null);
        triggerRefs.current[id]?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [openId]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const scheduleOpen = (id: string) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenId(id), openId ? 0 : 90);
  };
  const scheduleClose = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpenId(null), 220);
  };
  const cancelClose = () => window.clearTimeout(hoverTimer.current);

  const focusTrigger = (index: number) => {
    const ids = navigation.map((g) => g.id);
    const next = ids[(index + ids.length) % ids.length];
    triggerRefs.current[next]?.focus();
    if (openId) setOpenId(next);
  };

  const onTriggerKey = (e: ReactKeyboardEvent<HTMLButtonElement>, index: number, id: string) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusTrigger(index + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusTrigger(index - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpenId(id);
      requestAnimationFrame(() => {
        document.getElementById(`${uid}-panel-${id}`)?.querySelector<HTMLElement>(':scope ul a')?.focus();
      });
    }
  };

  const onPanelKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a'));
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    e.preventDefault();
    links[(i + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length]?.focus();
  };

  const solid = scrolled || openId !== null;

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenId(null);
        }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300',
          solid ? 'border-b border-line bg-ink/92 backdrop-blur-xl' : 'border-b border-transparent bg-gradient-to-b from-ink/80 to-ink/0',
        )}
      >
        <div className="mx-auto flex h-[var(--header-h)] w-full max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <Logo onNavigate={() => setOpenId(null)} />

          <nav aria-label="Main" className="hidden h-full xl:block">
            <ul className="flex h-full items-center gap-1">
              {navigation.map((group, index) => {
                const isOpen = openId === group.id;
                const active = isActiveGroup(group, pathname);
                const feature = features[group.id];
                return (
                  <li key={group.id} className="flex h-full items-center">
                    <button
                      ref={(el) => {
                        triggerRefs.current[group.id] = el;
                      }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${uid}-panel-${group.id}`}
                      onClick={() => setOpenId(isOpen ? null : group.id)}
                      onMouseEnter={() => scheduleOpen(group.id)}
                      onKeyDown={(e) => onTriggerKey(e, index, group.id)}
                      className={cn(
                        'relative flex h-11 items-center gap-1.5 rounded-full px-3.5 text-[15px] font-medium transition-colors',
                        isOpen ? 'text-gold' : active ? 'text-paper' : 'text-paper/85 hover:text-gold',
                      )}
                    >
                      {group.label}
                      <Icon
                        name="chevron-down"
                        size={14}
                        className={cn('transition-transform duration-300', isOpen && 'rotate-180')}
                      />
                      {active ? <span aria-hidden className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gold" /> : null}
                    </button>

                    <div
                      id={`${uid}-panel-${group.id}`}
                      hidden={!isOpen}
                      onKeyDown={onPanelKey}
                      className="absolute inset-x-0 top-full border-b border-line bg-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] motion-safe:animate-[af-panel-in_0.28s_var(--ease-out-soft)]"
                    >
                      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[minmax(0,300px)_minmax(0,1fr)_minmax(0,320px)] gap-10 px-10 py-10">
                        <div className="flex flex-col gap-4 border-r border-line pr-10">
                          <span className="font-mono text-[11px] tracking-[0.1em] text-muted">0{index + 1} / 06</span>
                          <Link
                            href={group.href}
                            onClick={() => setOpenId(null)}
                            className="display text-[34px] leading-none transition-colors hover:text-gold"
                          >
                            {group.label}
                          </Link>
                          <p className="text-[15px] leading-relaxed text-muted">{group.job}</p>
                        </div>
                        <ul className="grid grid-cols-2 gap-3 self-start">
                          {group.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setOpenId(null)}
                                aria-current={pathname === item.href ? 'page' : undefined}
                                className={cn(
                                  'group/item flex h-full items-start justify-between gap-4 rounded-xl border p-5 transition-colors',
                                  item.cta
                                    ? 'border-gold/50 bg-gold/[0.07] hover:border-gold hover:bg-gold/[0.12]'
                                    : 'border-line hover:border-line-strong hover:bg-ink-card',
                                )}
                              >
                                <span className="flex flex-col gap-1.5">
                                  <span className={cn('text-[17px] font-bold leading-tight', item.cta ? 'text-gold' : 'text-paper')}>
                                    {item.label}
                                  </span>
                                  <span className="text-[13px] leading-snug text-muted">{item.description}</span>
                                </span>
                                <Icon
                                  name="arrow-right"
                                  size={18}
                                  className={cn(
                                    'mt-0.5 shrink-0 transition-transform duration-300 group-hover/item:translate-x-1',
                                    item.cta ? 'text-gold' : 'text-muted group-hover/item:text-paper',
                                  )}
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {feature ? (
                          <Link
                            href={feature.href}
                            onClick={() => setOpenId(null)}
                            className="group/feat relative isolate flex min-h-[220px] flex-col justify-end overflow-hidden rounded-xl border border-line p-5"
                          >
                            <Img
                              src={feature.image.src}
                              alt=""
                              fill
                              sizes="320px"
                              position={feature.image.position}
                              className="-z-10 object-cover opacity-60 transition-transform duration-700 group-hover/feat:scale-[1.04]"
                            />
                            <span aria-hidden className="scrim-bottom absolute inset-0 -z-10" />
                            <span className="eyebrow">{feature.kicker}</span>
                            <span className="mt-2 text-lg font-bold leading-tight">{feature.title}</span>
                            <span className="mt-1 text-[13px] leading-snug text-muted">{feature.text}</span>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href={actions.invitation.href}
              className="hidden min-h-11 items-center rounded-full border border-paper/90 px-[18px] text-sm font-semibold text-paper transition-colors hover:bg-paper hover:text-ink sm:inline-flex"
            >
              {actions.invitation.label}
            </Link>
            <Link
              href={actions.partner.href}
              className="hidden min-h-11 items-center rounded-full bg-gold px-5 text-sm font-bold text-ink transition-colors hover:bg-gold-bright lg:inline-flex"
            >
              {actions.partner.label}
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              aria-controls={`${uid}-drawer`}
              className="flex size-11 items-center justify-center rounded-full border border-line-strong text-paper transition-colors hover:border-gold hover:text-gold xl:hidden"
            >
              <Icon name="menu" size={20} />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      {drawerOpen ? (
        <MobileDrawer
          id={`${uid}-drawer`}
          navigation={navigation}
          actions={actions}
          pathname={pathname}
          onClose={() => {
            setDrawerOpen(false);
            menuButtonRef.current?.focus();
          }}
        />
      ) : null}
    </>
  );
}

type DrawerProps = {
  id: string;
  navigation: NavGroup[];
  actions: Actions;
  pathname: string;
  onClose: () => void;
};

/**
 * Mobile drawer from the 390px spec: brand and close at the top, six accordion
 * sections with gold +/− indicators, and a pinned action area at the bottom
 * (Partner with us first, then Request an invitation).
 */
function MobileDrawer({ id, navigation, actions, pathname, onClose }: DrawerProps) {
  const initial = navigation.find((g) => isActiveGroup(g, pathname))?.id ?? navigation[0]?.id ?? null;
  const [section, setSection] = useState<string | null>(initial);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const uid = useId();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.scrollLock = 'true';
    closeRef.current?.focus();
    return () => {
      delete root.dataset.scrollLock;
    };
  }, []);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    },
    [onClose],
  );

  return (
    <div className="fixed inset-0 z-[60] xl:hidden">
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-ink-deep/70 backdrop-blur-sm motion-safe:animate-[af-fade-in_0.25s_ease-out]"
      />
      <div
        ref={dialogRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 right-0 flex h-dvh w-full max-w-[440px] flex-col overflow-hidden bg-ink shadow-2xl sm:border-l sm:border-line-strong motion-safe:animate-[af-drawer-in_0.35s_var(--ease-out-soft)]"
      >
        <div className="flex items-center justify-between border-b border-line px-5 pb-3 pt-5">
          <Logo compact onNavigate={onClose} />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full text-paper transition-colors hover:text-gold"
          >
            <Icon name="close" size={20} />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto overscroll-contain px-5 py-2">
          {navigation.map((group) => {
            const open = section === group.id;
            const panelId = `${uid}-m-${group.id}`;
            return (
              <div key={group.id}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setSection(open ? null : group.id)}
                  className="flex min-h-14 w-full items-center justify-between border-b border-line px-1 text-left text-xl font-bold text-paper"
                >
                  {group.label}
                  <span aria-hidden className="w-6 text-center text-[22px] font-normal leading-none text-gold">
                    {open ? '−' : '+'}
                  </span>
                </button>
                <ul id={panelId} hidden={!open} className="flex flex-col py-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={pathname === item.href ? 'page' : undefined}
                        className={cn(
                          'flex min-h-12 items-center justify-between gap-3 px-1 text-base transition-colors',
                          item.cta ? 'font-semibold text-gold' : 'text-paper hover:text-gold',
                        )}
                      >
                        <span>{item.label}</span>
                        <Icon name="arrow-right" size={16} className={item.cta ? 'text-gold' : 'text-subtle'} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="flex flex-col gap-2.5 border-t border-line px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-4">
          <Link
            href={actions.partner.href}
            onClick={onClose}
            className="flex min-h-[52px] items-center justify-center rounded-full bg-gold text-base font-bold text-ink transition-colors hover:bg-gold-bright"
          >
            {actions.partner.label}
          </Link>
          <Link
            href={actions.invitation.href}
            onClick={onClose}
            className="flex min-h-[52px] items-center justify-center rounded-full border border-paper text-base font-semibold text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            {actions.invitation.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
