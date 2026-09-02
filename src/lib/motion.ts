import type { Variants, Transition } from 'framer-motion';

/** Shared easing — a soft "out-expo" that feels expensive without being slow. */
export const easeOutExpo: Transition['ease'] = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutExpo },
  },
};

/** Parent that staggers its children's `fadeUp` entrances. */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const viewportOnce = { once: true, margin: '-15% 0px -10% 0px' } as const;
