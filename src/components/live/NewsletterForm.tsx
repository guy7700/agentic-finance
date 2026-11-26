'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Honeypot, TextField } from '../forms/Fields';
import { FormError, FormSuccess } from '../forms/FormStatus';
import { useEnquiry } from '../forms/useEnquiry';

/**
 * "Receive the latest insights every month": name and email, sent to the team's existing
 * enquiries sheet as a newsletter request (there is no mailing-list tool connected yet).
 */
export function NewsletterForm({ compact }: { compact?: boolean }) {
  const [v, setV] = useState({ name: '', email: '' });
  const formRef = useRef<HTMLFormElement>(null);
  const { state, errors, submit, reset, touch, honeypot, setHoneypot } = useEnquiry('contact');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit(
      { ...v, enquiryType: 'general', message: 'Newsletter: please add me to the monthly Agentic Finance newsletter.' },
      formRef.current,
    );
  };

  if (state.status === 'success') {
    return (
      <FormSuccess title="You’re on the list." onReset={() => (setV({ name: '', email: '' }), reset())} resetLabel="Add another email">
        <p>The next monthly issue comes to your inbox.</p>
      </FormSuccess>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={compact ? 'grid gap-4' : 'grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end'}>
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <TextField
        label="Name"
        name="name"
        required
        autoComplete="name"
        value={v.name}
        onChange={(e) => (touch(), setV((c) => ({ ...c, name: e.target.value })))}
        error={errors.name}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        value={v.email}
        onChange={(e) => (touch(), setV((c) => ({ ...c, email: e.target.value })))}
        error={errors.email}
      />
      <Button type="submit" size="lg" icon="arrow-right" disabled={state.status === 'submitting'} aria-busy={state.status === 'submitting'}>
        {state.status === 'submitting' ? 'Sending…' : 'Subscribe'}
      </Button>
      <div className={compact ? '' : 'sm:col-span-3'}>
        <FormError state={state} />
      </div>
    </form>
  );
}
