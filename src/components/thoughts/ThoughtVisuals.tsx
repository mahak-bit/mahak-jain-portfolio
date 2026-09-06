import type { ReactNode } from 'react';

/**
 * Five distinct visual treatments for the thought cards — one per topic, drawn
 * rather than photographed. Everything is stroked in `currentColor` and the
 * accent token, so each composition inherits whichever chapter it sits in.
 */
export type VisualKey = 'design' | 'learning' | 'ideas' | 'ai' | 'shipping';

const frame = 'h-full w-full';

/** 01 — architectural. Hard geometry, offset planes, one long cast shadow. */
function Design() {
  return (
    <svg viewBox="0 0 400 260" className={frame} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g fill="currentColor">
        <rect x="256" y="86" width="150" height="180" opacity="0.05" />
        <rect x="44" y="44" width="128" height="196" opacity="0.11" />
        <rect x="150" y="96" width="96" height="144" opacity="0.16" />
        {/* the long light, raking across */}
        <path d="M150 96 L246 96 L318 260 L222 260 Z" opacity="0.05" />
        <path d="M44 44 L172 44 L214 128 L86 128 Z" opacity="0.04" />
      </g>
      <g stroke="currentColor" strokeWidth="0.75" opacity="0.35" fill="none">
        <rect x="44" y="44" width="128" height="196" />
        <rect x="150" y="96" width="96" height="144" />
      </g>
      <rect x="150" y="96" width="96" height="3" fill="var(--accent)" />
    </svg>
  );
}

/** 02 — blueprint. Construction lines, a swept arc, dimension callouts. */
function Learning() {
  return (
    <svg viewBox="0 0 400 260" className={frame} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <pattern id="tv-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 H0 V20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
        </pattern>
      </defs>
      <rect width="400" height="260" fill="url(#tv-grid)" />
      <g fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.5">
        <circle cx="196" cy="132" r="88" strokeDasharray="3 5" />
        <path d="M196 132 L284 132" />
        <path d="M196 132 L196 44" />
        <path d="M108 220 L284 44" strokeDasharray="6 4" opacity="0.6" />
      </g>
      <path
        d="M196 44 A88 88 0 0 1 284 132"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.75"
      />
      {/* dimension run */}
      <g stroke="currentColor" strokeWidth="0.9" opacity="0.55">
        <path d="M108 238 L284 238" />
        <path d="M108 233 L108 243" />
        <path d="M284 233 L284 243" />
      </g>
      <circle cx="196" cy="132" r="2.5" fill="var(--accent)" />
    </svg>
  );
}

/** 03 — abstract. Soft overlapping fields, one crisp element for tension. */
function Ideas() {
  return (
    <svg viewBox="0 0 400 260" className={frame} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="tv-a" cx="50%" cy="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv-b" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.42" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="140" cy="118" rx="120" ry="104" fill="url(#tv-a)" />
      <ellipse cx="266" cy="156" rx="122" ry="98" fill="url(#tv-b)" />
      <ellipse cx="210" cy="96" rx="80" ry="76" fill="url(#tv-a)" />
      <g fill="none" stroke="currentColor" strokeWidth="0.9" opacity="0.45">
        <circle cx="210" cy="130" r="46" />
      </g>
      <rect x="204" y="124" width="12" height="12" fill="var(--accent)" />
    </svg>
  );
}

/** 04 — systems. A small graph and a weight matrix. No glowing brains. */
function Ai() {
  const nodes = [
    [64, 60],
    [64, 130],
    [64, 200],
    [178, 96],
    [178, 164],
    [286, 130],
  ] as const;
  const edges = [
    [0, 3],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 5],
    [4, 5],
  ] as const;
  return (
    <svg viewBox="0 0 400 260" className={frame} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g stroke="currentColor" strokeWidth="0.8" opacity="0.4">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      {nodes.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === 5 ? 5 : 3.5}
          fill={i === 5 ? 'var(--accent)' : 'currentColor'}
          opacity={i === 5 ? 1 : 0.55}
        />
      ))}
      {/* weight matrix */}
      <g transform="translate(310 74)">
        {Array.from({ length: 16 }).map((_, i) => {
          const c = i % 4;
          const r = Math.floor(i / 4);
          const v = [0.1, 0.32, 0.06, 0.24, 0.4, 0.12, 0.28, 0.08, 0.18, 0.36, 0.1, 0.3, 0.26, 0.08, 0.34, 0.14][i];
          return (
            <rect
              key={i}
              x={c * 18}
              y={r * 18}
              width="13"
              height="13"
              fill="currentColor"
              opacity={v}
            />
          );
        })}
      </g>
      <g stroke="currentColor" strokeWidth="0.8" opacity="0.3">
        <path d="M300 66 L300 60 L376 60" fill="none" />
      </g>
    </svg>
  );
}

/** 05 — wireframe. Bounding boxes, corner ticks, measured spans. */
function Shipping() {
  return (
    <svg viewBox="0 0 400 260" className={frame} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="0.85" opacity="0.5">
        <rect x="56" y="46" width="212" height="150" strokeDasharray="4 4" />
        {/* corner ticks */}
        <path d="M56 62 L56 46 L72 46 M252 46 L268 46 L268 62 M268 180 L268 196 L252 196 M72 196 L56 196 L56 180" strokeDasharray="0" />
      </g>
      {/* UI fragment */}
      <g fill="currentColor">
        <rect x="76" y="66" width="90" height="9" opacity="0.42" />
        <rect x="76" y="86" width="150" height="6" opacity="0.2" />
        <rect x="76" y="100" width="128" height="6" opacity="0.2" />
        <rect x="76" y="132" width="58" height="20" opacity="0.14" />
        <rect x="146" y="132" width="58" height="20" opacity="0.09" />
      </g>
      <rect x="76" y="132" width="58" height="2" fill="var(--accent)" />
      {/* measured span */}
      <g stroke="currentColor" strokeWidth="0.85" opacity="0.55">
        <path d="M56 216 L268 216" />
        <path d="M56 211 L56 221 M268 211 L268 221" />
        <path d="M292 46 L292 196" />
        <path d="M287 46 L297 46 M287 196 L297 196" />
      </g>
      <rect x="320" y="112" width="46" height="18" fill="none" stroke="var(--accent)" strokeWidth="1" />
    </svg>
  );
}

const VISUALS: Record<VisualKey, () => ReactNode> = {
  design: Design,
  learning: Learning,
  ideas: Ideas,
  ai: Ai,
  shipping: Shipping,
};

export function ThoughtVisual({ visual }: { visual: VisualKey }) {
  const Component = VISUALS[visual];
  return <Component />;
}
