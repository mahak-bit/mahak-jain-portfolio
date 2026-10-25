import type { Metadata } from 'next';
import { Exhibition } from '@/components/exhibition/Exhibition';
import { toExhibitProject } from '@/components/exhibition/types';
import { projects } from '@/data/projects';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Digital Experiences',
  description: `${site.name}'s work as a walk-through exhibition: six real projects in a 3D room, each with its live site, source and case study.`,
  alternates: { canonical: '/exhibition' },
  // Not for search results until it is promoted to the home page.
  robots: { index: false, follow: true },
  openGraph: {
    title: `Digital Experiences — ${site.name}`,
    url: `${site.url}/exhibition`,
    type: 'website',
  },
};

/**
 * The exhibition: the real projects from `src/data/projects.ts`, in a 3D room
 * where WebGL and the visitor's settings allow, and as an ordinary list where
 * they don't. The server only prepares the data; everything else is the client.
 */
export default function ExhibitionPage() {
  return <Exhibition projects={projects.map(toExhibitProject)} />;
}
