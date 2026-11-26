'use client';

import { useState } from 'react';
import { Button, ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';

/**
 * Google Calendar appointment schedule. With `open` (the partnership page, Tal's review of
 * 26 Nov 2026) the calendar shows at once, lazy-loaded as it scrolls into view; otherwise the
 * frame loads only when the visitor chooses to book.
 */
export function BookingEmbed({ url, minutes, title, open = false }: { url: string; minutes: number; title: string; open?: boolean }) {
  const [show, setShow] = useState(open);
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink-card/60">
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold">
            <Icon name="calendar" size={22} />
          </span>
          <div>
            <p className="text-xl font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted">
              {minutes} minutes with the partnerships team · choose a time that suits you
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {!show ? (
            <Button onClick={() => setShow(true)} icon="arrow-down">
              Choose a time here
            </Button>
          ) : null}
          {!open ? (
            <ButtonLink href={url} variant="outline">
              Open booking page
            </ButtonLink>
          ) : null}
        </div>
      </div>
      {show ? (
        <iframe
          src={url}
          title={`${title}: appointment booking`}
          className="block h-[680px] w-full border-t border-line bg-white"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : null}
    </div>
  );
}
