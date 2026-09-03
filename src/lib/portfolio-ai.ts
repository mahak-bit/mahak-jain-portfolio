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
  'is she a full-stack developer?',
  'can she build a website end to end?',
  "what's the tech stack?",
  'is she any good with AI agents?',
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
      'Six in the archive, all deployed. The range: a full e-commerce platform with payments and its own admin, built for a clothing label (Zazzlers), the AI Study Planner with a tool-calling coach, an AI skincare matcher with an explainable engine (Beauty Match), a client site for a rice-milling company (Pawan Industries), a digital exhibition on 80 years of Indian independence, and a scroll-scrubbed 911 Carrera concept. Open the archive to read any of them.',
    followUps: ['is she good with agents?', "what's the tech stack?", 'can she build an AI product?'],
  },
  {
    id: 'coach',
    keywords: ['coach', 'agent', 'agents', 'tool calling', 'tool-calling', 'multi-agent', 'guardrail'],
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
      'Day to day: TypeScript, React, Next.js, Node.js, Python and SQL, with Tailwind, Framer Motion, Prisma and Postgres, Zod, Git and Vercel for shipping. On the AI side: the OpenAI and Anthropic APIs, structured outputs, tool calling, retrieval and evals. The full list is in the "I work with" section.',
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
      'Yes, end to end. Zazzlers is the fullest example — a complete e-commerce platform with payments, notifications and a full admin back office, built for a clothing label. The Study Planner is the AI-heavy one: auth, onboarding, an AI generation layer with validated output, a database, analytics, a tool-calling agent and a tested critical path. Both went from first commit to deployed. If you have something in mind, the contact form is at the bottom.',
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
      'Four areas, starting with the core: full-stack web development — building and shipping complete websites and web apps in Next.js, React and TypeScript, with APIs, databases and deployment. Then generative and agentic AI — LLM apps, structured output, tool-calling agents with real guardrails. Then AI-assisted development — moving fast without losing the plot on architecture. And modern UI/UX with quick, credible prototyping.',
    followUps: ['what has she built?', 'how did she get into this?'],
  },
  {
    id: 'web',
    keywords: [
      'web',
      'website',
      'websites',
      'web developer',
      'web dev',
      'web development',
      'full stack',
      'full-stack',
      'fullstack',
      'developer',
      'frontend',
      'front-end',
      'backend',
      'back-end',
      'ui',
      'interface',
      'react project',
      'design',
      'deploy',
      'deployment',
    ],
    response:
      'First and foremost, Mahak is a professional full-stack web developer. She builds complete websites and web apps end to end — interface, front end, back end, database and deployment — and ships them to production. Most of the archive is web work: Zazzlers is a full Next.js storefront with its own admin back office; three projects are scroll-driven GSAP-and-Lenis sites (a rice-milling company site, a digital exhibition, a 911 Carrera concept); the Study Planner and Beauty Match are the app-shaped builds. All deployed, all built for real use. Increasingly she builds AI into that work, and is moving toward agentic AI — but the foundation is solid production web engineering.',
    followUps: ["what's the tech stack?", 'can she build a website end to end?'],
  },
  {
    id: 'ai',
    keywords: [
      'genai',
      'gen ai',
      'generative',
      'agentic',
      'llm',
      'automation',
      'ai work',
      'what ai',
      'ai does',
      'her ai',
      'openai',
      'claude',
      'anthropic',
      'gpt',
      'model',
      'models',
      'provider',
      'model-agnostic',
      'artificial intelligence',
      'up to date',
      'keep up',
      'keeping up',
      'stay current',
      'staying current',
      'latest ai',
    ],
    response:
      'On top of the web work, the focus is generative and agentic AI — LLM-powered features, tool-calling agents with real guardrails, retrieval over private data, and automating the workflow steps that don’t need a person. She’s not loyal to one provider: OpenAI or Anthropic, whichever model fits the task, kept behind one clean interface so swapping is a one-line change. And since the field reinvents itself roughly every quarter, keeping up is half the job and half the fun. The Study Planner shows most of it end to end — structured generation, a retry-then-typed-error contract, and an agent that can read a user’s context but never write to it.',
    followUps: ['is she good with agents?', "what's she working on now?"],
  },
  {
    id: 'about',
    keywords: [
      'who are you',
      'who is',
      "who's",
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
      'Mahak is a professional full-stack developer who builds AI into what she ships, and is now moving toward agentic AI. She studied business (BBA), got pulled into building software — full-stack web, Python, AI and GenAI, automation — and now ships products end to end, from first commit to deployment. The through-line: treat the problem as a product, then build something real for it. The build log has the rough timeline.',
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
      'She’s open to opportunities and collaborations. Fastest route is the contact section at the bottom — a form plus a direct email link (mahakj532@gmail.com). GitHub and LinkedIn are linked there too.',
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
      'AI-first, but engineering-led. She uses modern AI coding tools to move quickly through exploration, implementation and testing, while the data model, the boundaries and the guardrails stay deliberate and hand-designed. Fast, but the architecture decisions are hers — not hands-off.',
    followUps: ["what's the tech stack?", "what's she working on now?"],
  },
  {
    id: 'now',
    keywords: ['currently', 'right now', 'working on', 'these days', 'at the moment', 'up to'],
    response:
      'Right now: getting deeper into agentic AI, and building AI-powered products and full-stack web apps — while keeping up with a field that reinvents its tooling every few months. The "Now" section has the running list.',
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
