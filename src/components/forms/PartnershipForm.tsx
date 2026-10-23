'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { NOT_SURE, partnershipInterests, partnershipLevels, sectors } from '@/lib/forms';
import { Button, ButtonLink } from '../ui/Button';
import { CheckboxField, ChoiceChips, FormSection, Honeypot, SelectField, TextAreaField, TextField } from './Fields';
import { FormError, FormSuccess } from './FormStatus';
import { useEnquiry } from './useEnquiry';

const initial = {
  contactName: '',
  email: '',
  companyName: '',
  role: '',
  website: '',
  handle: '',
  sector: '',
  category: '',
  tier: '',
  about: '',
  goals: '',
};

type PartnershipFormProps = {
  categories: { id: string; name: string }[];
  bookingUrl: string;
  bookingLabel: string;
  compact?: boolean;
};

/**
 * Partnership enquiry, payload-compatible with the Abu Dhabi "Partner
 * application" sheet. Preselects ?category=<id> when arriving from a category.
 */
export function PartnershipForm({ categories, bookingUrl, bookingLabel, compact }: PartnershipFormProps) {
  const [v, setV] = useState(initial);
  const [interests, setInterests] = useState<string[]>([]);
  const [agree, setAgree] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { state, errors, submit, reset, touch, honeypot, setHoneypot } = useEnquiry('partnership');

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('category');
    const match = categories.find((c) => c.id === id);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time prefill from the referring category
    if (match) setV((cur) => ({ ...cur, category: match.name }));
  }, [categories]);

  const set = (k: keyof typeof initial) => (e: { target: { value: string } }) => {
    touch();
    setV((cur) => ({ ...cur, [k]: e.target.value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit({ ...v, interests, agreeUpdates: agree }, formRef.current);
  };

  if (state.status === 'success') {
    const first = v.contactName.split(/\s+/)[0];
    return (
      <FormSuccess
        title={`Thank you${first ? `, ${first}` : ''}.`}
        onReset={() => {
          setV(initial);
          setInterests([]);
          setAgree(false);
          reset();
        }}
      >
        <p>
          Your enquiry is with the partnerships team
          {v.category && v.category !== NOT_SURE ? `, including your interest in ${v.category}` : ''}. They will reply by email.
        </p>
        <p className="mt-6">Want to move faster?</p>
        <div className="mt-4 flex justify-center">
          <ButtonLink href={bookingUrl} variant="outline">
            {bookingLabel}
          </ButtonLink>
        </div>
      </FormSuccess>
    );
  }

  const categoryOptions = [...categories.map((c) => ({ value: c.name, label: c.name })), { value: NOT_SURE, label: NOT_SURE }];

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative flex flex-col gap-6">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <FormSection title="Company and contact">
        <TextField label="Your name" name="contactName" required autoComplete="name" value={v.contactName} onChange={set('contactName')} error={errors.contactName} />
        <TextField label="Work email" name="email" type="email" required autoComplete="email" value={v.email} onChange={set('email')} error={errors.email} />
        <TextField label="Company" name="companyName" required autoComplete="organization" value={v.companyName} onChange={set('companyName')} error={errors.companyName} />
        <TextField label="Your role" name="role" autoComplete="organization-title" value={v.role} onChange={set('role')} />
        {!compact ? (
          <>
            <TextField label="Company website" name="website" type="url" placeholder="https://" value={v.website} onChange={set('website')} error={errors.website} />
            <TextField label="Telegram or Discord" name="handle" placeholder="@handle" value={v.handle} onChange={set('handle')} />
          </>
        ) : null}
      </FormSection>

      <FormSection title="What you want to own" hint="There are twelve categories and no more than eight positions in Abu Dhabi.">
        <SelectField
          label="Category you want to lead"
          name="category"
          options={categoryOptions}
          placeholder="Choose a category…"
          value={v.category}
          onChange={set('category')}
        />
        <SelectField
          label="Level of involvement"
          name="tier"
          options={partnershipLevels.map((x) => ({ value: x, label: x }))}
          placeholder="Choose a level…"
          value={v.tier}
          onChange={set('tier')}
          error={errors.tier}
        />
        {!compact ? (
          <SelectField
            label="Sector"
            name="sector"
            className="sm:col-span-2"
            options={sectors.map((x) => ({ value: x, label: x }))}
            placeholder="Choose a sector…"
            value={v.sector}
            onChange={set('sector')}
            error={errors.sector}
          />
        ) : null}
        <div className="sm:col-span-2">
          <ChoiceChips legend="What matters most to you" name="interests" options={partnershipInterests} values={interests} onChange={setInterests} />
        </div>
        <TextAreaField
          label="What does your company do?"
          name="about"
          className="sm:col-span-2"
          rows={3}
          hint="A sentence or two is enough."
          value={v.about}
          onChange={set('about')}
        />
        {!compact ? (
          <TextAreaField label="Anything else we should know" name="goals" className="sm:col-span-2" rows={3} value={v.goals} onChange={set('goals')} />
        ) : null}
      </FormSection>

      <CheckboxField
        label="I agree to be contacted by the Agentic Finance team about partnership opportunities."
        name="agreeUpdates"
        required
        checked={agree}
        onChange={(e) => {
          touch();
          setAgree(e.target.checked);
        }}
        error={errors.agreeUpdates}
      />

      <FormError state={state} />
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-subtle">Sent to the partnerships team for review. No price list, just a conversation.</p>
        <Button type="submit" size="lg" icon="arrow-right" disabled={state.status === 'submitting'} aria-busy={state.status === 'submitting'}>
          {state.status === 'submitting' ? 'Sending…' : 'Send partnership enquiry'}
        </Button>
      </div>
    </form>
  );
}
