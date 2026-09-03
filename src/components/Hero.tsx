'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { site } from '@/lib/site';
import { easeOut } from '@/lib/motion';
import { cn } from '@/lib/utils';

const NAME = ['Mahak', 'Jain'];
const TAGS = ['Web Apps', 'Python Systems', 'GenAI Products', 'Agents'];
const ROLES = ['Full-Stack Developer', 'Python Developer', 'GenAI Engineer'];

export function Hero() {
  const reduceMotion = useReducedMotion();

  // A slow spotlight that moves across the three roles.
  const [lit, setLit] = useState(0);
  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setLit((n) => (n + 1) % ROLES.length), 2200);
    return () => clearInterval(id);
  }, [reduceMotion]);

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
      {/* What I build — animated tag boxes */}
      <ul className="flex flex-wrap gap-2" aria-label="What I build">
        {TAGS.map((tag, i) => (
          <motion.li
            key={tag}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut, delay: 0.06 + i * 0.09 }}
            className="border-line text-faint hover:border-accent hover:text-fg border px-2.5 py-1 font-mono text-[0.64rem] uppercase tracking-[0.16em] transition-colors"
          >
            {tag}
          </motion.li>
        ))}
      </ul>

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
      <div className="mt-6 flex flex-col gap-4">
        <p className="flex flex-wrap items-center font-mono text-[0.8rem] tracking-[0.02em]">
          {ROLES.map((role, i) => (
            <motion.span
              key={role}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: easeOut, delay: 0.35 + i * 0.1 }}
              className="inline-flex items-center whitespace-nowrap"
            >
              {i > 0 && (
                <span aria-hidden className="text-accent/40 mx-1.5 select-none">
                  ·
                </span>
              )}
              <span
                className={cn(
                  'rounded-[3px] px-1.5 py-0.5 transition-colors duration-700 ease-out',
                  !reduceMotion && lit === i
                    ? 'bg-accent/15 text-accent'
                    : 'text-muted'
                )}
              >
                {role}
              </span>
            </motion.span>
          ))}
        </p>

        <motion.p {...fade(0.5)} className="annotation -rotate-2">
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
