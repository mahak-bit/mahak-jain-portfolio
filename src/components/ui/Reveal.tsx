'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { enter, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

type RevealProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children?: ReactNode;
  delay?: number;
};

/**
 * The one scroll-entrance on the site: a quiet fade + 6px lift, once.
 * Collapses to a plain div under reduced motion.
 */
export function Reveal({ children, className, delay = 0, ...rest }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={cn(className)}>{children}</div>;

  return (
    <motion.div
      className={cn(className)}
      variants={enter}
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
