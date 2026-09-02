'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { site } from '@/lib/site';
import { buttonStyles } from './ui/Button';
import { Magnetic } from './ui/Magnetic';
import { easeOutExpo } from '@/lib/motion';

const HEADLINE = ['Building intelligent products', 'with AI, code & creativity.'];
const BUILD_WORDS = ['AI systems', 'Web experiences', 'Automation', 'Products'];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const px = useSpring(pointerX, { stiffness: 90, damping: 18, mass: 0.6 });
  const py = useSpring(pointerY, { stiffness: 90, damping: 18, mass: 0.6 });

  const ringX = useTransform(px, (v) => v * 22);
  const ringY = useTransform(py, (v) => v * 22);
  const coreX = useTransform(px, (v) => v * -12);
  const coreY = useTransform(py, (v) => v * -12);

  function handlePointer(e: React.MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: easeOutExpo, delay },
        };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handlePointer}
      onMouseLeave={resetPointer}
      className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-5 pb-16 pt-32 sm:px-8 sm:pt-36 lg:pt-32"
      aria-label="Introduction"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* Left — copy */}
        <div>
          <motion.p {...rise(0.05)} className="text-eyebrow flex items-center gap-2">
            <span className="bg-accent inline-block size-1.5 rounded-full" aria-hidden />
            AI Engineer · Creative Technologist
          </motion.p>

          <h1 className="mt-6 text-[clamp(2.4rem,1.2rem+5.4vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.03em]">
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  initial={reduceMotion ? false : { y: '115%' }}
                  animate={reduceMotion ? undefined : { y: '0%' }}
                  transition={{ duration: 0.75, ease: easeOutExpo, delay: 0.15 + i * 0.12 }}
                >
                  {i === 1 ? (
                    <>
                      with <span className="text-accent">AI</span>, code &amp; creativity.
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            {...rise(0.4)}
            className="text-muted mt-7 max-w-lg text-base leading-relaxed sm:text-lg"
          >
            I build AI-powered applications, modern web experiences and automation systems —
            turning ideas into products people can actually use.
          </motion.p>

          <motion.div {...rise(0.5)} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href="/#work" className={buttonStyles('primary', 'lg', 'group')}>
                View My Work
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </Link>
            </Magnetic>
            <Link href="/#contact" className={buttonStyles('outline', 'lg')}>
              Let&rsquo;s Talk
            </Link>
          </motion.div>

          <motion.p {...rise(0.58)} className="text-faint mt-6 font-mono text-xs sm:text-[0.8rem]">
            Based in {site.location} · {site.availability}
          </motion.p>
        </div>

        {/* Right — interactive AI visual */}
        <motion.div
          className="relative mx-auto w-full max-w-md lg:mx-0"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.35 }}
        >
          <div className="relative aspect-square">
            <Orb ringX={ringX} ringY={ringY} coreX={coreX} coreY={coreY} reduceMotion={!!reduceMotion} />
          </div>
          <div className="relative z-10 -mt-14 sm:-mt-16">
            <Terminal reduceMotion={!!reduceMotion} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Orb({
  ringX,
  ringY,
  coreX,
  coreY,
  reduceMotion,
}: {
  ringX: MotionValue<number>;
  ringY: MotionValue<number>;
  coreX: MotionValue<number>;
  coreY: MotionValue<number>;
  reduceMotion: boolean;
}) {
  return (
    <div className="absolute inset-0" aria-hidden>
      {/* glow */}
      <div
        className="absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent-soft), transparent 70%)' }}
      />
      {/* rotating outer ring */}
      <motion.div
        className="border-border-strong absolute inset-[8%] rounded-full border"
        style={reduceMotion ? undefined : { x: ringX, y: ringY }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={reduceMotion ? undefined : { duration: 46, repeat: Infinity, ease: 'linear' }}
      >
        <span className="bg-accent absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full" />
      </motion.div>
      {/* mid ring */}
      <motion.div
        className="border-border absolute inset-[22%] rounded-full border"
        style={reduceMotion ? undefined : { x: ringX, y: ringY }}
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={reduceMotion ? undefined : { duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      {/* core */}
      <motion.div
        className="absolute inset-[36%] rounded-full"
        style={{
          ...(reduceMotion ? {} : { x: coreX, y: coreY }),
          background:
            'conic-gradient(from 140deg, var(--accent), color-mix(in oklch, var(--accent) 25%, transparent), var(--accent))',
        }}
        animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
        transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="bg-background/40 absolute inset-[3px] rounded-full backdrop-blur-sm" />
      </motion.div>
    </div>
  );
}

function Terminal({ reduceMotion }: { reduceMotion: boolean }) {
  const [text, setText] = useState(reduceMotion ? BUILD_WORDS[0] : '');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const current = BUILD_WORDS[wordIndex];
    const atFull = text === current;
    const atEmpty = text === '';
    const delay = atFull && !deleting ? 1500 : atEmpty && deleting ? 400 : deleting ? 34 : 68;

    const id = setTimeout(() => {
      if (atFull && !deleting) {
        setDeleting(true);
      } else if (atEmpty && deleting) {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % BUILD_WORDS.length);
      } else {
        setText(current.slice(0, deleting ? text.length - 1 : text.length + 1));
      }
    }, delay);

    return () => clearTimeout(id);
  }, [text, deleting, wordIndex, reduceMotion]);

  return (
    <div className="border-border-strong bg-surface/85 shadow-xl shadow-black/10 overflow-hidden rounded-xl border backdrop-blur-md">
      <div className="border-border/70 flex items-center gap-1.5 border-b px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" />
        <span className="text-faint ml-2 font-mono text-xs">mahak@portfolio ~</span>
      </div>
      <div className="space-y-1.5 px-4 py-4 font-mono text-[0.82rem] leading-relaxed">
        <p>
          <span className="text-accent">$</span> <span className="text-foreground">build</span>{' '}
          <span className="text-muted">--something-amazing</span>
        </p>
        <p className="text-muted flex items-center">
          <span className="text-accent mr-2">→</span>
          <span className="text-foreground">{text || ' '}</span>
          <span className="bg-accent ml-0.5 inline-block h-[1.05em] w-[2px] animate-pulse" />
        </p>
        <p className="text-faint pt-1">{'// AI systems · Web experiences · Automation · Products'}</p>
      </div>
    </div>
  );
}
