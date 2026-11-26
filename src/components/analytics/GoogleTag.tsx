import Script from 'next/script';
import { ConsentBanner } from './ConsentBanner';

/** Google Tag Manager container for agentic-finance.live. GA4 is configured inside the container. */
export const GTM_ID = 'GTM-K3H2734X';

/**
 * Google tag (Tag Manager), with Consent Mode: storage is denied until the visitor accepts in the
 * consent banner (or accepted before), so GA4 only sets cookies with consent.
 */
export function GoogleTag() {
  const init = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var c = null; try { c = localStorage.getItem('af-consent'); } catch (e) {}
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: c === 'granted' ? 'granted' : 'denied',
  wait_for_update: 500
});
gtag('js', new Date());
dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });`;
  return (
    <>
      <Script id="google-tag-init" strategy="afterInteractive">
        {init}
      </Script>
      <Script id="google-tag" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} />
      <ConsentBanner />
    </>
  );
}

/**
 * Sends a named event to GA4 through the Google tag in the Tag Manager container (gtag 'event'
 * command). The events and their key-event status are listed in docs/analytics.md.
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
  if (!w.gtag) {
    w.dataLayer = w.dataLayer || [];
    // gtag commands must be pushed as an arguments object, not an array.
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
  }
  w.gtag('event', event, params);
}
