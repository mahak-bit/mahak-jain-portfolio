/**
 * "A little more about me" — five short, true thoughts, each behind a flip.
 * Keep them true and specific. `visual` selects the drawn treatment on the
 * card front; `rotation` is a small resting tilt in degrees, kept well under
 * ±2 so the set reads as placed by hand rather than stamped out.
 */
import type { VisualKey } from '@/components/thoughts/ThoughtVisuals';

export interface Thought {
  tag: string;
  content: string;
  visual: VisualKey;
  rotation: number;
}

export const thoughts: Thought[] = [
  {
    tag: 'On design',
    content: 'I like clean interfaces and will happily lose an hour to spacing.',
    visual: 'design',
    rotation: -0.9,
  },
  {
    tag: 'On learning',
    content: 'I learn by building. Documentation makes more sense after I’ve broken something.',
    visual: 'learning',
    rotation: 0.7,
  },
  {
    tag: 'On ideas',
    content: 'Most of my ideas start as “wait, can I just build this?” and end up as a repo.',
    visual: 'ideas',
    rotation: -0.5,
  },
  {
    tag: 'On AI',
    content: 'I think the best AI features are the ones you barely notice.',
    visual: 'ai',
    rotation: 1.1,
  },
  {
    tag: 'On shipping',
    content: 'I’d rather ship a small thing that works than plan a big thing that doesn’t.',
    visual: 'shipping',
    rotation: -0.7,
  },
];
