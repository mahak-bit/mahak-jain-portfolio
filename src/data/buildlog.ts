/**
 * A personal changelog. Newest first. Keep it honest — every entry should be
 * something that actually happened.
 */

export interface LogEntry {
  date: string;
  verb: 'Working on' | 'Shipped' | 'Rebuilt' | 'Built' | 'Learned' | 'Studied' | 'Started';
  entry: string;
  href?: string;
}

export const buildLog: LogEntry[] = [
  {
    date: 'Sep 2026',
    verb: 'Working on',
    entry: 'Going deeper into agentic AI — planning-and-acting agents',
  },
  {
    date: 'Sep 2026',
    verb: 'Rebuilt',
    entry: 'This site — to make it feel less like every other AI portfolio',
  },
  {
    date: 'Aug 2026',
    verb: 'Shipped',
    entry: 'AI Study Planner — adaptive scheduling and a real tool-calling AI coach',
    href: '/projects/ai-study-planner',
  },
  {
    date: 'Aug 2026',
    verb: 'Built',
    entry: 'Zazzlers — a full e-commerce platform with payments and its own admin back office',
    href: '/projects/zazzlers',
  },
  {
    date: 'Aug 2026',
    verb: 'Built',
    entry: 'Three scroll-driven sites in a fortnight — Pawan Industries, India at 80, a 911 Carrera concept',
    href: '/archive',
  },
  {
    date: 'Aug 2026',
    verb: 'Built',
    entry: 'Beauty Match — AI skincare matching with an engine you can actually inspect',
    href: '/projects/beauty-match',
  },
  {
    date: 'Jul–Aug 2026',
    verb: 'Built',
    entry: 'Python AI experiments — a RAG Q&A system, a multi-agent setup, an agent bot',
  },
  {
    date: 'Aug 2026',
    verb: 'Learned',
    entry: 'Structured LLM output and retry contracts — the hard way, from shipping the planner',
  },
  {
    date: 'Earlier',
    verb: 'Studied',
    entry: 'Business administration (BBA), then got distracted by code and never came back',
  },
];
