/**
 * Tools, as a plain list — no ratings, no percentages, no categories to
 * memorise. `iWorkWith` is day-to-day; `pokingAt` is the genuine frontier.
 *
 * Honesty rule: every entry here is something that appears in real, shipped
 * work in `projects.ts` or `buildlog.ts`. If it isn't in the work, it doesn't
 * go in the list. Ordering runs roughly language → interface → server → data →
 * services → AI → testing → ship, so the full-stack spread is readable at a
 * glance rather than alphabetical noise.
 */

export const iWorkWith: string[] = [
  // language
  'Python',
  'TypeScript',
  'JavaScript',
  'SQL',
  // interface
  'React',
  'Next.js',
  'Tailwind CSS',
  'Framer Motion',
  'GSAP',
  'ScrollTrigger',
  'Lenis',
  'Canvas',
  // server
  'Node.js',
  'Server Components',
  'Server Actions',
  'Route Handlers',
  'Auth.js',
  'Zod',
  // data
  'PostgreSQL',
  'Prisma',
  'Drizzle ORM',
  'libSQL',
  'Supabase',
  // services
  'Razorpay',
  'Twilio',
  'Resend',
  // AI
  'the OpenAI & Anthropic APIs',
  'the Vercel AI SDK',
  'structured outputs',
  'tool calling',
  'RAG & embeddings',
  'evals',
  // testing
  'Vitest',
  'Playwright',
  // ship
  'Git',
  'GitHub',
  'Vercel',
];

export const pokingAt: string[] = ['Agentic AI', 'Multi-agent systems'];
