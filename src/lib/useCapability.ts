import { useSyncExternalStore } from 'react';
import { detectCapability, setListView, type Capability } from './gpu';

/**
 * What the device can do, as a hook — `null` on the server and for the
 * hydration render, the real answer straight after, with no state-setting
 * effect. The probe creates a throwaway WebGL context, so it runs once and the
 * answer is kept; choosing the list view (or going back to 3D) clears it.
 */
let cached: Capability | undefined;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function snapshot(): Capability {
  return (cached ??= detectCapability());
}

export function useCapability(): Capability | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}

/** The visitor picks the plain list (true) or the 3D exhibition (false). */
export function chooseListView(on: boolean) {
  setListView(on);
  cached = undefined;
  listeners.forEach((l) => l());
}
