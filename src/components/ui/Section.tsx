import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Section shell. `bleed` drops the max-width so a section can run full-width;
 * otherwise content sits in the editorial column with generous vertical air.
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
        'scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28',
        !bleed && 'mx-auto max-w-5xl',
        className
      )}
    >
      {children}
    </section>
  );
}
