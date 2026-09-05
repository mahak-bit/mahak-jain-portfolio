'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { ArchiveBackdrop } from './ArchiveBackdrop';
import { projects } from '@/data/projects';
import { easeOut } from '@/lib/motion';

const cover: Variants = {
  rest: { rotateX: 0, y: 0 },
  hover: { rotateX: -15, y: -6 },
};

const sheet: Variants = {
  rest: { y: 0, x: 0, rotate: 0, transition: { duration: 0.35, ease: easeOut } },
  hover: (i: number) => ({
    y: -10 - i * 4,
    x: (i - 1) * 12,
    rotate: (i - 1) * 2.4,
    transition: { duration: 0.4, ease: easeOut },
  }),
};

export function HomeArchive() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [opening, setOpening] = useState(false);
  const [focused, setFocused] = useState(false);
  const pushed = useRef(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 16, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 140, damping: 16, mass: 0.4 });

  function onMove(e: React.MouseEvent) {
    if (reduceMotion || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 7);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 7);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  function go() {
    if (pushed.current) return;
    pushed.current = true;
    router.push('/archive');
  }

  function handleOpen(e: React.MouseEvent) {
    if (reduceMotion || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setOpening(true);
    window.setTimeout(go, 850); // fallback if onAnimationComplete misses
  }

  const previews = projects.slice(0, 3);
  const count = projects.filter((p) => p.status !== 'placeholder').length;

  return (
    <Section id="work" bleed className="ruled relative overflow-x-clip">
      <ArchiveBackdrop />

      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="flex flex-col items-center">
          <span className="kicker">The archive</span>

          <div
            ref={wrapRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="mt-12 w-full max-w-[30rem] [perspective:1400px] sm:mt-14"
          >
            <Link
              href="/archive"
              onClick={handleOpen}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="Open the archive — everything Mahak has built"
              className="block rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
            >
              <motion.div
                className="group relative [transform-style:preserve-3d]"
                initial="rest"
                animate={!reduceMotion && focused ? 'hover' : 'rest'}
                whileHover={reduceMotion ? undefined : 'hover'}
                style={reduceMotion ? undefined : { rotateX: srx, rotateY: sry }}
              >
                {/* prints peeking out the top */}
                <div className="absolute inset-x-7 -top-7 flex flex-col gap-1.5">
                  {previews.map((p, i) => (
                    <motion.div
                      key={p.slug}
                      custom={i}
                      variants={reduceMotion ? undefined : sheet}
                      style={{ zIndex: -i - 1 }}
                      className="border-line bg-raise flex items-center justify-between gap-4 rounded-[2px] border px-4 py-2"
                    >
                      <span className="text-faint font-mono text-[0.62rem]">{p.number}</span>
                      <span className="text-muted truncate font-mono text-[0.68rem]">
                        {p.name}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* the cover */}
                <motion.div
                  variants={reduceMotion ? undefined : cover}
                  transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                  style={{ transformOrigin: 'bottom' }}
                  className="border-line bg-surface relative z-10 flex aspect-[4/3] flex-col justify-between rounded-[3px] border p-8 shadow-[0_28px_60px_-30px_rgba(0,0,0,0.4)] transition-shadow group-hover:shadow-[0_50px_90px_-36px_rgba(0,0,0,0.5)] sm:p-11"
                >
                  <span className="border-line bg-surface text-faint absolute -top-[1.6rem] left-9 border border-b-0 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.22em]">
                    M · J
                  </span>

                  <div>
                    <h2 className="font-display text-[clamp(2rem,1.4rem+3vw,3.1rem)] leading-[0.95]">
                      The Archive
                    </h2>
                    <span className="bg-line my-4 block h-px w-12" />
                    <p className="text-muted text-[1.05rem]">Everything I&rsquo;ve built.</p>
                  </div>

                  <div className="flex items-end justify-between">
                    <span className="text-faint font-mono text-xs">
                      {count} {count === 1 ? 'piece' : 'pieces'}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm font-medium">
                      <span className="border-fg group-hover:border-accent border-b pb-0.5 transition-colors">
                        Open archive
                      </span>
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </Link>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {opening && (
          <motion.div
            aria-hidden
            className="bg-bg fixed inset-0 z-[90] flex items-center justify-center [perspective:1200px]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="border-line bg-surface flex aspect-[4/3] w-[min(30rem,82vw)] flex-col justify-between rounded-[3px] border p-10"
              style={{ transformOrigin: 'bottom' }}
              initial={{ rotateX: -15, y: -6, scale: 1, opacity: 1 }}
              animate={{ rotateX: -112, scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.6, ease: easeOut }}
              onAnimationComplete={go}
            >
              <h2 className="font-display text-4xl leading-none">The Archive</h2>
              <p className="text-muted text-[1.05rem]">Everything I&rsquo;ve built.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
