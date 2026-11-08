/**
 * A visible editorial placeholder, e.g. [TBC] or [Confirm with Tal]. Marks copy
 * that is missing or unconfirmed, so it cannot go live unnoticed.
 */
export function Placeholder({ children = 'TBC' }: { children?: string }) {
  return (
    <span className="whitespace-nowrap rounded border border-dashed border-gold/70 bg-gold/10 px-1.5 py-0.5 text-[0.85em] font-semibold text-gold">
      [{children}]
    </span>
  );
}
