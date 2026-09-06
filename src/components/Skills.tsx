'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { iWorkWith, pokingAt } from '@/data/skills';

/**
 * The toolset set as a run of display type rather than a badge wall, with the
 * two halves drifting past each other as the section crosses the viewport.
 */
export function Skills() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const xA = useTransform(scrollYProgress, [0, 1], ['2%', '-2.5%']);
  const xB = useTransform(scrollYProgress, [0, 1], ['-3%', '2.5%']);

  const mid = Math.ceil(iWorkWith.length / 2);
  const rowA = iWorkWith.slice(0, mid);
  const rowB = iWorkWith.slice(mid);

  return (
    <Section id="skills" bleed className="overflow-x-clip pt-0 sm:pt-0 lg:pt-0">
      <div ref={ref} className="mx-auto w-full max-w-[1500px]">
        <SectionMark index="05" label="Tools" />

        <Reveal className="mt-10 sm:mt-14">
          <h2 className="display-lg">I work with</h2>
        </Reveal>

        {/* The list is long on purpose — it is the breadth. Sized so the whole
            run stays a readable block rather than becoming a wall of display. */}
        <div className="font-display mt-12 text-[clamp(1.25rem,0.9rem+1.7vw,2.35rem)] leading-[1.3] tracking-[-0.02em] sm:mt-16">
          <motion.p style={reduceMotion ? undefined : { x: xA }}>{rowA.join(', ')},</motion.p>
          <motion.p style={reduceMotion ? undefined : { x: xB }} className="text-muted mt-1">
            {rowB.join(', ')}
            {/* The list stops; the sentence doesn't. Set as an aside in the
                display italic — smaller, accent, positive tracking so the
                italic breathes — against the long upright run before it. */}
            {/* max() keeps it legible on a phone, where 0.56em would fall to ~11px */}
            <span className="text-accent ml-3 inline-block text-[max(0.9rem,0.56em)] leading-none tracking-[0.01em] italic">
              &mdash;&thinsp;and it goes on
            </span>
          </motion.p>
        </div>

        <Reveal delay={0.05} className="border-line mt-12 border-t pt-5 sm:mt-16">
          <div className="grid grid-cols-12 items-baseline gap-x-4 gap-y-2">
            <span className="meta text-accent col-span-12 sm:col-span-3">Still poking at</span>
            <span className="text-muted col-span-12 text-[1rem] sm:col-span-9">
              {pokingAt.join(', ')}
            </span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
