'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { fadeUp, stagger, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

type MotionDivProps = Omit<HTMLMotionProps<'div'>, 'children'>;

type RevealProps = MotionDivProps & {
  children?: ReactNode;
  /** Delay the entrance (seconds). Ignored when reduced-motion is on. */
  delay?: number;
  /** `group` staggers its `RevealItem` children; `item` is a single fade-up. */
  as?: 'item' | 'group';
};

/**
 * Scroll-reveal wrapper. Collapses to a plain, instantly-visible div when the
 * visitor prefers reduced motion.
 */
export function Reveal({ children, className, delay = 0, as = 'item', ...rest }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      variants={as === 'group' ? stagger : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      transition={delay ? { delay } : undefined}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** A child of `<Reveal as="group">` — fades up as part of the stagger. */
export function RevealItem({
  children,
  className,
  ...rest
}: MotionDivProps & { children?: ReactNode }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={cn(className)}>{children}</div>;
  return (
    <motion.div className={cn(className)} variants={fadeUp} {...rest}>
      {children}
    </motion.div>
  );
}
