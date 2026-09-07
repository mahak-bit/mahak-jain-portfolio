/**
 * Résumé content, kept verbatim from Mahak's own résumé rather than rebuilt
 * from the site's project data — the two say deliberately different things,
 * and this page is the résumé, not a summary of the site.
 *
 * Same honesty rules as projects.ts: nothing here is invented or embellished.
 * Edit this file to change the résumé; the page is only a rendering of it.
 */

export type ResumeSkillGroup = { label: string; items: string[] };

export type ResumeProject = {
  title: string;
  stack: string;
  points: string[];
  /** Rendered as a link. Bare host, no protocol — the page adds it. */
  link?: { label: string; href: string; text: string };
};

export type ResumeRole = {
  title: string;
  period: string;
  meta?: string;
  points: string[];
};

export const resumeHeader = {
  name: 'Mahak Jain',
  roles: 'AI / Generative AI Developer · Full-Stack Developer · AI Product Builder',
  location: 'Kota, Rajasthan, India',
  email: 'mahakj532@gmail.com',
  /**
   * Present on the résumé, deliberately NOT rendered on this page: the site is
   * indexed, and a phone number in indexed markup gets harvested. The contact
   * form reaches her inbox, which is the same door without the scraping. To
   * publish it anyway, render this in the contact list on the résumé page.
   */
  phone: '+91 7339735955',
  links: [
    { label: 'Portfolio', text: 'mahak-jain-portfolio.vercel.app', href: 'https://mahak-jain-portfolio.vercel.app' },
    { label: 'GitHub', text: 'github.com/mahak-bit', href: 'https://github.com/mahak-bit' },
    {
      label: 'LinkedIn',
      text: 'linkedin.com/in/mahak-jain-7665432a3',
      href: 'https://www.linkedin.com/in/mahak-jain-7665432a3/',
    },
    {
      label: 'Instagram',
      text: 'instagram.com/tech._bloom',
      href: 'https://www.instagram.com/tech._bloom/',
    },
  ],
} as const;

export const summary: string[] = [
  'AI-focused developer and BBA graduate building at the intersection of Generative AI, full-stack development, automation, and product design. Hands-on experience designing, developing, and deploying modern web applications using Next.js, React, TypeScript, Python, REST APIs, databases, and cloud deployment platforms.',
  'Proficient in modern AI-assisted development and rapid product-building workflows, leveraging tools such as OpenAI APIs and tools, Claude, AI coding assistants, AI prototyping platforms, and AI-powered design tools to accelerate ideation, architecture, development, debugging, and iteration.',
  'Strong foundation in LLM applications, RAG, AI agents, agentic workflows, prompt engineering, AI automation, and intelligent product development, with a project-driven approach to learning and experimentation.',
  'Combining technical development skills with business and product thinking, with a particular interest in AI product development, hackathons, rapid prototyping, startup environments, and building practical AI solutions that create measurable user value.',
];

export const skillGroups: ResumeSkillGroup[] = [
  {
    label: 'Generative AI & AI Engineering',
    items: [
      'Generative AI',
      'Large Language Models (LLMs)',
      'AI Agents',
      'Agentic Workflows',
      'Retrieval-Augmented Generation (RAG)',
      'Prompt Engineering',
      'AI Automation',
      'Tool Calling',
      'LLM APIs',
      'AI-Assisted Development',
    ],
  },
  {
    label: 'AI Development, Coding & Prototyping',
    items: [
      'OpenAI API & SDKs',
      'Claude',
      'ChatGPT',
      'Claude Code',
      'Lovable',
      'v0',
      'Replit',
      'Cursor',
      'AI Coding Assistants',
      'AI Prototyping',
      'AI-Assisted UI Development',
      'Rapid AI Application Development',
    ],
  },
  {
    label: 'AI Design & Creative Tools',
    items: [
      'Figma AI',
      'Midjourney',
      'Runway',
      'Leonardo AI',
      'AI Image Generation',
      'AI Video Generation',
      'AI-Powered Design Workflows',
    ],
  },
  {
    label: 'Programming Languages',
    items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML5', 'CSS3'],
  },
  {
    label: 'Frontend Development',
    items: [
      'React.js',
      'Next.js',
      'Tailwind CSS',
      'Responsive Web Design',
      'Framer Motion',
      'GSAP',
      'ScrollTrigger',
    ],
  },
  {
    label: 'Backend, APIs & Databases',
    items: [
      'Node.js',
      'REST APIs',
      'PostgreSQL',
      'SQLite',
      'Prisma ORM',
      'API Integration',
      'Authentication',
      'Environment Configuration',
    ],
  },
  {
    label: 'Automation & Developer Tools',
    items: ['Selenium', 'Web Automation', 'Git', 'GitHub', 'VS Code', 'Vercel', 'Figma', 'Postman'],
  },
  {
    label: 'AI-Assisted Development Workflow',
    items: [
      'AI-Powered Coding',
      'AI Code Generation',
      'AI Debugging',
      'AI UI/UX Prototyping',
      'AI Workflow Automation',
      'Rapid MVP Development',
      'Multi-Tool AI Development Workflows',
    ],
  },
];

export const resumeProjects: ResumeProject[] = [
  {
    title: 'Pawan Industries — Industrial Digital Experience',
    stack: 'Next.js · React · TypeScript · Tailwind CSS · GSAP · ScrollTrigger · Modern UI/UX',
    points: [
      'Designed and developed a premium digital experience for an industrial manufacturing business, transforming a conventional company website concept into an immersive, cinematic brand experience.',
      'Structured the experience around the complete manufacturing journey: raw material → processing → machining/fabrication → quality control → finished product.',
      'Designed an industrial storytelling system combining factory visuals, production processes, capabilities, people, quality, and company information.',
      'Implemented cinematic scrolling, motion-driven storytelling, full-width visual sections, and interactive transitions to communicate industrial scale and precision.',
      'Balanced 70% cinematic visual storytelling, 20% premium editorial design, and 10% technical/company information to create a distinctive B2B experience.',
      'Focused on translating a real-world industrial operation into a modern digital identity rather than building a generic corporate website.',
    ],
    link: {
      label: 'Live',
      text: 'pawan-industries-livid.vercel.app',
      href: 'https://pawan-industries-livid.vercel.app',
    },
  },
  {
    title: 'Zazzlers — Full-Stack E-Commerce Platform',
    stack: 'Next.js · React · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Vercel',
    points: [
      'Designed and developed a complete custom e-commerce platform from concept through deployment.',
      'Built responsive product discovery, product detail pages, shopping workflows, reusable UI components, and interactive experiences.',
      'Integrated Prisma + PostgreSQL for structured application data and backend workflows.',
      'Developed functionality for product, order, and administrative management.',
      'Implemented environment-based configuration and deployment using Vercel.',
      'Applied AI-assisted development workflows for rapid prototyping, debugging, architecture exploration, and implementation.',
      'Designed the platform with real-world business requirements and future scalability in mind.',
    ],
    link: { label: 'Live', text: 'zazzlers.vercel.app', href: 'https://zazzlers.vercel.app' },
  },
  {
    title: 'Porsche 911 — Cinematic Automotive Experience',
    stack: 'Next.js · React · TypeScript · Tailwind CSS · GSAP · ScrollTrigger · Lenis',
    points: [
      'Built a highly interactive automotive experience focused on cinematic storytelling and premium digital design.',
      'Implemented scroll-driven animations and transitions using GSAP and ScrollTrigger.',
      'Integrated smooth scrolling and motion choreography using Lenis.',
      'Created responsive layouts, reusable components, and immersive visual sections.',
      'Combined frontend engineering with strong visual design to create an experience inspired by premium automotive digital platforms.',
    ],
    link: {
      label: 'Live',
      text: 'porsche-911-carrera-site.vercel.app',
      href: 'https://porsche-911-carrera-site.vercel.app',
    },
  },
  {
    title: 'India at 80 — Interactive Digital Experience',
    stack: 'Next.js · React · Tailwind CSS · Animation · Vercel',
    points: [
      'Designed and developed an interactive digital experience celebrating India’s Independence Day.',
      'Used animation, visual storytelling, and interactive sections to create an experience beyond a traditional static website.',
      'Built and deployed the application using modern Next.js and React workflows.',
      'Focused on performance, responsive design, and memorable user interaction.',
    ],
    link: { label: 'Live', text: 'india-at-80.vercel.app', href: 'https://india-at-80.vercel.app' },
  },
  {
    title: 'AI Study Planner — AI Product Concept',
    stack: 'Python · Generative AI · APIs · Automation',
    points: [
      'Designed an AI-powered study planning concept capable of transforming user goals into personalized schedules and actionable tasks.',
      'Explored LLM-powered workflows for personalization, planning, and intelligent recommendations.',
      'Focused on designing AI around a practical user problem rather than creating a standalone chatbot.',
      'Demonstrates interest in building useful AI products and intelligent workflows.',
    ],
    link: {
      label: 'Live',
      text: 'ai-study-planner-three-psi.vercel.app',
      href: 'https://ai-study-planner-three-psi.vercel.app',
    },
  },
  {
    title: 'Python Automation Projects',
    stack: 'Python · Selenium · APIs · Automation',
    points: [
      'Built multiple Python projects involving browser automation, APIs, data handling, and automated workflows.',
      'Developed practical automation using Selenium and external services.',
      'Worked with environment variables, debugging, web interactions, and application logic.',
      'Built a strong foundation in Python through consistent project-based development.',
    ],
    link: { label: 'GitHub', text: 'github.com/mahak-bit', href: 'https://github.com/mahak-bit' },
  },
];

export const experience: ResumeRole[] = [
  {
    title: 'Independent Developer / Freelance Web Developer',
    period: '2025 – Present',
    points: [
      'Develop custom web applications and digital experiences for personal and client-oriented projects.',
      'Translate business requirements, design references, and product ideas into functional, responsive applications.',
      'Work across frontend development, backend logic, databases, APIs, UI/UX, and deployment.',
      'Rapidly prototype and iterate using modern AI development tools and coding assistants.',
      'Use Claude, OpenAI tools/APIs, and AI-assisted workflows for research, architecture exploration, coding, debugging, documentation, and product iteration.',
      'Take projects through the complete development lifecycle: concept → design → development → testing → deployment.',
    ],
  },
];

export const hackathons: ResumeRole = {
  title: 'Hackathons & Building',
  period: 'AI · Generative AI · Full-Stack · Automation',
  points: [
    'Passionate about rapid prototyping and building functional products under time constraints.',
    'Comfortable moving from problem → idea → architecture → prototype → deployed product.',
    'Interested in hackathons focused on Generative AI, AI agents, automation, developer tools, and real-world problem solving.',
    'Combine LLMs, APIs, modern web frameworks, databases, and AI-assisted development tools to accelerate product development.',
    'Strong focus on building working MVPs rather than presentation-only concepts.',
  ],
};

export const education: ResumeRole = {
  title: 'Bachelor of Business Administration (BBA)',
  period: '2022 – 2025',
  meta: 'MIMT, Kota, Rajasthan',
  points: [],
};

export const focusAreas: string[] = [
  'Generative AI',
  'Large Language Models',
  'LLM APIs',
  'Prompt Engineering',
  'Retrieval-Augmented Generation (RAG)',
  'AI Agents',
  'Agentic Workflows',
  'AI Automation',
  'AI-powered Applications',
];

export const currentDirection =
  'Building deeper expertise in Generative AI → AI Engineering → Agentic AI, with an emphasis on developing practical, production-oriented AI applications.';

export const strengths: string[] = [
  'Rapid Product Building',
  'AI-Assisted Development',
  'Problem Solving',
  'UI/UX Thinking',
  'Full-Stack Development',
  'Rapid Learning',
  'Creative Prototyping',
  'Independent Execution',
];
