/**
 * Where each scene sits on the scroll, as plain numbers.
 *
 * Kept apart from `scene/layout.ts` on purpose: the interface needs these to
 * know which scene is showing, and the interface must not import anything that
 * pulls in three.js, or the plain list view would download the 3D library for
 * nothing. Everything three-dependent stays behind the lazy `scene/` boundary.
 */

/** Scroll progress at which each scene begins and ends (0..1). */
export const SCENES = {
  intro: { from: 0, to: 0.15 },
  projects: { from: 0.15, to: 0.58 },
  capabilities: { from: 0.58, to: 0.82 },
  contact: { from: 0.82, to: 1 },
} as const;

/** The stretch of scroll over which the tour walks card to card. */
export const TOUR = { from: 0.28, to: 0.5 };
