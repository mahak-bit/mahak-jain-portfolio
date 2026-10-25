'use client';

import { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { NeutralToneMapping, PCFShadowMap, type CanvasTexture } from 'three';
import { QUALITY, type Tier } from '@/lib/gpu';
import { exhibition, live } from '../store';
import type { ExhibitProject } from '../types';
import { CardField, type Faces } from './Cards';
import { CameraRig } from './CameraRig';
import { Debug } from './Debug';
import { Governor } from './Governor';
import { Ring } from './Ring';
import { Stage } from './Stage';
import { buildTrack, cardPoses } from './layout';
import { loadFonts, makeCodeFace, makeDesignFace, readFonts } from './textures';

/** Run `fn` when the browser has nothing better to do. */
function whenIdle(fn: () => void): () => void {
  // Safari has no requestIdleCallback
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(fn, { timeout: 1800 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(fn, 700);
  return () => window.clearTimeout(id);
}

/**
 * The whole 3D scene, and nothing else. This module is the only one that
 * imports three.js, and it is only ever loaded as a lazy chunk, so none of that
 * weight reaches a visitor who doesn't get the exhibition.
 */
export default function SceneRoot({
  projects,
  tier,
  reduced,
  onContextLost,
}: {
  projects: ExhibitProject[];
  tier: Tier;
  reduced: boolean;
  onContextLost: () => void;
}) {
  const quality = QUALITY[tier];
  const [faces, setFaces] = useState<Record<string, Faces>>({});
  const [designReady, setDesignReady] = useState(false);
  const [drawn, setDrawn] = useState(false);

  const track = useMemo(() => buildTrack(cardPoses(projects.length)), [projects.length]);
  // `?debug` exposes window.__ex (card screen rects, render stats) for testing
  const debug = useMemo(() => new URLSearchParams(window.location.search).has('debug'), []);

  // Card faces: the screenshots first, because they are what the visitor sees;
  // the CODE faces a moment later, when the browser is idle.
  useEffect(() => {
    let cancelled = false;
    const made: CanvasTexture[] = [];
    let cancelIdle = () => {};

    (async () => {
      const fonts = readFonts();
      await loadFonts(fonts);
      if (cancelled) return;

      const designs = await Promise.all(
        projects.map(async (p) => {
          try {
            const tex = await makeDesignFace(p, quality.texWidth, 8, fonts);
            made.push(tex);
            return [p.slug, tex] as const;
          } catch {
            return [p.slug, null] as const; // the card keeps its neutral face
          }
        })
      );
      if (cancelled) return;

      setFaces(Object.fromEntries(designs.map(([slug, design]) => [slug, { design, code: null }])));
      setDesignReady(true);

      cancelIdle = whenIdle(() => {
        if (cancelled) return;
        const codes = projects.map((p) => {
          const tex = makeCodeFace(p, projects.length, quality.texWidth, 8, fonts);
          made.push(tex);
          return [p.slug, tex] as const;
        });
        setFaces((prev) => {
          const next = { ...prev };
          for (const [slug, code] of codes)
            next[slug] = { design: next[slug]?.design ?? null, code };
          return next;
        });
      });
    })();

    return () => {
      cancelled = true;
      cancelIdle();
      made.forEach((t) => t.dispose());
    };
  }, [projects, quality.texWidth]);

  useEffect(() => {
    if (drawn && designReady) exhibition.set({ ready: true });
  }, [drawn, designReady]);

  return (
    <Canvas
      frameloop="always"
      dpr={[1, quality.dprMax]}
      // edges on a dense screen need no multisampling, and it is the costliest thing there
      gl={{
        antialias: quality.antialias && window.devicePixelRatio < 1.75,
        alpha: false,
        stencil: false,
      }}
      shadows={{ enabled: true, type: PCFShadowMap }}
      camera={{ fov: 30, near: 0.5, far: 120, position: [-3.4, 3.1, 15.6] }}
      // vertical swipes must keep scrolling the page
      style={{ touchAction: 'pan-y' }}
      onCreated={({ gl }) => {
        gl.toneMapping = NeutralToneMapping;
        gl.toneMappingExposure = 1;
      }}
      onPointerMissed={() => exhibition.set({ selected: null })}
    >
      <Stage quality={quality} />
      <Ring quality={quality} reduced={reduced} />
      <CardField projects={projects} faces={faces} quality={quality} reduced={reduced} />
      <CameraRig track={track} reduced={reduced} />
      {debug ? <Debug /> : null}
      <Governor
        quality={quality}
        onFirstFrame={() => {
          live.dirty = true;
          setDrawn(true);
        }}
        onContextLost={onContextLost}
      />
    </Canvas>
  );
}
