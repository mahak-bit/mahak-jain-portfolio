import type { Metadata } from 'next';
import { About } from '@/components/About';
import { Now } from '@/components/Now';
import { Skills } from '@/components/Skills';
import { BuildLog } from '@/components/BuildLog';
import { Personality } from '@/components/Personality';
import { Chapter } from '@/components/ui/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Mahak Jain — a full-stack developer building AI into what she ships, and moving toward agentic AI.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: `About — ${site.name}`,
    description: 'The person behind the work: background, current focus, tools and notes.',
    url: `${site.url}/about`,
    type: 'profile',
  },
};

export default function AboutPage() {
  return (
    <>
      <Chapter tone="ivory">
        <About />
        <Now />
        <Skills />
      </Chapter>

      <Chapter tone="charcoal">
        <BuildLog />
      </Chapter>

      <Chapter tone="ivory">
        <Personality />
      </Chapter>
    </>
  );
}
