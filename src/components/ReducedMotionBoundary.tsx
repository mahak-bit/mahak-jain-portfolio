'use client';

import { Fragment, type ReactNode } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Remounts the page once, right after hydration, for a visitor who prefers
 * reduced motion.
 *
 * Hydration has to match the server, which cannot know the preference, so the
 * page first hydrates in its animated form. This then swaps the key as soon as
 * the real preference is known, and React throws that tree away and mounts a
 * fresh one in which every component reads the right value from its first
 * render. That clears anything the animated render left behind (a hidden
 * wrapper, a half-run entrance) without each component having to handle the
 * switch itself.
 *
 * Nothing changes for anyone else: the key never changes and nothing remounts.
 */
export function ReducedMotionBoundary({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <Fragment key={reduced ? 'reduced' : 'full'}>{children}</Fragment>;
}
