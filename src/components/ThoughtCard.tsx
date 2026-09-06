'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import type { Thought } from '@/data/personality';
import { ThoughtVisual } from './thoughts/ThoughtVisuals';

const EASE = [0.16, 1, 0.3, 1] as const;

/** True only on devices with a real mouse — gates the magnetic tilt. */
function useCanHover() {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    () => false
  );
}

/**
 * One card in the thought archive. The front is a drawn composition with its
 * number and title; clicking turns the card over to the thought itself. A real
 * <button> underneath — the tilt, lift and 3D turn are decoration on top.
 */
export function ThoughtCard({
  thought,
  number,
  index,
  isFlipped,
  isDimmed,
  onToggle,
}: {
  thought: Thought;
  number: string;
  index: number;
  isFlipped: boolean;
  isDimmed: boolean;
  onToggle: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const canHover = useCanHover();
  const interactive = canHover && !reduceMotion;

  const btnRef = useRef<HTMLButtonElement>(null);
  const spring = { stiffness: 150, damping: 18, mass: 0.4 };
  const rotate = useMotionValue(thought.rotation);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const sRotate = useSpring(rotate, spring);
  const sTx = useSpring(tx, spring);
  const sTy = useSpring(ty, spring);

  const onEnter = useCallback(() => {
    if (!interactive) return;
    ty.set(-6);
  }, [interactive, ty]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!interactive || !btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      // Settles toward flat, then takes a couple of degrees from the cursor.
      rotate.set(thought.rotation * 0.2 + px * 2.4);
      tx.set(px * 3);
      ty.set(-6 + py * 2);
    },
    [interactive, rotate, tx, ty, thought.rotation]
  );

  const onLeave = useCallback(() => {
    rotate.set(thought.rotation);
    tx.set(0);
    ty.set(0);
  }, [rotate, tx, ty, thought.rotation]);

  const label = thought.tag.replace(/^on\s+/i, '');

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay: reduceMotion ? 0 : Math.min(index * 0.08, 0.4) }}
      className="h-full"
    >
      <motion.div
        animate={{ opacity: isDimmed ? 0.55 : 1 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="h-full"
      >
        <button
          ref={btnRef}
          type="button"
          onClick={onToggle}
          onMouseEnter={onEnter}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          aria-pressed={isFlipped}
          aria-label={`Turn over the note on ${label}`}
          className="group block h-full w-full appearance-none border-0 bg-transparent p-0 text-left outline-offset-4"
          style={{ perspective: 1400 }}
        >
          {reduceMotion ? (
            <div className="h-full" style={{ rotate: `${thought.rotation}deg` }}>
              {isFlipped ? (
                <Back number={number} tag={thought.tag} content={thought.content} />
              ) : (
                <Front number={number} tag={thought.tag} visual={thought.visual} />
              )}
            </div>
          ) : (
            <motion.div style={{ rotate: sRotate, x: sTx, y: sTy }} className="h-full">
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 190, damping: 24 }}
                className="relative h-full"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div aria-hidden={isFlipped} className="absolute inset-0 [backface-visibility:hidden]">
                  <Front number={number} tag={thought.tag} visual={thought.visual} />
                </div>
                <div
                  aria-hidden={!isFlipped}
                  className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                  <Back number={number} tag={thought.tag} content={thought.content} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ---- faces ------------------------------------------------------------- */

const face =
  'border-line bg-surface group-hover:border-accent relative flex h-full flex-col overflow-hidden border transition-colors duration-500';

function Front({
  number,
  tag,
  visual,
}: {
  number: string;
  tag: string;
  visual: Thought['visual'];
}) {
  return (
    <div className={face}>
      <div className="text-fg absolute inset-0 opacity-90 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]">
        <ThoughtVisual visual={visual} />
      </div>
      {/* keeps the type legible over whatever the drawing is doing */}
      <div className="from-surface via-surface/70 absolute inset-0 bg-gradient-to-t to-transparent" />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <span className="meta text-accent">{number}</span>
          <span
            aria-hidden
            className="meta group-hover:text-accent transition-all duration-500 group-hover:rotate-90"
          >
            ↻
          </span>
        </div>
        <h3 className="display-md max-w-[9ch]">{tag}</h3>
      </div>
    </div>
  );
}

function Back({ number, tag, content }: { number: string; tag: string; content: string }) {
  return (
    <div className={face}>
      <div className="flex h-full flex-col justify-between p-5 sm:p-6">
        <span className="meta text-accent">{number}</span>
        <p className="text-fg max-w-[26ch] text-[clamp(1rem,0.85rem+0.7vw,1.4rem)] leading-snug">
          {content}
        </p>
        <div className="border-line flex items-end justify-between border-t pt-3">
          <span className="meta">{tag}</span>
          <span aria-hidden className="meta">
            ↻
          </span>
        </div>
      </div>
    </div>
  );
}
