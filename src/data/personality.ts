/**
 * "A little more about me" — five short, true thoughts, each behind a flip.
 * Keep them true and specific. `rotation` is the card's resting tilt in
 * degrees — keep it small (well under ±2deg) so the grid reads as placed by
 * hand, not stamped out.
 */

export interface Thought {
  tag: string;
  content: string;
  rotation: number;
}

export const thoughts: Thought[] = [
  {
    tag: 'ON DESIGN',
    content: 'I like clean interfaces and will happily lose an hour to spacing.',
    rotation: -1.5,
  },
  {
    tag: 'ON LEARNING',
    content: 'I learn by building. Documentation makes more sense after I’ve broken something.',
    rotation: 1,
  },
  {
    tag: 'ON IDEAS',
    content: 'Most of my ideas start as “wait, can I just build this?” and end up as a repo.',
    rotation: -0.7,
  },
  {
    tag: 'ON AI',
    content: 'I think the best AI features are the ones you barely notice.',
    rotation: 1.8,
  },
  {
    tag: 'ON SHIPPING',
    content: 'I’d rather ship a small thing that works than plan a big thing that doesn’t.',
    rotation: -1,
  },
];
