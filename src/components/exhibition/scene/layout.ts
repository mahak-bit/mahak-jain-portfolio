import { MathUtils, Vector3 } from 'three';
import { TOUR } from '../timeline';

/**
 * Where everything stands, and how the camera moves between the scenes.
 *
 * World units are loose metres. +x is right, +y up, +z toward the viewer; the
 * floor is y = 0. Everything that is composed by eye lives in this file, so the
 * look can be tuned without touching a component.
 *
 * The composition keeps its weight on the right: the ring stands at the back and
 * the cards run out from its feet toward the viewer, so the left of the screen
 * stays clear for the type that sits over it.
 */

/* ---- the ring ---------------------------------------------------------- */

export const RING = {
  /** Outer radius of the band. */
  radius: 3.4,
  /** Depth of the band along its axis. */
  width: 1.45,
  /** Wall thickness. */
  wall: 0.26,
  x: 2.7,
  z: -4.8,
};

/* ---- the cards --------------------------------------------------------- */

/** 16:9, like every project plate on the rest of the site. */
export const CARD = { w: 2.7, h: 1.52, thick: 0.034 };

export interface CardPose {
  x: number;
  z: number;
  /** Rotation about the vertical axis, radians. */
  yaw: number;
}

/** Fold an angle into [-90°, 90°]: a card's edge has no front or back to a heading. */
function fold(a: number) {
  while (a > Math.PI / 2) a -= Math.PI;
  while (a < -Math.PI / 2) a += Math.PI;
  return a;
}

/** Where the sweep starts: at the ring's feet. */
const SWEEP_START = -3.0;
/** The gap between neighbours along the sweep, as it was tuned for six cards. */
const SPACING = 1.92;
/** Six cards end at 6.6. More cards lengthen the sweep rather than crowd it. */
const SIX_END = SWEEP_START + SPACING * 5;

function sweepEnd(count: number) {
  return Math.max(SIX_END, SWEEP_START + SPACING * (count - 1));
}

/**
 * The cards lie on the floor along one S-shaped sweep that starts at the ring's
 * base and runs out toward the viewer, as if the ring had set them down. Each
 * one follows the path only part of the way: left to itself the tangent would
 * turn some faces edge-on to the camera, so it leans back toward facing the
 * viewer, which keeps every project readable.
 */
export function cardPoses(count: number): CardPose[] {
  const end = sweepEnd(count);
  const at = (t: number) => ({
    // drifts right as it nears the viewer, with a gentle S in it
    x: 0.9 + 3.3 * t + Math.sin(t * Math.PI * 2.2) * 0.45,
    z: MathUtils.lerp(SWEEP_START, end, t),
  });

  const poses: CardPose[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const p = at(t);
    const a = at(Math.max(0, t - 0.02));
    const b = at(Math.min(1, t + 0.02));
    // heading of the path; 0 means the long edge runs straight across the screen
    const heading = fold(Math.atan2(-(b.z - a.z), b.x - a.x));
    const lean = (i % 2 === 0 ? 1 : -1) * 0.045;
    poses.push({ x: p.x, z: p.z, yaw: heading * 0.3 + lean });
  }
  return poses;
}

/* ---- the camera -------------------------------------------------------- */

export interface Shot {
  pos: Vector3;
  target: Vector3;
  fov: number;
  /** Ring rotation about the vertical axis, radians. */
  ringYaw: number;
  /**
   * Where the subject sits in the frame, as a fraction of the viewport. Moving
   * the subject sideways is how the type gets room, without touching the
   * perspective the scene was composed in.
   */
  offsetX: number;
  offsetY: number;
  /**
   * On a tall, narrow screen the subject is lifted by this much (a fraction of the
   * height) to leave the lower part for the type. The tour wants more: the next
   * cards in the line fall below the one on show.
   */
  lift: number;
}

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);

const shot = (
  pos: Vector3,
  target: Vector3,
  fov: number,
  ringYaw: number,
  offsetX = 0,
  offsetY = 0,
  lift = 0.2
): Shot => ({ pos, target, fov, ringYaw, offsetX, offsetY, lift });

/** From the front and a little to the left; the ring a landmark on the right. */
const INTRO = shot(v(-3.4, 3.2, 16.4), v(2.7, 3.1, -4.2), 30, -0.62, 0.06, 0);

/**
 * The whole sweep from above, every card in view, held right of centre. Framed for
 * six cards; a longer sweep is framed around its middle, from a little further back.
 */
function overviewShot(extra: number): Shot {
  const target = v(2.6, 0, 1.9 + extra / 2);
  const pos = v(-0.4, 14.0, 17.4 + extra / 2);
  const back = 1 + (extra / (SIX_END - SWEEP_START)) * 0.55;
  pos.sub(target).multiplyScalar(back).add(target);
  return shot(pos, target, 30, -1.1, 0.12, 0.04);
}

/**
 * Low and square to the ring, which takes the right half; the cards a soft
 * foreground. A longer sweep brings its last cards nearer the lens, so the camera
 * stands back a little to keep them a foreground rather than a crowd.
 */
function capabilitiesShot(extra: number): Shot {
  return shot(v(-1.4, 3.1, 15.4 + extra * 0.7), v(2.9, 4.4, -4.8), 32, -0.42, 0.25, 0, 0.3);
}

/** Straight on, so the ring becomes a halo around the closing lines. */
const CONTACT = shot(v(2.7, 3.6, 12.6), v(2.7, 3.0, -4.8), 34, 0, 0, 0);

/** Camera for the tour: above and just left of card `i`, looking down at it. */
function tourShot(pose: CardPose): Shot {
  const target = v(pose.x, 0, pose.z);
  const pos = v(pose.x - 1.6, 7.4, pose.z + 7.4);
  return shot(pos, target, 30, -1.1, 0.2, 0, 0.3);
}

// the scenes' scroll ranges live in ../timeline so the interface can read them without
// importing three.js
export { SCENES, TOUR } from '../timeline';

export interface KeyPoint {
  /** Scroll progress at which this shot is fully in force. */
  p: number;
  shot: Shot;
}

export function buildTrack(poses: CardPose[]): KeyPoint[] {
  const n = poses.length;
  const extra = sweepEnd(n) - SIX_END;
  const OVERVIEW = overviewShot(extra);
  const CAPABILITIES = capabilitiesShot(extra);
  const keys: KeyPoint[] = [
    { p: 0, shot: INTRO },
    { p: 0.1, shot: INTRO },
    { p: 0.2, shot: OVERVIEW },
  ];
  poses.forEach((pose, i) => {
    const p = n === 1 ? TOUR.from : MathUtils.lerp(TOUR.from, TOUR.to, i / (n - 1));
    keys.push({ p, shot: tourShot(pose) });
  });
  keys.push(
    { p: 0.57, shot: OVERVIEW },
    { p: 0.66, shot: CAPABILITIES },
    { p: 0.78, shot: CAPABILITIES },
    { p: 0.9, shot: CONTACT },
    { p: 1, shot: CONTACT }
  );
  return keys;
}

const ease = (t: number) => t * t * (3 - 2 * t);

const _a = new Vector3();
const _b = new Vector3();

export interface Sampled {
  pos: Vector3;
  target: Vector3;
  fov: number;
  ringYaw: number;
  offsetX: number;
  offsetY: number;
  lift: number;
  /** How far the camera was backed away for a narrow screen; 1 on a wide one. */
  push: number;
}

const out: Sampled = {
  pos: new Vector3(),
  target: new Vector3(),
  fov: 30,
  ringYaw: 0,
  offsetX: 0,
  offsetY: 0,
  lift: 0.2,
  push: 1,
};

/** Interpolate the track at `p`. Returns a shared object: read it, don't keep it. */
export function sample(track: KeyPoint[], p: number): Sampled {
  const last = track.length - 1;
  let i = 0;
  while (i < last - 1 && p > track[i + 1].p) i++;
  const a = track[i];
  const b = track[Math.min(i + 1, last)];
  const span = b.p - a.p || 1;
  const t = ease(MathUtils.clamp((p - a.p) / span, 0, 1));

  out.pos.copy(_a.copy(a.shot.pos).lerp(_b.copy(b.shot.pos), t));
  out.target.copy(_a.copy(a.shot.target).lerp(_b.copy(b.shot.target), t));
  out.fov = MathUtils.lerp(a.shot.fov, b.shot.fov, t);
  out.ringYaw = MathUtils.lerp(a.shot.ringYaw, b.shot.ringYaw, t);
  out.offsetX = MathUtils.lerp(a.shot.offsetX, b.shot.offsetX, t);
  out.offsetY = MathUtils.lerp(a.shot.offsetY, b.shot.offsetY, t);
  out.lift = MathUtils.lerp(a.shot.lift, b.shot.lift, t);
  out.push = 1;
  return out;
}

/**
 * Reframe for the screen's shape, in three independent moves:
 *
 * - A narrow screen sees a thin slice of the world, so the camera backs away
 *   along its own line of sight and the lens opens a little.
 * - A squarer landscape screen has less room beside the type, so the subject is
 *   nudged further to the right.
 * - A portrait screen stacks the type under the scene instead of beside it, so
 *   the subject loses its sideways offset and is lifted to leave the lower part
 *   free. Portrait is exactly the shape the layout CSS calls portrait, so the
 *   camera and the type always agree about where the room is.
 */
export function fitToAspect(s: Sampled, aspect: number, dir: Vector3 = _a): Sampled {
  const narrow = MathUtils.clamp((1.35 - aspect) / 0.9, 0, 1);
  if (narrow > 0) {
    const push = 1 + narrow * 0.5;
    dir.copy(s.pos).sub(s.target).multiplyScalar(push);
    s.pos.copy(s.target).add(dir);
    s.fov += narrow * 8;
    s.push = push;
  }

  if (aspect <= 1) {
    s.offsetX = 0;
    s.offsetY += s.lift;
  } else if (s.offsetX > 0) {
    const squarer = MathUtils.clamp((1.6 - aspect) / 0.3, 0, 1);
    s.offsetX = Math.min(s.offsetX * (1 + 1.1 * squarer), s.offsetX + 0.08 * squarer);
  }
  return s;
}
