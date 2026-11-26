'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { CheckboxField, ChoiceChips, Honeypot, TextAreaField, TextField } from './Fields';
import { FormError, FormSuccess } from './FormStatus';
import { useEnquiry } from './useEnquiry';

const initial = { contactName: '', email: '', companyName: '', role: '', website: '', goals: '' };

const GOALS = ['Meet decision-makers', 'Speak on stage', 'Brand exposure and PR', 'Host a private session', 'Launch or announce', 'Not sure yet'] as const;

/**
 * "Request partnership information" on /partners/book-a-call (Tal's review, 26 Nov 2026):
 * name, email and company first, the rest optional, and no question about budget or tier.
 * Delivered to the existing "Partner application" sheet, like every partnership enquiry.
 */
export function PartnershipInquiryForm({ events }: { events: string[] }) {
  const [v, setV] = useState(initial);
  const [goals, setGoals] = useState<string[]>([]);
  const [where, setWhere] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { state, errors, submit, reset, touch, honeypot, setHoneypot } = useEnquiry('partnership');

  const set = (k: keyof typeof initial) => (e: { target: { value: string } }) => {
    touch();
    setV((cur) => ({ ...cur, [k]: e.target.value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const note = [where.length ? `Events of interest: ${where.join(', ')}` : '', v.goals].filter(Boolean).join('\n\n');
    await submit({ ...v, goals: note, interests: goals, agreeUpdates: agree }, formRef.current);
  };

  if (state.status === 'success') {
    const first = v.contactName.split(/\s+/)[0];
    return (
      <FormSuccess
        title={`Thank you${first ? `, ${first}` : ''}.`}
        onReset={() => {
          setV(initial);
          setGoals([]);
          setWhere([]);
          setAgree(false);
          reset();
        }}
      >
        <p>Your request is with the partnerships team, who will reply by email within 2 working days. To talk sooner, pick a time in the calendar on this page.</p>
      </FormSuccess>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <TextField label="Your name" name="contactName" required autoComplete="name" value={v.contactName} onChange={set('contactName')} error={errors.contactName} />
      <TextField label="Work email" name="email" type="email" required autoComplete="email" value={v.email} onChange={set('email')} error={errors.email} />
      <TextField label="Company" name="companyName" required autoComplete="organization" value={v.companyName} onChange={set('companyName')} error={errors.companyName} />
      <TextField label="Your role" name="role" autoComplete="organization-title" value={v.role} onChange={set('role')} />
      <div className="sm:col-span-2">
        <ChoiceChips legend="What would you like to achieve?" name="interests" options={GOALS} values={goals} onChange={setGoals} />
      </div>
      <div className="sm:col-span-2">
        <ChoiceChips legend="Which events interest you?" name="events" options={events} values={where} onChange={setWhere} />
      </div>
      <TextAreaField label="Anything else (optional)" name="goals" className="sm:col-span-2" rows={3} value={v.goals} onChange={set('goals')} />
      <CheckboxField
        label="I agree to be contacted by the Agentic Finance team about partnerships."
        name="agreeUpdates"
        required
        checked={agree}
        onChange={(e) => {
          touch();
          setAgree(e.target.checked);
        }}
        error={errors.agreeUpdates}
        className="sm:col-span-2"
      />
      <div className="sm:col-span-2">
        <FormError state={state} />
      </div>
      <div className="flex flex-col items-start gap-3 sm:col-span-2">
        <Button
          type="submit"
          size="lg"
          icon="arrow-right"
          className="w-full whitespace-normal text-center sm:w-auto"
          disabled={state.status === 'submitting'}
          aria-busy={state.status === 'submitting'}
        >
          {state.status === 'submitting' ? 'Sending…' : 'Request partnership information'}
        </Button>
        <p className="text-[13px] text-subtle">No price list and no commitment: the team replies within 2 working days.</p>
      </div>
    </form>
  );
}
