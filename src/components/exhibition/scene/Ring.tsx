'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, LatheGeometry, MathUtils, Vector2 } from 'three';
import type { Quality } from '@/lib/gpu';
import { RING } from './layout';
import { activity, rig } from './shared';

/**
 * The cross-section of the band, as a closed loop of (radius, height) points,
 * walked so that every face points out of the metal: up the outer wall, across
 * the top, down the inner wall, across the bottom. Each corner is a small arc,
 * so the edges catch a line of light instead of being razor-sharp.
 */
function profile(outer: number, wall: number, width: number, corner: number): Vector2[] {
  const inner = outer - wall;
  const h = width / 2;
  const pts: Vector2[] = [];
  const arc = (cx: number, cy: number, from: number, to: number, steps = 7) => {
    for (let i = 0; i <= steps; i++) {
      const a = MathUtils.lerp(from, to, i / steps);
      pts.push(new Vector2(cx + Math.cos(a) * corner, cy + Math.sin(a) * corner));
    }
  };

  // outer wall, bottom to top
  arc(outer - corner, -h + corner, -Math.PI / 2, 0); // bottom-outer corner
  arc(outer - corner, h - corner, 0, Math.PI / 2); // top-outer corner
  // top face runs inward; inner wall runs down
  arc(inner + corner, h - corner, Math.PI / 2, Math.PI); // top-inner corner
  arc(inner + corner, -h + corner, Math.PI, Math.PI * 1.5); // bottom-inner corner
  pts.push(pts[0].clone()); // close the loop
  return pts;
}

/**
 * The ring: a wide, thin-walled band that stands on the floor like a piece of
 * architecture. Real thickness, a metal that mostly reflects the soft studio
 * around it, and a fine inlay of the site's blue on each face.
 *
 * It does not spin. It turns slowly as the scroll moves the story along, leans
 * a little toward the pointer, and drifts almost imperceptibly when idle.
 */
export function Ring({ quality, reduced }: { quality: Quality; reduced: boolean }) {
  const group = useRef<Group>(null);

  const body = useMemo(() => {
    const g = new LatheGeometry(
      profile(RING.radius, RING.wall, RING.width, 0.085),
      quality.ringSegments
    );
    g.rotateX(Math.PI / 2); // the axis points at the viewer, so the ring stands up
    return g;
  }, [quality.ringSegments]);
  useEffect(() => () => body.dispose(), [body]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;

    const t = state.clock.elapsedTime;
    // quantised to 30 steps a second, so the idle drift is drawn at 30fps, not 60
    const drift =
      reduced || !quality.ambient ? 0 : Math.sin((Math.floor(t * 30) / 30) * 0.32) * 0.035;
    const lean = rig.px * 0.07;

    // the entrance: the ring settles into place, turning from slightly further round
    const e = 1 - Math.pow(1 - rig.intro, 3);
    const yaw = rig.ringYaw + drift + lean + (1 - e) * 0.9;
    const y = RING.radius - 0.02 + (1 - e) * -0.6;

    if (
      Math.abs(g.rotation.y - yaw) > 1e-4 ||
      Math.abs(g.position.y - y) > 1e-4 ||
      Math.abs(g.rotation.x + rig.py * 0.02) > 1e-4
    ) {
      g.rotation.y = yaw;
      g.rotation.x = -rig.py * 0.02;
      g.position.y = y;
      activity.t = t;
    }
  });

  const r = RING.radius - RING.wall * 0.55;

  return (
    <group ref={group} position={[RING.x, RING.radius - 0.02, RING.z]} rotation={[0, -0.62, 0]}>
      <mesh geometry={body} castShadow receiveShadow>
        <meshStandardMaterial
          color="#cfd2d6"
          metalness={1}
          roughness={0.36}
          envMapIntensity={1.15}
        />
      </mesh>

      {/* the inlay, one on each face, a hair proud of the metal */}
      {[1, -1].map((side) => (
        <mesh
          key={side}
          position={[0, 0, (RING.width / 2 + 0.003) * side]}
          rotation={[0, side === 1 ? 0 : Math.PI, 0]}
        >
          <ringGeometry args={[r - 0.012, r + 0.012, quality.ringSegments]} />
          <meshBasicMaterial color="#002fa7" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
