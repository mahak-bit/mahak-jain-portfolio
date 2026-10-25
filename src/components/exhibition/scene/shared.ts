import type { Object3D } from 'three';

/**
 * Mutable state shared by the scene's components, read and written every frame.
 * Kept out of React on purpose: nothing here should ever cause a render.
 */

export const BG = '#e4e4e1';

/** Linear fog, set for a wide screen; the camera rig stretches it when it backs away. */
export const FOG = { near: 16, far: 52 };

export const rig = {
  /** The scroll progress the camera is actually at: `live.progress`, eased. */
  progress: 0,
  /** Ring rotation about the vertical axis, from the current shot. */
  ringYaw: -0.62,
  /** The entrance, 0 -> 1, started once the first frame is on screen. */
  intro: 0,
  /** How far a project is lifted into the detail view, 0..1, eased. */
  sel: 0,
  /** The DESIGN/CODE control, eased. */
  mix: 0,
  /** Pointer parallax, eased, -1..1. */
  px: 0,
  py: 0,
};

/**
 * Anything that is still animating stamps the current clock time here. The
 * renderer only draws a frame when something moved in it (or something woke
 * it), so a still scene costs nothing.
 */
export const activity = { t: -1 };

/** The DOM label for each card, positioned from the scene every frame. */
export const labelEls = new Map<string, HTMLElement>();

/** Each card's mesh, so the debug overlay (?debug) can measure where it lands on screen. */
export const cardMeshes = new Map<string, Object3D>();

export function resetRig() {
  rig.progress = 0;
  rig.ringYaw = -0.62;
  rig.intro = 0;
  rig.sel = 0;
  rig.mix = 0;
  rig.px = 0;
  rig.py = 0;
  activity.t = -1;
}
