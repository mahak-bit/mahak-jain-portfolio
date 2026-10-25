'use client';

import { exhibition } from '../store';
import { labelEls } from '../scene/shared';
import type { ExhibitProject } from '../types';

/**
 * The names under the cards. Each is positioned from the 3D scene every frame
 * (see Cards.tsx) and only decorates: it is hidden from assistive technology
 * and ignores the pointer, because the cards themselves are the targets and
 * <ProjectIndex> is the way in without a mouse.
 */
export function CardLabels({ projects }: { projects: ExhibitProject[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {projects.map((p) => (
        <span
          key={p.slug}
          ref={(el) => {
            if (el) labelEls.set(p.slug, el);
            else labelEls.delete(p.slug);
          }}
          data-state="off"
          className="group absolute top-0 left-0 will-change-transform"
        >
          <span className="text-muted group-data-[state=active]:border-fg group-data-[state=active]:bg-fg group-data-[state=active]:text-bg group-data-[state=hover]:border-accent group-data-[state=hover]:text-accent inline-flex -translate-x-full -translate-y-1/2 items-baseline gap-2 border border-black/10 bg-[#f7f5f0]/90 px-2 py-1 font-mono text-[0.625rem] font-medium tracking-[0.14em] whitespace-nowrap uppercase opacity-0 transition-[opacity,color,background-color,border-color] duration-500 group-data-[state=active]:opacity-100 group-data-[state=hover]:opacity-100 group-data-[state=idle]:opacity-90">
            <span>{p.number}</span>
            <span>{p.name}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * Every project as a button, for anyone without a pointer. It is out of sight
 * until something inside it takes focus; then it opens as a small list at the
 * top left, and the card for whichever entry has focus lifts in the scene.
 */
export function ProjectIndex({ projects }: { projects: ExhibitProject[] }) {
  return (
    <nav
      aria-label="Projects"
      className="group/index absolute top-[92px] left-[var(--gutter)] z-40"
    >
      <ul className="group-focus-within/index:border-line group-focus-within/index:bg-bg sr-only group-focus-within/index:not-sr-only group-focus-within/index:flex group-focus-within/index:flex-col group-focus-within/index:border group-focus-within/index:p-2">
        {projects.map((p) => (
          <li key={p.slug}>
            <button
              type="button"
              onClick={() => exhibition.set({ selected: p.slug })}
              onFocus={() => exhibition.set({ hovered: p.slug })}
              onBlur={() => exhibition.set({ hovered: null })}
              className="meta text-fg hover:text-accent flex w-full items-baseline gap-3 px-3 py-2.5 text-left transition-colors"
            >
              <span className="text-accent">{p.number}</span>
              <span>{p.name}</span>
              <span className="text-muted max-md:hidden">{p.tech.slice(0, 3).join(' / ')}</span>
              <span className="sr-only">. {p.oneLiner} Open to see details.</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
