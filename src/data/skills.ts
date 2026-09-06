/**
 * Tools, grouped so the full-stack spread is legible at a glance rather than
 * arriving as one long undifferentiated run.
 *
 * Honesty rule: every entry appears in real, shipped work in `projects.ts` or
 * `buildlog.ts`. If it isn't in the work, it doesn't go in the list.
 *
 * `iWorkWith` is derived from the groups rather than maintained separately —
 * one source of truth, so a tool can never be in the flat list but missing
 * from the grid.
 */

export interface ToolGroup {
  label: string;
  items: string[];
}

export const toolGroups: ToolGroup[] = [
  {
    label: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL'],
  },
  {
    label: 'Frameworks',
    items: [
      'React',
      'Next.js',
      'Tailwind CSS',
      'Framer Motion',
      'GSAP',
      'ScrollTrigger',
      'Lenis',
      'Node.js',
      'Server Components',
      'Server Actions',
      'Route Handlers',
    ],
  },
  {
    label: 'AI',
    items: [
      'the OpenAI & Anthropic APIs',
      'the Vercel AI SDK',
      'structured outputs',
      'tool calling',
      'RAG & embeddings',
      'evals',
    ],
  },
  {
    label: 'Data',
    items: ['PostgreSQL', 'Prisma', 'Drizzle ORM', 'libSQL', 'Supabase', 'Zod'],
  },
  {
    label: 'Infrastructure',
    items: ['Auth.js', 'Razorpay', 'Twilio', 'Resend', 'Vercel', 'Git', 'GitHub'],
  },
  {
    label: 'Tools',
    items: ['Canvas', 'Vitest', 'Playwright'],
  },
];

/** The flat list, for anything that wants the toolset as one run. */
export const iWorkWith: string[] = toolGroups.flatMap((g) => g.items);

/** The genuine frontier — not the working list. */
export const pokingAt: string[] = ['Agentic AI', 'Multi-agent systems'];

/** Closes the last group; the list stops, the sentence doesn't. */
export const toolsCoda = 'and it goes on';
