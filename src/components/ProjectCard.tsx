'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';
import type { Project } from '@/data/projects';
import { fadeUp, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function ProjectCard({ project, flip = false }: { project: Project; flip?: boolean }) {
  const reduceMotion = useReducedMotion();
  const isPlaceholder = project.status === 'placeholder';

  const shell = cn(
    'border-border-strong bg-surface/50 relative grid overflow-hidden rounded-3xl border backdrop-blur-sm transition-colors lg:grid-cols-2',
    !isPlaceholder && 'hover:border-accent/40 focus-visible:border-accent/60'
  );

  const inner: ReactNode = (
    <>
      <div className={cn('order-1', flip ? 'lg:order-2' : 'lg:order-1')}>
        <Preview project={project} />
      </div>

      <div
        className={cn('order-2 flex flex-col gap-5 p-6 sm:p-9', flip ? 'lg:order-1' : 'lg:order-2')}
      >
        <div className="flex items-center justify-between">
          <span className="text-faint font-mono text-sm">{project.number}</span>
          <span
            className={cn(
              'rounded-full border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wider',
              isPlaceholder
                ? 'border-border text-faint'
                : 'border-accent/30 text-accent bg-accent-soft'
            )}
          >
            {isPlaceholder ? 'Open slot' : project.status === 'live' ? 'Shipped' : project.status}
          </span>
        </div>

        <div>
          <h3 className="text-2xl tracking-tight sm:text-[1.7rem]">{project.name}</h3>
          <p className="text-muted mt-2 text-sm leading-relaxed sm:text-[0.95rem]">
            {project.description}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((t) => (
            <span
              key={t}
              className="border-border text-muted rounded-full border px-2.5 py-1 text-xs"
            >
              {t}
            </span>
          ))}
        </div>

        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-medium',
            isPlaceholder ? 'text-faint' : 'text-foreground'
          )}
        >
          {isPlaceholder ? (
            <>
              <Plus className="size-4" /> Add this project in{' '}
              <code className="text-xs">data/projects.ts</code>
            </>
          ) : (
            <>
              View case study
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </span>
      </div>
    </>
  );

  return (
    <motion.article
      variants={reduceMotion ? undefined : fadeUp}
      initial={reduceMotion ? undefined : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={viewportOnce}
      className="group"
    >
      {isPlaceholder ? (
        <div className={shell}>{inner}</div>
      ) : (
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${project.name} — view case study`}
          className={shell}
        >
          {inner}
        </Link>
      )}
    </motion.article>
  );
}

function Preview({ project }: { project: Project }) {
  const isPlaceholder = project.status === 'placeholder';

  return (
    <div className="relative h-56 overflow-hidden sm:h-full sm:min-h-[19rem]">
      <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 80% at 80% 0%, var(--accent-soft), transparent 55%)' }}
        aria-hidden
      />
      <span
        className="text-foreground/[0.04] pointer-events-none absolute -right-2 bottom-[-1.5rem] font-mono text-[9rem] font-bold leading-none sm:text-[12rem]"
        aria-hidden
      >
        {project.number}
      </span>

      {isPlaceholder ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-border text-faint flex size-16 items-center justify-center rounded-2xl border border-dashed">
            <Plus className="size-6" />
          </div>
        </div>
      ) : (
        <div className="absolute inset-x-8 top-9 flex flex-col gap-2.5" aria-hidden>
          <div className="border-border-strong bg-surface/80 h-8 w-2/3 rounded-lg border shadow-sm transition-transform duration-500 group-hover:translate-x-1" />
          <div className="border-border-strong bg-surface/80 ml-6 h-8 w-1/2 rounded-lg border shadow-sm transition-transform duration-500 group-hover:translate-x-2" />
          <div className="border-accent/40 bg-accent-soft h-8 w-3/5 rounded-lg border shadow-sm transition-transform duration-500 group-hover:-translate-x-1" />
        </div>
      )}
    </div>
  );
}
