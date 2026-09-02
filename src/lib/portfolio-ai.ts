/**
 * "Ask my portfolio" — a front-end simulated assistant.
 *
 * It matches the visitor's question against keyword intents and returns a
 * pre-written answer. Everything here is grounded in real, provided information;
 * there are no invented projects, clients or credentials.
 *
 * ── Connecting a real model later ───────────────────────────────────────────
 * The UI only ever calls `askPortfolio(query)`. To go live, replace the body of
 * that function with a request to your own route, e.g.:
 *
 *   const res = await fetch('/api/ask', {
 *     method: 'POST',
 *     headers: { 'content-type': 'application/json' },
 *     body: JSON.stringify({ query }),
 *   });
 *   return (await res.json()) as PortfolioAnswer;
 *
 * The keyword engine below can stay as an offline fallback.
 */

export interface PortfolioAnswer {
  intent: string;
  response: string;
  followUps?: string[];
}

export const SUGGESTED_PROMPTS = [
  'What AI projects have you built?',
  'What technologies do you use?',
  'Can you build an AI SaaS?',
  'What are your strongest skills?',
  'Tell me about your web projects.',
] as const;

interface Intent {
  id: string;
  keywords: string[];
  response: string;
  followUps?: string[];
}

const INTENTS: Intent[] = [
  {
    id: 'projects',
    keywords: [
      'project',
      'projects',
      'built',
      'build so far',
      'work have you',
      'case study',
      'study planner',
      'portfolio',
      'ai projects',
      'what have you made',
      'show me',
    ],
    response:
      'The flagship is the AI Study Planner — a full-stack platform that generates a personalised study schedule from a student’s subjects, exams and real availability, then rebalances it automatically when sessions are missed. It includes a genuine tool-calling AI Coach whose tools are scoped to the student’s own data, structured AI output with a retry contract, and a deterministic rescheduling engine backed by unit tests. This portfolio site is the second build: a hand-made design system, this assistant, and a restrained motion layer. A third project slot is open and clearly marked in the code.',
    followUps: ['How does the AI Coach work?', 'What’s the tech stack?', 'Can you build an AI SaaS?'],
  },
  {
    id: 'coach',
    keywords: ['coach', 'agent', 'agentic', 'tool calling', 'tool-calling', 'how does the ai'],
    response:
      'The AI Coach in the Study Planner is a multi-turn, tool-calling agent — not a chatbot wrapper. It has four read-only tools (student context, upcoming exams, weak topics, today’s tasks). Each tool binds the user id through a closure rather than taking it as a model argument, so the agent is structurally unable to read another user’s data or to modify a plan. Any AI output that would be written is re-checked against the user’s real records first.',
    followUps: ['What AI projects have you built?', 'What technologies do you use?'],
  },
  {
    id: 'tech',
    keywords: [
      'tech',
      'stack',
      'technolog',
      'tools do you use',
      'languages',
      'framework',
      'what do you use',
      'built with',
    ],
    response:
      'Day to day: TypeScript, React, Next.js (App Router), Node.js, Python, and SQL. On the AI side: the OpenAI APIs, Claude and Claude Code, structured outputs and tool calling, plus automation. For product work: Tailwind CSS, Framer Motion, Prisma/Postgres, Zod, Git/GitHub and Vercel. Testing with Vitest and Playwright. The full breakdown is in the Skills section.',
    followUps: ['What are your strongest skills?', 'Tell me about your web projects.'],
  },
  {
    id: 'saas',
    keywords: [
      'saas',
      'can you build',
      'could you build',
      'build me',
      'build an ai',
      'mvp',
      'prototype',
      'product',
      'hire you to build',
    ],
    response:
      'Yes. The AI Study Planner is a working example of the full loop: auth and onboarding, an AI generation layer with schema-validated output, a database, analytics, a tool-calling agent, and a tested critical path — deployed. The workflow is AI-first: an AI coding assistant sits between the IDE and the architecture, which makes moving from idea to a usable product fast. If you have an AI SaaS in mind, the Contact section is the place to start.',
    followUps: ['What’s your development workflow?', 'How do I get in touch?'],
  },
  {
    id: 'skills',
    keywords: [
      'strong',
      'strongest',
      'good at',
      'best at',
      'expertise',
      'skill',
      'skills',
      'specialis',
      'specializ',
    ],
    response:
      'Strengths cluster in four areas: (1) Generative & agentic AI — LLM application development, structured outputs, tool-calling agents; (2) Full-stack product engineering — Next.js, React, TypeScript, APIs and databases; (3) AI-assisted development — using Claude Code and AI coding assistants to move fast without losing architectural control; (4) Modern UI/UX and rapid prototyping — turning a rough idea into something people can use.',
    followUps: ['What AI projects have you built?', 'What’s your journey been?'],
  },
  {
    id: 'web',
    keywords: [
      'web',
      'website',
      'frontend',
      'front-end',
      'ui',
      'interface',
      'react project',
      'next.js project',
      'web projects',
      'web experiences',
    ],
    response:
      'This site is the clearest example — a bespoke design system, a simulated assistant, dynamic case-study routes and a motion layer that fully respects reduced-motion. The AI Study Planner is the larger one: a full Next.js App Router application with Server Components, Server Actions, a planner UI, analytics views and a streaming chat interface. Both are built for real use on desktop and mobile, not as demos.',
    followUps: ['What’s the tech stack?', 'Can you build an AI SaaS?'],
  },
  {
    id: 'ai',
    keywords: [
      'genai',
      'gen ai',
      'generative',
      'llm',
      'automation',
      'ai work',
      'ai focus',
      'openai',
      'claude',
      'artificial intelligence',
    ],
    response:
      'The focus is generative and agentic AI: building LLM-powered applications, designing tool-calling agents with real guardrails, wiring up the OpenAI APIs and Claude, and using AI to automate the parts of a workflow that don’t need a human. The Study Planner is where a lot of this is demonstrated end to end — structured generation, a retry/fallback contract, and an agent that can read a user’s context but never write to it.',
    followUps: ['How does the AI Coach work?', 'What are you currently building?'],
  },
  {
    id: 'about',
    keywords: [
      'who are you',
      'about you',
      'about mahak',
      'background',
      'bio',
      'bba',
      'story',
      'transition',
      'yourself',
    ],
    response:
      'Mahak Jain is an AI Engineer & Creative Technologist. A BBA graduate who moved deliberately into technology — AI and GenAI, full-stack development, automation and product engineering — and now builds AI-powered products end to end using an AI-first development workflow. The through-line: understanding a problem as a product, then shipping something real for it.',
    followUps: ['What’s your journey been?', 'What are your strongest skills?'],
  },
  {
    id: 'contact',
    keywords: [
      'contact',
      'hire',
      'reach',
      'email',
      'get in touch',
      'work together',
      'available',
      'availab',
      'freelance',
      'collaborat',
      'talk',
    ],
    response:
      'Mahak is open to opportunities and collaborations. The fastest way is the Contact section below — there’s a form and a direct email link (mahakj532@gmail.com). GitHub and LinkedIn links live there too once added.',
    followUps: ['Can you build an AI SaaS?', 'What have you built?'],
  },
  {
    id: 'workflow',
    keywords: [
      'workflow',
      'how do you work',
      'ai-first',
      'ai first',
      'claude code',
      'process',
      'develop',
    ],
    response:
      'AI-first, but engineering-led. The IDE and an AI coding assistant (Claude Code, plus the OpenAI APIs) sit at the front of the loop — used for architecture exploration, implementation and testing — while the design decisions, the data model and the guardrails stay deliberate. It’s covered visually in the “Built differently” section.',
    followUps: ['What technologies do you use?', 'What are you currently building?'],
  },
  {
    id: 'building',
    keywords: ['currently building', 'right now', 'working on', 'these days', 'at the moment'],
    response:
      'Right now: AI-powered products, GenAI applications, agentic workflows, premium websites and automation systems. The “Currently building” section has the live list.',
    followUps: ['What AI projects have you built?', 'How do I get in touch?'],
  },
];

const FALLBACK: PortfolioAnswer = {
  intent: 'fallback',
  response:
    'I can answer questions about Mahak’s projects, skills, AI work, tech stack, development workflow, journey, or how to get in touch. Try one of the suggestions, or ask about the AI Study Planner.',
  followUps: [...SUGGESTED_PROMPTS.slice(0, 3)],
};

export function answerLocally(query: string): PortfolioAnswer {
  const q = query.toLowerCase().trim();
  if (!q) return FALLBACK;

  let best: { intent: Intent; score: number } | null = null;
  for (const intent of INTENTS) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (q.includes(kw)) score += kw.length > 5 ? 2 : 1;
    }
    if (score > 0 && (!best || score > best.score)) best = { intent, score };
  }

  if (!best) return FALLBACK;
  return {
    intent: best.intent.id,
    response: best.intent.response,
    followUps: best.intent.followUps,
  };
}

/**
 * The only function the UI calls. Currently resolves the local engine with a
 * small delay so the interaction feels considered; swap the body for a real
 * request when a backend exists.
 */
export async function askPortfolio(query: string): Promise<PortfolioAnswer> {
  await new Promise((r) => setTimeout(r, 240));
  return answerLocally(query);
}
