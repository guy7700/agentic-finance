// network-apply: the server side of the /network/* forms on agentic-finance.live.
//
//   POST (JSON)         the website forms
//   GET (query string)  the shared prototype form, which cannot call fetch; saves, then redirects back with #thanks
//
// Flow: validate → spam checks → save to public.network_applications (the primary record) → reply to the visitor →
// deliver to the Network Sheet (apps-script/network-applications.gs) and Google Chat. Every delivery is logged in
// public.network_application_deliveries; the network-apply-retry cron job retries failures with backoff. The
// application is saved before anything is sent, so a notification failure never loses an application.
//
// Duplicates: one row per person and audience (unique on audience + lower(email)); a repeat updates that row and
// the Sheet, without a second Chat message. The same submission sent twice (submission_id) is saved once.
//
// Edge Function secrets: CHAT_WEBHOOK_URL (Google Chat incoming webhook), SHEETS_WEBHOOK_URL and SHEETS_WEBHOOK_TOKEN
// (the Apps Script web app and its shared token), SHEETS_URL (link to the Sheet, for Chat). Optional:
// CRM_RECORD_URL ("…{id}…") to link Chat to a CRM screen instead of the Supabase table editor.
// Vault: network_cron_secret, sent as x-cron-secret by the cron job; also unlocks {"action":"health"} and
// {"action":"fail_test"} (fault injection for testing retries).
import postgres from "https://deno.land/x/postgresjs@v3.4.5/mod.js";

declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void } | undefined;

const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { prepare: false, max: 3 });
const PROJECT_REF = "zcfypqptssyldfpeyirh";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const REDIRECT_HOSTS = ["claude.ai", "agentic-finance.live", "mnm.live"];
const DEFAULT_REDIRECT = "https://agentic-finance.live/network/";
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const RATE_LIMIT = 6; // submissions per IP per 10 minutes
const MIN_FILL_MS = 1500; // faster than this is a bot
const BACKOFF_MIN = [1, 5, 15, 60, 180, 720]; // minutes before attempts 2..7
const MAX_ATTEMPTS = 7;

// ---------- Form definitions (mirror src/data/network.ts on the site) ----------
// Since 26 Nov 2026 no audience field is required: only name, email and organisation are.

type Kind = "text" | "url" | "select" | "multi" | "yesno" | "flag";
type Field = { key: string; label: string; kind: Kind; required?: boolean; max?: number; options?: string[]; labels?: Record<string, string> };

const CATEGORIES = ["Trading", "Payments", "Compliance and security", "Data and research", "Wallets and infrastructure", "Prediction markets", "Other"];
const CITIES = ["Hong Kong", "Cannes", "Dubai", "Miami", "Paris", "Singapore"];
const REGIONS = ["Asia Pacific", "Middle East", "Europe", "North America", "LatAm", "Africa"];

const AUDIENCES: Record<string, { label: string; org: string; fields: Field[] }> = {
  startup: {
    label: "Startup",
    org: "Company",
    fields: [
      { key: "website", label: "Website", kind: "url" },
      { key: "one_liner", label: "What they build", kind: "text", max: 140 },
      { key: "category", label: "Category", kind: "select", options: CATEGORIES },
      { key: "stage", label: "Stage", kind: "select", options: ["Pre-seed", "Seed", "Series A", "Series B+", "Revenue-generating"] },
      { key: "raising", label: "Currently raising", kind: "yesno" },
      { key: "raising_amount", label: "Raising amount", kind: "text", max: 60 },
      { key: "meet", label: "Wants to meet", kind: "multi", options: ["VCs", "Banks", "Exchanges", "Payment networks", "Customers", "Media"] },
      { key: "linkedin", label: "LinkedIn or X", kind: "url" },
      { key: "competition", label: "Startup Competition", kind: "flag" },
    ],
  },
  vc: {
    label: "VC (fund)",
    org: "Fund",
    fields: [
      { key: "website", label: "Website", kind: "url" },
      { key: "fund_type", label: "Fund type", kind: "select", options: ["VC", "Corporate VC", "Family office", "Angel syndicate", "Crypto fund", "Other"] },
      {
        key: "check_size", label: "Check size", kind: "select",
        options: ["under_250k", "250k_1m", "1m_5m", "5m_plus"],
        labels: { under_250k: "Under $250K", "250k_1m": "$250K to $1M", "1m_5m": "$1M to $5M", "5m_plus": "$5M+" },
      },
      { key: "stage_focus", label: "Stage focus", kind: "multi", options: ["Pre-seed", "Seed", "Series A", "Series B+"] },
      { key: "categories", label: "Categories", kind: "multi", options: CATEGORIES },
      { key: "regions", label: "Regions", kind: "multi", options: ["Asia", "Middle East", "Europe", "North America", "LatAm"] },
      { key: "venture_partner_interest", label: "Venture Partner brief", kind: "flag" },
      { key: "linkedin", label: "LinkedIn", kind: "url" },
    ],
  },
  company: {
    label: "Company",
    org: "Company",
    fields: [
      { key: "website", label: "Website", kind: "url" },
      { key: "seat", label: "Seat of interest", kind: "select", options: ["Founding Partner", "Strategic Partner", "Not sure"] },
      {
        key: "category", label: "Category", kind: "select",
        options: ["Payments", "Banking", "Exchange or brokerage", "Custody and infrastructure", "Security and compliance", "Cloud and AI", "Data", "Prediction markets", "Other"],
      },
      { key: "cities", label: "Cities", kind: "multi", options: CITIES },
      { key: "goals", label: "Main goal", kind: "multi", options: ["Meet buyers and partners", "Meet investors", "Find startups", "Brand visibility", "Recruit"] },
      { key: "timing", label: "Timing", kind: "select", options: ["This quarter", "Next quarter", "Exploring"] },
      { key: "notes", label: "Notes", kind: "text", max: 2000 },
    ],
  },
  institution: {
    label: "Institution",
    org: "Institution",
    fields: [
      {
        key: "institution_type", label: "Institution type", kind: "select",
        options: ["Bank", "Exchange", "Payment network", "Asset manager", "Broker", "Custodian", "Market infrastructure", "Regulator-affiliated", "Other"],
      },
      { key: "region", label: "Region", kind: "select", options: REGIONS },
      { key: "team", label: "Team", kind: "select", options: ["Innovation", "Digital assets", "Payments", "Technology", "Strategy", "Compliance", "Other"] },
      { key: "interests", label: "Main interest", kind: "multi", options: ["Meet startups", "Peer network", "Pilots and partnerships", "Speaking", "Market intelligence"] },
      { key: "cities", label: "Cities", kind: "multi", options: CITIES },
      { key: "long_term_partnership", label: "Long-term partnership", kind: "yesno" },
    ],
  },
  ecosystem: {
    label: "Ecosystem",
    org: "Organisation",
    fields: [
      { key: "website", label: "Website", kind: "url" },
      {
        key: "org_type", label: "Organisation type", kind: "select",
        options: ["Association", "Government or regulator", "Accelerator or lab", "Alliance", "Media", "Event organiser", "University", "Other"],
      },
      { key: "region", label: "Region", kind: "select", options: REGIONS },
      { key: "community_size", label: "Community size", kind: "select", options: ["under 1,000", "1,000 to 10,000", "10,000+"] },
      { key: "wants", label: "Wants", kind: "multi", options: ["Tickets for members", "Host a delegation", "Co-create content", "Showcase startups", "Media access", "Other"] },
      { key: "can_share", label: "Can share with community", kind: "yesno" },
    ],
  },
};

// ---------- Helpers ----------

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}
const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : typeof v === "number" ? String(v) : "");
function normalizeUrl(v: string): string {
  if (!v) return "";
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withScheme);
    if ((u.protocol === "http:" || u.protocol === "https:") && u.hostname.includes(".")) return u.toString();
  } catch { /* invalid */ }
  return "";
}
function safeEqual(a: string, b: string) {
  if (a.length !== b.length || !a) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}
const asList = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => str(x, 100)).filter(Boolean) : typeof v === "string" && v ? v.split("|").map((x) => x.trim()).filter(Boolean) : [];

// ---------- Validation ----------

type Clean = { audience: string; name: string; email: string; organisation: string; role: string; fields: Record<string, unknown> };

function validate(p: Record<string, unknown>): { ok: true; data: Clean } | { ok: false; errors: Record<string, string> } {
  const audience = str(p.audience, 20);
  const spec = AUDIENCES[audience];
  if (!spec) return { ok: false, errors: { audience: "Unknown form." } };
  const errors: Record<string, string> = {};
  const name = str(p.name, 120);
  const email = str(p.email, 200).toLowerCase();
  const organisation = str(p.organisation, 200) || str(p.fund, 200) || str(p.company, 200) || str(p.startup, 200) || str(p.institution, 200);
  const role = str(p.role, 120);
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!emailRe.test(email)) errors.email = "Please enter a valid email.";
  if (organisation.length < 2) errors.organisation = "Please enter the name.";
  // Joining needs only name, email and organisation (Tal, 26 Nov 2026); every other field is optional.

  const fields: Record<string, unknown> = {};
  for (const f of spec.fields) {
    const raw = p[f.key];
    if (f.kind === "text") {
      const v = str(raw, f.max ?? 500);
      if (f.required && v.length < 2) errors[f.key] = "Please fill this in.";
      fields[f.key] = v;
    } else if (f.kind === "url") {
      const v = str(raw, 300);
      const u = normalizeUrl(v);
      if (v && !u) errors[f.key] = "Please enter a valid link.";
      else if (f.required && !u) errors[f.key] = "Please enter a link.";
      fields[f.key] = u;
    } else if (f.kind === "select") {
      const v = str(raw, 100);
      if (v && !f.options!.includes(v)) errors[f.key] = "Please choose an option from the list.";
      else if (f.required && !v) errors[f.key] = "Please choose an option.";
      fields[f.key] = v;
    } else if (f.kind === "multi") {
      const v = Array.from(new Set(asList(raw).filter((x) => f.options!.includes(x))));
      if (f.required && v.length === 0) errors[f.key] = "Pick at least one.";
      fields[f.key] = v;
    } else if (f.kind === "yesno") {
      const v = str(raw, 5);
      fields[f.key] = v === "Yes" || v === "No" ? v : "";
    } else {
      const v = raw === true || str(raw, 5) === "Yes" ? "Yes" : "";
      fields[f.key] = v;
    }
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { audience, name, email, organisation, role, fields } };
}

// ---------- Save ----------

type SaveResult = { ok: true; id: string | null; duplicate: boolean; spam?: boolean } | { ok: false; status: number; error: string; fields?: Record<string, string> };

async function save(p: Record<string, unknown>, req: Request): Promise<SaveResult> {
  // Spam: honeypot fields and impossibly fast submissions get a normal-looking reply and are not saved.
  if (str(p.website_url) || str(p.company_url)) return { ok: true, id: null, duplicate: false, spam: true };
  const elapsed = Number(p.elapsed_ms);
  if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FILL_MS) return { ok: true, id: null, duplicate: false, spam: true };

  const v = validate(p);
  if (!v.ok) return { ok: false, status: 422, error: "invalid", fields: v.errors };
  const d = v.data;

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("cf-connecting-ip") || "";
  const ipHash = ip ? await sha256(`${ip}:${PROJECT_REF}:network`) : null;
  if (ipHash) {
    const [{ n }] = await sql`select count(*)::int as n from public.network_applications
      where ip_hash = ${ipHash} and last_submitted_at > now() - interval '10 minutes'`;
    if (n >= RATE_LIMIT) return { ok: false, status: 429, error: "rate_limited" };
  }

  const submissionId = uuidRe.test(str(p.submission_id, 40)) ? str(p.submission_id, 40) : null;
  const utm: Record<string, string> = {};
  const rawUtm = (p.utm && typeof p.utm === "object" ? p.utm : {}) as Record<string, unknown>;
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref"]) {
    const val = str(rawUtm[k], 200);
    if (val) utm[k] = val;
  }
  const request = str(p.request, 40) === "venture_partner_brief" ? "venture_partner_brief" : "";
  const payload: Record<string, unknown> = {
    audience: d.audience, name: d.name, email: d.email, organisation: d.organisation, role: d.role, ...d.fields,
    ...(request ? { request } : {}),
    submitted_at: new Date().toISOString(),
  };
  const source = str(p.source, 100) || null;
  const page = str(p.page, 300) || null;

  return await sql.begin(async (tx) => {
    if (submissionId) {
      const [replay] = await tx`select id from public.network_applications where submission_id = ${submissionId}`;
      if (replay) return { ok: true, id: replay.id, duplicate: true } as SaveResult;
    }
    let [prev] = await tx`select id, payload from public.network_applications
      where audience = ${d.audience} and lower(email) = ${d.email} for update`;
    if (!prev) {
      const [row] = await tx`insert into public.network_applications
          (audience, name, email, organisation, payload, submission_id, source, page, utm, ip_hash)
        values (${d.audience}, ${d.name}, ${d.email}, ${d.organisation}, ${tx.json(payload)}, ${submissionId}, ${source}, ${page}, ${tx.json(utm)}, ${ipHash})
        on conflict do nothing
        returning id`;
      if (row) {
        await enqueue(tx, row.id, [["sheets", "new", `sheets:new:${row.id}`], ["chat", "new", `chat:new:${row.id}`]]);
        return { ok: true, id: row.id, duplicate: false } as SaveResult;
      }
      // A parallel first submission won the race: treat this one as a repeat.
      [prev] = await tx`select id, payload from public.network_applications
        where audience = ${d.audience} and lower(email) = ${d.email} for update`;
      if (!prev) throw new Error("conflict without a row");
    }
    const before = (prev.payload ?? {}) as Record<string, unknown>;
    if (d.audience === "vc" && before.venture_partner_interest === "Yes" && !payload.venture_partner_interest) payload.venture_partner_interest = "Yes";
    const [row] = await tx`update public.network_applications set
        name = ${d.name}, organisation = ${d.organisation},
        payload = payload || ${tx.json(payload)},
        submission_id = coalesce(${submissionId}, submission_id),
        source = coalesce(${source}, source), page = coalesce(${page}, page),
        utm = utm || ${tx.json(utm)}, ip_hash = coalesce(${ipHash}, ip_hash),
        submission_count = submission_count + 1, last_submitted_at = now(), updated_at = now()
      where id = ${prev.id}
      returning id, submission_count`;
    const jobs: [string, string, string][] = [["sheets", "update", `sheets:update:${row.id}:${row.submission_count}`]];
    const vpNow = payload.venture_partner_interest === "Yes" || request === "venture_partner_brief";
    if (d.audience === "vc" && vpNow && before.venture_partner_interest !== "Yes") {
      jobs.push(["chat", "venture_partner_brief", `chat:venture_partner_brief:${row.id}`]);
    }
    await enqueue(tx, row.id, jobs);
    return { ok: true, id: row.id, duplicate: true } as SaveResult;
  });
}

// deno-lint-ignore no-explicit-any
async function enqueue(tx: any, applicationId: string, jobs: [string, string, string][], override: string | null = null) {
  for (const [target, event, key] of jobs) {
    await tx`insert into public.network_application_deliveries (application_id, target, event, dedupe_key, endpoint_override)
      values (${applicationId}, ${target}, ${event}, ${key}, ${override}) on conflict (dedupe_key) do nothing`;
  }
}

// ---------- Deliveries ----------

let tableOid: number | null = null;
async function crmUrl(id: string) {
  const custom = Deno.env.get("CRM_RECORD_URL");
  if (custom) return custom.replace("{id}", id);
  if (tableOid === null) {
    const [r] = await sql`select 'public.network_applications'::regclass::oid::int as oid`;
    tableOid = r.oid;
  }
  return `https://supabase.com/dashboard/project/${PROJECT_REF}/editor/${tableOid}?schema=public&filter=id%3Aeq%3A${id}`;
}

function display(audience: string, payload: Record<string, unknown>) {
  const spec = AUDIENCES[audience];
  const lines: string[] = [];
  for (const f of spec?.fields ?? []) {
    if (f.key === "website" || f.key === "linkedin") continue;
    const v = payload[f.key];
    const text = Array.isArray(v) ? v.join(", ") : f.labels && typeof v === "string" ? (f.labels[v] ?? v) : str(v, 2000);
    if (!text) continue;
    if (f.kind === "flag") lines.push(f.key === "venture_partner_interest" ? "Venture Partner brief: requested" : `${f.label}: wants to enter`);
    else lines.push(`${f.label}: ${text}`);
  }
  return lines;
}

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }) + " UTC";

// deno-lint-ignore no-explicit-any
async function chatText(app: any, event: string, sheetLink: string | null) {
  const label = AUDIENCES[app.audience]?.label ?? app.audience;
  const p = (app.payload ?? {}) as Record<string, unknown>;
  const who = app.organisation || app.name;
  const head =
    event === "venture_partner_brief"
      ? `*Venture Partner brief requested: ${who}* (${label})`
      : event === "test_failure"
        ? `*Test delivery (retry check): ${who}*`
        : `*New ${label} application: ${who}*`;
  const lines = [head, `Contact: ${app.name}${p.role ? `, ${p.role}` : ""}`, `Email: ${app.email}`];
  if (p.linkedin) lines.push(`${app.audience === "startup" ? "LinkedIn or X" : "LinkedIn"}: ${p.linkedin}`);
  if (p.website) lines.push(`Website: ${p.website}`);
  if (event !== "venture_partner_brief") lines.push(...display(app.audience, p));
  lines.push(`Submitted: ${fmtTime(app.last_submitted_at ?? app.created_at)}`);
  const utm = Object.entries((app.utm ?? {}) as Record<string, string>).map(([k, v]) => `${k}=${v}`).join(" ");
  lines.push(`Source: ${app.source ?? "website"}${utm ? ` · ${utm}` : ""}`);
  if (sheetLink) lines.push(`Sheet: ${sheetLink}`);
  lines.push(`CRM record: ${await crmUrl(app.id)}`);
  return lines.join("\n");
}

// deno-lint-ignore no-explicit-any
async function deliverOne(d: any, app: any): Promise<{ ok: true; result: unknown } | { ok: false; error: string; notConfigured?: boolean }> {
  try {
    if (d.target === "sheets") {
      const url = d.endpoint_override || Deno.env.get("SHEETS_WEBHOOK_URL");
      const token = Deno.env.get("SHEETS_WEBHOOK_TOKEN") ?? "";
      if (!url) return { ok: false, error: "SHEETS_WEBHOOK_URL not configured", notConfigured: true };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          event: d.event,
          application: {
            id: app.id, audience: app.audience, audience_label: AUDIENCES[app.audience]?.label ?? app.audience,
            created_at: app.created_at, last_submitted_at: app.last_submitted_at, submission_count: app.submission_count,
            name: app.name, email: app.email, organisation: app.organisation, source: app.source, page: app.page,
            utm: app.utm, payload: app.payload, crm_url: await crmUrl(app.id),
          },
        }),
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
      });
      const text = await res.text();
      let body: Record<string, unknown> = {};
      try { body = JSON.parse(text); } catch { /* not JSON */ }
      if (!res.ok || body.ok !== true) return { ok: false, error: `sheets HTTP ${res.status}: ${(body.error as string) ?? text.slice(0, 200)}` };
      return { ok: true, result: { row_url: body.row_url ?? null, sheet: body.sheet ?? null } };
    }
    const url = d.endpoint_override || Deno.env.get("CHAT_WEBHOOK_URL");
    if (!url) return { ok: false, error: "CHAT_WEBHOOK_URL not configured", notConfigured: true };
    const [sheetRow] = await sql`select result ->> 'row_url' as row_url from public.network_application_deliveries
      where application_id = ${app.id} and target = 'sheets' and status = 'delivered' and result ->> 'row_url' is not null
      order by delivered_at desc limit 1`;
    const text = await chatText(app, d.event, sheetRow?.row_url ?? Deno.env.get("SHEETS_URL") ?? null);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return { ok: false, error: `chat HTTP ${res.status}: ${(await res.text()).slice(0, 200)}` };
    return { ok: true, result: { chat_status: res.status } };
  } catch (e) {
    return { ok: false, error: String((e as Error)?.message ?? e).slice(0, 300) };
  }
}

/** Claim due deliveries (all, or one application's), send them Sheet first, record the outcome. */
async function processDue(applicationId: string | null = null, limit = 25) {
  const only = applicationId ? sql`and application_id = ${applicationId}` : sql``;
  // A short lease stops the cron job and a live request sending the same delivery twice.
  const claimed = await sql`
    update public.network_application_deliveries d
    set next_attempt_at = now() + interval '3 minutes', updated_at = now()
    where d.id in (
      select id from public.network_application_deliveries
      where status = 'pending' and next_attempt_at <= now() ${only}
      order by id
      for update skip locked
      limit ${limit}
    )
    returning d.*`;
  // deno-lint-ignore no-explicit-any
  claimed.sort((a: any, b: any) => (a.target === b.target ? a.id - b.id : a.target === "sheets" ? -1 : 1));
  const apps = new Map<string, unknown>();
  const outcomes: { id: number; target: string; status: string; error?: string }[] = [];
  for (const d of claimed) {
    if (!apps.has(d.application_id)) {
      const [app] = await sql`select * from public.network_applications where id = ${d.application_id}`;
      apps.set(d.application_id, app);
    }
    const app = apps.get(d.application_id);
    const r = await deliverOne(d, app);
    if (r.ok) {
      await sql`update public.network_application_deliveries set status = 'delivered', attempts = attempts + 1,
        delivered_at = now(), last_error = null, result = ${sql.json(r.result as Record<string, unknown>)}, updated_at = now() where id = ${d.id}`;
      outcomes.push({ id: d.id, target: d.target, status: "delivered" });
    } else if (r.notConfigured) {
      // Not set up yet: keep it waiting without spending an attempt, so it goes out once the secret exists.
      await sql`update public.network_application_deliveries set last_error = ${r.error},
        next_attempt_at = now() + interval '15 minutes', updated_at = now() where id = ${d.id}`;
      outcomes.push({ id: d.id, target: d.target, status: "waiting", error: r.error });
    } else {
      const attempts = d.attempts + 1;
      const failed = attempts >= MAX_ATTEMPTS;
      const wait = BACKOFF_MIN[Math.min(attempts - 1, BACKOFF_MIN.length - 1)];
      await sql`update public.network_application_deliveries set attempts = ${attempts}, last_error = ${r.error},
        status = ${failed ? "failed" : "pending"}, next_attempt_at = now() + ${`${wait} minutes`}::interval, updated_at = now()
        where id = ${d.id}`;
      console.error(`[network-apply] delivery ${d.id} (${d.target}/${d.event}) attempt ${attempts} failed${failed ? " permanently" : ""}: ${r.error}`);
      outcomes.push({ id: d.id, target: d.target, status: failed ? "failed" : "retrying", error: r.error });
    }
  }
  return outcomes;
}

function later(p: Promise<unknown>) {
  const guarded = p.catch((e) => console.error("[network-apply] background delivery error", e));
  if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) EdgeRuntime.waitUntil(guarded);
  return guarded;
}

// ---------- Admin (cron) ----------

async function isAdmin(req: Request) {
  const provided = req.headers.get("x-cron-secret") ?? "";
  if (!provided) return false;
  const [sec] = await sql`select decrypted_secret from vault.decrypted_secrets where name = 'network_cron_secret'`;
  return !!sec && safeEqual(provided, sec.decrypted_secret);
}

async function admin(body: Record<string, unknown>) {
  const action = str(body.action, 20);
  if (action === "retry") {
    const outcomes = [];
    for (let i = 0; i < 4; i++) {
      const batch = await processDue(null, 25);
      outcomes.push(...batch);
      if (batch.length < 25) break;
    }
    return json({ ok: true, processed: outcomes.length, outcomes });
  }
  if (action === "health") {
    const [counts] = await sql`select
      count(*) filter (where status = 'pending')::int as pending,
      count(*) filter (where status = 'failed')::int as failed,
      count(*) filter (where status = 'delivered')::int as delivered
      from public.network_application_deliveries`;
    return json({
      ok: true,
      configured: {
        chat: !!Deno.env.get("CHAT_WEBHOOK_URL"),
        sheets: !!Deno.env.get("SHEETS_WEBHOOK_URL"),
        sheets_token: !!Deno.env.get("SHEETS_WEBHOOK_TOKEN"),
        sheets_url: !!Deno.env.get("SHEETS_URL"),
      },
      deliveries: counts,
    });
  }
  if (action === "fail_test") {
    // Fault injection: a delivery to an address that cannot resolve, to show it is logged and retried.
    const id = str(body.application_id, 40);
    if (!uuidRe.test(id)) return json({ ok: false, error: "application_id" }, 422);
    const key = `chat:test_failure:${id}:${Date.now()}`;
    await enqueue(sql, id, [["chat", "test_failure", key]], "https://network-apply-test.invalid/");
    const outcomes = await processDue(id, 10);
    const [row] = await sql`select id, status, attempts, last_error, next_attempt_at from public.network_application_deliveries where dedupe_key = ${key}`;
    return json({ ok: true, outcomes, delivery: row });
  }
  return json({ ok: false, error: "action" }, 400);
}

// ---------- HTTP ----------

function safeRedirect(r: string | null, hash: string) {
  let target = DEFAULT_REDIRECT;
  try {
    const u = new URL(r || "");
    if (u.protocol === "https:" && REDIRECT_HOSTS.some((h) => u.hostname === h || u.hostname.endsWith("." + h))) {
      u.hash = "";
      target = u.toString();
    }
  } catch { /* use default */ }
  return new Response(null, { status: 302, headers: { Location: target + hash, "Cache-Control": "no-store" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  try {
    if (req.method === "GET") {
      // The shared prototype form (VC): field names as in its query string.
      const q = new URL(req.url).searchParams;
      if (q.get("hp")) return safeRedirect(q.get("r"), "#thanks");
      const p: Record<string, unknown> = {
        audience: q.get("audience") || "vc",
        source: q.get("source") || "artifact",
        page: q.get("r"),
        name: q.get("name"), email: q.get("email"), fund: q.get("fund"), website: q.get("website"),
        role: q.get("role"), fund_type: q.get("fund_type"), check_size: q.get("check_size"),
        stage_focus: q.get("stage"), categories: q.get("categories"), regions: q.get("regions"),
        venture_partner_interest: q.get("vp") === "Yes" ? "Yes" : "",
        linkedin: q.get("linkedin"),
      };
      const res = await save(p, req);
      if (res.ok && res.id) later(processDue(res.id));
      return safeRedirect(q.get("r"), res.ok ? "#thanks" : "#error");
    }

    if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);

    const raw = await req.text();
    if (raw.length > 20000) return json({ ok: false, error: "too_large" }, 413);
    let body: Record<string, unknown>;
    try { body = JSON.parse(raw); } catch { return json({ ok: false, error: "json" }, 400); }

    if (req.headers.get("x-cron-secret") !== null) {
      if (!(await isAdmin(req))) return json({ ok: false, error: "not authorized" }, 401);
      return await admin(body);
    }

    const res = await save(body, req);
    if (!res.ok) return json({ ok: false, error: res.error, fields: res.fields }, res.status);
    if (res.id) later(processDue(res.id));
    return json({ ok: true, id: res.id, duplicate: res.duplicate });
  } catch (e) {
    console.error("[network-apply] error", e);
    return json({ ok: false, error: "server" }, 500);
  }
});
