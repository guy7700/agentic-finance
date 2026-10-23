'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { enquiryTypes } from '@/lib/forms';
import { Button } from '../ui/Button';
import { FormSection, Honeypot, SelectField, TextAreaField, TextField } from './Fields';
import { FormError, FormSuccess } from './FormStatus';
import { useEnquiry } from './useEnquiry';

const initial = { name: '', email: '', organization: '', role: '', enquiryType: '', edition: '', message: '' };

type ContactFormProps = {
  editions: { slug: string; label: string }[];
};

/**
 * General enquiries with a type selector. Accepts ?topic=<type>&edition=<slug>
 * so CTAs across the site (e.g. "Register interest" for a 2027 city) prefill it.
 */
export function ContactForm({ editions }: ContactFormProps) {
  const [v, setV] = useState(initial);
  const formRef = useRef<HTMLFormElement>(null);
  const { state, errors, submit, reset, touch, honeypot, setHoneypot } = useEnquiry('contact');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const topic = p.get('topic');
    const edition = p.get('edition');
    const next: Partial<typeof initial> = {};
    if (topic && enquiryTypes.some((t) => t.value === topic)) next.enquiryType = topic;
    const match = editions.find((e) => e.slug === edition);
    if (match) {
      next.edition = match.label;
      if (topic === 'attendance' && match.label.includes('2027')) {
        next.message = `I would like to register my interest in ${match.label.replace(' 2027', '')} 2027.`;
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time prefill from the referring CTA
    if (Object.keys(next).length) setV((cur) => ({ ...cur, ...next }));
  }, [editions]);

  const set = (k: keyof typeof initial) => (e: { target: { value: string } }) => {
    touch();
    setV((cur) => ({ ...cur, [k]: e.target.value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit(v, formRef.current);
  };

  if (state.status === 'success') {
    return (
      <FormSuccess title="Message received." onReset={() => { setV(initial); reset(); }}>
        Thank you{v.name ? `, ${v.name.split(/\s+/)[0]}` : ''}. The team will reply to <strong className="text-paper">{v.email}</strong>.
      </FormSuccess>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative flex flex-col gap-6">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <FormSection title="Your enquiry">
        <SelectField
          label="What is it about?"
          name="enquiryType"
          required
          options={enquiryTypes}
          placeholder="Choose a topic…"
          value={v.enquiryType}
          onChange={set('enquiryType')}
          error={errors.enquiryType}
        />
        <SelectField
          label="Edition"
          name="edition"
          options={editions.map((e) => ({ value: e.label, label: e.label }))}
          placeholder="Any or not specific"
          value={v.edition}
          onChange={set('edition')}
        />
        <TextField label="Your name" name="name" required autoComplete="name" value={v.name} onChange={set('name')} error={errors.name} />
        <TextField label="Email" name="email" type="email" required autoComplete="email" value={v.email} onChange={set('email')} error={errors.email} />
        <TextField label="Organisation" name="organization" autoComplete="organization" value={v.organization} onChange={set('organization')} />
        <TextField label="Role" name="role" autoComplete="organization-title" value={v.role} onChange={set('role')} />
        <TextAreaField label="Message" name="message" required className="sm:col-span-2" value={v.message} onChange={set('message')} error={errors.message} />
      </FormSection>
      <FormError state={state} />
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-subtle">Your details are used only to answer this enquiry.</p>
        <Button type="submit" size="lg" icon="arrow-right" disabled={state.status === 'submitting'} aria-busy={state.status === 'submitting'}>
          {state.status === 'submitting' ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}
