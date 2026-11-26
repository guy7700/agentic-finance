'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const KEY = 'af-consent';

/** A small analytics-consent bar. Accept grants analytics storage; Decline keeps it denied. */
export function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let v: string | null = null;
    try {
      v = localStorage.getItem(KEY);
    } catch {
      /* storage blocked: ask every visit */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from storage after mount
    if (!v) setShow(true);
  }, []);
  const choose = (granted: boolean) => {
    try {
      localStorage.setItem(KEY, granted ? 'granted' : 'denied');
    } catch {
      /* ignore */
    }
    const w = window as unknown as { gtag?: (...a: unknown[]) => void };
    w.gtag?.('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
    setShow(false);
  };
  if (!show) return null;
  return (
    <div role="dialog" aria-label="Cookies" className="fixed inset-x-3 bottom-3 z-[90] mx-auto flex max-w-2xl flex-col gap-3 rounded-2xl border border-line-strong bg-ink-card/95 p-4 text-sm text-paper/90 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <p>
        We use analytics cookies to understand how the site is used.{' '}
        <Link href="/privacy" className="text-gold underline-offset-4 hover:underline">
          Privacy
        </Link>
      </p>
      <div className="flex shrink-0 gap-2">
        <button type="button" onClick={() => choose(false)} className="min-h-10 rounded-full border border-line-strong px-4 font-semibold hover:border-gold hover:text-gold">
          Decline
        </button>
        <button type="button" onClick={() => choose(true)} className="min-h-10 rounded-full bg-gold px-4 font-semibold text-ink hover:bg-gold-bright">
          Accept
        </button>
      </div>
    </div>
  );
}
