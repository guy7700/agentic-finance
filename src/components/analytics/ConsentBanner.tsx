'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const KEY = 'af-consent';

/**
 * A small cookie notice. Analytics runs for every visitor (see GoogleTag); Accept closes the notice
 * and it does not come back on later visits.
 */
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
  const accept = () => {
    try {
      localStorage.setItem(KEY, 'granted');
    } catch {
      /* ignore */
    }
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
      <button type="button" onClick={accept} className="min-h-10 shrink-0 self-start rounded-full bg-gold px-5 font-semibold text-ink hover:bg-gold-bright sm:self-auto">
        Accept
      </button>
    </div>
  );
}
