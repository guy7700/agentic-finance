# Agentic Finance Abu Dhabi 2026 (not taking place)

Tal cancelled the Abu Dhabi 2026 edition on 26 Nov 2026. Its record stays in
`src/data/editions.ts` (status `cancelled`) and its components stay in the codebase as a design
reference (`UpcomingEdition.tsx`, the partner offer in `events/2026/[city]/partners`).

`GalaPage.tsx` is the former `/events/2026/[city]/gala` route, kept here unrouted. Its
addresses forward to the next event (see `src/data/redirects.mjs`).
