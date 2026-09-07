/**
 * Identity, links and the bits of copy that live outside a section component.
 * Placeholders in [SQUARE BRACKETS] are intentional — replace them with real
 * values; nothing here should be treated as verified until you've edited it.
 */
export const site = {
  name: 'Mahak Jain',
  firstName: 'Mahak',
  role: 'Full-Stack Developer · Python Developer · GenAI Engineer',

  /** Hero statement — short, spoken, first person. */
  statement:
    'I build full-stack web apps, Python backends and AI-powered products — and lately that’s meant going deeper into GenAI and agents. Came from a business degree, got curious about how software actually gets made, and haven’t really stopped since.',

  /** Short editorial note beside the roles in the hero. Truthful + editable. */
  annotation: 'Building toward Agentic AI',

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
    x: '', // [ADD X / TWITTER] (optional)
  },
} as const;

export const seo = {
  title: 'Mahak Jain — Full-Stack & GenAI Developer',
  description:
    'Mahak Jain builds full-stack web apps, Python systems and GenAI products — and is moving toward agentic AI. Based in India.',
  keywords: [
    'Mahak Jain',
    'Full-Stack Developer',
    'Python Developer',
    'GenAI Engineer',
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
 * Nav — three destinations, kept short on purpose. The home page is the work
 * browser itself, so "Work" points back to it.
 */
export const navItems = [
  { label: 'Work', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;
