'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { Thought } from '@/data/personality';
import { ThoughtVisual } from './thoughts/ThoughtVisuals';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * One note. The front is a drawn motif on the ivory ground; turning it over
 * reveals the thought on charcoal — the back reuses the `chapter-dark` class,
 * so it inverts the palette tokens rather than hard-coding a second set of
 * colours.
 *
 * A real <button> underneath: click, Enter and Space all work, `aria-pressed`
 * carries the state, and reduced motion swaps the faces with no 3D at all.
 */
export function ThoughtCard({
  thought,
  number,
  index,
  isFlipped,
  onToggle,
}: {
  thought: Thought;
  number: string;
  index: number;
  isFlipped: boolean;
  onToggle: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const label = thought.tag.replace(/^on\s+/i, '');

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay: Math.min(index * 0.08, 0.4) }}
      className="h-full"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isFlipped}
        aria-label={`Turn over the note on ${label}`}
        className="group block h-[260px] w-full appearance-none border-0 bg-transparent p-0 text-left outline-offset-4"
        style={{ perspective: 1600 }}
      >
        {reduceMotion ? (
          <div className="h-full">
            {isFlipped ? (
              <Back number={number} tag={thought.tag} content={thought.content} />
            ) : (
              <Front number={number} tag={thought.tag} visual={thought.visual} />
            )}
          </div>
        ) : (
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div aria-hidden={isFlipped} className="absolute inset-0 [backface-visibility:hidden]">
              <Front number={number} tag={thought.tag} visual={thought.visual} />
            </div>
            <div
              aria-hidden={!isFlipped}
              className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
            >
              <Back number={number} tag={thought.tag} content={thought.content} />
            </div>
          </motion.div>
        )}
      </button>
    </motion.div>
  );
}

function Front({
  number,
  tag,
  visual,
}: {
  number: string;
  tag: string;
  visual: Thought['visual'];
}) {
  return (
    <div className="border-line bg-bg group-hover:border-accent flex h-full flex-col justify-between border p-6 transition-colors duration-500">
      <span className="text-accent font-mono text-[0.68rem]">{number}</span>

      <div className="text-fg relative my-4 flex-1 overflow-hidden">
        <div className="absolute inset-0 opacity-90 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
          <ThoughtVisual visual={visual} />
        </div>
      </div>

      <h3 className="font-display text-fg text-[1.15rem] italic">{tag}</h3>
    </div>
  );
}

/** `chapter-dark` re-declares the palette tokens, so this face inverts. */
function Back({ number, tag, content }: { number: string; tag: string; content: string }) {
  return (
    <div className="chapter-dark border-line flex h-full flex-col justify-between border p-6">
      <span className="text-accent font-mono text-[0.68rem]">{number}</span>
      <p className="text-fg text-[1rem] leading-[1.6]">{content}</p>
      <span className="meta">
        {tag} <span aria-hidden>↻</span>
      </span>
    </div>
  );
}
