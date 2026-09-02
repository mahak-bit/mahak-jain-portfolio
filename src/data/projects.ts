/**
 * Project data. Edit this file to add / change work.
 *
 * Honesty rules:
 *  - Only describe things that actually exist and were actually built.
 *  - Unknowns stay as visible [ADD ...] placeholders — never a guess.
 *  - `status: 'placeholder'` renders a clearly-labelled empty slot.
 */

export type ProjectStatus = 'live' | 'in-progress' | 'concept' | 'placeholder';

export interface Screenshot {
  /** Empty string → renders an "[ADD SCREENSHOT]" placeholder panel. */
  src: string;
  alt: string;
  caption?: string;
}

export interface CasePoint {
  title: string;
  detail: string;
}

export interface Project {
  slug: string;
  index: string;
  name: string;
  year: string;
  status: ProjectStatus;
  featured: boolean;

  /** One sentence: what it is. */
  oneLiner: string;

  /** The mini-story shown on the home page. */
  story: {
    solving: string;
    built: string;
    learned: string;
  };

  tech: string[];
  links: { demo?: string; github?: string };
  screenshots: Screenshot[];

  /** Deeper material for the /projects/[slug] page. */
  caseStudy: {
    overview: string;
    features: CasePoint[];
    architecture: string[];
    challenges: CasePoint[];
    outcome: string;
  };
}

export const projects: Project[] = [
  {
    slug: 'ai-study-planner',
    index: 'i',
    name: 'AI Study Planner',
    year: '2026',
    status: 'live',
    featured: true,
    oneLiner:
      'A study planner that reshuffles itself when you miss a session — with an AI coach that can actually see your schedule.',
    story: {
      solving:
        'Every study planner I’d used broke the moment real life happened. Miss one session and the whole plan is just wrong, sitting there. I wanted one that expected you to fall behind.',
      built:
        'A Next.js app with two layers of rescheduling: a plain, tested function that instantly redistributes missed time, and an optional “redo it with AI” pass on top. The coach is a real tool-calling agent — it can read your exams and weak topics, but it structurally can’t touch your plan or see anyone else’s data.',
      learned:
        'That you can’t trust model output for a database write, ever — even valid-looking JSON. And that a real production build finds bugs the dev server never will; this one caught a sign-in failure that only happened off Vercel.',
    },
    tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Auth.js', 'Vercel AI SDK', 'Zod'],
    links: {
      demo: '', // [ADD LIVE DEMO URL]
      github: '', // [ADD GITHUB REPO URL]
    },
    screenshots: [
      { src: '', alt: 'AI Study Planner — dashboard', caption: '[ADD SCREENSHOT] — Dashboard' },
      { src: '', alt: 'AI Study Planner — planner', caption: '[ADD SCREENSHOT] — Planner' },
      { src: '', alt: 'AI Study Planner — coach', caption: '[ADD SCREENSHOT] — AI Coach' },
    ],
    caseStudy: {
      overview:
        'A student enters their subjects, exams and real weekly hours; an AI layer builds a day-by-day schedule, and a deterministic engine keeps it realistic as things get completed or missed. An AI coach answers “why am I behind?” by calling read-only tools scoped to that student’s own data.',
      features: [
        {
          title: 'AI-generated plans',
          detail:
            'Schema-validated structured output from the student’s subjects, topics and available hours, with a retry-once-then-typed-error contract.',
        },
        {
          title: 'Deterministic rescheduling',
          detail:
            'A pure, unit-tested function pools missed minutes and redistributes them across upcoming days — never silently dropping time or overloading a day.',
        },
        {
          title: 'A coach that can’t misbehave',
          detail:
            'Four read-only tools, each binding the user id through a closure. No write tools at all. It can’t read another user’s data because there’s no parameter for it.',
        },
        {
          title: 'Grounded analytics',
          detail:
            'Study time, completion rate, subject progress, consistency — each answering one question, none of it decoration.',
        },
      ],
      architecture: [
        'Server Components for reads, Server Actions for owned CRUD, Route Handlers for anything that streams or generates.',
        'All logic in a service layer scoped by a server-derived user id — unit-tested with a two-user fixture so a dropped filter fails the test.',
        'AI output filtered against the user’s real record ids before any write.',
        'One provider module behind every agent — the model swap (to a free tier, under a quota wall) touched two files.',
      ],
      challenges: [
        {
          title: 'A production-only auth bug',
          detail:
            'Sign-in threw “UntrustedHost” on every attempt off Vercel — invisible on the dev server, obvious the moment I ran a real build.',
        },
        {
          title: 'Keeping AI honest about writes',
          detail:
            'A hallucinated record id passes schema validation just fine. Every persist step re-checks the model’s response against the user’s actual data first.',
        },
      ],
      outcome:
        'A deployed, tested MVP covering the whole loop: onboarding, generation, adaptive rescheduling, analytics and the coach. Unit tests cover the rebalance edge cases, cross-tenant access and the agent retry contract.',
    },
  },
  {
    slug: 'portfolio-site',
    index: 'ii',
    name: 'This site',
    year: '2026',
    status: 'live',
    featured: true,
    oneLiner: 'The site you’re on — rebuilt to stop looking like every other AI portfolio.',
    story: {
      solving:
        'The first version was fine and completely forgettable — the same floating cards, glowing orb and “building the future with AI” energy as a hundred other portfolios. If you removed my name, nothing was left.',
      built:
        'A full redesign around type and composition instead of effects: a serif display face, a single vermilion accent, asymmetric layouts, and roughly half the animation. The projects became the centrepiece, the copy got rewritten in a normal voice, and the AI assistant got demoted to a quiet “ask around” at the bottom.',
      learned:
        'That “make it feel human” is mostly restraint — fewer gradients, fewer rounded rectangles, fewer things moving — plus a few deliberate imperfections that a generator would never choose.',
    },
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    links: {
      demo: '', // [ADD LIVE URL once deployed]
      github: 'https://github.com/mahak-bit/mahak-jain-portfolio',
    },
    screenshots: [
      { src: '', alt: 'Portfolio — hero', caption: '[ADD SCREENSHOT] — Hero' },
      { src: '', alt: 'Portfolio — work section', caption: '[ADD SCREENSHOT] — Work' },
    ],
    caseStudy: {
      overview:
        'A single-page site with dynamic case-study routes, built from one set of typed data files — no CMS. Designed and engineered as one piece, with a deliberate typographic identity rather than a component-kit look.',
      features: [
        {
          title: 'Type-led, not effect-led',
          detail:
            'Fraunces for display, a grotesk for text, mono for structure, and one handwritten annotation. Composition does the work.',
        },
        {
          title: '“Ask around”',
          detail:
            'A local keyword assistant behind a single async function — swap in a real model endpoint later without touching the UI.',
        },
        {
          title: 'Calm motion',
          detail:
            'One scroll entrance, reused everywhere, plus a scroll-linked drift on the tools list. Everything collapses under reduced-motion.',
        },
      ],
      architecture: [
        'App Router with statically generated case-study routes.',
        'All content in typed data files (projects, now, build log, tools).',
        'Server Components by default; interactivity isolated to small client components.',
      ],
      challenges: [
        {
          title: 'Originality inside a familiar format',
          detail:
            'A portfolio is a well-worn shape. The work was in the details — the spacing, the accent discipline, the annotation — not in reinventing the structure.',
        },
      ],
      outcome:
        'A fast, accessible single-page site with dynamic case studies, full light/dark theming, and SEO metadata, sitemap and robots configured.',
    },
  },
  {
    slug: 'project-slot-03',
    index: 'iii',
    name: '[ADD PROJECT]',
    year: '[ADD YEAR]',
    status: 'placeholder',
    featured: false,
    oneLiner: 'An open slot — add your next project in src/data/projects.ts.',
    story: {
      solving: '[ADD: what problem were you looking at?]',
      built: '[ADD: what did you actually build?]',
      learned: '[ADD: what surprised you / what would you do differently?]',
    },
    tech: ['[ADD TECH]'],
    links: {},
    screenshots: [{ src: '', alt: 'Project screenshot', caption: '[ADD SCREENSHOT]' }],
    caseStudy: {
      overview: '[ADD OVERVIEW]',
      features: [{ title: '[ADD FEATURE]', detail: '[ADD DETAIL]' }],
      architecture: ['[ADD ARCHITECTURE NOTE]'],
      challenges: [{ title: '[ADD CHALLENGE]', detail: '[ADD DETAIL]' }],
      outcome: '[ADD OUTCOME]',
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
