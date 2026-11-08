'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

/**
 * Meta (Facebook) pixel for the 2027 questionnaire pages only (/2027 and
 * /2027/thanks); it is not loaded anywhere else on the site. Nothing loads
 * unless NEXT_PUBLIC_META_PIXEL_ID is set at build time.
 *
 * The site has no cookie-consent banner, which is why the pixel stays isolated
 * to these two pages.
 */
const PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '').trim();
const FBEVENTS_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: Fbq;
  loaded: boolean;
  version: string;
  disablePushState?: boolean;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let initialised = false;
let lastPageView: string | null = null;

/** The standard pixel stub: queues calls until fbevents.js arrives. */
function fbq(): Fbq | null {
  if (!PIXEL_ID || typeof window === 'undefined') return null;
  if (!window.fbq) {
    const n = ((...args: unknown[]) => {
      if (n.callMethod) n.callMethod(...args);
      else n.queue.push(args);
    }) as Fbq;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    // Page views are sent by hand below; stop the pixel adding its own on
    // client-side navigation, which would count the thank-you page twice.
    n.disablePushState = true;
    window.fbq = n;
    if (!window._fbq) window._fbq = n;
  }
  if (!initialised) {
    window.fbq('init', PIXEL_ID);
    initialised = true;
  }
  return window.fbq;
}

/** Fire after the questionnaire is delivered. No personal data is sent. */
export function trackLead() {
  fbq()?.('track', 'Lead', { content_name: 'Questionnaire 2027' });
}

export function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    // One PageView per page, even when React runs effects twice in development.
    if (!PIXEL_ID || lastPageView === pathname) return;
    lastPageView = pathname;
    fbq()?.('track', 'PageView');
  }, [pathname]);

  if (!PIXEL_ID) return null;
  return (
    <>
      <Script id="meta-pixel" src={FBEVENTS_SRC} strategy="afterInteractive" />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- the pixel's 1x1 no-script fallback, not content */}
        <img height={1} width={1} alt="" style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${encodeURIComponent(PIXEL_ID)}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}
