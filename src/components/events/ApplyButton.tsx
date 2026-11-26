'use client';

import { track } from '../analytics/GoogleTag';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Upcoming2027 } from '@/data/upcoming-2027';
import { cn } from '@/lib/cn';
import { buttonClasses, ButtonLink, type ButtonSize, type ButtonVariant } from '../ui/Button';
import { Icon } from '../ui/Icon';

type Props = {
  event: Upcoming2027;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: string;
};

/**
 * "Apply to attend" for one event. With the event's own Luma registration it opens Luma's
 * registration in a window on the page (Luma's embed, as on the Abu Dhabi site), which also works
 * after moving between pages, closes with Escape, the close button or a click outside, and offers
 * the Luma page if the embed cannot load. Without JavaScript the link opens the Luma page. Without
 * a Luma event yet, it opens the interest form.
 */
export function ApplyButton({ event, variant = 'primary', size = 'lg', className, children = 'Apply to attend' }: Props) {
  const [open, setOpen] = useState(false);
  if (!event.luma) {
    return (
      <ButtonLink href={`/about/contact?topic=attendance&edition=${event.editionSlug}`} variant={variant} size={size} className={className}>
        {children}
      </ButtonLink>
    );
  }
  const luma = event.luma;
  return (
    <>
      <a
        href={luma.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          track('apply_to_attend', { event_name: event.name });
          setOpen(true);
        }}
        aria-haspopup="dialog"
        className={cn(buttonClasses({ variant, size }), className)}
      >
        <span>{children}</span>
        <Icon name="arrow-right" size={16} className="shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
      </a>
      {open ? <LumaDialog eventName={event.name} eventId={luma.eventId} url={luma.url} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function LumaDialog({ eventName, eventId, url, onClose }: { eventName: string; eventId: string; url: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    // If Luma has not answered in 8 seconds, offer the Luma page itself.
    const t = window.setTimeout(() => setSlow(true), 8000);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      previous?.focus?.();
    };
  }, [close]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Apply to attend ${eventName}`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-deep/80 p-0 backdrop-blur-sm sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-ink-card sm:h-[min(720px,90svh)] sm:max-w-[560px] sm:rounded-2xl sm:border sm:border-line-strong">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
          <p className="text-sm font-semibold">{eventName}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="flex size-10 items-center justify-center rounded-full border border-line-strong text-paper hover:border-gold hover:text-gold"
          >
            <Icon name="close" size={18} />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="relative flex-1 bg-white">
          {!loaded ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink-card p-6 text-center">
              <span aria-hidden className="size-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
              <p className="text-sm text-muted">Opening the registration…</p>
              {slow ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold hover:text-gold-bright">
                  Open it on Luma instead
                </a>
              ) : null}
            </div>
          ) : null}
          <iframe
            src={`https://luma.com/embed/event/${eventId}/simple`}
            title={`Registration for ${eventName} on Luma`}
            onLoad={() => setLoaded(true)}
            className="h-full w-full border-0"
            allow="payment; fullscreen"
          />
        </div>
        <p className="border-t border-line px-5 py-2.5 text-center text-xs text-muted">
          Registration by Luma ·{' '}
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-bright">
            open the Luma page
          </a>
        </p>
      </div>
    </div>,
    document.body,
  );
}
