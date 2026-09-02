/**
 * Project data. Edit this file to add / change work.
 *
 * Honesty rules:
 *  - Only describe things that actually exist and were actually built.
 *  - Unknowns stay as visible [ADD ...] placeholders — never a guess.
 *  - `status: 'placeholder'` renders a clearly-labelled empty slot.
 *
 * Every project below is deployed. Screenshots are marked [ADD SCREENSHOT] —
 * grab them from the live sites (all linked) and drop them in `public/`.
 */

export type ProjectStatus = 'live' | 'in-progress' | 'concept' | 'placeholder';

export interface Screenshot {
  /** Empty string → renders an "[ADD SCREENSHOT]" placeholder panel. */
  src: string;
  alt: string;
  caption?: string;
  /** 'contain' (logos, portrait shots) sits the image on a dark panel; default 'cover'. */
  fit?: 'cover' | 'contain';
}

export interface CasePoint {
  title: string;
  detail: string;
}

export interface Project {
  slug: string;
  /** Auto-assigned two-digit number (01, 02, 03…) from list order. */
  number: string;
  name: string;
  year: string;
  status: ProjectStatus;
  featured: boolean;
  /** Optional label — e.g. "Client project". Shown next to the year. */
  context?: string;

  /** One sentence: what it is. */
  oneLiner: string;

  /** The mini-story shown on the archive entry. */
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

type ProjectInput = Omit<Project, 'number'>;

/**
 * The list. To add a project, drop a new object in here — the number, the
 * archive entry and the /projects/<slug> page all follow automatically.
 */
const projectList: ProjectInput[] = [
  {
    slug: 'pawan-industries',
    name: 'Pawan Industries',
    year: '2026',
    status: 'live',
    featured: true,
    context: 'Client project',
    oneLiner:
      'A cinematic, scroll-driven site for a rice-milling company — the production line told as one continuous film.',
    story: {
      solving:
        'Built for Pawan Industries, a rice-milling company in Kota. They needed a site that felt as precise as the process they run — and most factory websites are a logo, a stock photo and a phone number.',
      built:
        'A single-page scroll experience in Next.js: a 14-step journey from raw paddy to packed grain, expandable craft stages, a product range with quality grades, a zero-waste model and a real facility spec sheet. GSAP timelines and Lenis smooth scroll carry it; every section has a reduced-motion fallback.',
      learned:
        'How to pace a long scroll so it reads as one film rather than fourteen disconnected sections — and how much of “premium” is restraint in the type and timing, not more effects.',
    },
    tech: ['Next.js 16', 'TypeScript', 'GSAP', 'Lenis', 'Tailwind CSS'],
    links: {
      demo: 'https://pawan-industries-livid.vercel.app',
      github: 'https://github.com/mahak-bit/PAWAN-INDUSTRIES',
    },
    screenshots: [
      {
        src: '/projects/pawan-industries.jpg',
        alt: 'The Pawan Industries milling facility',
        caption: 'The facility',
      },
      { src: '', alt: 'Pawan Industries — the journey', caption: '[ADD SCREENSHOT] — The Journey section' },
    ],
    caseStudy: {
      overview:
        'Pawan Industries processes raw paddy into graded, packed rice for domestic and export markets. They wanted their public site to present that as a continuous narrative — “precision in every grain” — instead of a brochure.',
      features: [
        {
          title: 'The Journey',
          detail: 'A 14-step visual walk-through from paddy collection to final packaging.',
        },
        {
          title: 'The Craft',
          detail:
            'Four operational stages — cleaning & de-stoning, whitening, optical sorting, grading & packing — each expandable in place.',
        },
        {
          title: 'Products & grades',
          detail: 'Basmati varieties and quality tiers, plus brown-rice options.',
        },
        {
          title: 'Sustainability',
          detail: 'The zero-waste model that turns by-products into bran oil, fuel and cattle feed.',
        },
        {
          title: 'Facility specs',
          detail: 'The real equipment — optical sorters, whitening systems, multi-stage dryers, steam power.',
        },
      ],
      architecture: [
        'Single route (app/page.tsx); each chapter is its own component with a self-contained GSAP timeline and cleanup.',
        'All copy and product data in one lib/data.ts file.',
        'Lenis for smooth scroll, GSAP ScrollTrigger for the scrubbed sequences.',
      ],
      challenges: [
        {
          title: 'One piece, not fourteen',
          detail:
            'Keeping a long scroll feeling authored by one hand — solved with a shared pacing rhythm and a consistent type scale rather than section-by-section flourishes.',
        },
      ],
      outcome:
        'The company’s public site — a deployed, production-ready experience that reads like a documentary short, from process to products in one scroll.',
    },
  },

  {
    slug: 'zazzlers',
    name: 'Zazzlers',
    year: '2026',
    status: 'live',
    featured: true,
    oneLiner:
      'A full production e-commerce platform for a fashion label — storefront, payments, notifications and a complete admin back office.',
    story: {
      solving:
        'A clothing brand needs more than a storefront: order management, payments that reconcile, stock control and customer comms — without paying a platform a cut of every sale.',
      built:
        'An end-to-end store in Next.js. Front: catalogue, cart, wishlist, reviews, an editorial lookbook, checkout. Payments: Razorpay with a verify step and a webhook. Comms: SMS and email on order events, plus in-app notifications, PDF invoices and order QR codes. Behind it, a full admin dashboard — products with bulk actions, orders with payment/shipping/status-history control, users, categories, coupons, messages and analytics.',
      learned:
        'That the hard part of commerce isn’t the checkout button — it’s the states after it: partial payments, refunds, status history, and making the admin side fast enough that someone actually uses it.',
    },
    tech: ['Next.js 16', 'TypeScript', 'Prisma', 'PostgreSQL', 'Auth.js', 'Razorpay', 'Tailwind CSS'],
    links: {
      demo: 'https://zazzlers.vercel.app',
      // repo is private
    },
    screenshots: [
      {
        src: '/projects/zazzlers-logo.png',
        alt: 'Zazzlers logo',
        caption: 'Zazzlers',
        fit: 'contain',
      },
      { src: '', alt: 'Zazzlers — admin orders', caption: '[ADD SCREENSHOT] — Admin dashboard' },
    ],
    caseStudy: {
      overview:
        'Zazzlers is an Indian fashion label — heavyweight graphic tees and wide-leg denim. The site is the full commercial system behind it: a shoppable storefront and the operational tooling to run it.',
      features: [
        {
          title: 'Storefront',
          detail: 'Collections, product detail, search, cart, wishlist, reviews and an editorial lookbook.',
        },
        {
          title: 'Checkout',
          detail: 'Razorpay integration with a server-side verify step and a webhook, plus UPI reference capture.',
        },
        {
          title: 'Customer comms',
          detail: 'SMS (Twilio) and email (Resend) on order events; in-app notifications.',
        },
        {
          title: 'Documents',
          detail: 'Generated PDF invoices and per-order QR codes.',
        },
        {
          title: 'Admin back office',
          detail:
            'Products with bulk edit, orders with payment / shipping / status-history control, users, categories, coupons, contact messages and dashboard stats.',
        },
      ],
      architecture: [
        'Prisma schema of around twenty models: users and auth, catalogue, cart / wishlist, orders with status history, addresses, coupons, notifications.',
        'Storefront and admin each get their own Route Handler API surface under app/api.',
        'Auth.js v5 with credentials + bcrypt and a full password-reset flow; Postgres and file storage on Supabase.',
      ],
      challenges: [
        {
          title: 'Payment integrity',
          detail:
            'A checkout that survives a dropped connection — the order, the Razorpay verify call and the webhook all have to agree before anything ships.',
        },
        {
          title: 'Admin performance',
          detail:
            'The order and product tables had to stay fast with real data, which drove the bulk-action and filtering design.',
        },
      ],
      outcome:
        'A deployed storefront with a working admin back office — the full loop from browsing to a fulfilled, paid order.',
    },
  },

  {
    slug: 'ai-study-planner',
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
    tech: ['Next.js 16', 'TypeScript', 'Prisma', 'PostgreSQL', 'Auth.js', 'Vercel AI SDK', 'Vitest'],
    links: {
      demo: 'https://ai-study-planner-three-psi.vercel.app',
      github: 'https://github.com/mahak-bit/ai-study-planner',
    },
    screenshots: [
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
          detail: 'Study time, completion rate, subject progress and consistency — each answering one question.',
        },
      ],
      architecture: [
        'Server Components for reads, Server Actions for owned CRUD, Route Handlers for anything that streams or generates.',
        'All logic in a service layer scoped by a server-derived user id — unit-tested with a two-user fixture so a dropped filter fails the test.',
        'AI output filtered against the user’s real record ids before any write; one provider module behind every agent.',
        'Vitest for units (rebalance edge cases, cross-tenant access, the agent retry contract) and a small Playwright critical-path suite, run in CI.',
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
        'A deployed, tested MVP covering the whole loop: onboarding, generation, adaptive rescheduling, analytics and the coach.',
    },
  },

  {
    slug: 'india-at-80',
    name: 'India at 80',
    year: '2026',
    status: 'live',
    featured: true,
    oneLiner:
      'A scroll-driven digital exhibition on 80 years of Indian independence — history, protest and the questions still open.',
    story: {
      solving:
        'I wanted to see whether a serious subject — “what does freedom actually look like at 80?” — could hold up as an interactive exhibition instead of an essay, without cheapening it with stock imagery or AI-generated “history”.',
      built:
        'One continuous scroll through fourteen chapters: a 1947–2026 timeline, a wall of documented civic movements with real sources, a culture section, and speculative “next 80 years” prompts. Every visual is generative or typographic — particle formations, SVG pattern work drawn from block prints and jali lattice — zero photographs by design, with an asset manifest ready to take real licensed images.',
      learned:
        'How to build a long-form narrative where each chapter has its own GSAP timeline and reduced-motion fallback but the whole still reads as one hand — and where to draw the line on a subject that could easily overreach.',
    },
    tech: ['Next.js 16', 'TypeScript', 'GSAP', 'Canvas', 'Lenis', 'Tailwind CSS'],
    links: {
      demo: 'https://india-at-80.vercel.app',
      github: 'https://github.com/mahak-bit/india-at-80',
    },
    screenshots: [
      { src: '', alt: 'India at 80 — hero', caption: '[ADD SCREENSHOT] — Hero' },
      { src: '', alt: 'India at 80 — timeline', caption: '[ADD SCREENSHOT] — Timeline' },
    ],
    caseStudy: {
      overview:
        'An independent digital exhibition marking 80 years of Indian independence. It treats freedom as inherited, questioned and reimagined by each generation rather than settled — history as narrative, not verdict.',
      features: [
        {
          title: 'Fourteen-chapter scroll',
          detail:
            'Hero → timeline → archive wall → people → culture → civic map → open questions → the next 80 → credits, as one continuous piece.',
        },
        {
          title: 'Civic movements',
          detail:
            'Documented, closed historical movements — each with dates, location, demands, government response and real sources.',
        },
        {
          title: 'Generative visuals only',
          detail:
            'Particle formations (the “80”, the map of India, a flag reveal) and SVG pattern work from Indian textile and architectural motifs.',
        },
        {
          title: 'Asset manifest',
          detail: 'A registry (lib/assets.ts) so real licensed photography drops in later and the placeholders retire automatically.',
        },
      ],
      architecture: [
        'Single route; one component per chapter, each owning its GSAP timeline, reduced-motion fallback and cleanup.',
        'All historical data in lib/data.ts, every record carrying a source field.',
        'Shared canvas point-sampling (lib/particles.ts) powers every particle-formation visual.',
      ],
      challenges: [
        {
          title: 'Scoping honestly',
          detail:
            'The full idea wanted WebGL scenes, per-state culture breakdowns and a live protest map. The shipped version is 2D canvas + GSAP and only documented, closed movements — what one build could do responsibly.',
        },
        {
          title: 'No photography',
          detail: 'Building visual richness from particles, gradients and typography instead of images.',
        },
      ],
      outcome:
        'A deployed single-page exhibition that carries a heavy subject on composition and motion alone.',
    },
  },

  {
    slug: 'porsche-911-carrera',
    name: '911 Carrera',
    year: '2026',
    status: 'live',
    featured: true,
    oneLiner:
      'A scroll-scrubbed concept microsite for the Porsche 911 Carrera — each clip’s playback position is your scroll position.',
    story: {
      solving:
        'Apple product pages feel incredible because the imagery is tied to your scroll. I wanted that effect without their pipeline — no sliced frame sequences, no 3D, no WebGL.',
      built:
        'A premium single-page microsite where each chapter’s video has its currentTime driven straight by scroll position — hero orbit, exterior, engine, wheels, interior, performance tunnel, final reveal. Everything is CSS transforms and native video seeking, so nothing competes with scroll compositing.',
      learned:
        'That the 3D car placeholder was the entire performance cost — a shadow map recomputing every frame. Removing it and switching to scrubbed footage cut the page’s JS from ~424KB to under 4KB, and it felt better.',
    },
    tech: ['Next.js 15', 'TypeScript', 'GSAP', 'ScrollTrigger', 'Lenis', 'Tailwind CSS'],
    links: {
      demo: 'https://porsche-911-carrera-site.vercel.app',
      github: 'https://github.com/mahak-bit/porsche-911-carrera',
    },
    screenshots: [
      { src: '', alt: '911 Carrera — hero', caption: '[ADD SCREENSHOT] — Hero' },
      { src: '', alt: '911 Carrera — performance', caption: '[ADD SCREENSHOT] — Performance' },
    ],
    caseStudy: {
      overview:
        'An unofficial, fan-made concept build — no Porsche branding or assets. A study in scroll-driven storytelling: “born from heritage, engineered for speed”, told through nine chapters of scrubbed footage.',
      features: [
        {
          title: 'Scroll-scrubbed video',
          detail:
            'Each clip’s playback position is the scroll position; clips are reused and frame-held where an SVG overlay does the animating instead.',
        },
        {
          title: 'SVG overlays',
          detail:
            'Energy lines over the engine, airflow lines over the aero section, a speed HUD in the cockpit, spec reveals in the tunnel.',
        },
        {
          title: 'Tuned for smoothness',
          detail: 'One scrub value site-wide and threshold-gated seeks, so the scroll stays connected without stutter.',
        },
      ],
      architecture: [
        'Next.js 15 with Turbopack; GSAP ScrollTrigger for every scrubbed section; Lenis for smooth scroll.',
        'No Three.js or React Three Fiber — removed deliberately after profiling showed it was 99% of the JS.',
        'Source clips trimmed and cropped to remove third-party badges and a generation artifact before use.',
      ],
      challenges: [
        {
          title: 'Smoothness',
          detail:
            'Video seeking and scroll compositing fight each other — solved with threshold-gated currentTime updates and a single light scrub value everywhere.',
        },
        {
          title: 'Bundle size',
          detail: 'The 3D scene was almost all of the JS; cutting it was the single biggest performance win.',
        },
      ],
      outcome:
        'A sub-4KB-JS microsite that feels like a high-budget product page, running on native browser features.',
    },
  },

  {
    slug: 'beauty-match',
    name: 'Beauty Match',
    year: '2026',
    status: 'live',
    featured: true,
    oneLiner:
      'An AI skincare-matching platform with an explainable engine — every recommendation shows its reasoning, never a bare percentage.',
    story: {
      solving:
        'Beauty recommendation quizzes are black boxes — you answer five questions and get a product with no idea why. I wanted one where the match is transparent enough to argue with.',
      built:
        'A discovery platform with two quiz modes — a conversational AI quiz (Claude, via the Vercel AI SDK) that adapts to your answers, and a fast static one that needs no AI credits. Both feed a scoring engine that grades skin fit, concern coverage, ingredient compatibility and budget, and shows the reasons and caveats behind every score. Plus a filterable catalogue across mass, clinical, K-beauty and Indian brands, an ingredient explorer, and an AM/PM routine builder that flags conflicting actives.',
      learned:
        'That the interesting design problem in an “AI product” is often the non-AI part — here, a scoring model you can inspect line by line, with the LLM only doing the conversational front end.',
    },
    tech: ['Next.js 16', 'TypeScript', 'Claude / Vercel AI SDK', 'Drizzle ORM', 'libSQL', 'Tailwind CSS'],
    links: {
      demo: 'https://beauty-match-p.vercel.app',
      github: 'https://github.com/mahak-bit/beauty-match',
    },
    screenshots: [
      { src: '', alt: 'Beauty Match — quiz', caption: '[ADD SCREENSHOT] — The quiz' },
      { src: '', alt: 'Beauty Match — a match with reasoning', caption: '[ADD SCREENSHOT] — A match, explained' },
    ],
    caseStudy: {
      overview:
        'A beauty-tech discovery platform: “skincare matched to your skin, not the other way around”. A conversational AI quiz and a static quiz both feed one transparent matching engine over a structured product catalogue.',
      features: [
        {
          title: 'Two quiz modes',
          detail: 'An adaptive conversational quiz (Claude) and a fast static flow with no AI cost.',
        },
        {
          title: 'Explainable matching',
          detail:
            'Scores across skin fit, concern coverage, ingredient compatibility and budget — each shown with its reasons and caveats, never a bare percentage.',
        },
        {
          title: 'Catalogue',
          detail:
            'Eight categories with ingredient- and concern-based filtering, spanning mass, clinical, K-beauty and Indian brands.',
        },
        {
          title: 'Routine builder',
          detail: 'Slot matches into AM/PM and get warned about incompatible active ingredients before you buy.',
        },
        {
          title: 'Ingredient explorer & shelf',
          detail: 'Side-by-side compare, plus a localStorage “Beauty Shelf” for saved products and routines.',
        },
      ],
      architecture: [
        'Drizzle ORM over libSQL (SQLite) locally — no native compilation, works on any OS — designed to swap to Postgres / Turso for production.',
        'The matching model lives in lib/match/engine.ts as a pure scoring function; the LLM only powers the conversational quiz.',
        'Next.js 16 with the proxy.ts convention; a centralised Framer Motion variant system.',
        'Seed data is explicitly labelled dataSource: "seed" — 28 brands, 54 products, not real verified listings.',
      ],
      challenges: [
        {
          title: 'Keeping the AI honest',
          detail:
            'The scoring is deterministic and inspectable; the model never invents a match, it only conducts the interview.',
        },
        {
          title: 'Ingredient conflict logic',
          detail: 'Encoding which actives shouldn’t share a routine, and surfacing it at the right moment.',
        },
      ],
      outcome:
        'A deployed platform where every recommendation is traceable to a reason — the transparency is the product.',
    },
  },
];

export const projects: Project[] = projectList.map((p, i) => ({
  ...p,
  number: String(i + 1).padStart(2, '0'),
}));

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
