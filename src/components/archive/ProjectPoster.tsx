import type { Project } from '@/data/projects';
import { cn } from '@/lib/utils';

/**
 * A typographic panel shown in place of a screenshot for projects that don't
 * have an image yet. It keeps the same frame + aspect ratio as a real
 * screenshot so the archive and case-study layouts hold their shape — and it's
 * built from the project's own words. Metadata (number, year, stack) lives in
 * the surrounding layout, so the panel itself stays to one idea: the phrase,
 * over the name set oversized and faint.
 */
export function ProjectPoster({
  project,
  ratio,
  size = 'md',
}: {
  project: Project;
  ratio: string;
  size?: 'md' | 'lg';
}) {
  const phrase = project.poster ?? project.oneLiner;

  return (
    <div
      className={cn(
        'bg-raise border-line group-hover:border-accent relative isolate flex flex-col justify-end overflow-hidden border transition-colors',
        ratio,
        size === 'lg' ? 'p-8 sm:p-11' : 'p-6 sm:p-8'
      )}
    >
      {/* The name, oversized and faint, clipped by the frame — texture, not text. */}
      <span
        aria-hidden
        className="text-fg pointer-events-none absolute -right-[0.06em] -bottom-[0.12em] -z-10 max-w-none leading-[0.7] font-display tracking-tight whitespace-nowrap opacity-[0.06] select-none dark:opacity-[0.08]"
        style={{
          fontSize:
            size === 'lg' ? 'clamp(6rem, 4rem + 13vw, 13rem)' : 'clamp(4.5rem, 3rem + 9vw, 9rem)',
        }}
      >
        {project.name}
      </span>

      <span
        aria-hidden
        className="bg-accent mb-4 block h-px w-8 origin-left"
      />
      <p
        className={cn(
          'font-display tracking-tight text-pretty',
          size === 'lg'
            ? 'max-w-[16ch] text-[clamp(1.9rem,1.3rem+2.6vw,3rem)] leading-[1.06]'
            : 'max-w-[18ch] text-[clamp(1.4rem,1rem+1.9vw,2.15rem)] leading-[1.1]'
        )}
      >
        {phrase}
      </p>
    </div>
  );
}
