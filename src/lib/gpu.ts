/**
 * What this device can run, decided once on the client.
 *
 * The 3D exhibition is an enhancement, never a requirement: anything that can't
 * do WebGL2 properly, or that asks for less motion, or simply prefers a plain
 * page, gets the list view, which carries exactly the same content.
 */
export type Tier = 'desktop' | 'tablet' | 'mobile';

export type Capability = { ok: true; tier: Tier } | { ok: false; reason: 'no-webgl' | 'list-view' };

const LIST_KEY = 'exhibition:list-view';

function readParam(name: string): string | null {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
}

/** The visitor chose the plain page — in this session, or via ?view=list. */
export function prefersListView(): boolean {
  if (readParam('view') === 'list') return true;
  try {
    return window.sessionStorage.getItem(LIST_KEY) === '1';
  } catch {
    return false;
  }
}

export function setListView(on: boolean) {
  try {
    if (on) window.sessionStorage.setItem(LIST_KEY, '1');
    else window.sessionStorage.removeItem(LIST_KEY);
  } catch {
    /* storage can be blocked; the choice just won't persist */
  }
}

/**
 * Phones and tablets get a lighter scene: fewer segments, a smaller shadow map,
 * smaller textures and a lower pixel ratio. The tier is about the device, so it
 * is read from the input type and the memory/CPU hints, not only the width.
 */
function pickTier(): Tier {
  const forced = readParam('tier');
  if (forced === 'mobile' || forced === 'tablet' || forced === 'desktop') return forced;

  const w = window.innerWidth;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency || 4;

  if (w < 720 || (coarse && w < 900) || (memory !== undefined && memory <= 2) || cores <= 2) {
    return 'mobile';
  }
  if (coarse || w < 1100) return 'tablet';
  return 'desktop';
}

export function detectCapability(): Capability {
  if (prefersListView()) return { ok: false, reason: 'list-view' };

  try {
    const probe = document.createElement('canvas');
    // A software renderer would "work" and then crawl, so it counts as no WebGL.
    const gl = probe.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    if (!gl) return { ok: false, reason: 'no-webgl' };
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    return { ok: false, reason: 'no-webgl' };
  }

  return { ok: true, tier: pickTier() };
}

/** Everything that scales with the device, in one place. */
export interface Quality {
  /** Upper bound for the device pixel ratio the canvas renders at. */
  dprMax: number;
  /** Width of each card face texture, px. */
  texWidth: number;
  /** Shadow map edge, px. */
  shadowMap: number;
  ringSegments: number;
  antialias: boolean;
  /** A slow idle drift in the scene when nothing else is moving. */
  ambient: boolean;
  /** Label every card in the scene, or only the active one. */
  labelAll: boolean;
}

export const QUALITY: Record<Tier, Quality> = {
  desktop: {
    dprMax: 2,
    texWidth: 1280,
    shadowMap: 2048,
    ringSegments: 160,
    antialias: true,
    ambient: true,
    labelAll: true,
  },
  tablet: {
    dprMax: 1.75,
    texWidth: 1024,
    shadowMap: 1024,
    ringSegments: 112,
    antialias: true,
    ambient: false,
    labelAll: true,
  },
  mobile: {
    dprMax: 1.5,
    texWidth: 768,
    shadowMap: 1024,
    ringSegments: 72,
    antialias: true,
    ambient: false,
    labelAll: false,
  },
};
