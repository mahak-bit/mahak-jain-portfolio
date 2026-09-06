'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { progression } from '@/data/buildlog';
import { cn } from '@/lib/utils';

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
 * The opening of the About page: the claim, the roles, the arc that got here,
 * then the story itself.
 *
 * Motion is deliberately cheap — every animated property is transform or
 * opacity, so the compositor does the work and layout is never re-run, and
 * every reveal is IntersectionObserver-driven and fires once.
 */
export function About() {
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-12% 0px -12% 0px' },
          transition: { duration: 0.9, ease: EASE, delay },
        };

  return (
    <Section id="about">
      <SectionMark index="03" label="About" />

      <Reveal className="mt-10 sm:mt-14">
        <h1 className="display-lg max-w-[15ch]">
          I studied business. Then I got more interested in the thing everyone was building on top
          of.
        </h1>
      </Reveal>

      <motion.ul
        {...rise(0.1)}
        className="mt-12 flex flex-wrap gap-x-9 gap-y-2 sm:mt-14 md:ml-[2%]"
      >
        {ROLES.map((role) => (
          <li key={role} className="meta">
            {role}
          </li>
        ))}
        <li className="meta text-accent">Moving toward Agentic AI</li>
      </motion.ul>

      {/* The arc, as four marks — business, code, GenAI, agents. */}
      <motion.ol
        {...rise(0.18)}
        aria-label="How the work got here"
        className="border-line mt-14 flex flex-wrap gap-x-9 gap-y-3 border-t pt-7"
      >
        {progression.map((step) => (
          <li key={step.n} className="flex items-baseline gap-2.5">
            <span
              className={cn('font-mono text-[0.68rem]', step.current ? 'text-accent' : 'text-faint')}
            >
              {step.n}
            </span>
            <span
              className={cn(
                'meta',
                step.current ? 'text-accent font-semibold' : 'text-faint font-normal'
              )}
            >
              {step.label}
            </span>
          </li>
        ))}
      </motion.ol>

      {/* The story */}
      <div className="mt-20 grid gap-x-12 gap-y-8 sm:mt-24 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <p className="meta">The story</p>
        </Reveal>

        <div className="prose-links text-muted flex flex-col gap-5 text-[1.02rem] leading-relaxed md:col-span-8 md:col-start-5">
          {PARAGRAPHS.map((text, i) => (
            <motion.p key={i} {...rise(Math.min(i * 0.06, 0.24))}>
              {text}
            </motion.p>
          ))}

          <motion.p
            {...rise(0.1)}
            className="border-accent text-fg font-display mt-6 border-l-2 pl-5 text-[clamp(1.2rem,1rem+1.1vw,1.75rem)] leading-tight italic"
          >
            Most of my ideas start as a random thought and end up as a repo.
          </motion.p>
        </div>
      </div>
    </Section>
  );
}
