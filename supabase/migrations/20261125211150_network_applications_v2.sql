-- Network applications v2: duplicate protection, source tracking, delivery log (Sheets, Chat) and CRM read access.
-- Written only by the network-apply edge function (service role). Additive: no existing column or row changes.

alter table public.network_applications
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists last_submitted_at timestamptz not null default now(),
  add column if not exists submission_count integer not null default 1,
  add column if not exists submission_id uuid,
  add column if not exists source text,
  add column if not exists page text,
  add column if not exists utm jsonb not null default '{}'::jsonb,
  add column if not exists ip_hash text;

-- One application per person per audience: a second submission updates the first one.
create unique index if not exists network_applications_audience_email_key
  on public.network_applications (audience, lower(email));
-- The same form submission sent twice (double click, network retry) is saved once.
create unique index if not exists network_applications_submission_id_key
  on public.network_applications (submission_id) where submission_id is not null;
-- Rate limit lookups.
create index if not exists network_applications_ip_recent_idx
  on public.network_applications (ip_hash, last_submitted_at desc);

comment on column public.network_applications.submission_count is 'How many times this person sent this form. Repeats update the row instead of adding one.';
comment on column public.network_applications.ip_hash is 'SHA-256 of the sender IP with a salt, for rate limiting only.';

-- Delivery log: every Sheet write and Chat notification, with retries. A failed delivery never loses the application.
create table if not exists public.network_application_deliveries (
  id bigint generated always as identity primary key,
  application_id uuid not null references public.network_applications(id) on delete cascade,
  target text not null check (target in ('sheets', 'chat')),
  event text not null check (event in ('new', 'update', 'venture_partner_brief', 'test_failure')),
  dedupe_key text not null unique,
  status text not null default 'pending' check (status in ('pending', 'delivered', 'failed')),
  attempts integer not null default 0,
  last_error text,
  next_attempt_at timestamptz not null default now(),
  delivered_at timestamptz,
  result jsonb,
  endpoint_override text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists network_application_deliveries_due_idx
  on public.network_application_deliveries (next_attempt_at) where status = 'pending';
create index if not exists network_application_deliveries_app_idx
  on public.network_application_deliveries (application_id);
alter table public.network_application_deliveries enable row level security;
comment on table public.network_application_deliveries is 'Outbox for network-apply: one row per Sheet write or Chat notification. dedupe_key stops a notification being sent twice. A pg_cron job retries pending rows with backoff; after 7 attempts a row is marked failed and keeps last_error.';
comment on column public.network_application_deliveries.endpoint_override is 'Admin-only fault injection for testing retries. Always null for real deliveries.';

-- Nobody but the edge function writes; the signed-in CRM team reads (same model as core.contacts).
revoke all on public.network_applications from anon;
revoke all on public.network_application_deliveries from anon;
revoke insert, update, delete, truncate on public.network_applications from authenticated;
revoke insert, update, delete, truncate on public.network_application_deliveries from authenticated;
grant select on public.network_applications to authenticated;
grant select on public.network_application_deliveries to authenticated;

drop policy if exists crm_read on public.network_applications;
create policy crm_read on public.network_applications for select to authenticated using (true);
drop policy if exists crm_read on public.network_application_deliveries;
create policy crm_read on public.network_application_deliveries for select to authenticated using (true);

-- CRM view, like the other public.v_* views.
create or replace view public.v_network_applications with (security_invoker = true) as
select
  a.id,
  a.created_at,
  a.last_submitted_at,
  a.submission_count,
  a.audience,
  case a.audience
    when 'startup' then 'Startup'
    when 'vc' then 'VC (fund)'
    when 'company' then 'Company'
    when 'institution' then 'Institution'
    else 'Ecosystem'
  end as audience_label,
  a.status,
  a.name,
  a.email,
  a.organisation,
  a.payload ->> 'role' as role,
  a.payload ->> 'website' as website,
  nullif(a.payload ->> 'linkedin', '') as linkedin,
  a.source,
  a.page,
  a.utm,
  a.payload,
  (
    select jsonb_object_agg(d.target, d.status)
    from (
      select distinct on (x.target) x.target, x.status
      from public.network_application_deliveries x
      where x.application_id = a.id and x.event <> 'test_failure'
      order by x.target, x.created_at desc
    ) d
  ) as delivery_status
from public.network_applications a;
revoke all on public.v_network_applications from anon;
grant select on public.v_network_applications to authenticated;
comment on view public.v_network_applications is 'Network applications for the internal CRM: one row per person and audience, newest details, with the latest Sheet and Chat delivery status.';
