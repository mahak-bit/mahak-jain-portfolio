'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { site } from '@/lib/site';
import { easeOut } from '@/lib/motion';

const NAME = ['Mahak', 'Jain'];

export function Hero() {
  const reduceMotion = useReducedMotion();

  const line = (i: number) => ({
    initial: reduceMotion ? false : { y: '108%' },
    animate: reduceMotion ? undefined : { y: '0%' },
    transition: { duration: 0.7, ease: easeOut, delay: 0.05 + i * 0.09 },
  });

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, ease: easeOut, delay },
        };

  return (
    <section
      aria-label="Introduction"
      className="mx-auto flex min-h-[88svh] max-w-5xl flex-col justify-center px-5 pb-16 pt-20 sm:px-8"
    >
      <motion.p {...fade(0)} className="kicker">
        Portfolio — {site.location}
      </motion.p>

      {/* Name */}
      <h1 aria-label={site.name} className="mt-6 font-display leading-[0.92] tracking-[-0.02em]">
        {NAME.map((word, i) => (
          <span key={word} className="block overflow-hidden">
            <motion.span
              {...line(i)}
              className="block text-[clamp(3.4rem,1.5rem+13vw,9rem)]"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h1>

      {/* Role + annotation */}
      <div className="mt-7 grid gap-x-10 gap-y-6 sm:grid-cols-[auto_1fr] sm:items-start">
        <motion.p
          {...fade(0.35)}
          className="font-display text-[clamp(1.35rem,1rem+1.6vw,2rem)] leading-tight"
        >
          AI Engineer
          <br />
          <span className="text-accent">&</span> Creative Technologist
        </motion.p>

        <motion.p
          {...fade(0.5)}
          className="annotation max-w-[16rem] -rotate-2 sm:mt-1 sm:justify-self-start"
        >
          {site.annotation} →
        </motion.p>
      </div>

      {/* Statement — indented, narrow measure */}
      <motion.p
        {...fade(0.58)}
        className="text-muted mt-10 max-w-md text-[1.08rem] leading-relaxed sm:ml-[8%]"
      >
        {site.statement}
      </motion.p>

      {/* Links */}
      <motion.div {...fade(0.66)} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2 text-[0.95rem] font-medium"
        >
          <span className="border-fg group-hover:border-accent border-b pb-0.5 transition-colors">
            See the work
          </span>
          <span aria-hidden className="transition-transform group-hover:translate-y-0.5">
            ↓
          </span>
        </Link>
        <Link
          href="/#contact"
          className="text-muted hover:text-fg group inline-flex items-center gap-2 text-[0.95rem] transition-colors"
        >
          Say hi
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </motion.div>

      <motion.p {...fade(0.74)} className="text-faint mt-14 font-mono text-xs">
        Open to good problems — AI products, web apps, automation.
      </motion.p>
    </section>
  );
}
