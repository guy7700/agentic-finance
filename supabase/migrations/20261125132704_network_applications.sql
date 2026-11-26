-- Applied 25 Nov 2026 (before network-apply v3). Recorded here as applied.
create table if not exists public.network_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  audience text not null check (audience in ('startup','vc','company','institution','ecosystem')),
  name text,
  email text,
  organisation text,
  status text not null default 'new',
  payload jsonb not null
);
create index if not exists network_applications_created_idx on public.network_applications (created_at desc);
create index if not exists network_applications_audience_idx on public.network_applications (audience, status);
alter table public.network_applications enable row level security;
comment on table public.network_applications is 'Raw submissions from the /network/* forms on agentic-finance.live. Written only by the network-apply edge function (service role). Review here, then promote to core.accounts / core.contacts.';
