'use client';

import type { ReactNode } from 'react';
import { Icon } from '../ui/Icon';
import type { SubmitState } from './useEnquiry';

export function FormError({ state }: { state: SubmitState }) {
  if (state.status !== 'error') return null;
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-danger/40 bg-danger/[0.07] p-4 text-[14.5px] text-paper/90">
      <Icon name="close" size={18} className="mt-0.5 shrink-0 text-danger" />
      <p>
        {state.message}
        {state.fallbackEmail ? (
          <>
            {' '}
            <a href={`mailto:${state.fallbackEmail}`} className="font-semibold text-gold underline-offset-4 hover:underline">
              {state.fallbackEmail}
            </a>
            .
          </>
        ) : null}
      </p>
    </div>
  );
}

export function FormSuccess({ title, children, onReset, resetLabel }: { title: string; children: ReactNode; onReset?: () => void; resetLabel?: string }) {
  return (
    <div role="status" className="rounded-2xl border border-gold/40 bg-gold/[0.05] p-8 text-center sm:p-14">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold text-ink">
        <Icon name="check" size={26} />
      </span>
      <p className="display-tight mt-6 text-3xl">{title}</p>
      <div className="mx-auto mt-4 max-w-lg text-[15.5px] leading-relaxed text-muted">{children}</div>
      {onReset ? (
        <button type="button" onClick={onReset} className="mt-8 text-sm font-semibold text-gold hover:text-gold-bright">
          {resetLabel ?? 'Send another'}
        </button>
      ) : null}
    </div>
  );
}
