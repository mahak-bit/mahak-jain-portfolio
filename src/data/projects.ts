/**
 * Project data. Edit this file to add / update work.
 *
 * Honesty rules for this file:
 *  - Only describe things that actually exist and were actually built.
 *  - Anything unknown stays as a visible [ADD ...] placeholder — never a guess.
 *  - `status: 'placeholder'` entries render as clearly-labelled empty slots.
 */

export type ProjectStatus = 'live' | 'in-progress' | 'concept' | 'placeholder';

export interface CaseStudyPoint {
  title: string;
  detail: string;
}

export interface Screenshot {
  /** Leave empty to render an "[ADD SCREENSHOT]" placeholder panel. */
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  /** 1–2 sentences shown on the work card. */
  description: string;
  year: string;
  status: ProjectStatus;
  featured: boolean;
  tech: string[];
  overview: string;
  problem: string;
  approach: string;
  features: CaseStudyPoint[];
  architecture: string[];
  challenges: CaseStudyPoint[];
  outcome: string;
  screenshots: Screenshot[];
  links: {
    demo?: string;
    github?: string;
  };
}

export const projects: Project[] = [
  {
    slug: 'ai-study-planner',
    number: '01',
    name: 'AI Study Planner',
    tagline: 'An adaptive study platform with real AI agents — not a chatbot wrapper.',
    description:
      'A full-stack AI platform that generates a personalised study schedule from a student’s subjects, exams and real availability, then rebalances it automatically when sessions are missed. Includes a tool-calling AI Coach grounded in the student’s own data.',
    year: '2026',
    status: 'live',
    featured: true,
    tech: [
      'Next.js 16',
      'TypeScript',
      'Tailwind CSS',
      'Prisma',
      'PostgreSQL (Neon)',
      'Auth.js',
      'Vercel AI SDK',
      'Zod',
      'Vitest',
      'Playwright',
    ],
    overview:
      'AI Study Planner is a production-grade study platform. A student enters their subjects, topics, exam dates and weekly availability during onboarding; an AI planning layer builds a day-by-day schedule that respects their real hours, and a deterministic engine keeps that schedule realistic as tasks are completed or missed. An AI Coach answers questions like “why am I behind?” by calling read-only tools scoped to that student’s own data.',
    problem:
      'Most study planners are static. You fill in a schedule once, and the moment a session is missed the plan just sits there — wrong. Nothing reconsiders exam dates, how confident you feel about each topic, or how much time is realistically left. Students end up abandoning the plan or rebuilding it by hand.',
    approach:
      'Two tiers of rescheduling. A pure, unit-tested rebalancing function runs instantly whenever a task is marked missed — it pools the lost minutes and reallocates them across upcoming days, weighted by exam proximity and low-confidence topics, against each day’s real capacity. On top of that, an explicit “Optimize with AI” pass refines that deterministic baseline rather than inventing a schedule from scratch. Business logic lives in a service layer called by both Server Actions and Route Handlers, and every service function is scoped by a server-verified user id.',
    features: [
      {
        title: 'AI-generated study plans',
        detail:
          'A planning agent produces schema-validated structured output from the student’s subjects, topics, exam dates and available hours, with a retry-once-then-typed-error contract.',
      },
      {
        title: 'Deterministic adaptive rescheduling',
        detail:
          'Missing a task triggers a pure function that redistributes the time across upcoming days — respecting each day’s capacity and never silently dropping minutes or overloading a day.',
      },
      {
        title: 'Tool-calling AI Coach',
        detail:
          'A genuine multi-turn agent with four read-only tools. Each tool binds the user id via closure, so the coach is structurally unable to read another user’s data or modify a plan.',
      },
      {
        title: 'Grounded progress analytics',
        detail:
          'Study time, completion rate, subject progress and a consistency view — each answering a specific question rather than existing as decoration.',
      },
      {
        title: 'Auth, onboarding & route protection',
        detail:
          'Email/password with optional Google OAuth, a multi-step onboarding wizard, and route guarding driven by both authentication and onboarding-completion state.',
      },
    ],
    architecture: [
      'Server Components for data reads, Server Actions for owned-entity CRUD, Route Handlers for anything that streams or generates.',
      'All business logic in a service layer (lib/services) called by both entry points — never trapped in a component or duplicated.',
      'Every service function takes a server-derived user id and scopes every database query by it; this is unit-tested with a two-user fixture so a dropped filter fails the test.',
      'Provider-abstracted AI layer: agents import a model from one provider module, never a vendor SDK directly.',
      'AI output is never trusted for a write — model responses are filtered against the requesting user’s real record ids before anything is persisted.',
    ],
    challenges: [
      {
        title: 'A latent production-only auth bug',
        detail:
          'Testing against a real production build (not just the dev server) surfaced an “UntrustedHost” failure on every sign-in outside Vercel. Fixed with an explicit trustHost setting — a bug the dev server would never have shown.',
      },
      {
        title: 'Swapping the model provider under a quota wall',
        detail:
          'The project started on one hosted model API and hit a real quota limit. Because every agent imported from a single provider module, moving to a free-tier model touched only two files.',
      },
      {
        title: 'Keeping AI honest about writes',
        detail:
          'A hallucinated or cross-tenant record id still passes schema validation. Every service that persists AI output re-checks the model’s response against the user’s actual data first.',
      },
    ],
    outcome:
      'A deployed, tested MVP covering the full loop: onboarding, AI plan generation, adaptive rescheduling, analytics and the AI Coach. Unit tests cover the rebalance algorithm’s edge cases, cross-tenant authorization and the agent retry contract; a small Playwright suite covers the critical signup-to-dashboard path.',
    screenshots: [
      { src: '', alt: 'AI Study Planner dashboard', caption: '[ADD SCREENSHOT] — Dashboard' },
      { src: '', alt: 'AI Study Planner planner view', caption: '[ADD SCREENSHOT] — Planner' },
      { src: '', alt: 'AI Study Planner AI Coach', caption: '[ADD SCREENSHOT] — AI Coach' },
    ],
    links: {
      demo: '', // [ADD LIVE DEMO URL]
      github: '', // [ADD GITHUB REPO URL]
    },
  },
  {
    slug: 'portfolio-site',
    number: '02',
    name: 'This Portfolio',
    tagline: 'The site you’re reading — a hand-built, motion-driven identity.',
    description:
      'A bespoke portfolio built from scratch: a custom design system, a simulated “ask my portfolio” command bar structured for a real LLM backend, and a restrained Framer Motion layer that fully respects reduced-motion.',
    year: '2026',
    status: 'live',
    featured: true,
    tech: ['Next.js 16', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion', 'Lucide'],
    overview:
      'A single-page portfolio with dynamic case-study routes, designed and engineered as one piece. The goal was a site that reads as “a designer and an engineer built this,” not a template: a token-based design system, deliberate typographic hierarchy, and interaction that has a purpose everywhere it appears.',
    problem:
      'Most developer portfolios look the same — the same template cards, the same hero, the same skill bars. It’s hard to communicate craft when the container itself signals “generated”.',
    approach:
      'Start from a design system (OKLCH token palette, one accent, mono for structure), then build every component by hand against it. Motion is added last and only where it clarifies: staggered reveals, a magnetic CTA, project-card hover, a typing terminal. The “ask my portfolio” interaction runs a local keyword engine now but is written behind an async boundary so a real model API can drop in later.',
    features: [
      {
        title: 'Custom design system',
        detail:
          'OKLCH token palette with automatic light/dark theming, a single warm accent, and monospace used structurally for eyebrows and numbering.',
      },
      {
        title: '“Ask my portfolio” command bar',
        detail:
          'A simulated assistant with keyword-matched answers and streamed rendering — structured so a real LLM endpoint can replace the local matcher without touching the UI.',
      },
      {
        title: 'Purpose-driven motion',
        detail:
          'Reveal-on-scroll, a magnetic primary button, a cursor-follow accent and a typing terminal — every animation gated behind prefers-reduced-motion.',
      },
      {
        title: 'Dynamic case studies',
        detail:
          'Statically generated project pages from a single typed data file, with per-project metadata and Open Graph tags.',
      },
    ],
    architecture: [
      'App Router with statically generated dynamic routes for case studies.',
      'All content in typed data files (projects, skills, journey) — no CMS, easy to edit.',
      'Server Components by default; interactivity isolated to small client components.',
      'The assistant interaction sits behind one async function, so swapping the local engine for a real API is a one-file change.',
    ],
    challenges: [
      {
        title: 'Originality within a familiar form',
        detail:
          'A portfolio is a well-worn format. The work was in the details — spacing rhythm, the accent discipline, the terminal, the workflow diagram — rather than reinventing the structure.',
      },
      {
        title: 'Motion that never gets in the way',
        detail:
          'Every animation was pressure-tested for whether it earns its place, kept short, and made to fully collapse under reduced-motion.',
      },
    ],
    outcome:
      'A fast, accessible, single-page portfolio with dynamic case-study routes, full light/dark theming, SEO metadata, a sitemap and a robots configuration.',
    screenshots: [
      { src: '', alt: 'Portfolio hero section', caption: '[ADD SCREENSHOT] — Hero' },
      { src: '', alt: 'Portfolio work section', caption: '[ADD SCREENSHOT] — Selected Work' },
    ],
    links: {
      demo: '', // [ADD LIVE URL once deployed]
      github: '', // [ADD GITHUB REPO URL]
    },
  },
  {
    slug: 'project-slot-03',
    number: '03',
    name: '[ADD PROJECT]',
    tagline: '[ADD ONE-LINE TAGLINE]',
    description:
      'Open slot. Add your next project in src/data/projects.ts — problem, approach, features, tech and links. This card and its case study page render automatically.',
    year: '[ADD YEAR]',
    status: 'placeholder',
    featured: false,
    tech: ['[ADD TECH]'],
    overview: '[ADD OVERVIEW]',
    problem: '[ADD PROBLEM]',
    approach: '[ADD APPROACH]',
    features: [{ title: '[ADD FEATURE]', detail: '[ADD FEATURE DETAIL]' }],
    architecture: ['[ADD ARCHITECTURE NOTE]'],
    challenges: [{ title: '[ADD CHALLENGE]', detail: '[ADD CHALLENGE DETAIL]' }],
    outcome: '[ADD OUTCOME]',
    screenshots: [{ src: '', alt: 'Project screenshot', caption: '[ADD SCREENSHOT]' }],
    links: {},
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const projectSlugs = projects.map((p) => p.slug);
