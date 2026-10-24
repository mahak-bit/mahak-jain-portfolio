import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/**
 * Whether the visitor has asked for reduced motion.
 *
 * A drop-in for framer-motion's hook, with one difference that matters.
 * framer reads the preference synchronously on the first client render, so a
 * visitor with reduced motion on hydrates a tree that differs from the one the
 * server rendered (the animated one, hidden at opacity 0). React does not patch
 * attributes on a hydration mismatch, so the server's inline `opacity: 0` stayed
 * on the page for good, and whole pages (the archive, the résumé, the contact
 * form, every case study) loaded blank for exactly the people who had asked for
 * less animation.
 *
 * Here the server snapshot is `false`, and React uses it for the hydration
 * render as well, so hydration always matches. The real value arrives one
 * render later, and <ReducedMotionBoundary> remounts the page at that point so
 * every component starts clean in the right mode. A visitor who has not asked
 * for reduced motion never sees any of that: the value is `false` throughout.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
