'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { FlaskConical, Lightbulb, Palette, Shapes, Sparkle } from 'lucide-react';
import { Section } from './ui/Section';
import { SectionHeading } from './ui/SectionHeading';
import { viewportOnce } from '@/lib/motion';

const CARDS = [
  {
    icon: Palette,
    title: 'Design',
    body: 'How things look and feel matters to me — type, spacing, motion, the details that make a product feel considered rather than assembled.',
  },
  {
    icon: FlaskConical,
    title: 'AI experiments',
    body: "Small tests with new models and APIs — what breaks, what's genuinely useful, and what's just a good demo.",
  },
  {
    icon: Shapes,
    title: 'Creative coding',
    body: "Interfaces that do something a little unexpected. This site's hero visual and command bar both started as experiments.",
  },
  {
    icon: Lightbulb,
    title: 'Always learning',
    body: 'Currently deep in agentic AI and LLM application patterns. [ADD ANOTHER CURRENT INTEREST]',
  },
  {
    icon: Sparkle,
    title: 'Random ideas',
    body: "Half-built side projects and 'what if' prototypes that exist mostly to answer a question. [ADD A FAVOURITE ONE]",
  },
];

export function BeyondCode() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="beyond">
      <SectionHeading
        index="06"
        label="Beyond the code"
        title="Beyond the code."
        intro="The parts that don't fit on a CV but shape how I build."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={reduceMotion ? undefined : { y: -4 }}
            className="border-border hover:border-border-strong bg-surface/40 rounded-2xl border p-6 transition-colors"
          >
            <card.icon className="text-accent size-5" />
            <h3 className="mt-4 font-medium">{card.title}</h3>
            <p className="text-muted mt-2 text-sm leading-relaxed">{card.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
