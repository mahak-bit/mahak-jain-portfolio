'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  DataTexture,
  Euler,
  Group,
  MathUtils,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Quaternion,
  RGBAFormat,
  SRGBColorSpace,
  Vector3,
  type CanvasTexture,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { Quality } from '@/lib/gpu';
import { exhibition, live } from '../store';
import type { ExhibitProject } from '../types';
import { CARD, RING, SCENES, cardPoses, type CardPose } from './layout';
import { activity, cardMeshes, labelEls, rig } from './shared';

export interface Faces {
  design: CanvasTexture | null;
  code: CanvasTexture | null;
}

const { damp, clamp, lerp } = MathUtils;
const ease = (t: number) => t * t * (3 - 2 * t);

const MID = new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)); // lies the card flat
const MID_INV = MID.clone().invert();
const FLIP_AXIS = new Vector3(0, 1, 0);

const _hero = new Quaternion();
const _heroPos = new Vector3();
const _anchor = new Vector3();
const _base = new Euler();

/**
 * Where a card goes when it is opened: in front of the camera, facing it, big
 * enough to read. On a wide screen it sits left of centre and leaves the right
 * for the details; on a tall one it takes the upper part and the details rise
 * from the bottom.
 */
function heroPose(camera: PerspectiveCamera, aspect: number, outPos: Vector3) {
  const d = 7;
  const visH = 2 * d * Math.tan(MathUtils.degToRad(camera.fov / 2));
  const visW = visH * aspect;
  const portrait = aspect < 1;
  const byWidth = ((portrait ? 0.84 : 0.47) * visW) / CARD.w;
  const byHeight = ((portrait ? 0.27 : 0.52) * visH) / CARD.h;
  const scale = Math.min(byWidth, byHeight);
  // portrait: the card takes the strip between the masthead and the sheet
  outPos
    .set(portrait ? 0 : -0.2 * visW, portrait ? 0.225 * visH : 0.02 * visH, -d)
    .applyMatrix4(camera.matrixWorld);
  return scale;
}

export function CardField({
  projects,
  faces,
  quality,
  reduced,
}: {
  projects: ExhibitProject[];
  faces: Record<string, Faces>;
  quality: Quality;
  reduced: boolean;
}) {
  const poses = useMemo(() => cardPoses(projects.length), [projects.length]);

  const geometry = useMemo(() => {
    const g = new RoundedBoxGeometry(CARD.w, CARD.h, CARD.thick, 2, CARD.thick * 0.45);
    // the box arrives as six groups (+x -x +y -y +z -z), one draw call each; the
    // four edges can share one, so a card costs three calls rather than six
    const face = g.attributes.position.count / 6;
    g.clearGroups();
    g.addGroup(0, face * 4, 0);
    g.addGroup(face * 4, face, 1);
    g.addGroup(face * 5, face, 2);
    return g;
  }, []);
  const edge = useMemo(
    () => new MeshStandardMaterial({ color: '#efede8', roughness: 0.85, metalness: 0 }),
    []
  );
  const placeholder = useMemo(() => {
    const t = new DataTexture(new Uint8Array([228, 226, 221, 255]), 1, 1, RGBAFormat);
    t.colorSpace = SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }, []);

  useEffect(
    () => () => {
      geometry.dispose();
      edge.dispose();
      placeholder.dispose();
    },
    [geometry, edge, placeholder]
  );

  // Put each face on the GPU as soon as it exists, so turning a card over, or
  // opening one, never stalls on a texture upload.
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    for (const f of Object.values(faces)) {
      if (f.design) gl.initTexture(f.design);
      if (f.code) gl.initTexture(f.code);
    }
  }, [faces, gl]);

  return (
    <>
      {projects.map((project, i) => (
        <Card
          key={project.slug}
          project={project}
          index={i}
          count={projects.length}
          pose={poses[i]}
          faces={faces[project.slug]}
          geometry={geometry}
          edge={edge}
          placeholder={placeholder}
          quality={quality}
          reduced={reduced}
        />
      ))}
    </>
  );
}

function Card({
  project,
  index,
  count,
  pose,
  faces,
  geometry,
  edge,
  placeholder,
  quality,
  reduced,
}: {
  project: ExhibitProject;
  index: number;
  count: number;
  pose: CardPose;
  faces: Faces | undefined;
  geometry: RoundedBoxGeometry;
  edge: MeshStandardMaterial;
  placeholder: DataTexture;
  quality: Quality;
  reduced: boolean;
}) {
  const outer = useRef<Group>(null);
  const flipRef = useRef<Group>(null);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const gl = useThree((s) => s.gl);

  const front = useMemo(
    () => new MeshBasicMaterial({ map: placeholder, toneMapped: false }),
    [placeholder]
  );
  const back = useMemo(
    () => new MeshBasicMaterial({ map: placeholder, toneMapped: false }),
    [placeholder]
  );
  // groups: the four edges, the front face (+z), the back face (-z)
  const materials = useMemo(() => [edge, front, back], [edge, front, back]);

  useEffect(
    () => () => {
      front.dispose();
      back.dispose();
    },
    [front, back]
  );

  useEffect(() => {
    front.map = faces?.design ?? placeholder;
    front.needsUpdate = true;
    live.dirty = true;
  }, [faces?.design, front, placeholder]);

  useEffect(() => {
    back.map = faces?.code ?? placeholder;
    back.needsUpdate = true;
    live.dirty = true;
  }, [faces?.code, back, placeholder]);

  const s = useRef({ hover: 0, sel: 0, active: 0, dim: 0, gather: 0, label: '' });

  useFrame((state, dt) => {
    const g = outer.current;
    const flip = flipRef.current;
    if (!g || !flip) return;

    const { selected, hovered, scene, active } = exhibition.get();
    const anySel = selected !== null;
    const isSel = selected === project.slug;
    const st = s.current;
    const L = (rate: number) => (reduced ? 400 : rate);

    const before = st.hover + st.sel + st.active + st.dim;
    st.hover = damp(st.hover, hovered === project.slug && !anySel ? 1 : 0, L(10), dt);
    st.sel = damp(st.sel, isSel ? 1 : 0, L(5.5), dt);
    st.active = damp(st.active, scene === 1 && active === index && !anySel ? 1 : 0, L(6), dt);
    st.dim = damp(st.dim, anySel && !isSel ? 1 : 0, L(6), dt);
    const settling = Math.abs(before - (st.hover + st.sel + st.active + st.dim)) > 1e-4;

    // the entrance: each card slides out from the ring's footing to its place, one
    // after another; the last always has time to land, however many there are
    const e = ease(
      clamp(rig.intro * 1.8 - index * Math.min(0.13, 0.78 / Math.max(1, count - 1)), 0, 1)
    );
    const flipMix = clamp(rig.mix * 1.6 - (index / Math.max(1, count - 1)) * 0.6, 0, 1);

    const hop = Math.sin(Math.PI * flipMix) * 0.55;
    const lift = st.hover * 0.16 + st.active * 0.1 + hop;
    const arc = Math.sin(Math.PI * e) * 0.35;

    // At the close the cards go back to where they came from: gathered into a
    // tidy pile at the ring's feet, which also leaves the floor clear for the
    // contact lines, whatever shape the screen is.
    const gather = ease(clamp((rig.progress - SCENES.contact.from) / 0.09, 0, 1));
    const pileX = RING.x + (index - (count - 1) / 2) * 0.05;
    const pileZ = RING.z + 1.15;

    const x = lerp(lerp(RING.x, pose.x, e), pileX, gather);
    const z = lerp(lerp(RING.z + 0.6, pose.z, e), pileZ, gather);
    g.position.set(x, 0.012 + lift + arc * (1 - e) + gather * index * 0.042, z);
    _base.set(0, lerp(pose.yaw * e, 0, gather), 0);
    g.quaternion.setFromEuler(_base);
    g.scale.setScalar(1 + st.hover * 0.025);

    // the face the card shows: a turn about its own vertical axis
    flip.quaternion.setFromAxisAngle(FLIP_AXIS, Math.PI * flipMix);

    if (st.sel > 0.001) {
      const aspect = state.size.width / state.size.height;
      const scale = heroPose(camera, aspect, _heroPos);
      // The card ends up facing the camera with whichever face the control has
      // turned up: world = outer * MID * flip, so outer = camera * MID^-1 leaves
      // the flip to do its work (and DESIGN or CODE stays where the viewer set it).
      _hero.copy(camera.quaternion).multiply(MID_INV);
      const k = ease(st.sel);
      g.position.lerp(_heroPos, k);
      g.quaternion.slerp(_hero, k);
      g.scale.setScalar(lerp(g.scale.x, scale, k));
    }

    // dim whatever isn't the subject while a project is open
    const shade = lerp(1, 0.5, st.dim) + st.active * 0.0;
    front.color.setScalar(shade);
    back.color.setScalar(shade);

    // the DOM label rides beside its card on the floor: off the card's left edge,
    // where the ribbon leaves clear floor, so it never sits on a neighbouring card
    const label = labelEls.get(project.slug);
    if (label) {
      const { width, height } = state.size;
      const reach = CARD.w / 2 + 0.32;
      _anchor.set(pose.x - Math.cos(pose.yaw) * reach, 0, pose.z + Math.sin(pose.yaw) * reach);
      _anchor.project(camera);
      const visible =
        _anchor.z < 1 && e > 0.95 && !anySel && (scene === 1 || hovered === project.slug);
      const mode =
        !visible || !quality.labelAll
          ? 'off'
          : st.active > 0.5
            ? 'active'
            : hovered === project.slug
              ? 'hover'
              : 'idle';
      if (mode !== st.label) {
        label.dataset.state = mode;
        st.label = mode;
      }
      if (visible) {
        label.style.transform = `translate3d(${((_anchor.x * 0.5 + 0.5) * width).toFixed(1)}px, ${((-_anchor.y * 0.5 + 0.5) * height).toFixed(1)}px, 0)`;
      }
    }

    // the camera and the control stamp their own motion; this is only the card's
    const pileMoved = Math.abs(gather - st.gather) > 1e-4;
    st.gather = gather;
    if (settling || e < 1 || pileMoved) activity.t = state.clock.elapsedTime;
  });

  return (
    <group ref={outer} position={[RING.x, 0.012, RING.z + 0.6]}>
      <group quaternion={MID}>
        <group ref={flipRef}>
          <mesh
            ref={(m) => {
              if (m) cardMeshes.set(project.slug, m);
              else cardMeshes.delete(project.slug);
            }}
            geometry={geometry}
            material={materials}
            castShadow
            onPointerOver={(ev) => {
              ev.stopPropagation();
              exhibition.set({ hovered: project.slug });
              gl.domElement.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              exhibition.set({ hovered: null });
              gl.domElement.style.cursor = '';
            }}
            onClick={(ev) => {
              ev.stopPropagation();
              exhibition.set({ selected: project.slug });
            }}
          />
        </group>
      </group>
    </group>
  );
}
