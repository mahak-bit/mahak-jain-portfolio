import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * `false` during SSR and the first client render, `true` afterwards — without a
 * state-setting effect. Use to gate client-only UI (theme, pointer effects)
 * past hydration.
 */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
