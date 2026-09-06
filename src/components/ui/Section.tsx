import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Section shell. Vertical rhythm is deliberately generous — the whitespace is
 * doing as much compositional work as the type. `bleed` drops the measure so a
 * section can run the full page width.
 */
export function Section({
  id,
  children,
  className,
  bleed = false,
  'aria-label': ariaLabel,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bleed?: boolean;
  'aria-label'?: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        'gutter-x scroll-mt-24 py-24 sm:py-32 lg:py-40',
        !bleed && 'mx-auto w-full max-w-[1500px]',
        className
      )}
    >
      {children}
    </section>
  );
}

/**
 * A chapter of the page. Charcoal chapters re-declare the palette tokens, so
 * everything inside inverts without a single `dark:` variant.
 */
export function Chapter({
  tone = 'ivory',
  children,
  className,
}: {
  tone?: 'ivory' | 'charcoal';
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative', tone === 'charcoal' && 'chapter-dark', className)}>
      {children}
    </div>
  );
}

/**
 * The rule that opens a section: a number, a name, and a hairline running the
 * width of the measure.
 */
export function SectionMark({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn('border-line flex items-baseline gap-4 border-t pt-4', className)}>
      <span className="meta text-accent">{index}</span>
      <span className="meta">{label}</span>
    </div>
  );
}
