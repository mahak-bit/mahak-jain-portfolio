'use client';

import Link from 'next/link';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';
import { exhibition, useExhibition } from '../store';
import { CODE, CODE_LINE, DESIGN, DESIGN_LINE, type Capability } from '../capabilities';
import { GithubIcon, InstagramIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import type { ExhibitProject } from '../types';

/**
 * The words of each scene. They sit over the 3D stage, are real DOM, and read
 * the same whether or not the scene behind them ever loads.
 */

/**
 * Scene 1: the way into the work. Her name and what she does are the screen
 * above this, so here it only says what is on offer and how to move through it.
 */
export function WorkIntro({
  total,
  className,
  cue = true,
}: {
  total: number;
  className?: string;
  cue?: boolean;
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      <p className="meta text-muted">{String(total).padStart(2, '0')} projects</p>
      <h2
        aria-label="Selected work"
        className="font-display mt-4 flex flex-col text-[clamp(3rem,min(9.5vw,15svh),7rem)] leading-[0.88] tracking-[-0.04em]"
      >
        <span>Selected</span>
        <span>work</span>
      </h2>
      <p className="text-muted mt-6 max-w-[34ch] text-[0.98rem] leading-relaxed">
        Scroll through them, or open any one.
      </p>
      {cue ? (
        <p className="meta text-muted mt-8 flex items-center gap-3">
          <span aria-hidden className="ex-cue bg-fg block h-px w-10 origin-left" />
          Scroll
        </p>
      ) : null}
    </div>
  );
}

/** Scene 2: the project the tour is on, with a way in. */
export function ProjectCaption({
  project,
  total,
  className,
}: {
  project: ExhibitProject;
  total: number;
  className?: string;
}) {
  return (
    <div key={project.slug} className={cn('ex-in flex flex-col', className)}>
      <div className="flex items-baseline gap-4">
        <span className="font-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.8] tracking-[-0.05em] tabular-nums">
          {project.number}
        </span>
        <span className="meta text-muted">/ {String(total).padStart(2, '0')}</span>
        <span className="meta text-muted">{project.year}</span>
        <span className="meta text-muted max-sm:hidden">{project.context ?? project.status}</span>
      </div>
      <h2 className="font-display mt-5 text-[clamp(1.9rem,3.4vw,3rem)] leading-[0.95] tracking-[-0.03em]">
        {project.name}
      </h2>
      <p className="text-muted mt-3 max-w-[40ch] text-[0.95rem] leading-relaxed max-sm:line-clamp-2">
        {project.oneLiner}
      </p>
      <p className="meta text-muted mt-4 max-sm:hidden">{project.tech.join(' / ')}</p>
      <div className="mt-5 flex items-center gap-6">
        <button
          type="button"
          onClick={() => exhibition.set({ selected: project.slug })}
          className="meta bg-fg text-bg hover:bg-accent tap pointer-events-auto px-4 py-3 transition-colors"
        >
          Open project
        </button>
        <Link
          href={`/projects/${project.slug}`}
          className="meta text-fg hover:text-accent pointer-events-auto py-2 transition-colors"
        >
          Case study →
        </Link>
      </div>
    </div>
  );
}

function Column({
  label,
  line,
  items,
  hiddenOnPhone,
}: {
  label: string;
  line: string;
  items: Capability[];
  hiddenOnPhone: boolean;
}) {
  return (
    <div className={cn(hiddenOnPhone && 'max-sm:hidden')}>
      <h3 className="font-display text-[clamp(1.5rem,2.4vw,2.1rem)] leading-none tracking-[-0.03em]">
        {label}
      </h3>
      <p className="meta text-muted mt-2 max-sm:hidden">{line}</p>
      <ul className="border-line mt-4 border-t">
        {items.map((c) => (
          <li key={c.title} className="border-line border-b py-2.5 max-sm:py-1.5">
            <p className="text-fg text-[0.92rem] leading-snug">{c.title}</p>
            <p className="text-muted mt-0.5 text-[0.8rem] leading-snug max-sm:line-clamp-1">
              {c.items.join(' · ')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Scene 3: what the work is made of, in the two halves the control names. */
export function CapabilitiesBlock({ className }: { className?: string }) {
  // Side by side where there is room. On a phone, one at a time: the half the
  // DESIGN/CODE control is on, so the same control that turns the cards turns this.
  const code = useExhibition((s) => s.mix) >= 0.5;
  return (
    <div className={cn('grid gap-x-10 gap-y-6 sm:grid-cols-2', className)}>
      {/* so the two columns' headings sit under one of their own, not straight under the page's */}
      <h2 className="sr-only">Design and code</h2>
      <Column label="Design" line={DESIGN_LINE} items={DESIGN} hiddenOnPhone={code} />
      <Column label="Code" line={CODE_LINE} items={CODE} hiddenOnPhone={!code} />
    </div>
  );
}

/** Scene 4: the way to reach her. Words come from the existing contact page. */
export function ContactBlock({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <p className="meta text-muted">Contact</p>
      <h2 className="font-display mt-4 max-w-[12ch] text-[clamp(2.1rem,4.3vw,3.7rem)] leading-[0.92] tracking-[-0.04em] [@media(max-height:820px)]:text-[clamp(2rem,3.6vw,2.9rem)]">
        Got something you want built?
      </h2>
      <p className="text-muted mt-4 max-w-[34ch] text-[0.95rem] leading-relaxed max-sm:hidden [@media(max-height:820px)]:hidden">
        An AI product, a website, an automation, or a half-formed idea you want a second opinion on
        — I&rsquo;d like to hear it.
      </p>
      <div className="pointer-events-auto mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        <Link
          href="/contact"
          className="meta bg-fg text-bg hover:bg-accent tap px-5 py-3 transition-colors"
        >
          Write to me
        </Link>
        <a
          href={`mailto:${site.email}`}
          className="meta text-fg hover:text-accent py-2 transition-colors"
        >
          {site.email}
        </a>
      </div>
      <ul className="pointer-events-auto mt-4 flex items-center gap-5">
        {site.socials.github ? (
          <li>
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-muted hover:text-accent tap inline-flex size-9 items-center justify-center transition-colors"
            >
              <GithubIcon className="size-[18px]" />
            </a>
          </li>
        ) : null}
        {site.socials.linkedin ? (
          <li>
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-muted hover:text-accent tap inline-flex size-9 items-center justify-center transition-colors"
            >
              <LinkedinIcon className="size-[18px]" />
            </a>
          </li>
        ) : null}
        {site.socials.instagram ? (
          <li>
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-muted hover:text-accent tap inline-flex size-9 items-center justify-center transition-colors"
            >
              <InstagramIcon className="size-[18px]" />
            </a>
          </li>
        ) : null}
        <li>
          <Link
            href={site.resumeUrl}
            className="meta text-muted hover:text-accent tap py-2 transition-colors"
          >
            Résumé →
          </Link>
        </li>
      </ul>
    </div>
  );
}
