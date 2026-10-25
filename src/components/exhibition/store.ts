import { useSyncExternalStore } from 'react';

/**
 * The exhibition's shared state, in two parts.
 *
 * `state` is what the interface (React) reads: which project is open, which
 * face the cards are showing, which scene the scroll is in. It changes rarely
 * and goes through subscribe/getSnapshot.
 *
 * `live` is what the renderer reads every frame: the scroll position and the
 * pointer. It is a plain mutable object, never rendered from, so a scroll tick
 * costs an assignment rather than a React render.
 *
 * R3F does not carry React context across its canvas boundary, so a module
 * store is also the simplest way for the DOM and the scene to share state.
 * There is one exhibition per page; `reset` runs on mount.
 */

export interface ExhibitionState {
  /** Slug of the project being viewed in detail, if any. */
  selected: string | null;
  /** Slug of the card under the pointer. */
  hovered: string | null;
  /**
   * Which face the cards show: 0 is DESIGN (the work as it looks), 1 is CODE
   * (how it is built). Continuous, so dragging the control turns the cards.
   */
  mix: number;
  /** 0 intro, 1 projects, 2 capabilities, 3 contact — from the scroll. */
  scene: number;
  /** The project the scroll tour is currently on. */
  active: number;
  /** The first frame is on screen and the card faces are loaded. */
  ready: boolean;
}

const initial: ExhibitionState = {
  selected: null,
  hovered: null,
  mix: 0,
  scene: 0,
  active: 0,
  ready: false,
};

let state: ExhibitionState = initial;
const listeners = new Set<() => void>();

export const exhibition = {
  get: () => state,

  set(patch: Partial<ExhibitionState>) {
    let changed = false;
    for (const key of Object.keys(patch) as (keyof ExhibitionState)[]) {
      if (state[key] !== patch[key]) {
        changed = true;
        break;
      }
    }
    if (!changed) return;
    state = { ...state, ...patch };
    live.dirty = true;
    listeners.forEach((l) => l());
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  reset() {
    state = initial;
    live.progress = 0;
    live.pointer.x = 0;
    live.pointer.y = 0;
    live.dirty = true;
    listeners.forEach((l) => l());
  },
};

export const live = {
  /** Scroll progress through the exhibition, 0..1. The camera eases to it. */
  progress: 0,
  /** Pointer, -1..1 on each axis, centre is 0. */
  pointer: { x: 0, y: 0 },
  /** Anything that wants a frame drawn sets this; the renderer clears it. */
  dirty: true,
};

export function useExhibition<T>(select: (s: ExhibitionState) => T): T {
  return useSyncExternalStore(
    exhibition.subscribe,
    () => select(state),
    () => select(initial)
  );
}
