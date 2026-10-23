# QA scripts

Playwright (driving an installed Chrome) plus axe-core. Point `BASE` at any running build.

```bash
npm run qa:mock                      # mock form webhook on :4010 (optional)
BASE=http://localhost:3000 npm run qa:interact   # 82 interaction checks
BASE=http://localhost:3000 npm run qa:overflow   # horizontal overflow at 390px, every route
BASE=http://localhost:3000 npm run qa:links      # internal links + image loading
BASE=http://localhost:3000 npm run qa:a11y       # axe-core WCAG 2.1 AA, every route
```

The form checks need delivery configured. For local runs, start the mock and set
`AF_PARTNER_WEBHOOK_URL=http://localhost:4010/partner` and
`AF_GENERAL_WEBHOOK_URL=http://localhost:4010/general` in `.env.local`. Never point
QA at the production Apps Script URLs. Screenshots and logs go to `qa/output/`.
