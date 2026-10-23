type ClassValue = string | number | null | undefined | false | ClassValue[] | Record<string, boolean | undefined>;

/** Join class names, skipping falsy values. Mirrors the clsx API we need. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (typeof v === 'string' || typeof v === 'number') out.push(String(v));
    else if (Array.isArray(v)) out.push(cn(...v));
    else for (const [k, on] of Object.entries(v)) if (on) out.push(k);
  }
  return out.join(' ');
}
