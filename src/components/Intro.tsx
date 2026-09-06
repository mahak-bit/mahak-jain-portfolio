'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;
const SESSION_KEY = 'mj-intro-seen';

/**
 * The opening. An ivory ground with a counter running to 100 in the corner,
 * then the ground lifts away and the page is underneath.
 *
 * It runs once per tab (sessionStorage), can be dismissed with any key, click
 * or scroll, and is skipped outright under reduced motion — an intro that
 * can't be got past is a usability problem, not an art direction.
 *
 * It deliberately does not touch document overflow: it covers the page as a
 * fixed layer, and whatever it sits over owns the scroll lock. Two components
 * writing the same property means whichever unmounts last wins.
 */
export function Intro({ onDone }: { onDone?: () => void }) {
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle');
  const [count, setCount] = useState(0);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    setState('done');
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* private mode — the intro simply runs again */
    }
    onDone?.();
  }, [onDone]);

  // Decide whether to run at all. The decision needs sessionStorage, so it can
  // only happen on the client — deferred a tick so the state change lands in a
  // callback rather than synchronously inside the effect body.
  useEffect(() => {
    const id = window.setTimeout(() => {
      let seen = false;
      try {
        seen = sessionStorage.getItem(SESSION_KEY) === '1';
      } catch {
        /* private mode — the intro simply runs */
      }
      if (seen || reduceMotion) {
        finished.current = true;
        setState('done');
        onDone?.();
        return;
      }
      setState('running');
    }, 0);
    return () => window.clearTimeout(id);
  }, [reduceMotion, onDone]);

  // The counter.
  useEffect(() => {
    if (state !== 'running') return;
    const start = performance.now();
    const DURATION = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // ease-out so it decelerates into 100
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(finish, 260);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, finish]);

  // Any input gets past it.
  useEffect(() => {
    if (state !== 'running') return;
    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('wheel', skip);
    };
  }, [state, finish]);

  return (
    <AnimatePresence>
      {state === 'running' && (
        <motion.div
          className="bg-bg fixed inset-0 z-[100] flex flex-col justify-end"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: EASE }}
          aria-hidden
        >
          <div className="gutter-x flex items-end justify-between pb-8">
            <span className="font-mono text-[clamp(3rem,10vw,7rem)] leading-none tracking-[-0.04em] tabular-nums">
              {String(count).padStart(3, '0')}
            </span>
            <span className="meta pb-3">Loading</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
