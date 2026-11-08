import { useRef, type MouseEvent, type PointerEvent } from 'react';

/** Horizontal travel, in CSS pixels, before a touch drag counts as a swipe. */
const MIN_DISTANCE = 48;

/**
 * Left/right swipe on touch and pen, from pointer events. Give the element
 * `touch-action: pan-y` (Tailwind `touch-pan-y`) so the browser still scrolls
 * the page vertically: a mostly vertical drag becomes a scroll and cancels the
 * pointer, so it never counts. A mouse never swipes.
 *
 * `onSwipe(1)` is a swipe to the left (go forward), `onSwipe(-1)` to the right.
 * The click a browser may fire at the end of a swipe is swallowed.
 */
export function useSwipe(onSwipe: (dir: 1 | -1) => void) {
  const origin = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);

  return {
    onPointerDown(e: PointerEvent) {
      swiped.current = false;
      origin.current = e.pointerType === 'mouse' || !e.isPrimary ? null : { x: e.clientX, y: e.clientY, id: e.pointerId };
    },
    onPointerUp(e: PointerEvent) {
      const o = origin.current;
      origin.current = null;
      if (!o || o.id !== e.pointerId) return;
      const dx = e.clientX - o.x;
      const dy = e.clientY - o.y;
      if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      swiped.current = true;
      onSwipe(dx < 0 ? 1 : -1);
    },
    onPointerCancel() {
      origin.current = null;
    },
    onClickCapture(e: MouseEvent) {
      if (!swiped.current) return;
      swiped.current = false;
      e.preventDefault();
      e.stopPropagation();
    },
  };
}
