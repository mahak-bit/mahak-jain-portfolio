'use client';

import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { cn } from '@/lib/utils';

export function SectionHeading({
  index,
  label,
  title,
  intro,
  className,
}: {
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={cn('flex flex-col gap-5', className)}>
      <div className="text-eyebrow flex items-center gap-3">
        <span className="text-accent">{index}</span>
        <span className="bg-border-strong h-px w-8" aria-hidden />
        <span>{label}</span>
      </div>
      <h2 className="max-w-3xl text-[clamp(1.9rem,1.2rem+3vw,3.25rem)] leading-[1.05]">{title}</h2>
      {intro ? (
        <p className="text-muted max-w-xl text-base leading-relaxed sm:text-lg">{intro}</p>
      ) : null}
    </Reveal>
  );
}
