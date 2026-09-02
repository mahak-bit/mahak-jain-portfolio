'use client';

import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { cn } from '@/lib/utils';

/**
 * A quiet kicker + a display-type heading. No section numbers.
 */
export function SectionHeading({
  kicker,
  title,
  lede,
  className,
}: {
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn('flex flex-col gap-4', className)}>
      <span className="kicker">{kicker}</span>
      <h2 className="max-w-3xl text-[clamp(1.85rem,1.3rem+2.4vw,2.9rem)]">{title}</h2>
      {lede ? <p className="text-muted max-w-xl text-[1.05rem] leading-relaxed">{lede}</p> : null}
    </Reveal>
  );
}
