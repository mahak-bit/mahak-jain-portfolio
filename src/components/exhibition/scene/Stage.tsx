'use client';

import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import {
  CanvasTexture,
  Color,
  Fog,
  LinearMipmapLinearFilter,
  PMREMGenerator,
  SRGBColorSpace,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { Quality } from '@/lib/gpu';
import { RING } from './layout';
import { BG, FOG } from './shared';

/**
 * The room: a pale floor that melts into the background at a distance, a soft
 * overhead light that casts the shadows, a hemisphere fill so nothing goes
 * black, and a small procedural studio for the metal to reflect.
 *
 * The background, the fog and the floor are all close to one grey on purpose.
 * Where the floor ends there is no line, only a slow lightening.
 */
export function Stage({ quality }: { quality: Quality }) {
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    scene.background = new Color(BG);
    scene.fog = new Fog(BG, FOG.near, FOG.far);
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  // Reflections for the ring come from a tiny studio built in code — no HDR file
  // to download, and nothing in it that isn't a soft rectangle of light.
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const studio = new RoomEnvironment();
    const target = pmrem.fromScene(studio, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.3;
    studio.dispose();
    pmrem.dispose();
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene]);

  const plan = useMemo(() => makePlanTexture(), []);
  useEffect(() => () => plan.dispose(), [plan]);

  return (
    <>
      <hemisphereLight args={['#ffffff', '#b9b9b6', 0.5]} />

      <directionalLight
        position={[-7, 12, 8]}
        intensity={2.3}
        color="#fffaf4"
        castShadow
        shadow-mapSize={[quality.shadowMap, quality.shadowMap]}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-camera-near={2}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-radius={5}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[240, 240]} />
        <meshStandardMaterial color="#d6d6d2" roughness={1} metalness={0} envMapIntensity={0.3} />
      </mesh>

      {/* A drafting-table marking around the ring's footing: concentric arcs and
          a few ticks, very faint. It is the only decoration on the floor. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[RING.x, 0.004, RING.z]} renderOrder={1}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial
          map={plan}
          transparent
          depthWrite={false}
          toneMapped={false}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      </mesh>
    </>
  );
}

/** Thin concentric rings and tick marks, drawn once to a canvas. */
function makePlanTexture(): CanvasTexture {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const c = size / 2;
  const px = size / 30; // one world unit in pixels

  ctx.strokeStyle = 'rgba(21,21,21,0.13)';
  ctx.fillStyle = 'rgba(21,21,21,0.13)';
  ctx.lineWidth = 2;

  for (const r of [RING.radius + 0.9, RING.radius + 2.6, RING.radius + 6.2]) {
    ctx.beginPath();
    ctx.arc(c, c, r * px, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ticks on the second ring, like the graduations on a protractor
  const rr = (RING.radius + 2.6) * px;
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const long = i % 10 === 0;
    const len = long ? 0.32 * px : 0.14 * px;
    ctx.beginPath();
    ctx.moveTo(c + Math.cos(a) * rr, c + Math.sin(a) * rr);
    ctx.lineTo(c + Math.cos(a) * (rr + len), c + Math.sin(a) * (rr + len));
    ctx.stroke();
  }

  // cross-hair at the centre
  const arm = 0.5 * px;
  ctx.beginPath();
  ctx.moveTo(c - arm, c);
  ctx.lineTo(c + arm, c);
  ctx.moveTo(c, c - arm);
  ctx.lineTo(c, c + arm);
  ctx.stroke();

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.anisotropy = 4;
  return tex;
}
