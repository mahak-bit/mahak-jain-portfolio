/**
 * Single source of truth for identity, links and SEO copy.
 * Placeholders in [SQUARE BRACKETS] are intentional — fill them in when the
 * real value exists. Nothing here should be treated as verified until edited.
 */
export const site = {
  name: 'Mahak Jain',
  firstName: 'Mahak',
  role: 'AI Engineer & Creative Technologist',
  shortPitch:
    'I build AI-powered products, intelligent web experiences and automation systems using AI-first development workflows.',
  location: 'India',
  availability: 'Open to opportunities & collaborations',
  /** Used for canonical URLs, sitemap and OG tags. [ADD PRODUCTION DOMAIN] */
  url: 'https://mahak-jain-portfolio.vercel.app',
  email: 'mahakj532@gmail.com',
  resumeUrl: '', // [ADD RESUME] — e.g. '/mahak-jain-resume.pdf'
  socials: {
    github: '', // [ADD GITHUB] — e.g. 'https://github.com/username'
    linkedin: '', // [ADD LINKEDIN] — e.g. 'https://linkedin.com/in/username'
    x: '', // [ADD X / TWITTER] (optional)
  },
} as const;

export const seo = {
  title: 'Mahak Jain — AI Engineer & Creative Technologist',
  description:
    'Mahak Jain builds AI-powered applications, intelligent web experiences and automation systems — turning ideas into products people can actually use.',
  keywords: [
    'AI Engineer',
    'Creative Technologist',
    'Generative AI',
    'Agentic AI',
    'Full-stack developer',
    'Next.js',
    'React',
    'TypeScript',
    'Python',
    'AI application development',
    'Automation',
  ],
};

/** Ordered nav — hrefs point at in-page section ids. */
export const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
] as const;
