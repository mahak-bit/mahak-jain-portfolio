'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { CARD } from './layout';
import { cardMeshes, rig } from './shared';

interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

declare global {
  interface Window {
    /** Present only with `?debug` in the URL. */
    __ex?: {
      rects: () => Record<string, Rect>;
      info: () => Record<string, unknown>;
    };
  }
}

/**
 * Test hooks, mounted only when the URL carries `?debug`. `rects()` says where
 * every card currently lands on screen (so layout tests can check that none sits
 * under the type); `info()` reports what the renderer is spending.
 */
export function Debug() {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    const corners: [number, number][] = [
      [-1, 1],
      [1, 1],
      [1, -1],
      [-1, -1],
    ];
    const v = new Vector3();

    window.__ex = {
      rects() {
        const out: Record<string, Rect> = {};
        for (const [slug, mesh] of cardMeshes) {
          mesh.updateWorldMatrix(true, false);
          const xs: number[] = [];
          const ys: number[] = [];
          for (const [cx, cy] of corners) {
            v.set((cx * CARD.w) / 2, (cy * CARD.h) / 2, 0)
              .applyMatrix4(mesh.matrixWorld)
              .project(camera);
            xs.push((v.x * 0.5 + 0.5) * size.width);
            ys.push((-v.y * 0.5 + 0.5) * size.height);
          }
          out[slug] = {
            x0: Math.min(...xs),
            x1: Math.max(...xs),
            y0: Math.min(...ys),
            y1: Math.max(...ys),
          };
        }
        return out;
      },
      info() {
        return {
          frame: gl.info.render.frame,
          calls: gl.info.render.calls,
          triangles: gl.info.render.triangles,
          geometries: gl.info.memory.geometries,
          textures: gl.info.memory.textures,
          programs: gl.info.programs?.length ?? 0,
          dpr: gl.getPixelRatio(),
          progress: rig.progress,
          mix: rig.mix,
          sel: rig.sel,
        };
      },
    };
    return () => {
      delete window.__ex;
    };
  }, [gl, camera, size]);

  return null;
}
