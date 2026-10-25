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

/**
 * Where the words are on screen, which is not quite where the scenes are. A scene's
 * words are shown only while the camera is settled on its pose. Between poses the
 * camera is travelling, and anything written over a room in motion gets crossed by
 * whatever is moving: a card passing under a caption, the ring's wall through a
 * headline. So the words arrive once the camera has, and are gone before it leaves;
 * for the stretch of scroll in between there are none.
 */
export const WORDS = {
  /** The tour's captions hold from the end of the intro to just after its last card. */
  projects: { from: 0.15, to: 0.575 },
  capabilities: { from: 0.65, to: 0.785 },
  /** The closing words wait for the ring to finish sliding in behind them. */
  contact: { from: 0.89 },
} as const;

/** Which scene's words show at progress `p` (0 intro, 1 projects, 2 capabilities, 3 contact), or -1 between scenes. */
export function wordsAt(p: number): number {
  if (p < WORDS.projects.from) return 0;
  if (p < WORDS.projects.to) return 1;
  if (p < WORDS.capabilities.from) return -1;
  if (p < WORDS.capabilities.to) return 2;
  if (p < WORDS.contact.from) return -1;
  return 3;
}
