import { iWorkWith, toolGroups } from '@/data/skills';

/**
 * What the exhibition says about the work, split the way the control splits it:
 * DESIGN is how a thing looks and moves, CODE is how it is built.
 *
 * Nothing is typed in fresh. Every tool named here is drawn from the site's own
 * tool list (`src/data/skills.ts`), which holds only things that appear in
 * shipped work. `pick` keeps it that way: a name that isn't in that list is
 * dropped, so this file can't quietly claim something the rest of the site
 * doesn't.
 */
export interface Capability {
  title: string;
  items: string[];
}

const known = new Set(iWorkWith);
const pick = (names: string[]) => names.filter((n) => known.has(n));
const group = (label: string) => toolGroups.find((g) => g.label === label)?.items ?? [];

export const DESIGN_LINE = 'Interactive experiences, visual presentation, creative direction.';
export const CODE_LINE = 'Web development, Python, AI applications, technical implementation.';

export const DESIGN: Capability[] = [
  { title: 'Scroll-driven storytelling', items: pick(['GSAP', 'ScrollTrigger', 'Lenis']) },
  { title: 'Motion and interaction', items: pick(['Framer Motion', 'Canvas']) },
  { title: 'Interfaces', items: pick(['React', 'Next.js', 'Tailwind CSS']) },
];

export const CODE: Capability[] = [
  {
    title: 'Full-stack web',
    items: pick(['TypeScript', 'Node.js', 'Server Components', 'Server Actions', 'Route Handlers']),
  },
  { title: 'Python', items: pick(['Python', 'SQL']) },
  { title: 'AI applications', items: group('AI') },
  { title: 'Data', items: group('Data') },
  {
    title: 'Shipping',
    items: pick(['Auth.js', 'Razorpay', 'Resend', 'Vercel', 'Vitest', 'Playwright']),
  },
];
