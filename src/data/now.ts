/**
 * A personal "what I'm on right now" list — like a status line, not a feature
 * grid. Edit freely. Keep `nowUpdated` roughly current.
 *
 * `href` points at wherever on the site the claim is actually backed up, so a
 * row can be followed to its evidence rather than just asserted. Leave it off
 * when there isn't any — an unsupported row is fine, a fake link is not.
 */

export interface NowRow {
  verb: string;
  value: string;
  href?: string;
  evidence?: string;
}

export const nowUpdated = 'September 2026';

export const now: NowRow[] = [
  {
    verb: 'Building',
    value: 'AI-powered products and full-stack web apps',
    href: '/',
    evidence: 'Six pieces',
  },
  {
    verb: 'Learning',
    value: 'Agentic AI — how to make agents that plan and actually act',
    href: '/projects/ai-study-planner',
    evidence: 'The coach',
  },
  {
    verb: 'Exploring',
    value: 'LLM patterns, retrieval over private data, evals',
    href: '#skills',
    evidence: 'Still poking at',
  },
  {
    verb: 'Using',
    value: 'the OpenAI & Anthropic APIs, the Vercel AI SDK, Next.js, Python',
    href: '#skills',
    evidence: 'The full list',
  },
  {
    verb: 'Keeping up',
    value: 'with a field that reinvents its tooling every few months — which is half the fun',
    href: '#log',
    evidence: 'The build log',
  },
];
