'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

const noop = () => () => {};

/**
 * Renders its children until `publishedAt` is older than `maxAgeMs` on the
 * visitor's clock. The page is static, so this covers days when the daily
 * rebuild has not run.
 */
export function FreshOnly({ publishedAt, maxAgeMs, children }: { publishedAt: string; maxAgeMs: number; children: ReactNode }) {
  const fresh = useSyncExternalStore(
    noop,
    () => Date.now() - Date.parse(publishedAt) < maxAgeMs,
    () => true,
  );
  return fresh ? children : null;
}
