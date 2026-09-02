'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useMounted } from '@/lib/use-mounted';

/**
 * A single soft accent dot that trails the cursor. Fine-pointer devices only,
 * and fully disabled under reduced motion. Purely decorative — aria-hidden.
 */
export function Cursor() {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();
  const [hovering, setHovering] = useState(false);

  const enabled =
    mounted &&
    !reduceMotion &&
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;

    function move(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHovering(Boolean(el?.closest('a, button, [role="button"], input, textarea')));
    }

    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-6 w-6 rounded-full mix-blend-difference md:block"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        backgroundColor: 'oklch(0.82 0.125 78)',
      }}
      animate={{ scale: hovering ? 2.4 : 1, opacity: hovering ? 0.35 : 0.9 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    />
  );
}
