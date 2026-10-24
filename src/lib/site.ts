/**
 * Identity, links and the bits of copy that live outside a section component.
 * Placeholders in [SQUARE BRACKETS] are intentional — replace them with real
 * values; nothing here should be treated as verified until you've edited it.
 */
export const site = {
  name: 'Mahak Jain',
  firstName: 'Mahak',
  role: 'AI/ML Engineer · Full-Stack Developer · Python Developer',

  /** Hero statement — short, spoken, first person. */
  statement:
    'I build AI-powered products, full-stack web apps and Python backends. Came from a business degree, got curious about how software actually gets made, and haven’t really stopped since.',

  /**
   * The pull quote on the opening slide. `emphasis` is the one word set in the
   * accent — it must appear in `text` verbatim or it is simply not highlighted.
   */
  pullQuote: {
    label: 'The shift',
    text: 'I didn’t switch from business to tech. I connected the two.',
    emphasis: 'business',
  },

  location: 'India',
  /** Canonical URL — used for OG tags, canonical links and the sitemap. Swap for a custom domain when there is one. */
  url: 'https://mahak-jain-portfolio.vercel.app',
  email: 'mahakj532@gmail.com',
  /**
   * Résumé. A route on this site rather than a link out — a hosted document
   * puts someone else's chrome, a sign-in prompt and an "unverified content"
   * notice above her CV. Content lives in src/data/resume.ts.
   */
  resumeUrl: '/resume',
  socials: {
    github: 'https://github.com/mahak-bit',
    linkedin: 'https://www.linkedin.com/in/mahak-jain-7665432a3/',
    instagram: 'https://www.instagram.com/tech._bloom/',
    x: '', // [ADD X / TWITTER] (optional)
  },
} as const;

export const seo = {
  title: 'Mahak Jain — AI/ML Engineer & Full-Stack Developer',
  description:
    'Mahak Jain is an AI/ML engineer and full-stack developer building AI-powered products, Python backends and web apps. Based in India.',
  keywords: [
    'Mahak Jain',
    'AI/ML Engineer',
    'AI Engineer',
    'Full-Stack Developer',
    'Python Developer',
    'Generative AI',
    'Agentic AI',
    'LLM applications',
    'Next.js',
    'React',
    'TypeScript',
    'Python',
    'automation',
  ],
};

/**
 * Nav — four destinations, kept short on purpose. The home page is the work
 * browser itself, so "Work" points back to it.
 */
export const navItems = [
  { label: 'Work', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Templates', href: '/templates' },
  { label: 'Contact', href: '/contact' },
] as const;
