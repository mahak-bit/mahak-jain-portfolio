import type { Variants, Transition } from 'framer-motion';

/** One easing for the whole site — a quiet settle, nothing springy. */
export const easeOut: Transition['ease'] = [0.22, 1, 0.36, 1];

/** The only entrance used anywhere: a small opacity + 6px lift. */
export const enter: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

export const viewportOnce = { once: true, margin: '-8% 0px -8% 0px' } as const;
