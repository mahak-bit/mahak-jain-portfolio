/**
 * Identity, links and the bits of copy that live outside a section component.
 * Placeholders in [SQUARE BRACKETS] are intentional — replace them with real
 * values; nothing here should be treated as verified until you've edited it.
 */
export const site = {
  name: 'Mahak Jain',
  firstName: 'Mahak',
  role: 'AI Engineer & Creative Technologist',

  /** Hero statement — short, spoken, first person. */
  statement:
    'I’m a web developer who builds AI into the things I make — apps, agents, small automations, mostly in Python and TypeScript. Came from a business degree, got curious about how software actually gets made, and haven’t really stopped since.',

  /** Handwritten annotation in the hero. Truthful + editable. */
  annotation: 'currently figuring out how to make AI agents actually useful',

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
  title: 'Mahak Jain — AI Engineer & Creative Technologist',
  description:
    'Mahak Jain builds AI products — apps, agents and automations. Currently going deep on agentic AI. Based in India.',
  keywords: [
    'Mahak Jain',
    'AI Engineer',
    'Creative Technologist',
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
