# Analytics

Google Tag Manager container `GTM-K3H2734X` holds the Google tag for GA4 property stream `G-D230PZDQTX` (agentic-finance.live). The site loads it in `src/components/analytics/GoogleTag.tsx`, with Consent Mode: analytics storage is denied until the visitor accepts the cookie bar, so GA4 receives cookieless pings until then.

## Site events

Sent with `track()` from `GoogleTag.tsx` as `gtag('event', …)` commands. The Google tag in the container forwards them to GA4, so no Tag Manager tag is needed for them.

| Event | When | Parameters | Key event |
| --- | --- | --- | --- |
| `apply_to_attend` | "Apply to attend" opens the Luma registration window | `edition` (event name, e.g. Agentic Finance Hong Kong) | Yes |
| `network_signup` | A Network form is sent | `audience` (the Network page's audience) | Yes |
| `partnership_request` | The partnership form on /partners/book-a-call is sent | none | Yes |
| `speaker_nomination` | The speaker nomination form is sent | none | Yes |
| `contact_enquiry` | The contact form is sent | none | Yes |

`apply_to_attend` counts opening the registration, not completing it: the registration itself happens inside Luma's window and is counted in Luma.

## GA4 settings

- Key events: the five events above (Admin > Data display > Key events).
- Custom dimensions (event scope): `edition` and `audience` (Admin > Data display > Custom definitions), so the parameters show in reports.
- Search Console: link it under Admin > Product links > Search Console links (property https://agentic-finance.live/).

A new event name needs no GA4 setup to be collected; mark it as a key event and add a custom dimension for any new parameter, then list it here.
