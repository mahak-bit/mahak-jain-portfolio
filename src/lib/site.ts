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

  /** Handwritten annotation in the hero. Truthful + editable. */
  annotation: 'Building toward Agentic AI',

  location: 'India',
  /** Canonical URL — used for OG tags, canonical links and the sitemap. Swap for a custom domain when there is one. */
  url: 'https://mahak-jain-portfolio.vercel.app',
  email: 'mahakj532@gmail.com',
  resumeUrl: '', // [ADD RESUME] e.g. '/mahak-jain-resume.pdf'
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

/** Nav — kept short on purpose. Hrefs are in-page anchors. */
export const navItems = [
  { label: 'Archive', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Now', href: '#now' },
  { label: 'Contact', href: '#contact' },
] as const;
