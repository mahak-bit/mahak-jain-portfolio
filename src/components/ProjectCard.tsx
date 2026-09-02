'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { enter, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function ProjectCard({ project, position }: { project: Project; position: number }) {
  const reduceMotion = useReducedMotion();
  const isPlaceholder = project.status === 'placeholder';
  const cover = project.screenshots[0];

  return (
    <motion.article
      variants={reduceMotion ? undefined : enter}
      initial={reduceMotion ? undefined : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={viewportOnce}
      className="border-line border-t pt-10 first:border-t-0 first:pt-0"
    >
      {/* Heading row */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div className="flex items-baseline gap-4">
          <span className="text-faint font-mono text-sm">{project.index}</span>
          <h3 className="text-[clamp(1.6rem,1.2rem+1.8vw,2.4rem)]">{project.name}</h3>
        </div>
        <span className="text-faint font-mono text-xs uppercase tracking-[0.12em]">
          {project.year} · {isPlaceholder ? 'Open slot' : project.status}
        </span>
      </div>

      <p className="text-muted mt-4 max-w-2xl text-[1.12rem] leading-snug">{project.oneLiner}</p>

      {/* Visual */}
      <div
        className={cn(
          'mt-8',
          position % 2 === 1 ? 'sm:ml-[6%] sm:mr-0' : 'sm:mr-[6%] sm:ml-0'
        )}
      >
        <div
          className={cn(
            'border-line flex items-center justify-center border',
            position % 2 === 1 ? 'aspect-[4/3]' : 'aspect-[16/10]',
            isPlaceholder ? 'bg-surface border-dashed' : 'bg-raise'
          )}
        >
          <span className="text-faint px-6 text-center font-mono text-xs">
            {cover?.caption || '[ADD SCREENSHOT]'}
          </span>
        </div>
      </div>

      {/* Story */}
      {!isPlaceholder ? (
        <div className="mt-9 grid gap-x-10 gap-y-6 sm:grid-cols-3">
          <StoryCol label="The problem" text={project.story.solving} />
          <StoryCol label="I built" text={project.story.built} />
          <StoryCol label="I learned" text={project.story.learned} />
        </div>
      ) : (
        <p className="text-faint mt-9 text-sm">
          Add the details in <code className="text-xs">src/data/projects.ts</code> — this entry and
          its case-study page render automatically.
        </p>
      )}

      {/* Footer row */}
      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <p className="text-faint text-[0.82rem]">{project.tech.join(' · ')}</p>
        <div className="flex items-center gap-6 text-[0.9rem]">
          {!isPlaceholder && (
            <Link href={`/projects/${project.slug}`} className="group inline-flex items-center gap-1.5">
              <span className="border-fg group-hover:border-accent border-b pb-0.5 transition-colors">
                Read the case study
              </span>
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-fg transition-colors"
            >
              GitHub ↗
            </a>
          )}
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-fg transition-colors"
            >
              Live ↗
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function StoryCol({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-faint mb-2 font-mono text-xs uppercase tracking-[0.12em]">{label}</p>
      <p className="text-[0.98rem] leading-relaxed">{text}</p>
    </div>
  );
}
