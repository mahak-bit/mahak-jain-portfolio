'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Boxes,
  Braces,
  FlaskConical,
  Rocket,
  Sparkles,
  TerminalSquare,
  type LucideIcon,
} from 'lucide-react';
import { Section } from './ui/Section';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';
import { viewportOnce } from '@/lib/motion';

interface Step {
  icon: LucideIcon;
  title: string;
  detail: string;
}

const STEPS: Step[] = [
  { icon: TerminalSquare, title: 'IDE', detail: 'Editor, terminal and repo — where every change starts.' },
  {
    icon: Sparkles,
    title: 'AI coding assistant',
    detail: 'Claude Code and the OpenAI APIs for architecture exploration and implementation.',
  },
  {
    icon: Boxes,
    title: 'Architecture',
    detail: 'Data model, boundaries and guardrails — decided deliberately, not generated.',
  },
  {
    icon: Braces,
    title: 'Implementation',
    detail: 'Components, APIs and services — built fast, reviewed closely.',
  },
  {
    icon: FlaskConical,
    title: 'Testing',
    detail: 'Unit tests on the logic that matters, plus a small end-to-end path.',
  },
  {
    icon: Rocket,
    title: 'Deployment',
    detail: 'Shipped to Vercel with automated checks on every push.',
  },
];

export function AIWorkflow() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="built-differently" aria-label="AI-first development">
      <SectionHeading
        index="04"
        label="Built differently"
        title={
          <>
            I don&rsquo;t just use AI.
            <br />I build <span className="text-accent">with</span> it.
          </>
        }
        intro="An AI-first workflow, but engineering-led. AI coding assistants sit at the front of the loop — architecture, implementation, testing — while the decisions that matter stay deliberate."
      />

      <div className="mt-14">
        {/* Desktop: horizontal flow */}
        <div className="relative hidden lg:block">
          <div className="bg-border-strong absolute left-0 right-0 top-6 h-px" aria-hidden />
          <div className="relative grid grid-cols-6 gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col items-start"
              >
                <div className="bg-background border-border-strong text-accent relative z-10 flex size-12 items-center justify-center rounded-full border">
                  <step.icon className="size-5" />
                </div>
                <p className="text-faint mt-3 font-mono text-xs">0{i + 1}</p>
                <h3 className="mt-1 text-sm font-medium">{step.title}</h3>
                <p className="text-muted mt-1.5 text-xs leading-relaxed">{step.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile / tablet: vertical flow */}
        <div className="border-border-strong relative flex flex-col gap-8 border-l pl-8 lg:hidden">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={reduceMotion ? 0 : i * 0.05} className="relative">
              <div className="bg-background border-border-strong text-accent absolute -left-[3.05rem] flex size-9 items-center justify-center rounded-full border">
                <step.icon className="size-4" />
              </div>
              <p className="text-faint font-mono text-xs">0{i + 1}</p>
              <h3 className="mt-1 font-medium">{step.title}</h3>
              <p className="text-muted mt-1 text-sm leading-relaxed">{step.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
