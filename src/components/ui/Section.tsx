import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Section({
  id,
  children,
  className,
  'aria-label': ariaLabel,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        'mx-auto max-w-6xl scroll-mt-28 px-5 py-24 sm:px-8 sm:py-32',
        className
      )}
    >
      {children}
    </section>
  );
}
