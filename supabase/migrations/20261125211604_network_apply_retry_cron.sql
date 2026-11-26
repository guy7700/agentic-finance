-- Retries for network-apply deliveries (Sheet writes, Chat notifications): every 5 minutes, same pattern as
-- external-events-refresh (Vault secret sent as x-cron-secret).
select vault.create_secret(encode(extensions.gen_random_bytes(32), 'hex'), 'network_cron_secret', 'x-cron-secret for network-apply admin actions (retry job)')
where not exists (select 1 from vault.secrets where name = 'network_cron_secret');

select cron.unschedule('network-apply-retry') where exists (select 1 from cron.job where jobname = 'network-apply-retry');

select cron.schedule(
  'network-apply-retry',
  '*/5 * * * *',
  $job$
  select net.http_post(
    url := 'https://zcfypqptssyldfpeyirh.supabase.co/functions/v1/network-apply',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'network_cron_secret')
    ),
    body := '{"action":"retry"}'::jsonb,
    timeout_milliseconds := 120000
  );
  $job$
);
