# Network applications (/network/*)

Five forms (startups, VCs, companies, institutions, ecosystem) on agentic-finance.live/network/. Copy and fields: `src/data/network.ts`.

**Since 26 Nov 2026 (Tal's review): only name, email and organisation are required.** Every other field (role, website, check size, stage, geography...) is optional and sits behind "Tell us more (optional)". All five groups are free to join; the paid tiers (Venture Partner, partner seats) are no longer part of the form. The edge function in `supabase/functions/network-apply/index.ts` was changed to match and **must be deployed** (Supabase > Edge Functions > network-apply, or `supabase functions deploy network-apply --no-verify-jwt`) before the new site goes live: the version live until then still requires the old fields and would reject the short form with field errors.

## How a submission flows

```
Website form ──POST──▶ Supabase edge function network-apply
                         1. checks the fields (same rules as the form), spam checks, rate limit
                         2. saves to public.network_applications            ← primary record
                         3. replies to the visitor (success only after step 2)
                         4. Sheet: apps-script/network-applications.gs      ← one tab per audience
                         5. Google Chat message                              ← type, organisation, contact, time, links
```

- **Supabase is the primary database** (project mnm-master-data). Steps 4 and 5 are logged in `public.network_application_deliveries`. A failed or not-yet-configured delivery is retried by the cron job `network-apply-retry` every 5 minutes: 1, 5, 15, 60, 180 and 720 minutes apart, then marked `failed` with the error kept. **A notification failure never loses an application.**
- **Duplicates:** one row per person and audience. A repeat updates that row and its Sheet row, without a second Chat message. The same submission sent twice (double click, resend after an error) is saved once.
- **Spam:** hidden field, a minimum fill time, at most 6 submissions per IP in 10 minutes. IPs are stored only as a salted hash.
- **CRM:** the view `public.v_network_applications` (signed-in users, like the other `v_*` views) shows each application with its Sheet and Chat delivery status. To bring one into the CRM, promote it to `core.accounts` / `core.contacts` as usual.
- **Credentials stay server-side:** the Chat webhook and the Sheet token are Supabase secrets. The browser only knows the public function URL.

Source of the function: `supabase/functions/network-apply/index.ts`. Database changes: `supabase/migrations/`.

## Setup: Google Sheet and Chat (once)

Until these secrets exist, applications are saved in Supabase and their Sheet and Chat deliveries wait. They go out automatically within 15 minutes of the secrets being added, so nothing submitted in the meantime is missed.

1. **Sheet.** Create a Google Sheet called "Agentic Finance VC Network" (one tab per form, VCs first). Open Extensions > Apps Script, replace the code with `apps-script/network-applications.gs`, save, and run `setup` once (allow the permissions). It creates the five tabs and logs a token: copy it.
2. **Web app.** Deploy > New deployment > Web app, execute as **Me**, access **Anyone**. Copy the web app URL.
3. **Chat.** Create a Google Chat space called "VC Network Tracker" (same pattern as "Questionnaire 2027 Tracker"; it gets every Network form, not only VCs) and add the team. In it: Apps & integrations > Webhooks > Add, name it "Network applications", copy the webhook URL.
4. **Supabase secrets.** Supabase dashboard > Edge Functions > Secrets (project mnm-master-data), add:

   | Name | Value |
   | --- | --- |
   | `SHEETS_WEBHOOK_URL` | the web app URL from step 2 |
   | `SHEETS_WEBHOOK_TOKEN` | the token from step 1 |
   | `SHEETS_URL` | the Sheet's own link (shown in Chat if a row link is missing) |
   | `CHAT_WEBHOOK_URL` | the webhook URL from step 3 |

   Optional: `CRM_RECORD_URL`, for example `https://your-crm/network/{id}`, to link Chat to a CRM screen instead of the Supabase table editor.

To change the script later, deploy a new **version** of the same deployment (Deploy > Manage deployments > edit > New version), so the URL stays the same.

## Checking it

In the Supabase SQL editor:

```sql
-- Latest applications and where they were delivered
select created_at, audience_label, organisation, name, email, submission_count, delivery_status
from public.v_network_applications order by created_at desc limit 20;

-- Deliveries still waiting or failed, with the error
select id, application_id, target, event, status, attempts, last_error, next_attempt_at
from public.network_application_deliveries where status <> 'delivered' order by id desc;
```

The function's health (which secrets are set, delivery counts), from the SQL editor:

```sql
select net.http_post(
  url := 'https://zcfypqptssyldfpeyirh.supabase.co/functions/v1/network-apply',
  headers := jsonb_build_object('Content-Type', 'application/json',
    'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'network_cron_secret')),
  body := '{"action":"health"}'::jsonb);
-- then: select status_code, content from net._http_response order by id desc limit 1;
```
