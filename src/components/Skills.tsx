'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Section } from './ui/Section';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';
import { skillGroups, type Skill } from '@/data/skills';
import { cn } from '@/lib/utils';

export function Skills() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<Skill | null>(null);

  return (
    <Section id="skills">
      <SectionHeading
        index="03"
        label="Skills"
        title="Tools I build with."
        intro="Grouped, not ranked. Hover or focus any tool for what I actually use it for."
      />

      <Reveal
        delay={0.05}
        className="border-border-strong bg-surface/50 mt-10 flex min-h-[4.5rem] items-center rounded-xl border px-5 py-4"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active?.name ?? 'default'}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="text-sm leading-relaxed sm:text-[0.95rem]"
          >
            {active ? (
              <>
                <span className="text-foreground font-medium">{active.name}</span>{' '}
                {active.exploring && (
                  <span className="text-accent font-mono text-xs">· exploring</span>
                )}
                <span className="text-muted"> — {active.note}</span>
              </>
            ) : (
              <span className="text-faint">
                Point at a tool to see how it&rsquo;s used in real projects.
              </span>
            )}
          </motion.p>
        </AnimatePresence>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, gi) => (
          <Reveal
            key={group.title}
            delay={reduceMotion ? 0 : gi * 0.04}
            className="border-border bg-surface/30 rounded-2xl border p-5"
          >
            <p className="text-eyebrow mb-4">{group.title}</p>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <button
                  key={skill.name}
                  type="button"
                  onMouseEnter={() => setActive(skill)}
                  onFocus={() => setActive(skill)}
                  onMouseLeave={() => setActive(null)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-xs transition-colors',
                    skill.exploring
                      ? 'border-dashed border-accent/40 text-accent/90'
                      : 'border-border text-muted hover:border-border-strong hover:text-foreground'
                  )}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
