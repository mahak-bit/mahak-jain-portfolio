'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';

const EASE = [0.16, 1, 0.3, 1] as const;
const ROLES = ['Full-Stack Developer', 'Python Developer', 'GenAI Engineer'];

const PARAGRAPHS = [
  'I’m Mahak. Somewhere between spreadsheets and a late-night “wait, can I just build this?”, I started building for the web — and lately, that’s increasingly meant putting AI on top of it.',
  'I build full-stack web applications, Python backends, AI-powered products, and automations. My work has grown from traditional web development into Generative AI, and I’m now going deeper into Agentic AI — building systems that can reason, use tools, work with data, and handle tasks beyond a simple prompt-and-response.',
  'I work across the stack: React, Next.js, TypeScript, Python, APIs, databases, and cloud deployment, alongside modern AI tools and frameworks.',
  'I work AI-first. An assistant handles the repetitive parts; I decide the architecture — the data model, system boundaries, integrations, and the places where things aren’t allowed to break. It’s fast, but it’s not hands-off.',
  'The work here is real and deliberately small. I’d rather ship something that works than write a paragraph about something that might.',
];

/**
 * The motion here is deliberately cheap: every animated property is transform
 * or opacity, so the compositor does the work and layout is never re-run.
 *
 * Reveals are IntersectionObserver-driven and fire once. The only scroll-linked
 * element is the reading rule in the sticky column, and it is rendered from lg
 * up only — continuous scroll work is what actually costs on a phone, and a
 * progress line beside a column that isn't sticky yet has nothing to say.
 */
export function About() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 60%', 'end 80%'],
  });
  // A spring so the rule settles rather than tracking the wheel exactly.
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <Section id="about">
      <SectionMark index="03" label="About" />

      <div ref={ref} className="mt-10 grid gap-x-12 gap-y-12 sm:mt-14 md:grid-cols-12">
        <Reveal className="md:sticky md:top-28 md:col-span-5 md:self-start">
          <h2 className="display-lg max-w-[12ch]">
            I studied business. Then I got more interested in the thing everyone was building on top
            of.
          </h2>

          <div className="mt-8 flex gap-5">
            {/* The reading rule — desktop only, pure scaleY. */}
            <div
              aria-hidden
              className="bg-line relative hidden w-px shrink-0 overflow-hidden lg:block"
            >
              <motion.span
                className="bg-accent absolute inset-0 block origin-top"
                style={reduceMotion ? { transform: 'scaleY(1)' } : { scaleY }}
              />
            </div>

            <ul className="flex flex-col gap-1.5">
              {ROLES.map((role) => (
                <li key={role} className="meta">
                  {role}
                </li>
              ))}
              <li className="meta text-accent">Moving toward Agentic AI</li>
            </ul>
          </div>
        </Reveal>

        <div className="prose-links text-muted flex flex-col gap-5 text-[1.02rem] leading-relaxed md:col-span-6 md:col-start-7">
          {PARAGRAPHS.map((text, i) => (
            <motion.p
              key={i}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
              transition={{ duration: 0.8, ease: EASE, delay: Math.min(i * 0.06, 0.24) }}
            >
              {text}
            </motion.p>
          ))}

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12% 0px -12% 0px' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="border-accent text-fg font-display mt-6 border-l-2 pl-5 text-[clamp(1.2rem,1rem+1.1vw,1.75rem)] leading-tight"
          >
            Most of my ideas start as a random thought and end up as a repo.
          </motion.p>
        </div>
      </div>
    </Section>
  );
}
