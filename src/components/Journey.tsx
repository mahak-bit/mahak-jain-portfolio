'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Section } from './ui/Section';
import { SectionHeading } from './ui/SectionHeading';
import { journey } from '@/data/journey';
import { viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function Journey() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="journey">
      <SectionHeading
        index="05"
        label="Journey"
        title="From business to building with AI."
        intro="Undated on purpose — the direction matters more than the dates."
      />

      <ol className="border-border-strong relative mt-14 flex flex-col border-l">
        {journey.map((stage, i) => (
          <motion.li
            key={stage.title}
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="relative pb-10 pl-8 last:pb-0"
          >
            <span
              className={cn(
                'absolute -left-[0.5rem] top-1 flex size-4 items-center justify-center rounded-full border',
                stage.state === 'now'
                  ? 'border-accent bg-accent'
                  : stage.state === 'next'
                    ? 'border-accent/50 bg-background border-dashed'
                    : 'border-border-strong bg-background'
              )}
              aria-hidden
            >
              {stage.state === 'now' && !reduceMotion && (
                <motion.span
                  className="bg-accent absolute inset-0 rounded-full"
                  animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              )}
            </span>

            <p
              className={cn(
                'font-mono text-xs uppercase tracking-wider',
                stage.state === 'now' ? 'text-accent' : 'text-faint'
              )}
            >
              {stage.marker}
            </p>
            <h3 className="mt-1 text-lg tracking-tight sm:text-xl">{stage.title}</h3>
            <p className="text-muted mt-1.5 max-w-xl text-sm leading-relaxed">
              {stage.description}
            </p>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
