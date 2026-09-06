/**
 * A personal changelog. Newest first. Keep it honest — every entry should be
 * something that actually happened.
 *
 * `title` is the thing itself and `detail` is the qualifier, so the row can
 * set them differently: the title in the display face, the detail alongside
 * it in the body face.
 */

export interface LogEntry {
  date: string;
  verb: 'Working on' | 'Shipped' | 'Rebuilt' | 'Built' | 'Learned' | 'Studied' | 'Started';
  title: string;
  detail: string;
  href?: string;
}

export const buildLog: LogEntry[] = [
  {
    date: 'Sep 2026',
    verb: 'Working on',
    title: 'Going deeper into agentic AI',
    detail: 'planning-and-acting agents',
  },
  {
    date: 'Sep 2026',
    verb: 'Rebuilt',
    title: 'This site',
    detail: 'to make it feel less like every other AI portfolio',
  },
  {
    date: 'Aug 2026',
    verb: 'Shipped',
    title: 'AI Study Planner',
    detail: 'adaptive scheduling and a real tool-calling AI coach',
    href: '/projects/ai-study-planner',
  },
  {
    date: 'Aug 2026',
    verb: 'Built',
    title: 'Zazzlers',
    detail: 'a full e-commerce platform with payments and admin, for a clothing label',
    href: '/projects/zazzlers',
  },
  {
    date: 'Aug 2026',
    verb: 'Built',
    title: 'Three scroll-driven sites in a fortnight',
    detail: 'Pawan Industries, India at 80, a 911 Carrera concept',
    href: '/archive',
  },
  {
    date: 'Aug 2026',
    verb: 'Built',
    title: 'Beauty Match',
    detail: 'AI skincare matching with an engine you can actually inspect',
    href: '/projects/beauty-match',
  },
  {
    date: 'Jul–Aug 2026',
    verb: 'Built',
    title: 'Python AI experiments',
    detail: 'a RAG Q&A system, a multi-agent setup, an agent bot',
    href: 'https://github.com/mahak-bit?tab=repositories',
  },
  {
    date: 'Aug 2026',
    verb: 'Learned',
    title: 'Structured LLM output and retry contracts',
    detail: 'the hard way, from shipping the planner',
  },
  {
    date: 'Earlier',
    verb: 'Studied',
    title: 'Business administration (BBA)',
    detail: 'then got distracted by code and never came back',
  },
];

/**
 * The arc, as four marks. Truthful shorthand for the story told just above it
 * on the About page — business, then code, then GenAI, now agents.
 */
export const progression: { n: string; label: string; current?: boolean }[] = [
  { n: '01', label: 'Business' },
  { n: '02', label: 'Code' },
  { n: '03', label: 'GenAI' },
  { n: '04', label: 'Agentic AI', current: true },
];
