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
  'what has she actually built?',
  'is she any good with agents?',
  'can she build an AI product end to end?',
  "what's the tech stack?",
  'how does she work?',
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
      'made',
      'case study',
      'study planner',
      'portfolio',
      'show me',
      'her work',
      'the work',
    ],
    response:
      'Six in the archive, all deployed. The range: a full e-commerce platform with its own admin (Zazzlers), the AI Study Planner with a tool-calling coach, an AI skincare matcher with an explainable engine (Beauty Match), a scroll-driven site for a rice mill (Pawan Industries), a digital exhibition on 80 years of Indian independence, and a scroll-scrubbed 911 Carrera concept. Open the archive to read any of them.',
    followUps: ['is she good with agents?', "what's the tech stack?", 'can she build an AI product?'],
  },
  {
    id: 'coach',
    keywords: ['coach', 'agent', 'agents', 'agentic', 'tool calling', 'tool-calling'],
    response:
      'The AI coach in the Study Planner is a real multi-turn, tool-calling agent — not a chatbot wrapper. Four read-only tools: student context, upcoming exams, weak topics, today’s tasks. Each one binds the user id through a closure instead of taking it as a model argument, so the agent physically can’t read another user’s data or change a plan. Anything it would write gets re-checked against the user’s real records first.',
    followUps: ['what has she built?', "what's the tech stack?"],
  },
  {
    id: 'tech',
    keywords: [
      'tech',
      'stack',
      'technolog',
      'tools',
      'languages',
      'framework',
      'what do you use',
      'what does she use',
      'built with',
      'day to day',
    ],
    response:
      'Day to day: TypeScript, React, Next.js, Node.js, Python, SQL. On the AI side: the OpenAI APIs, Claude, Claude Code, structured outputs and tool calling. For product work: Tailwind, Framer Motion, Prisma and Postgres, Zod, Git, Vercel. The full list is in the "I work with" section.',
    followUps: ["what's she best at?", 'tell me about the web work'],
  },
  {
    id: 'saas',
    keywords: [
      'saas',
      'can you build',
      'can she build',
      'could you build',
      'build me',
      'build an ai',
      'mvp',
      'prototype',
      'product',
      'end to end',
      'hire',
    ],
    response:
      'Yes — the Study Planner is the proof: auth, onboarding, an AI generation layer with validated output, a database, analytics, a tool-calling agent, and a tested critical path, all deployed. The workflow is AI-first, so idea to working product is fast. If you have something in mind, the contact form is at the bottom.',
    followUps: ['how does she work?', 'how do I reach her?'],
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
      'Roughly four areas: generative and agentic AI (LLM apps, structured output, tool-calling agents); full-stack product engineering (Next.js, React, TypeScript, APIs, databases); AI-assisted development (moving fast with Claude Code without losing the plot on architecture); and modern UI/UX plus quick prototyping.',
    followUps: ['what has she built?', 'how did she get into this?'],
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
      'design',
    ],
    response:
      'Most of the archive is web work. Zazzlers is a full Next.js storefront plus an admin back office. Three of the projects are scroll-driven, GSAP-and-Lenis sites — a rice-mill site, a digital exhibition, and a 911 Carrera concept where the video scrubs to your scroll. The Study Planner and Beauty Match are the app-shaped ones. All deployed, all built for real use.',
    followUps: ["what's the tech stack?", 'can she build an AI product?'],
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
      'openai',
      'claude',
      'artificial intelligence',
    ],
    response:
      'The focus is generative and agentic AI: building LLM-powered apps, designing tool-calling agents with real guardrails, wiring up the OpenAI APIs and Claude, and using AI to automate the parts of a workflow that don’t need a person. The Study Planner shows most of this end to end — structured generation, a retry/fallback contract, and an agent that can read a user’s context but never write to it.',
    followUps: ['is she good with agents?', "what's she working on now?"],
  },
  {
    id: 'about',
    keywords: [
      'who are you',
      'about you',
      'about mahak',
      'about her',
      'background',
      'bio',
      'bba',
      'story',
      'transition',
      'get into',
      'how did she',
      'her journey',
    ],
    response:
      'Mahak is an AI Engineer & Creative Technologist. She studied business (BBA), got pulled into building software — AI and GenAI, full-stack, automation — and now ships AI products end to end with an AI-first workflow. The through-line: treat the problem as a product, then build something real for it. The build log has the rough timeline.',
    followUps: ["what's she working on now?", "what's she best at?"],
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
      'linkedin',
      'github',
      'socials',
      'connect',
    ],
    response:
      'She’s open to opportunities and collaborations. Fastest route is the contact section at the bottom — there’s a form and a direct email link (mahakj532@gmail.com). GitHub is linked there too; LinkedIn is coming.',
    followUps: ['can she build an AI product?', 'what has she built?'],
  },
  {
    id: 'workflow',
    keywords: [
      'workflow',
      'how do you work',
      'how does she work',
      'how she works',
      'ai-first',
      'ai first',
      'claude code',
      'process',
      'develop',
    ],
    response:
      'AI-first, but engineering-led. An AI coding assistant (Claude Code, plus the OpenAI APIs) sits at the front of the loop for architecture exploration, implementation and testing — while the data model, the boundaries and the guardrails stay deliberate. Fast, but not hands-off.',
    followUps: ["what's the tech stack?", "what's she working on now?"],
  },
  {
    id: 'now',
    keywords: ['currently', 'right now', 'working on', 'these days', 'at the moment', 'up to'],
    response:
      'Right now: getting deeper into agentic AI, and building AI-powered products and web apps. The "Now" section has the current list — building, learning, exploring, using.',
    followUps: ['what has she built?', 'how do I reach her?'],
  },
];

const FALLBACK: PortfolioAnswer = {
  intent: 'fallback',
  response:
    'I can answer questions about Mahak’s projects, her AI and agent work, the tools she uses, how she works, or how to get in touch. Try one of the suggestions, or just ask about the AI Study Planner.',
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
