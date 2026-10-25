'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, type Fog, type PerspectiveCamera } from 'three';
import { exhibition, live } from '../store';
import { fitToAspect, sample, type KeyPoint } from './layout';
import { activity, FOG, rig } from './shared';

const { damp } = MathUtils;

/**
 * Drives the camera from the scroll position.
 *
 * Scroll sets a target; the camera eases toward it, so a flick of the wheel
 * becomes a glide rather than a jump. The pointer adds a small parallax in the
 * camera's own axes. Every eased value that is still moving stamps `activity`,
 * which is what tells the renderer a frame is worth drawing.
 *
 * Runs before everything else each frame (priority -1): the cards place
 * themselves relative to the camera they find.
 */
export function CameraRig({ track, reduced }: { track: KeyPoint[]; reduced: boolean }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const L = (rate: number) => (reduced ? 400 : rate);
    const { selected, ready, inView, mix: mixTarget } = exhibition.get();

    const progress = damp(rig.progress, live.progress, L(5), dt);
    const px = damp(rig.px, live.pointer.x, L(3.2), dt);
    const py = damp(rig.py, live.pointer.y, L(3.2), dt);
    const mix = damp(rig.mix, mixTarget, L(5.5), dt);
    const sel = damp(rig.sel, selected ? 1 : 0, L(5.5), dt);

    if (
      Math.abs(progress - rig.progress) > 2e-5 ||
      Math.abs(px - rig.px) > 3e-4 ||
      Math.abs(py - rig.py) > 3e-4 ||
      Math.abs(mix - rig.mix) > 1e-4 ||
      Math.abs(sel - rig.sel) > 1e-4
    ) {
      activity.t = t;
    }
    rig.progress = progress;
    rig.px = px;
    rig.py = py;
    rig.mix = mix;
    rig.sel = sel;

    // the entrance starts when the scene is ready and someone is there to see it
    if (ready && inView && rig.intro < 1) {
      rig.intro = reduced ? 1 : Math.min(1, rig.intro + dt / 2.8);
      activity.t = t;
    }

    const { width, height } = state.size;
    const shot = fitToAspect(sample(track, progress), width / height);
    rig.ringYaw = shot.ringYaw;

    // the fog is set for a wide screen; back the camera off and it must go with it
    const fog = state.scene.fog as Fog | null;
    if (fog) {
      fog.near = FOG.near * shot.push;
      fog.far = FOG.far * shot.push;
    }

    camera.position.copy(shot.pos);
    camera.lookAt(shot.target);
    camera.translateX(px * 0.35);
    camera.translateY(py * 0.22);
    camera.fov = shot.fov;
    // composition offsets fade out while a project is open: the card is placed
    // against the real viewport, not the offset one
    const k = 1 - sel;
    camera.setViewOffset(
      width,
      height,
      -shot.offsetX * width * k,
      shot.offsetY * height * k,
      width,
      height
    );
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }, -1);

  return null;
}
