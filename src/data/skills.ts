/**
 * Skills, grouped. `note` is the short explanation revealed on hover/focus.
 * `exploring: true` marks something actively being learned — it is rendered
 * with a distinct "Exploring" tag and never presented as established.
 */

export interface Skill {
  name: string;
  note: string;
  exploring?: boolean;
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'AI / GenAI',
    skills: [
      { name: 'Generative AI', note: 'Designing and shipping features powered by large language models.' },
      {
        name: 'LLM application development',
        note: 'Turning models into products — context design, structured output, evaluation.',
      },
      {
        name: 'Structured outputs & tool calling',
        note: 'Schema-validated model responses and read-only tool-calling agents with guardrails.',
      },
      {
        name: 'OpenAI APIs',
        note: 'Completions, structured outputs and function calling in production code.',
      },
      { name: 'Claude', note: 'Reasoning-heavy tasks, long-context work and agent design.' },
      {
        name: 'Claude Code',
        note: 'AI-first development — architecture, implementation and testing from the terminal.',
      },
      {
        name: 'Prompt & system design',
        note: 'Writing prompts and system messages that produce reliable, structured results.',
      },
      {
        name: 'Agentic AI',
        note: 'Multi-step, tool-using agents that plan and act — an active focus.',
        exploring: true,
      },
      {
        name: 'RAG & embeddings',
        note: 'Retrieval-augmented generation over private data.',
        exploring: true,
      },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'React', note: 'Component architecture, hooks and state patterns for real apps.' },
      {
        name: 'Next.js',
        note: 'App Router, Server Components, Server Actions and route handlers.',
      },
      { name: 'TypeScript', note: 'Strict typing across components, APIs and data.' },
      { name: 'Tailwind CSS', note: 'Utility-first styling built on a design-token system.' },
      {
        name: 'Framer Motion',
        note: 'Purposeful animation — reveals, transitions and micro-interactions.',
      },
      { name: 'HTML', note: 'Semantic, accessible markup.' },
      { name: 'CSS', note: 'Modern layout, custom properties and responsive design.' },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', note: 'Server-side JavaScript, API routes and tooling.' },
      { name: 'REST APIs', note: 'Designing and consuming APIs with validated request bodies.' },
      {
        name: 'Prisma',
        note: 'Type-safe database access and schema modelling.',
      },
      {
        name: 'Auth & route protection',
        note: 'Session and authorization logic scoped per user.',
      },
      { name: 'Zod', note: 'One schema library for forms, API bodies and AI output.' },
    ],
  },
  {
    title: 'Languages',
    skills: [
      { name: 'TypeScript', note: 'Primary language for product work.' },
      { name: 'JavaScript', note: 'The foundation underneath the tooling.' },
      { name: 'Python', note: 'Scripting, automation and AI/data work.' },
      { name: 'SQL', note: 'Relational queries and schema design.' },
    ],
  },
  {
    title: 'Databases',
    skills: [
      {
        name: 'PostgreSQL',
        note: 'Relational modelling, migrations and hosted serverless Postgres.',
      },
      { name: 'Prisma ORM', note: 'Migrations and a typed query layer over Postgres.' },
      { name: 'SQL', note: 'Joins, constraints and query shape for read-heavy paths.' },
    ],
  },
  {
    title: 'APIs & Integrations',
    skills: [
      { name: 'OpenAI APIs', note: 'LLM features — generation, structured output, tools.' },
      {
        name: 'Vercel AI SDK',
        note: 'Streaming, schema-validated structured output and tool calling.',
      },
      { name: 'REST & JSON', note: 'Integrating third-party services over HTTP.' },
      {
        name: 'Automation',
        note: 'Wiring services together to remove manual steps from a workflow.',
      },
      {
        name: 'Webhooks',
        note: 'Event-driven integrations between services.',
        exploring: true,
      },
    ],
  },
  {
    title: 'Developer Tools',
    skills: [
      { name: 'Git', note: 'Version control and branching workflows.' },
      { name: 'GitHub', note: 'Pull requests, issues and Actions-based CI.' },
      { name: 'Claude Code', note: 'The AI coding assistant at the front of the workflow.' },
      { name: 'VS Code', note: 'Primary editor and debugging environment.' },
      { name: 'ESLint & Prettier', note: 'Consistent, linted, formatted codebases.' },
    ],
  },
  {
    title: 'Deployment',
    skills: [
      {
        name: 'Vercel',
        note: 'Next.js hosting, preview deployments and environment configuration.',
      },
      { name: 'Neon', note: 'Serverless Postgres with branch-per-environment databases.' },
      {
        name: 'GitHub Actions',
        note: 'Automated type-check, lint and test on every push.',
      },
    ],
  },
];
