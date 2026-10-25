'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { exhibition } from '../store';
import type { ExhibitProject } from '../types';

/**
 * Scene 3: a project, opened. The card itself has come forward in the 3D scene;
 * this is the rest of it — what it is, what it was for, how it was built, and
 * the three real ways in: the live site, the source, the case study. Everything
 * here is the project's own data.
 *
 * It is a dialog that doesn't trap you: Escape, the close button, or a click on
 * the empty stage all put the card back. Focus goes in when it opens and returns
 * to wherever it came from when it closes.
 */
export function DetailPanel({
  project,
  total,
  className,
}: {
  project: ExhibitProject;
  total: number;
  className?: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const from = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') exhibition.set({ selected: null });
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (from && from !== document.body && document.contains(from)) {
        from.focus({ preventScroll: true });
      }
    };
  }, [project.slug]);

  const story = [
    ['The problem', project.story.solving],
    ['What I built', project.story.built],
    ['What I learned', project.story.learned],
  ] as const;

  return (
    <section
      role="dialog"
      aria-labelledby="ex-detail-title"
      className={cn(
        'ex-in border-line bg-bg/95 pointer-events-auto flex flex-col overflow-y-auto border backdrop-blur-sm',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 p-5 pb-0 sm:p-7 sm:pb-0">
        <p className="meta text-muted">
          <span className="text-accent">{project.number}</span> / {String(total).padStart(2, '0')} ·{' '}
          {project.year} · {project.context ?? project.status}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={() => exhibition.set({ selected: null })}
          className="meta text-fg hover:text-accent tap -mt-1 shrink-0 px-1 py-2 transition-colors"
        >
          Close ✕
        </button>
      </div>

      <div className="px-5 pt-3 pb-6 sm:px-7 sm:pb-8">
        <h2
          id="ex-detail-title"
          className="font-display text-[clamp(1.9rem,3vw,2.8rem)] leading-[0.95] tracking-[-0.03em]"
        >
          {project.name}
        </h2>
        <p className="text-fg mt-3 text-[0.98rem] leading-relaxed">{project.oneLiner}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="meta bg-fg text-bg hover:bg-accent tap px-4 py-3 transition-colors"
            >
              Live site ↗
            </a>
          )}
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="meta text-fg hover:text-accent py-2 transition-colors"
            >
              Source code ↗
            </a>
          ) : project.sourceNote ? (
            <span className="meta text-muted py-2">{project.sourceNote}</span>
          ) : null}
          <Link
            href={`/projects/${project.slug}`}
            className="meta text-fg hover:text-accent py-2 transition-colors"
          >
            Case study →
          </Link>
        </div>

        <dl className="mt-7 flex flex-col gap-5">
          {story.map(([label, text]) => (
            <div key={label} className="border-line border-t pt-3">
              <dt className="meta text-muted">{label}</dt>
              <dd className="text-muted mt-1.5 text-[0.9rem] leading-relaxed">{text}</dd>
            </div>
          ))}
        </dl>

        <p className="meta text-muted border-line mt-6 border-t pt-3">{project.tech.join(' / ')}</p>
      </div>
    </section>
  );
}
