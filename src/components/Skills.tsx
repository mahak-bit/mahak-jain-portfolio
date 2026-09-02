'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { iWorkWith, pokingAt } from '@/data/skills';

export function Skills() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // A small, opposite-direction drift on the two halves as the section passes.
  const xA = useTransform(scrollYProgress, [0, 1], ['1.5%', '-1.5%']);
  const xB = useTransform(scrollYProgress, [0, 1], ['-2%', '2%']);

  const mid = Math.ceil(iWorkWith.length / 2);
  const rowA = iWorkWith.slice(0, mid);
  const rowB = iWorkWith.slice(mid);

  return (
    <Section id="skills" bleed className="ruled overflow-x-clip">
      <div ref={ref} className="mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal>
          <span className="kicker">Tools</span>
          <h2 className="mt-4 text-[clamp(1.7rem,1.2rem+2vw,2.6rem)]">I work with</h2>
        </Reveal>

        <div className="mt-10 font-display text-[clamp(1.35rem,1rem+2vw,2.4rem)] leading-[1.25]">
          <motion.p style={reduceMotion ? undefined : { x: xA }} className="[text-wrap:balance]">
            {join(rowA)}
          </motion.p>
          <motion.p
            style={reduceMotion ? undefined : { x: xB }}
            className="text-muted mt-1 [text-wrap:balance]"
          >
            {join(rowB)}
          </motion.p>
        </div>

        <Reveal delay={0.05} className="mt-10">
          <p className="text-faint text-[0.95rem]">
            <span className="font-mono text-xs uppercase tracking-[0.12em]">Still poking at</span>
            <span className="mx-3">—</span>
            {pokingAt.join(', ')}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

function join(items: string[]) {
  return items.map((t, i) => (
    <span key={t}>
      {i > 0 && (
        <span className="text-accent align-middle text-[0.5em]" aria-hidden>
          {' ✳ '}
        </span>
      )}
      {t}
    </span>
  ));
}
