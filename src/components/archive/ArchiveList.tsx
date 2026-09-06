'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { projects } from '@/data/projects';
import { ArchiveEntry } from './ArchiveEntry';

const EASE = [0.16, 1, 0.3, 1] as const;

export function ArchiveList() {
  const reduceMotion = useReducedMotion();
  const count = projects.filter((p) => p.status !== 'placeholder').length;

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, ease: EASE, delay },
        };

  return (
    <div className="gutter-x mx-auto w-full max-w-[1500px] pt-24 pb-28 sm:pt-32">
      <div className="border-line flex items-baseline justify-between border-b pb-4">
        <Link href="/#work" className="meta hover:text-fg transition-colors">
          ← Index
        </Link>
        <span className="meta">
          {count} {count === 1 ? 'piece' : 'pieces'}
        </span>
      </div>

      <header className="mt-14 sm:mt-20">
        <motion.h1 {...rise(0.05)} className="display-xl max-w-[8ch]">
          The Archive
        </motion.h1>
        <motion.p
          {...rise(0.14)}
          className="text-muted mt-8 max-w-[42ch] text-[1.02rem] leading-relaxed"
        >
          Everything I&rsquo;ve built — one collection, no particular order.
        </motion.p>
      </header>

      <div className="mt-20 flex flex-col gap-24 sm:mt-28 sm:gap-36">
        {projects.map((project, i) => (
          <ArchiveEntry key={project.slug} project={project} position={i} />
        ))}
      </div>

      <div className="border-line mt-28 border-t pt-10">
        <Link
          href="/#contact"
          className="group border-line hover:border-accent inline-flex items-baseline gap-4 border-b pb-2 transition-colors"
        >
          <span className="display-md group-hover:text-accent transition-colors">
            Start a conversation
          </span>
          <span
            aria-hidden
            className="text-faint group-hover:text-accent text-sm transition-[color,transform] duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
