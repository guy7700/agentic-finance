'use client';

import { useCallback, useRef, useState } from 'react';
import { formWebhooks } from '@/config/forms';
import { contacts } from '@/config/site';
import { getCurrentEdition } from '@/data/editions';
import { validate, type FormKind } from '@/lib/forms';

export type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string; fallbackEmail?: string };

/** Map validated fields onto the payload shapes the existing Apps Scripts expect. */
function toPayload(kind: FormKind, data: Record<string, unknown>) {
  const edition = getCurrentEdition();
  const meta = {
    event: edition.name,
    source: 'Agentic Finance global site',
    submittedAt: new Date().toISOString(),
    pageUrl: window.location.href,
    userAgent: navigator.userAgent.slice(0, 300),
  };
  if (kind === 'speaker-nomination') {
    return { formType: 'Speaker nomination', ...data, nominatingSelf: data.nominatingSelf ? 'Yes' : 'No', ...meta };
  }
  if (kind === 'partnership') {
    return { formType: 'Partner application', program: `Agentic Finance - ${edition.shortName}`, ...data, ...meta };
  }
  return { formType: 'Contact enquiry', ...data, ...meta };
}

function focusFirstInvalid(formEl?: HTMLFormElement | null) {
  // Wait for React to commit the error state before moving focus.
  window.setTimeout(() => formEl?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
}

/**
 * Shared submission flow: validate, then POST straight to the Apps Script web
 * app. The scripts allow cross-site reads, so success is only shown when the
 * reply confirms delivery.
 */
export function useEnquiry(kind: FormKind) {
  const [state, setState] = useState<SubmitState>({ status: 'idle' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');
  const startedAt = useRef<number | null>(null);

  const touch = useCallback(() => {
    if (startedAt.current === null) startedAt.current = Date.now();
  }, []);

  const submit = useCallback(
    async (fields: Record<string, unknown>, formEl?: HTMLFormElement | null) => {
      const result = validate(kind, fields);
      if (!result.ok) {
        setErrors(result.errors);
        setState({ status: 'error', message: 'Please check the highlighted fields.' });
        focusFirstInvalid(formEl);
        return false;
      }
      setErrors({});

      // Bots: honeypot filled or submitted faster than a person can type.
      const tooFast = startedAt.current !== null && Date.now() - startedAt.current < 2500;
      if (honeypot || tooFast) {
        setState({ status: 'success' });
        return true;
      }

      const fallbackEmail = kind === 'partnership' ? contacts.partnerships : contacts.general;
      const target = kind === 'contact' ? formWebhooks.general : formWebhooks.partner;
      if (!target) {
        setState({
          status: 'error',
          message: `Online submissions are not switched on in this version of the site yet, so nothing was sent. Please email`,
          fallbackEmail,
        });
        return false;
      }

      setState({ status: 'submitting' });
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 15_000);
      try {
        const res = await fetch(target, {
          method: 'POST',
          // text/plain keeps this a "simple" request, which Apps Script accepts cross-site.
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(toPayload(kind, result.data)),
          signal: controller.signal,
        });
        const text = await res.text().catch(() => '');
        let reply: { ok?: boolean; result?: string } = {};
        try {
          reply = JSON.parse(text);
        } catch {
          /* plain-text replies are fine */
        }
        if (!res.ok || reply.ok === false || reply.result === 'error') throw new Error(`Delivery failed (${res.status})`);
        setState({ status: 'success' });
        return true;
      } catch {
        setState({
          status: 'error',
          message: 'We could not deliver your submission just now. Please try again in a moment, or email',
          fallbackEmail,
        });
        return false;
      } finally {
        window.clearTimeout(timer);
      }
    },
    [kind, honeypot],
  );

  const reset = useCallback(() => {
    setState({ status: 'idle' });
    setErrors({});
    startedAt.current = null;
  }, []);

  return { state, errors, submit, reset, touch, honeypot, setHoneypot };
}
