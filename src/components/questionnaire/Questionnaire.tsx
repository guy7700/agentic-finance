'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from 'react';
import { audienceSegments, companyTypes, questionnaire2027, seniorityLevels } from '@/config/events-2027';
import { formWebhooks } from '@/config/forms';
import { contacts } from '@/config/site';
import { cn } from '@/lib/cn';
import { trackLead } from '../analytics/MetaPixel';
import { SelectField, TextField } from '../forms/Fields';
import { FormError } from '../forms/FormStatus';
import type { SubmitState } from '../forms/useEnquiry';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { Chip, toggle } from './Chips';
import {
  MAX,
  THANKS_PATH,
  buildPayload,
  errorLabels,
  initialAnswers,
  isCompletePrefill,
  markSent,
  persistInitial,
  readInitial,
  saveSummary,
  sentRecently,
  toSummary,
  validateAnswers,
  withoutPii,
  type Answers,
  type ErrorKey,
} from './lib';
import { WhereStep, type WhereTab } from './WhereStep';

const noopSubscribe = () => () => {};
const YOU_KEYS: ErrorKey[] = ['first_name', 'last_name', 'email', 'company'];
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/**
 * "Where will you be in 2027?" The static HTML carries a placeholder; the form
 * itself renders in the browser, where it can read the personal link and this
 * tab's saved answers without a mismatch between server and client.
 */
export function Questionnaire() {
  const client = useSyncExternalStore(noopSubscribe, () => true, () => false);
  return client ? <QuestionnaireForm /> : <QuestionnaireSkeleton />;
}

/* ------------------------------------------------------------------ Form */

function QuestionnaireForm() {
  const router = useRouter();
  const [init] = useState(readInitial);
  const [v, setV] = useState<Answers>(() => initialAnswers(init));
  const [editingYou, setEditingYou] = useState(() => !isCompletePrefill(init.prefill));
  const [tab, setTab] = useState<WhereTab>('events');
  const [moreOpen, setMoreOpen] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [state, setState] = useState<SubmitState>({ status: 'idle' });
  const [honeypot, setHoneypot] = useState('');
  const startedAt = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    persistInitial(init);
    // Personal fields leave the address bar once read: they stay out of the
    // history, shared links and anything that reports the page URL.
    if (init.hasPiiInUrl) {
      const clean = withoutPii(window.location.href);
      if (clean) window.history.replaceState(null, '', clean);
    }
    // From the home calendar (?event=<id>): bring step 2 into view.
    if (init.event) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.getElementById('q-where')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }, [init]);

  const errors = attempted ? validateAnswers(v) : {};
  const errorKeys = Object.keys(errors) as ErrorKey[];
  const sending = state.status === 'submitting';
  const fallbackEmail = contacts.general;

  // First interaction, as an event timestamp: elapsed_ms is measured between events.
  const touch = (e: { timeStamp: number }) => {
    if (startedAt.current === null) startedAt.current = e.timeStamp;
  };
  const update = (patch: Partial<Answers>) => setV((cur) => ({ ...cur, ...patch }));
  const field = (k: keyof Answers) => (e: { target: { value: string } }) => update({ [k]: e.target.value } as Partial<Answers>);

  const focusError = (key: ErrorKey) => {
    const form = formRef.current;
    if (!form) return;
    if (YOU_KEYS.includes(key)) setEditingYou(true);
    // Wait for React to show the field before moving focus.
    window.setTimeout(() => {
      const el =
        key === 'where' ? form.querySelector<HTMLElement>('#q-where [role="tab"][aria-selected="true"]')
        : key === 'audience' ? form.querySelector<HTMLElement>('input[name="audience"]')
        : form.querySelector<HTMLElement>(`[name="${key}"]`);
      el?.focus();
    }, 0);
  };

  const editYou = () => {
    setEditingYou(true);
    window.setTimeout(() => formRef.current?.querySelector<HTMLElement>('[name="first_name"]')?.focus(), 0);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setAttempted(true);
    const found = Object.keys(validateAnswers(v)) as ErrorKey[];
    if (found.length) {
      setState({ status: 'idle' });
      focusError(found[0]);
      return;
    }

    const payload = buildPayload(v, {
      tracking: init.tracking,
      prefilled: init.prefill.prefilled,
      honeypot,
      elapsedMs: startedAt.current === null ? 0 : Math.max(0, Math.round(e.timeStamp - startedAt.current)),
    });
    const finish = () => {
      saveSummary(toSummary(payload, v));
      router.push(THANKS_PATH);
    };

    // Bots fill the hidden field: show them the usual ending, send nothing.
    if (honeypot) {
      setState({ status: 'submitting' });
      finish();
      return;
    }
    if (sentRecently()) {
      setState({ status: 'error', message: 'You sent your answers less than a minute ago. Please wait a moment before sending again, or email', fallbackEmail });
      return;
    }
    const target = formWebhooks.questionnaire2027;
    if (!target) {
      setState({
        status: 'error',
        message: 'Online submissions are not switched on in this version of the site yet, so nothing was sent. Please email',
        fallbackEmail,
      });
      return;
    }

    setState({ status: 'submitting' });
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20_000);
    let code = '';
    try {
      const res = await fetch(target, {
        method: 'POST',
        // text/plain keeps this a "simple" request: no CORS preflight, which Apps Script cannot answer.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const reply = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || reply?.ok !== true) {
        code = reply?.error ?? '';
        throw new Error(`Delivery failed (${res.status})`);
      }
      markSent();
      trackLead();
      finish();
    } catch {
      setState({
        status: 'error',
        message:
          code === 'rate_limited'
            ? 'Too many tries in a short time. Please wait a few minutes and send again, or email'
            : 'We could not send your answers just now. Please try again in a moment, or email',
        fallbackEmail,
      });
    } finally {
      window.clearTimeout(timer);
    }
  };

  const placeCount = v.events.length + v.cities.length + v.regions.length + (v.other_event.trim() ? 1 : 0);
  const status = [
    placeCount ? plural(placeCount, 'place') : v.not_sure ? 'Not sure yet' : '',
    v.audiences.length ? `${plural(v.audiences.length, 'group')} to meet` : '',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onFocus={touch}
      onPointerDown={touch}
      onKeyDown={touch}
      noValidate
      aria-labelledby="q-title"
      className="relative flex flex-col gap-5 [&_:is(input,select,button)]:scroll-mb-32 [&_:is(input,select,button)]:scroll-mt-28"
    >
      <div aria-hidden className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      {errorKeys.length ? (
        <div role="alert" className="rounded-2xl border border-danger/40 bg-danger/[0.07] p-5 sm:p-6">
          <p className="flex items-center gap-2 font-semibold text-paper">
            <Icon name="close" size={16} className="text-danger" />
            Almost there. Please check {errorKeys.length === 1 ? 'this' : `these ${errorKeys.length}`}:
          </p>
          <ul className="mt-3 flex flex-col gap-1.5 pl-6">
            {errorKeys.map((k) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => focusError(k)}
                  className="min-h-8 text-left text-[14.5px] text-gold underline decoration-gold/40 underline-offset-4 hover:text-gold-bright"
                >
                  {errorLabels[k]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Step 1 */}
      <Step n={1} id="q-you" title="You" hint="Where we send your meeting plan.">
        {!editingYou ? (
          <div className="flex flex-col gap-4 rounded-xl border border-line bg-paper/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <dl className="grid min-w-0 gap-0.5 text-[15px]">
              <dt className="sr-only">Name</dt>
              <dd className="font-medium text-paper">
                {v.first_name} {v.last_name}
              </dd>
              <dt className="sr-only">Work email</dt>
              <dd className="break-all font-light text-muted">{v.email}</dd>
              <dt className="sr-only">Company</dt>
              <dd className="font-light text-muted">{v.company}</dd>
            </dl>
            <button
              type="button"
              onClick={editYou}
              aria-expanded={false}
              aria-controls="q-you-fields"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-line-strong px-4 text-[13px] text-paper/85 transition-colors hover:border-gold hover:text-gold sm:self-center"
            >
              Not you? <span className="font-semibold text-gold">Edit</span>
            </button>
          </div>
        ) : init.prefill.prefilled.length ? (
          <p className="-mt-2 mb-5 flex items-center gap-2 text-[13.5px] text-subtle">
            <Icon name="check" size={14} className="text-gold" />
            We filled in what we had. Change anything that is not right.
          </p>
        ) : null}
        <div id="q-you-fields" hidden={!editingYou} className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            maxLength={MAX.name}
            value={v.first_name}
            onChange={field('first_name')}
            error={errors.first_name}
          />
          <TextField
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            maxLength={MAX.name}
            value={v.last_name}
            onChange={field('last_name')}
            error={errors.last_name}
          />
          <TextField
            label="Work email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={MAX.email}
            value={v.email}
            onChange={field('email')}
            error={errors.email}
          />
          <TextField
            label="Company"
            name="company"
            required
            autoComplete="organization"
            maxLength={MAX.company}
            value={v.company}
            onChange={field('company')}
            error={errors.company}
          />
        </div>
      </Step>

      {/* Step 2 */}
      <Step
        n={2}
        id="q-where"
        title="Where will you be in 2027?"
        hint="Pick events, cities or regions. Any mix works."
        highlight={Boolean(init.event)}
        count={placeCount ? `${placeCount} picked` : v.not_sure ? 'Not sure yet' : 'None picked yet'}
        error={errors.where}
      >
        {init.event && v.events.includes(init.event.id) ? (
          <p className="-mt-1 mb-5 flex items-start gap-2 text-[14px] text-gold-bright">
            <Icon name="check" size={16} className="mt-0.5 shrink-0" />
            We ticked {init.event.name} for you. Add any others.
          </p>
        ) : null}
        <WhereStep answers={v} update={update} tab={tab} onTab={setTab} errorId={errors.where ? 'q-where-error' : undefined} />
      </Step>

      {/* Step 3 */}
      <Step
        n={3}
        id="q-audience"
        title="Who do you want to meet?"
        hint="Pick all that apply."
        count={v.audiences.length ? `${v.audiences.length} picked` : 'None picked yet'}
        error={errors.audience}
      >
        <fieldset aria-describedby={errors.audience ? 'q-audience-error' : undefined}>
          <legend className="sr-only">Who do you want to meet?</legend>
          <div className="flex flex-wrap gap-2">
            {audienceSegments.map((a) => (
              <Chip key={a} name="audience" value={a} checked={v.audiences.includes(a)} onChange={(on) => update({ audiences: toggle(v.audiences, a, on) })}>
                {a}
              </Chip>
            ))}
          </div>
        </fieldset>
      </Step>

      {/* Optional details */}
      <section aria-labelledby="q-more-title" className="rounded-2xl border border-line bg-ink-card/50">
        <h2 id="q-more-title" className="text-[17px] font-normal">
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-controls="q-more"
            onClick={() => setMoreOpen((o) => !o)}
            className="flex min-h-16 w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-colors hover:text-gold sm:px-8"
          >
            <span>
              A bit more about you <span className="text-[14px] font-light text-subtle">(optional)</span>
            </span>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong text-gold">
              <Icon name={moreOpen ? 'minus' : 'plus'} size={16} />
            </span>
          </button>
        </h2>
        <div id="q-more" hidden={!moreOpen} className="grid gap-5 border-t border-line px-5 pb-6 pt-5 sm:grid-cols-2 sm:px-8 sm:pb-8">
          <SelectField
            label="Company type"
            name="company_type"
            options={companyTypes.map((c) => ({ value: c, label: c }))}
            value={v.company_type}
            onChange={field('company_type')}
          />
          <TextField label="Job title" name="role_title" autoComplete="organization-title" maxLength={MAX.role} value={v.role_title} onChange={field('role_title')} />
          <SelectField
            label="Seniority"
            name="seniority"
            options={seniorityLevels.map((s) => ({ value: s, label: s }))}
            value={v.seniority}
            onChange={field('seniority')}
          />
          <TextField label="Based in: country" name="hq_country" autoComplete="country-name" maxLength={MAX.short} value={v.hq_country} onChange={field('hq_country')} />
          <TextField label="Based in: city" name="hq_city" autoComplete="address-level2" maxLength={MAX.short} value={v.hq_city} onChange={field('hq_city')} />
          <TextField
            label="WhatsApp or phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={MAX.phone}
            value={v.phone}
            onChange={field('phone')}
          />
          <TextField
            label="LinkedIn profile"
            name="linkedin"
            type="url"
            inputMode="url"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={MAX.linkedin}
            placeholder="linkedin.com/in/..."
            value={v.linkedin}
            onChange={field('linkedin')}
            className="sm:col-span-2"
          />
        </div>
      </section>

      {/* Consent */}
      <div className="rounded-2xl border border-line bg-ink-card/50 p-5 sm:px-8 sm:py-6">
        <label htmlFor="q-consent" className="flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-snug text-paper/90">
          <input
            id="q-consent"
            type="checkbox"
            name="consent"
            required
            checked={v.consent}
            onChange={(e) => update({ consent: e.target.checked })}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={cn('q-consent-note', errors.consent && 'q-consent-error')}
            className="af-checkbox mt-0.5 size-5 shrink-0 cursor-pointer appearance-none rounded-md border border-line-strong bg-ink-card checked:border-gold checked:bg-gold"
          />
          <span>
            I agree that More &amp; More may contact me about meetings and events.
            <span className="ml-1 text-gold" aria-hidden>
              *
            </span>
          </span>
        </label>
        <p id="q-consent-note" className="ml-8 mt-1 text-[13px] leading-relaxed text-subtle">
          You can unsubscribe at any time with one click or a reply.{' '}
          <a
            href={questionnaire2027.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap text-gold underline decoration-gold/40 underline-offset-4 hover:text-gold-bright"
          >
            Privacy policy
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
        {errors.consent ? (
          <p id="q-consent-error" className="ml-8 mt-2 flex items-center gap-1.5 text-[13px] text-danger">
            <Icon name="close" size={12} />
            {errors.consent}
          </p>
        ) : null}
      </div>

      <FormError state={state} />

      {/* Submit: stays in view at the bottom of the screen while the form scrolls. */}
      <div className="sticky bottom-0 z-20 -mx-4 border-t border-line-strong bg-ink/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-16px_40px_rgb(5_11_24/0.55)] backdrop-blur-md sm:bottom-4 sm:mx-0 sm:rounded-2xl sm:border sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <p className="min-w-0 text-[13px] leading-snug text-muted">
            {sending ? (
              'Sending your answers…'
            ) : errorKeys.length ? (
              <span className="text-danger">Check {plural(errorKeys.length, 'answer')} above</span>
            ) : (
              status || 'Two minutes, one form.'
            )}
          </p>
          <Button type="submit" size="lg" icon={sending ? null : 'arrow-right'} disabled={sending} className="shrink-0">
            {sending ? 'Sending' : (
              <>
                <span className="sm:hidden">Send</span>
                <span className="hidden sm:inline">Tell us where you’ll be</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ Step */

type StepProps = {
  n: number;
  id: string;
  title: string;
  hint?: string;
  /** Running count, announced politely as it changes. */
  count?: string;
  error?: string;
  highlight?: boolean;
  children: ReactNode;
};

function Step({ n, id, title, hint, count, error, highlight, children }: StepProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        'edge-gold relative rounded-2xl border bg-ink-card p-5 transition-shadow duration-700 sm:p-8',
        highlight ? 'border-gold/60 shadow-[0_0_56px_rgb(209_182_121/0.16)]' : 'border-line',
      )}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="serif-figure flex size-11 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-[24px] leading-none lining-nums"
        >
          {n}
        </span>
        <div className="min-w-0 flex-1 pt-1">
          <h2 id={`${id}-title`} className="text-[clamp(1.3rem,1.15rem+0.6vw,1.65rem)] font-normal leading-tight tracking-[-0.01em]">
            <span className="sr-only">Step {n}: </span>
            {title}
          </h2>
          {hint ? <p className="mt-1.5 text-[14.5px] font-light text-muted">{hint}</p> : null}
          {count ? (
            <p aria-live="polite" className="mono-label mt-2.5 text-gold-bright">
              {count}
            </p>
          ) : null}
        </div>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-4 flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/[0.06] px-3 py-2.5 text-[13.5px] text-danger">
          <Icon name="close" size={14} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------- Skeleton */

const SKELETON_STEPS = ['You', 'Where will you be in 2027?', 'Who do you want to meet?'];

/** What the static HTML shows until the form renders. */
function QuestionnaireSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-5">
      <p className="sr-only">Loading the form.</p>
      {SKELETON_STEPS.map((title, i) => (
        <div key={title} className="edge-gold relative rounded-2xl border border-line bg-ink-card p-5 sm:p-8">
          <div className="flex items-start gap-4">
            <span aria-hidden className="serif-figure flex size-11 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-[24px] leading-none lining-nums">
              {i + 1}
            </span>
            <p className="pt-1 text-[clamp(1.3rem,1.15rem+0.6vw,1.65rem)] font-normal leading-tight">{title}</p>
          </div>
          <div aria-hidden className="mt-6 grid gap-3 motion-safe:animate-pulse sm:grid-cols-2">
            {Array.from({ length: i === 1 ? 6 : 4 }, (_, j) => (
              <div key={j} className="h-12 rounded-xl border border-line bg-paper/[0.03]" />
            ))}
          </div>
        </div>
      ))}
      <noscript>
        <p className="rounded-2xl border border-line-strong p-5 text-[15px] text-muted">
          This form needs JavaScript. You can also email{' '}
          <a href={`mailto:${contacts.general}`} className="font-semibold text-gold">
            {contacts.general}
          </a>{' '}
          with where you will be in 2027 and who you want to meet.
        </p>
      </noscript>
    </div>
  );
}
