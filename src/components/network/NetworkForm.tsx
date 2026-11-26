'use client';

import { track } from '../analytics/GoogleTag';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { contacts } from '@/config/site';
import { formWebhooks } from '@/config/forms';
import { QUICK_FIELDS, type NetworkField, type NetworkPage } from '@/data/network';
import { cn } from '@/lib/cn';
import { CheckboxField, Honeypot, SelectField, TextAreaField, TextField } from '../forms/Fields';
import { FormSuccess } from '../forms/FormStatus';
import { Icon } from '../ui/Icon';

/** Sent by the "Request the Venture Partner brief" buttons; the VC form answers with VP_RESULT. */
export const VP_REQUEST = 'network:venture-partner';
export const VP_RESULT = 'network:venture-partner-result';

type Values = Record<string, string | string[]>;
type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success'; duplicate: boolean } | { kind: 'error'; message: string; email?: boolean };

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PRIVACY_URL = 'https://mnm.live/privacy';

function normalizeUrl(v: string) {
  if (!v) return '';
  const withScheme = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withScheme);
    return (u.protocol === 'http:' || u.protocol === 'https:') && u.hostname.includes('.') ? u.toString() : '';
  } catch {
    return '';
  }
}

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });

function utm() {
  const p = new URLSearchParams(window.location.search);
  const o: Record<string, string> = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref']) {
    const v = p.get(k);
    if (v) o[k] = v;
  }
  return o;
}

/** The same rules the server applies (supabase/functions/network-apply), with friendlier messages. */
function validate(fields: NetworkField[], v: Values) {
  const errors: Record<string, string> = {};
  for (const f of fields) {
    const raw = v[f.key];
    const text = typeof raw === 'string' ? raw.trim() : '';
    const label = f.label.toLowerCase();
    if (f.kind === 'email') {
      if (!emailRe.test(text)) errors[f.key] = 'Please enter a valid work email.';
    } else if (f.kind === 'url') {
      if (text && !normalizeUrl(text)) errors[f.key] = 'Please enter a valid link.';
      else if (f.required && !text) errors[f.key] = `Please enter your ${label}.`;
    } else if (f.kind === 'text' || f.kind === 'textarea') {
      if (f.required && text.length < 2) {
        errors[f.key] =
          f.key === 'name' ? 'Please enter your name.' : f.key === 'one_liner' ? 'Please say in one line what you build.' : `Please enter your ${label.replace(/^your /, '')}.`;
      }
    } else if (f.kind === 'select' || f.kind === 'yesno') {
      if (f.required && !text) errors[f.key] = `Please select your ${label.replace(/^your /, '')}.`;
    } else if (f.kind === 'multi') {
      if (f.required && (!Array.isArray(raw) || raw.length === 0)) errors[f.key] = 'Pick at least one.';
    }
  }
  return errors;
}

function payloadFrom(fields: NetworkField[], v: Values) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = v[f.key];
    if (f.kind === 'multi') out[f.key] = Array.isArray(raw) ? raw : [];
    else if (f.kind === 'url') out[f.key] = normalizeUrl(typeof raw === 'string' ? raw.trim() : '');
    else if (f.kind === 'email') out[f.key] = (typeof raw === 'string' ? raw.trim() : '').toLowerCase();
    else out[f.key] = typeof raw === 'string' ? raw.trim() : '';
  }
  return out;
}

function Chips({ field, values, onChange, error }: { field: Extract<NetworkField, { kind: 'multi' }>; values: string[]; onChange: (v: string[]) => void; error?: string }) {
  return (
    <fieldset aria-invalid={error ? true : undefined} data-field={field.key} className="sm:col-span-2">
      <legend className="text-sm font-semibold text-paper">
        {field.label}
        {field.required ? (
          <span className="ml-1 text-gold" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-2 text-xs font-normal text-subtle">(optional, choose any)</span>
        )}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {field.options.map((o) => {
          const on = values.includes(o);
          return (
            <label
              key={o}
              className={cn(
                'inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-[13.5px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold',
                on ? 'border-gold bg-gold/15 text-gold' : 'border-line-strong text-paper/85 hover:border-gold/60',
              )}
            >
              <input
                type="checkbox"
                name={field.key}
                value={o}
                checked={on}
                onChange={() => onChange(on ? values.filter((x) => x !== o) : [...values, o])}
                className="sr-only"
              />
              {on ? <Icon name="check" size={14} /> : null}
              {o}
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="mt-2 flex items-center gap-1.5 text-[13px] text-danger">
          <Icon name="close" size={12} />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/**
 * One Network application form. Posts to network-apply, which saves to Supabase before anything else, so a
 * success message means the application is stored. The same submission id is reused on a retry, so a double
 * click or a resend after an error is saved once.
 */
export function NetworkForm({ page }: { page: NetworkPage }) {
  const { fields } = page.form;
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<number>(0);
  const submissionId = useRef<string>('');
  const lastPayload = useRef<Record<string, unknown> | null>(null);
  const [values, setValues] = useState<Values>(() => Object.fromEntries(fields.map((f) => [f.key, f.kind === 'multi' ? [] : ''])));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const endpoint = formWebhooks.network;

  useEffect(() => {
    startedAt.current = Date.now();
    submissionId.current = newId();
  }, []);

  const set = (key: string, v: string | string[]) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  async function send(body: Record<string, unknown>): Promise<{ ok: true; duplicate: boolean } | { ok: false; status: number; fields?: Record<string, string> }> {
    if (!endpoint) return { ok: false, status: 0 };
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; duplicate?: boolean; fields?: Record<string, string> };
      if (res.ok && data.ok) return { ok: true, duplicate: !!data.duplicate };
      return { ok: false, status: res.status, fields: data.fields };
    } catch {
      return { ok: false, status: -1 };
    }
  }

  // The VC page's "Request the Venture Partner brief" buttons.
  useEffect(() => {
    if (page.audience !== 'vc') return;
    const onRequest = async () => {
      if (!lastPayload.current) {
        set('venture_partner_interest', 'Yes');
        document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.setTimeout(() => formRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true }), 500);
        window.dispatchEvent(new CustomEvent(VP_RESULT, { detail: { state: 'form' } }));
        return;
      }
      if (lastPayload.current.venture_partner_interest === 'Yes') {
        window.dispatchEvent(new CustomEvent(VP_RESULT, { detail: { state: 'already' } }));
        return;
      }
      window.dispatchEvent(new CustomEvent(VP_RESULT, { detail: { state: 'sending' } }));
      const r = await send({ ...lastPayload.current, venture_partner_interest: 'Yes', request: 'venture_partner_brief', submission_id: newId(), elapsed_ms: undefined });
      if (r.ok) lastPayload.current = { ...lastPayload.current, venture_partner_interest: 'Yes' };
      window.dispatchEvent(new CustomEvent(VP_RESULT, { detail: { state: r.ok ? 'sent' : 'error' } }));
    };
    window.addEventListener(VP_REQUEST, onRequest);
    return () => window.removeEventListener(VP_REQUEST, onRequest);
  });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status.kind === 'sending') return;
    const found = validate(fields, values);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus({ kind: 'idle' });
      window.setTimeout(() => {
        const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
        first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (first?.matches('input,select,textarea') ? first : first?.querySelector<HTMLElement>('input,select,textarea'))?.focus({ preventScroll: true });
      }, 0);
      return;
    }
    if (!endpoint) {
      setStatus({ kind: 'error', message: 'Applications are switched off in this preview build. Please email', email: true });
      return;
    }
    const body = {
      audience: page.audience,
      source: `network/${page.slug}`,
      page: window.location.href,
      submission_id: submissionId.current,
      elapsed_ms: Date.now() - startedAt.current,
      utm: utm(),
      company_url: honeypot,
      ...payloadFrom(fields, values),
    };
    setStatus({ kind: 'sending' });
    const r = await send(body);
    if (r.ok) {
      lastPayload.current = { ...body, company_url: undefined };
      setStatus({ kind: 'success', duplicate: r.duplicate });
      track('network_signup', { audience: page.audience });
      window.setTimeout(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
      return;
    }
    if (r.status === 422 && r.fields) {
      setErrors(r.fields);
      setStatus({ kind: 'error', message: 'Please check the highlighted fields.' });
      return;
    }
    if (r.status === 429) {
      setStatus({ kind: 'error', message: 'Too many applications from this connection. Please wait a few minutes and try again.' });
      return;
    }
    setStatus({ kind: 'error', message: 'Something went wrong and your application was not sent. Please try again, or email', email: true });
  }

  if (status.kind === 'success') {
    return (
      <FormSuccess title={page.form.successTitle}>
        <p>{page.form.successBody}</p>
        {status.duplicate ? <p className="mt-3">You had already applied with this email, so we updated your application with these details.</p> : null}
      </FormSuccess>
    );
  }

  const v = (key: string) => (typeof values[key] === 'string' ? (values[key] as string) : '');

  const renderField = (f: NetworkField) => {
        if (f.key === 'raising_amount' && v('raising') !== 'Yes') return null;
        const error = errors[f.key];
        if (f.kind === 'multi') {
          return <Chips key={f.key} field={f} values={(values[f.key] as string[]) ?? []} onChange={(x) => set(f.key, x)} error={error} />;
        }
        if (f.kind === 'flag') {
          return (
            <CheckboxField
              key={f.key}
              name={f.key}
              label={f.label}
              checked={v(f.key) === 'Yes'}
              onChange={(e) => set(f.key, e.target.checked ? 'Yes' : '')}
              className="sm:col-span-2"
            />
          );
        }
        if (f.kind === 'select' || f.kind === 'yesno') {
          const options = f.kind === 'select' ? f.options : [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
          return (
            <SelectField
              key={f.key}
              name={f.key}
              label={f.label}
              required={f.required}
              options={options}
              value={v(f.key)}
              onChange={(e) => set(f.key, e.target.value)}
              error={error}
              aria-invalid={error ? true : undefined}
            />
          );
        }
        if (f.kind === 'textarea') {
          return (
            <TextAreaField
              key={f.key}
              name={f.key}
              label={f.label}
              required={f.required}
              maxLength={f.max}
              value={v(f.key)}
              onChange={(e) => set(f.key, e.target.value)}
              error={error}
              className="sm:col-span-2"
            />
          );
        }
        return (
          <TextField
            key={f.key}
            name={f.key}
            label={f.label}
            required={f.required}
            type={f.kind === 'email' ? 'email' : f.kind === 'url' ? 'text' : 'text'}
            inputMode={f.kind === 'url' ? 'url' : f.kind === 'email' ? 'email' : undefined}
            autoComplete={f.key === 'name' ? 'name' : f.key === 'email' ? 'email' : f.key === 'organisation' ? 'organization' : f.key === 'role' ? 'organization-title' : f.kind === 'url' ? 'url' : undefined}
            placeholder={f.placeholder}
            maxLength={f.max}
            hint={f.hint}
            value={v(f.key)}
            onChange={(e) => set(f.key, e.target.value)}
            error={error}
            className={f.key === 'one_liner' || f.key === 'organisation' ? 'sm:col-span-2' : undefined}
          />
        );
  };
  const quick = fields.filter((f) => QUICK_FIELDS.includes(f.key));
  const more = fields.filter((f) => !QUICK_FIELDS.includes(f.key));
  const moreHasError = more.some((f) => errors[f.key]);

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative grid gap-6 sm:grid-cols-2">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      {quick.map(renderField)}
      {more.length ? (
        <details open={moreHasError || undefined} className="group/more rounded-2xl border border-line bg-ink/40 sm:col-span-2 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 text-sm font-semibold text-paper/90 hover:text-gold">
            <span>
              Tell us more <span className="font-normal text-subtle">(optional)</span>
            </span>
            <Icon name="chevron-down" size={16} className="shrink-0 transition-transform group-open/more:rotate-180" />
          </summary>
          <div className="grid gap-6 border-t border-line p-5 sm:grid-cols-2">{more.map(renderField)}</div>
        </details>
      ) : null}

      <div className="flex flex-col gap-4 sm:col-span-2">
        {status.kind === 'error' ? (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-danger/40 bg-danger/[0.07] p-4 text-[14.5px] text-paper/90">
            <Icon name="close" size={18} className="mt-0.5 shrink-0 text-danger" />
            <p>
              {status.message}
              {status.email ? (
                <>
                  {' '}
                  <a href={`mailto:${contacts.general}`} className="font-semibold text-gold underline-offset-4 hover:underline">
                    {contacts.general}
                  </a>
                  .
                </>
              ) : null}
            </p>
          </div>
        ) : null}
        <button
          type="submit"
          disabled={status.kind === 'sending'}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-7 text-[15px] font-semibold text-ink transition-colors hover:bg-gold-bright disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:self-start"
        >
          {status.kind === 'sending' ? 'Sending…' : page.form.button}
        </button>
        <p className="text-[13px] text-subtle">
          Free to join. By joining you agree to our{' '}
          <a href={PRIVACY_URL} className="underline underline-offset-4 hover:text-gold">
            privacy policy
          </a>
          . We use your details to review your membership and to run the Network.
        </p>
      </div>
    </form>
  );
}

/** "Request the Venture Partner brief": before joining it ticks the box and goes to the form; after joining it sends the request. */
export function VenturePartnerButton({ label, className, variant = 'outline' }: { label: string; className?: string; variant?: 'outline' | 'primary' }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'already' | 'error'>('idle');
  useEffect(() => {
    const onResult = (e: Event) => {
      const s = (e as CustomEvent<{ state: string }>).detail.state;
      if (s === 'sending' || s === 'sent' || s === 'already' || s === 'error') setState(s);
    };
    window.addEventListener(VP_RESULT, onResult);
    return () => window.removeEventListener(VP_RESULT, onResult);
  }, []);
  const note =
    state === 'sent'
      ? 'Our partnerships team will send the brief within 2 working days.'
      : state === 'already'
        ? 'Already requested. The brief is on its way.'
        : state === 'error'
          ? 'That didn’t go through. Please try again.'
          : null;
  return (
    <div className={className}>
      <button
        type="button"
        disabled={state === 'sending' || state === 'sent'}
        onClick={() => window.dispatchEvent(new Event(VP_REQUEST))}
        className={cn(
          'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-[15px] font-semibold transition-colors disabled:opacity-70',
          variant === 'primary' ? 'bg-gold text-ink hover:bg-gold-bright' : 'border border-line-strong text-paper hover:border-gold hover:text-gold',
        )}
      >
        {state === 'sending' ? 'Sending…' : state === 'sent' ? 'Request sent' : label}
      </button>
      {note ? (
        <p role="status" className="mt-3 text-sm text-muted">
          {note}
        </p>
      ) : null}
    </div>
  );
}
