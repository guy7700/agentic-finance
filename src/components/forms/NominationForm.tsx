'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { CheckboxField, FormSection, Honeypot, TextAreaField, TextField } from './Fields';
import { FormError, FormSuccess } from './FormStatus';
import { useEnquiry } from './useEnquiry';

const initial = {
  nominatorName: '',
  nominatorEmail: '',
  nominatorCompany: '',
  nominatorTelegram: '',
  speakerName: '',
  speakerRole: '',
  speakerCompany: '',
  speakerEmail: '',
  speakerLinkedin: '',
  speakerX: '',
  speakerWebsite: '',
  topic: '',
  reason: '',
};

/**
 * Speaker nomination, field-for-field compatible with the live Abu Dhabi form
 * so submissions land in the same sheet.
 */
export function NominationForm({ edition }: { edition: string }) {
  const [v, setV] = useState(initial);
  const [self, setSelf] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { state, errors, submit, reset, touch, honeypot, setHoneypot } = useEnquiry('speaker-nomination');

  const set = (k: keyof typeof initial) => (e: { target: { value: string } }) => {
    touch();
    setV((cur) => ({ ...cur, [k]: e.target.value }));
  };

  const toggleSelf = (on: boolean) => {
    setSelf(on);
    if (on) {
      setV((cur) => ({
        ...cur,
        speakerName: cur.speakerName || cur.nominatorName,
        speakerCompany: cur.speakerCompany || cur.nominatorCompany,
        speakerEmail: cur.speakerEmail || cur.nominatorEmail,
      }));
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit({ ...v, nominatingSelf: self, edition }, formRef.current);
  };

  if (state.status === 'success') {
    const first = v.nominatorName.split(/\s+/)[0];
    return (
      <FormSuccess
        title={`Thank you${first ? `, ${first}` : ''}.`}
        onReset={() => {
          setV(initial);
          setSelf(false);
          reset();
        }}
        resetLabel="Nominate someone else"
      >
        Your nomination of <strong className="text-paper">{v.speakerName}</strong> is with the programme team. Every nomination is read;
        a nomination is not a confirmation. If it is a fit, we will be in touch by email.
      </FormSuccess>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative flex flex-col gap-6">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <FormSection title="You" hint="So we know who put this name forward, and where to reply.">
        <TextField label="Your name" name="nominatorName" required autoComplete="name" value={v.nominatorName} onChange={set('nominatorName')} error={errors.nominatorName} />
        <TextField
          label="Your email"
          name="nominatorEmail"
          type="email"
          required
          autoComplete="email"
          value={v.nominatorEmail}
          onChange={set('nominatorEmail')}
          error={errors.nominatorEmail}
        />
        <TextField
          label="Your company"
          name="nominatorCompany"
          required
          autoComplete="organization"
          value={v.nominatorCompany}
          onChange={set('nominatorCompany')}
          error={errors.nominatorCompany}
        />
        <TextField label="Telegram" name="nominatorTelegram" placeholder="@handle" value={v.nominatorTelegram} onChange={set('nominatorTelegram')} />
        <CheckboxField
          className="sm:col-span-2"
          label="I’m nominating myself"
          name="nominatingSelf"
          checked={self}
          onChange={(e) => toggleSelf(e.target.checked)}
        />
      </FormSection>

      <FormSection title="The speaker" hint="Who belongs on this stage?">
        <TextField label="Speaker name" name="speakerName" required value={v.speakerName} onChange={set('speakerName')} error={errors.speakerName} />
        <TextField label="Role or title" name="speakerRole" required value={v.speakerRole} onChange={set('speakerRole')} error={errors.speakerRole} />
        <TextField
          label="Company or institution"
          name="speakerCompany"
          required
          value={v.speakerCompany}
          onChange={set('speakerCompany')}
          error={errors.speakerCompany}
        />
        <TextField label="Speaker email" name="speakerEmail" type="email" value={v.speakerEmail} onChange={set('speakerEmail')} error={errors.speakerEmail} />
        <TextField
          label="LinkedIn"
          name="speakerLinkedin"
          type="url"
          placeholder="https://www.linkedin.com/in/…"
          value={v.speakerLinkedin}
          onChange={set('speakerLinkedin')}
          error={errors.speakerLinkedin}
        />
        <TextField label="X (Twitter)" name="speakerX" placeholder="@handle or URL" value={v.speakerX} onChange={set('speakerX')} />
        <TextField
          label="Website"
          name="speakerWebsite"
          type="url"
          placeholder="https://"
          className="sm:col-span-2"
          value={v.speakerWebsite}
          onChange={set('speakerWebsite')}
          error={errors.speakerWebsite}
        />
      </FormSection>

      <FormSection title="The session" hint="None of this is required, but it is what makes a nomination land.">
        <TextField label="Proposed topic" name="topic" className="sm:col-span-2" value={v.topic} onChange={set('topic')} />
        <TextAreaField label="Why this speaker" name="reason" className="sm:col-span-2" value={v.reason} onChange={set('reason')} />
      </FormSection>

      <FormError state={state} />
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-subtle">The stage is curated. Sending a nomination does not confirm a slot.</p>
        <Button type="submit" size="lg" icon="arrow-right" disabled={state.status === 'submitting'} aria-busy={state.status === 'submitting'}>
          {state.status === 'submitting' ? 'Sending…' : 'Submit nomination'}
        </Button>
      </div>
    </form>
  );
}
