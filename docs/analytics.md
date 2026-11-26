# Analytics

Google Tag Manager container `GTM-K3H2734X` holds the Google tag for GA4 property stream `G-D230PZDQTX` (agentic-finance.live). The site loads it in `src/components/analytics/GoogleTag.tsx`. Analytics is on for every visitor, with no consent step, for the most complete measurement (decided 26 Nov 2026, regardless of EU consent rules); advertising storage stays off. The cookie bar is a notice with one button, Accept, which only closes it.

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

- Custom dimensions (event scope), created 26 Nov 2026: `Edition` from `edition`, `Audience` from `audience` (Admin > Data display > Custom definitions).
- Key events: the five events above. GA4 has no way to add a key event by name in advance: once an event has arrived (it shows under Admin > Data display > Events > Recent events within 24 hours), select the star next to it.
- Search Console: not linked yet. Link it under Admin > Product links > Search Console links (property https://agentic-finance.live/).

## PR traffic

GA4's primary channel group is **Channels with PR** (Admin > Data display > Channel groups, set 26 Nov 2026): the default channels plus a **PR** channel, placed above Referral. A session is PR when:

- its campaign medium is `pr` (a tagged link, below), or
- its source partially matches `chainwire|businessinsider|benzinga|financepolice|gurufocus|cryptoevents|tradingview|thedefiant|coinmarketcap`, or
- its source partially matches `blockchainmagazine|blockchainreporter|coinlive|yellow\.com|theblockopedia|cryptofrontnews|cryptonewsfocus`.

When a release is picked up by an outlet not in those lists, add it (edit the PR channel; up to 10 conditions). In reports: Reports > Acquisition > Traffic acquisition, row PR. For the outlet behind each visit, use the Page referrer dimension in Explore.

**Links in new releases.** Link to the page itself (for Hong Kong, `/events/2027/hong-kong/`, not an old address) and tag it, so every pickup counts as PR even where the outlet hides the referrer:

`https://agentic-finance.live/events/2027/hong-kong/?utm_source=chainwire&utm_medium=pr&utm_campaign=<release>`

with `<release>` a short name such as `hk27-announcement`. Releases sent before 26 Nov 2026 have no tags; today's Singapore release links to `/events/2027/hong-kong/` and the old `/upcoming/2027/afhk/`, and both are counted by the outlet rules above.

**Old addresses.** Forwarding pages (scripts/write-redirects.mjs) redirect with a script, which would make the forwarding page the referrer and the visit "direct". When the visitor came from another site and the link has no campaign tags, the forwarding page adds `utm_source=<that site>&utm_medium=referral`, so the PR rules above still apply.

**Consent.** Every visitor is measured, so PR visits are counted whether or not the visitor clicks Accept.

A new event name needs no GA4 setup to be collected. Star it as a key event if it counts as a lead, add a custom dimension for any new parameter, and list it here.
