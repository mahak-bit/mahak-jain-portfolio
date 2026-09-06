'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { cn } from '@/lib/utils';
import { ProjectPoster } from './ProjectPoster';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Each entry is composed differently on purpose — a showcase, an asymmetric
 * split, a full-bleed immersive plate, and a typography-led setting — so the
 * archive reads as a sequence of spreads rather than a repeated card.
 */
type Kind = 'showcase' | 'split' | 'immersive' | 'typographic';
const KINDS: Kind[] = ['showcase', 'split', 'immersive', 'typographic'];

export function ArchiveEntry({ project, position }: { project: Project; position: number }) {
  const reduceMotion = useReducedMotion();
  const kind = KINDS[position % KINDS.length];
  const flip = Math.floor(position / KINDS.length) % 2 === 1;
  const isPlaceholder = project.status === 'placeholder';

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 32 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration: 1, ease: EASE }}
      className="group/entry"
    >
      <Head project={project} />

      <div className="mt-8 sm:mt-10">
        {kind === 'showcase' && <Showcase project={project} flip={flip} />}
        {kind === 'split' && <Split project={project} flip={flip} />}
        {kind === 'immersive' && <Immersive project={project} />}
        {kind === 'typographic' && <Typographic project={project} flip={flip} />}
      </div>

      {!isPlaceholder ? (
        <FootLinks project={project} className="mt-8" />
      ) : (
        <p className="meta mt-8">Open slot</p>
      )}
    </motion.article>
  );
}

/* ---- the metadata rule that opens every entry -------------------------- */

function Head({ project }: { project: Project }) {
  return (
    <div className="border-line grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-t pt-4">
      <span className="meta text-accent col-span-2 sm:col-span-1">{project.number}</span>
      <span className="meta col-span-5 sm:col-span-2">{project.year}</span>
      <span className="meta col-span-5 sm:col-span-3">
        {project.context ?? project.status}
      </span>
      <span className="meta col-span-12 sm:col-span-6 sm:text-right">
        {project.tech.join(' / ')}
      </span>
    </div>
  );
}

/* ---- compositions ------------------------------------------------------ */

function Title({ project, size = 'lg' }: { project: Project; size?: 'lg' | 'xl' }) {
  const cls = size === 'xl' ? 'display-xl' : 'display-lg';
  if (project.status === 'placeholder') return <h2 className={cls}>{project.name}</h2>;
  return (
    <h2 className={cls}>
      <Link
        href={`/projects/${project.slug}`}
        className="group-hover/entry:text-accent inline-block transition-colors duration-500"
      >
        {project.name}
      </Link>
    </h2>
  );
}

function Blurb({ project, className }: { project: Project; className?: string }) {
  return (
    <p className={cn('text-muted max-w-[40ch] text-[1rem] leading-relaxed', className)}>
      {project.oneLiner}
    </p>
  );
}

/** 01 — large visual set beside the typography. */
function Showcase({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <div className="grid gap-x-10 gap-y-8 md:grid-cols-12 md:items-end">
      <div className={cn('md:col-span-7', flip && 'md:order-2 md:col-start-6')}>
        <Visual project={project} ratio="aspect-[4/3]" />
      </div>
      <div className={cn('md:col-span-5', flip && 'md:order-1 md:col-start-1 md:row-start-1')}>
        <Title project={project} />
        <Blurb project={project} className="mt-6" />
      </div>
    </div>
  );
}

/** 02 — asymmetric split: a tall plate against a narrow column. */
function Split({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <div className="grid gap-x-10 gap-y-8 md:grid-cols-12">
      <div className={cn('md:col-span-4', flip && 'md:order-2 md:col-start-9')}>
        <Visual project={project} ratio="aspect-[3/4]" />
      </div>
      <div
        className={cn(
          'flex flex-col justify-between md:col-span-7 md:col-start-6',
          flip && 'md:order-1 md:col-start-1'
        )}
      >
        <Title project={project} />
        <Blurb project={project} className="mt-6" />
      </div>
    </div>
  );
}

/** 03 — the immersive plate: full measure, type beneath. */
function Immersive({ project }: { project: Project }) {
  return (
    <div>
      <Visual project={project} ratio="aspect-[16/7]" />
      <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-12">
        <div className="md:col-span-7">
          <Title project={project} size="xl" />
        </div>
        <div className="md:col-span-5 md:pt-3">
          <Blurb project={project} />
        </div>
      </div>
    </div>
  );
}

/** 04 — typography-led: the name carries it, the visual is a footnote. */
function Typographic({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <div className={cn('md:max-w-[85%]', flip && 'md:ml-auto md:text-right')}>
      <Title project={project} size="xl" />
      <div
        className={cn(
          'mt-10 grid gap-x-10 gap-y-8 md:grid-cols-12',
          flip && 'md:text-left'
        )}
      >
        <div className={cn('md:col-span-5', flip && 'md:order-2')}>
          <Blurb project={project} />
        </div>
        <div className={cn('md:col-span-4', flip ? 'md:order-1' : 'md:col-start-9')}>
          <Visual project={project} ratio="aspect-[5/4]" />
        </div>
      </div>
    </div>
  );
}

/* ---- shared bits ------------------------------------------------------- */

function Visual({ project, ratio }: { project: Project; ratio: string }) {
  const shot = project.screenshots[0];
  const fit = shot?.fit ?? 'cover';
  const isPlaceholder = project.status === 'placeholder';

  let frame: React.ReactNode;
  if (shot?.src) {
    frame = (
      <div
        className={cn(
          'border-line group-hover/entry:border-accent relative overflow-hidden border transition-colors duration-500',
          ratio,
          fit === 'logo' ? 'bg-[#0a0a0a]' : 'bg-raise'
        )}
      >
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(max-width: 768px) 100vw, 720px"
          className={cn(
            'transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/entry:scale-[1.035]',
            fit === 'logo' ? 'object-contain p-12' : fit === 'contain' ? 'object-contain p-3' : 'object-cover'
          )}
        />
      </div>
    );
  } else if (isPlaceholder) {
    frame = (
      <div className={cn('border-line bg-raise border border-dashed', ratio)} />
    );
  } else {
    frame = <ProjectPoster project={project} ratio={ratio} />;
  }

  if (isPlaceholder) return frame;
  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`${project.name} — case study`}
      className="block"
      tabIndex={-1}
    >
      {frame}
    </Link>
  );
}

function FootLinks({ project, className }: { project: Project; className?: string }) {
  return (
    <div
      className={cn(
        'border-line flex flex-wrap items-center gap-x-8 gap-y-2 border-t pt-4',
        className
      )}
    >
      <Link href={`/projects/${project.slug}`} className="group meta hover:text-accent py-1.5 transition-colors">
        Case study
        <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">
          →
        </span>
      </Link>
      {project.links.demo && (
        <a
          href={project.links.demo}
          target="_blank"
          rel="noreferrer"
          className="meta hover:text-accent py-1.5 transition-colors"
        >
          Live ↗
        </a>
      )}
      {project.links.github ? (
        <a
          href={project.links.github}
          target="_blank"
          rel="noreferrer"
          className="meta hover:text-accent py-1.5 transition-colors"
        >
          GitHub ↗
        </a>
      ) : project.sourceNote ? (
        <span className="meta">{project.sourceNote}</span>
      ) : null}
    </div>
  );
}
