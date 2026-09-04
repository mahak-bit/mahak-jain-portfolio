'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import type { Thought } from '@/data/personality';
import { easeOut, viewportOnce } from '@/lib/motion';

/**
 * One card in the "A little more about me" archive — a front label that
 * flips over on click/tap to reveal the thought. A real <button> under the
 * hood; the tilt, lift and 3D turn are all decoration on top.
 */

/** True only on devices with a real mouse — gates the magnetic-tilt effect. */
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
  const springOpts = { stiffness: 140, damping: 16, mass: 0.4 };
  const rotate = useMotionValue(thought.rotation);
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const scale = useMotionValue(1);
  const sRotate = useSpring(rotate, springOpts);
  const sTx = useSpring(tx, springOpts);
  const sTy = useSpring(ty, springOpts);
  const sScale = useSpring(scale, springOpts);

  const onEnter = useCallback(() => {
    if (!interactive) return;
    ty.set(-6);
    scale.set(1.012);
  }, [interactive, ty, scale]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!interactive || !btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      // "toward 0deg" + the magnetic wobble are the same move: mostly flattened,
      // nudged a couple of degrees by the cursor.
      rotate.set(thought.rotation * 0.25 + px * 4);
      tx.set(px * 4);
      ty.set(-6 + py * 3);
    },
    [interactive, rotate, tx, ty, thought.rotation]
  );

  const onLeave = useCallback(() => {
    rotate.set(thought.rotation);
    tx.set(0);
    ty.set(0);
    scale.set(1);
  }, [rotate, tx, ty, scale, thought.rotation]);

  const tagLabel = thought.tag.replace(/^on\s+/i, '').toLowerCase();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{
        duration: 0.5,
        ease: easeOut,
        delay: reduceMotion ? 0 : Math.min(index * 0.08, 0.4),
      }}
    >
      <motion.div
        animate={{ opacity: isDimmed ? 0.88 : 1 }}
        transition={{ duration: 0.25, ease: easeOut }}
      >
        <button
          ref={btnRef}
          type="button"
          onClick={onToggle}
          onMouseEnter={onEnter}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          aria-pressed={isFlipped}
          aria-label={`Flip thought about ${tagLabel}`}
          className="group block w-full appearance-none border-0 bg-transparent p-0 text-left outline-offset-4"
          style={{ perspective: 1200 }}
        >
          {reduceMotion ? (
            <div
              className="relative min-h-[210px] sm:min-h-[236px]"
              style={{ rotate: `${thought.rotation}deg` }}
            >
              {isFlipped ? (
                <Back number={number} tag={thought.tag} content={thought.content} />
              ) : (
                <Front number={number} tag={thought.tag} />
              )}
            </div>
          ) : (
            <motion.div style={{ rotate: sRotate, x: sTx, y: sTy, scale: sScale }}>
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                className="relative min-h-[210px] sm:min-h-[236px]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  aria-hidden={isFlipped}
                  className="absolute inset-0 [backface-visibility:hidden]"
                >
                  <Front number={number} tag={thought.tag} />
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

const faceClass =
  'border-line bg-surface group-hover:border-accent/35 flex h-full flex-col justify-between rounded-[3px] border p-6 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] duration-300 group-hover:shadow-[0_18px_36px_-16px_rgba(0,0,0,0.45)] sm:p-7';

function Front({ number, tag }: { number: string; tag: string }) {
  return (
    <div className={faceClass}>
      <div className="flex items-start justify-between">
        <span className="text-faint font-mono text-xs tabular-nums">{number}</span>
        <span
          aria-hidden="true"
          className="text-faint group-hover:text-accent/70 font-mono text-sm transition-transform duration-300 group-hover:rotate-45"
        >
          ↻
        </span>
      </div>
      <span className="kicker">{tag}</span>
    </div>
  );
}

function Back({ number, tag, content }: { number: string; tag: string; content: string }) {
  return (
    <div className={faceClass}>
      <p className="font-display text-[clamp(1.05rem,0.9rem+0.9vw,1.3rem)] leading-snug text-balance">
        {content}
      </p>
      <div className="flex items-end justify-between gap-3">
        <span className="kicker">
          {number} · {tag}
        </span>
        <span aria-hidden="true" className="text-faint font-mono text-sm">
          ↻
        </span>
      </div>
    </div>
  );
}
