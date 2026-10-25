'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Quality } from '@/lib/gpu';
import { exhibition, live } from '../store';
import { activity } from './shared';

/** A frame slower than this (ms) is one the eye can catch. */
const SLOW = 28;
/** Frames judged together. */
const WINDOW = 48;
/** The first moving frames pay for shader compiles and uploads; they are not the steady state. */
const WARM_UP = 90;

/**
 * Decides when a frame is actually drawn, and at what resolution.
 *
 * R3F would redraw sixty times a second whether or not anything changed. Here
 * the scene is drawn only when something moved this frame, or something woke it
 * (a resize, a new texture, a click). With nothing moving it does no GPU work at
 * all; with only the ring's idle drift (which is quantised to thirty steps a
 * second) it draws at thirty. That is most of the battery budget of an
 * installation like this, and it costs nothing visible.
 *
 * It also watches frame times while the scene is moving. If a fifth of the
 * recent frames were slow, the pixel ratio steps down a quarter (never below 1);
 * if a long stretch was comfortably quick it steps back up toward the tier's
 * cap. A dense screen on a modest GPU settles at a resolution it can hold; a
 * strong one never notices.
 */
export function Governor({
  quality,
  onFirstFrame,
  onContextLost,
}: {
  quality: Quality;
  onFirstFrame: () => void;
  onContextLost: () => void;
}) {
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const setDpr = useThree((s) => s.setDpr);
  const first = useRef(false);
  const st = useRef({ moved: 0, times: [] as number[], calm: 0, dpr: 0, steppedDownAt: 0 });

  // a resize changes what a frame looks like even if nothing is animating
  useEffect(() => {
    live.dirty = true;
  }, [size]);

  useEffect(() => {
    const el = gl.domElement;
    const lost = (e: Event) => {
      e.preventDefault();
      onContextLost();
    };
    el.addEventListener('webglcontextlost', lost);
    return () => el.removeEventListener('webglcontextlost', lost);
  }, [gl, onContextLost]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const moving = activity.t === t;

    // Off screen, nothing is drawn. The very first frame is the exception: it compiles
    // the shaders and puts the textures on the GPU while nobody is looking, so the room
    // is ready the moment it scrolls into view.
    if (first.current && !exhibition.get().inView) return;

    if (!moving && !live.dirty) return;
    live.dirty = false;
    state.gl.render(state.scene, state.camera);

    const s = st.current;
    if (!first.current) {
      first.current = true;
      s.dpr = state.viewport.dpr;
      onFirstFrame();
    }

    if (!moving) return;
    if (++s.moved < WARM_UP) return;

    const ms = Math.min(delta, 0.25) * 1000;
    s.times.push(ms);
    if (s.times.length > WINDOW) s.times.shift();
    s.calm = ms < 15.5 ? s.calm + 1 : 0;

    const now = performance.now();
    const cap = Math.min(quality.dprMax, window.devicePixelRatio);

    if (s.times.length === WINDOW && s.dpr > 1) {
      const slow = s.times.filter((x) => x > SLOW).length;
      if (slow >= WINDOW / 5) {
        s.dpr = Math.max(1, s.dpr - 0.25);
        s.times.length = 0;
        s.calm = 0;
        s.steppedDownAt = now;
        setDpr(s.dpr);
        return;
      }
    }
    // comfortably quick for a long stretch, and not just after having stepped down
    if (s.calm >= 300 && s.dpr < cap && now - s.steppedDownAt > 12000) {
      s.dpr = Math.min(cap, s.dpr + 0.25);
      s.calm = 0;
      s.times.length = 0;
      setDpr(s.dpr);
    }
  }, 1);

  return null;
}
