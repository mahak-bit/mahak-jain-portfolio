import type { Project } from '@/data/projects';

/**
 * The slice of a project the exhibition needs, in a shape that can cross from
 * the server page to the client. Everything in it comes straight from
 * `src/data/projects.ts` — nothing is added, reworded or invented here.
 */
export interface ExhibitProject {
  slug: string;
  number: string;
  name: string;
  year: string;
  status: Project['status'];
  context?: string;
  oneLiner: string;
  poster?: string;
  story: { solving: string; built: string; learned: string };
  tech: string[];
  demo?: string;
  github?: string;
  sourceNote?: string;
  shot?: { src: string; alt: string; fit: 'cover' | 'contain' | 'logo' };
}

export function toExhibitProject(p: Project): ExhibitProject {
  const first = p.screenshots[0];
  return {
    slug: p.slug,
    number: p.number,
    name: p.name,
    year: p.year,
    status: p.status,
    context: p.context,
    oneLiner: p.oneLiner,
    poster: p.poster,
    story: p.story,
    tech: p.tech,
    demo: p.links.demo,
    github: p.links.github,
    sourceNote: p.sourceNote,
    shot: first ? { src: first.src, alt: first.alt, fit: first.fit ?? 'cover' } : undefined,
  };
}

/** A hostname-and-path rendition of a URL, for labels: no protocol, no slash. */
export function bare(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
