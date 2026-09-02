'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { easeOut, viewportOnce } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Kind = 'showcase' | 'wide' | 'text' | 'compact';
const KINDS: Kind[] = ['showcase', 'wide', 'text', 'compact'];

export function ArchiveEntry({ project, position }: { project: Project; position: number }) {
  const reduceMotion = useReducedMotion();
  const kind = KINDS[position % KINDS.length];
  const flip = Math.floor(position / KINDS.length) % 2 === 1;
  const isPlaceholder = project.status === 'placeholder';

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.6, ease: easeOut, delay: Math.min(position * 0.06, 0.3) }}
      className="border-line border-t pt-12 first:border-t-0 first:pt-0 sm:pt-16"
    >
      {kind === 'showcase' && <Showcase project={project} flip={flip} />}
      {kind === 'wide' && <Wide project={project} />}
      {kind === 'text' && <TextLed project={project} flip={flip} />}
      {kind === 'compact' && <Compact project={project} />}

      {!isPlaceholder && <FootLinks project={project} className="mt-6" />}
      {isPlaceholder && (
        <p className="text-faint mt-6 text-sm">
          Open slot — add it in <code className="text-xs">src/data/projects.ts</code>.
        </p>
      )}
    </motion.article>
  );
}

/* ---- layouts ---------------------------------------------------------- */

function Showcase({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <div
      className={cn(
        'grid gap-x-10 gap-y-6 sm:grid-cols-[1.1fr_0.9fr] sm:items-center',
        flip && 'sm:[&>*:first-child]:order-2'
      )}
    >
      <Visual project={project} ratio="aspect-[4/5]" />
      <div className={cn(flip ? 'sm:pr-4' : 'sm:pl-4')}>
        <Head project={project} size="lg" />
        <p className="text-muted mt-4 max-w-sm text-[1.05rem] leading-snug">{project.oneLiner}</p>
        <TechLine project={project} className="mt-5" />
      </div>
    </div>
  );
}

function Wide({ project }: { project: Project }) {
  return (
    <div>
      <Visual project={project} ratio="aspect-[16/8]" />
      <div className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-[1fr_1fr]">
        <Head project={project} size="md" />
        <div>
          <p className="text-muted text-[1.02rem] leading-snug">{project.oneLiner}</p>
          <TechLine project={project} className="mt-4" />
        </div>
      </div>
    </div>
  );
}

function TextLed({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <div className={cn('sm:max-w-2xl', flip && 'sm:ml-auto sm:text-right')}>
      <Head project={project} size="xl" />
      <p
        className={cn(
          'text-muted mt-5 text-[1.15rem] leading-relaxed',
          flip ? 'sm:ml-auto sm:max-w-md' : 'max-w-md'
        )}
      >
        {project.oneLiner}
      </p>
      <TechLine project={project} className={cn('mt-6', flip && 'sm:justify-end')} />
    </div>
  );
}

function Compact({ project }: { project: Project }) {
  const inner = (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
      <span className="text-faint font-mono text-sm">{project.number}</span>
      <span className="font-display text-xl tracking-tight">{project.name}</span>
      <span className="text-faint font-mono text-xs">
        {project.year}
        {project.context && <span className="text-accent"> · {project.context}</span>}
      </span>
      <span className="text-muted min-w-0 flex-1 truncate text-[0.95rem]">{project.oneLiner}</span>
    </div>
  );
  if (project.status === 'placeholder') return inner;
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      {inner}
      <span className="text-faint mt-2 inline-block font-mono text-xs">
        {project.tech.join(' · ')}
        <span className="text-fg ml-3 transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}

/* ---- shared bits ----------------------------------------------------- */

function Head({ project, size }: { project: Project; size: 'md' | 'lg' | 'xl' }) {
  const cls = {
    md: 'text-[clamp(1.5rem,1.2rem+1.4vw,2rem)]',
    lg: 'text-[clamp(1.8rem,1.3rem+2vw,2.7rem)]',
    xl: 'text-[clamp(2.2rem,1.5rem+3.4vw,4rem)]',
  }[size];
  return (
    <div className="flex flex-col gap-2">
      <span className="text-faint font-mono text-sm tabular-nums">
        {project.number} — {project.year}
        {project.context && <span className="text-accent"> · {project.context}</span>}
      </span>
      {project.status === 'placeholder' ? (
        <h2 className={cn('font-display leading-[1.02] tracking-tight', cls)}>{project.name}</h2>
      ) : (
        <Link href={`/projects/${project.slug}`} className="group w-fit">
          <h2 className={cn('font-display leading-[1.02] tracking-tight', cls)}>
            {project.name}
            <span
              aria-hidden
              className="text-accent ml-2 inline-block -translate-x-1 align-middle text-[0.5em] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
            >
              ↗
            </span>
          </h2>
        </Link>
      )}
    </div>
  );
}

function TechLine({ project, className }: { project: Project; className?: string }) {
  return (
    <p className={cn('text-faint flex flex-wrap gap-x-2 font-mono text-xs', className)}>
      {project.tech.map((t, i) => (
        <span key={t}>
          {t}
          {i < project.tech.length - 1 && <span className="ml-2 opacity-40">/</span>}
        </span>
      ))}
    </p>
  );
}

function Visual({ project, ratio }: { project: Project; ratio: string }) {
  const caption = project.screenshots[0]?.caption || `[ADD SCREENSHOT] — ${project.name}`;
  const frame = (
    <div
      className={cn(
        'border-line bg-raise relative flex items-center justify-center overflow-hidden border',
        ratio,
        project.status === 'placeholder' && 'border-dashed'
      )}
    >
      <span className="text-faint px-6 text-center font-mono text-xs">{caption}</span>
    </div>
  );
  if (project.status === 'placeholder') return frame;
  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`${project.name} — case study`}
      className="group hover:border-accent block transition-colors"
    >
      {frame}
    </Link>
  );
}

function FootLinks({ project, className }: { project: Project; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.9rem]', className)}>
      <Link
        href={`/projects/${project.slug}`}
        className="group inline-flex items-center gap-1.5"
      >
        <span className="border-fg group-hover:border-accent border-b pb-0.5 transition-colors">
          Case study
        </span>
        <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </Link>
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
    </div>
  );
}
