/**
 * A personal changelog. Newest first. Keep it honest — every entry should be
 * something that actually happened. `[ADD ...]` rows are placeholders.
 */

export interface LogEntry {
  date: string;
  verb: 'Working on' | 'Shipped' | 'Rebuilt' | 'Built' | 'Learned' | 'Studied' | 'Started';
  entry: string;
  href?: string;
}

export const buildLog: LogEntry[] = [
  { date: 'Sep 2026', verb: 'Working on', entry: 'Going deeper into agentic AI — planning-and-acting agents' },
  {
    date: 'Sep 2026',
    verb: 'Rebuilt',
    entry: 'This site — to make it feel less like every other AI portfolio',
  },
  {
    date: '2026',
    verb: 'Built',
    entry: 'AI Study Planner — an adaptive schedule with a real tool-calling AI coach',
    href: '/projects/ai-study-planner',
  },
  {
    date: '2026',
    verb: 'Learned',
    entry: 'Structured LLM output and retry contracts — the hard way, from shipping the planner',
  },
  {
    date: 'Earlier',
    verb: 'Studied',
    entry: 'Business administration (BBA), then got distracted by code and never came back',
  },
  { date: '[ADD DATE]', verb: 'Started', entry: '[ADD AN OLDER ENTRY — a first project, a course, the moment it clicked]' },
];
