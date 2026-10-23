'use client';

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '../ui/Icon';

const control =
  'w-full rounded-xl border bg-ink-card/80 px-4 text-[15px] text-paper placeholder:text-subtle transition-colors focus:border-gold focus:outline-none focus-visible:outline-none';

type BaseFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
};

function FieldShell({
  id,
  label,
  required,
  hint,
  error,
  className,
  children,
}: Omit<BaseFieldProps, 'name'> & { id: string; children: ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-paper">
        {label}
        {required ? (
          <span className="ml-1 text-gold" aria-hidden>
            *
          </span>
        ) : (
          <>
            {' '}
            <span className="ml-1 text-xs font-normal text-subtle">(optional)</span>
          </>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-[13px] text-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-[13px] text-danger">
          <Icon name="close" size={12} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, hint?: ReactNode, error?: string) {
  return [error ? `${id}-error` : null, hint && !error ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined;
}

export function TextField({
  label,
  name,
  required,
  hint,
  error,
  className,
  ...rest
}: BaseFieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <input
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, 'h-12', error ? 'border-danger/70' : 'border-line-strong')}
        {...rest}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  name,
  required,
  hint,
  error,
  className,
  ...rest
}: BaseFieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <textarea
        id={id}
        name={name}
        required={required}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(control, 'min-h-32 resize-y py-3', error ? 'border-danger/70' : 'border-line-strong')}
        {...rest}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  name,
  required,
  hint,
  error,
  className,
  options,
  placeholder = 'Choose…',
  ...rest
}: BaseFieldProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> & { options: readonly { value: string; label: string }[]; placeholder?: string }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(control, 'h-12 appearance-none pr-10', error ? 'border-danger/70' : 'border-line-strong')}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
      </div>
    </FieldShell>
  );
}

export function CheckboxField({
  label,
  name,
  required,
  error,
  className,
  ...rest
}: Omit<BaseFieldProps, 'hint'> & Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'>) {
  const id = useId();
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-[14.5px] leading-snug text-paper/90">
        <input
          id={id}
          type="checkbox"
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="af-checkbox mt-0.5 size-5 shrink-0 cursor-pointer appearance-none rounded-md border border-line-strong bg-ink-card checked:border-gold checked:bg-gold"
          {...rest}
        />
        <span>
          {label}
          {required ? (
            <span className="ml-1 text-gold" aria-hidden>
              *
            </span>
          ) : null}
        </span>
      </label>
      {error ? (
        <p id={`${id}-error`} className="ml-8 text-[13px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ChoiceChips({
  legend,
  name,
  options,
  values,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly string[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-paper">
        {legend}
        <span className="ml-2 text-xs font-normal text-subtle">(optional, choose any)</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
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
                name={name}
                value={o}
                checked={on}
                onChange={() => onChange(on ? values.filter((v) => v !== o) : [...values, o])}
                className="sr-only"
              />
              {on ? <Icon name="check" size={14} /> : null}
              {o}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FormSection({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-line bg-ink-card/40 p-5 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <h2 aria-hidden className="text-xl font-bold sm:text-2xl">
        {title}
      </h2>
      {hint ? <p className="mt-1.5 text-sm text-muted">{hint}</p> : null}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/** Off-screen honeypot. Real visitors never see it; bots fill it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company URL
        <input type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} name="company_url" />
      </label>
    </div>
  );
}
