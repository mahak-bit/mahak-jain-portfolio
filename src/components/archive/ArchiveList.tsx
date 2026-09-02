'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { projects } from '@/data/projects';
import { ArchiveEntry } from './ArchiveEntry';
import { easeOut } from '@/lib/motion';

export function ArchiveList() {
  const reduceMotion = useReducedMotion();
  const count = projects.filter((p) => p.status !== 'placeholder').length;

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, ease: easeOut, delay },
        };

  return (
    <div className="mx-auto max-w-5xl px-5 pb-28 pt-24 sm:px-8 sm:pt-32">
      <Link
        href="/#work"
        className="text-muted hover:text-fg inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        ← Back
      </Link>

      <header className="mt-10">
        <motion.h1
          {...rise(0.05)}
          className="font-display text-[clamp(2.6rem,1.7rem+5vw,6rem)] leading-[0.92]"
        >
          The Archive
        </motion.h1>
        <motion.p {...rise(0.14)} className="text-muted mt-5 max-w-md text-[1.1rem] leading-relaxed">
          Everything I&rsquo;ve built — {count} {count === 1 ? 'piece' : 'pieces'}, one collection,
          no particular order.
        </motion.p>
      </header>

      <div className="mt-16 flex flex-col gap-12 sm:mt-24 sm:gap-20">
        {projects.map((project, i) => (
          <ArchiveEntry key={project.slug} project={project} position={i} />
        ))}
      </div>

      <div className="border-line mt-20 border-t pt-10">
        <Link
          href="/#contact"
          className="border-fg hover:border-accent inline-block border-b pb-0.5 text-[0.95rem] transition-colors"
        >
          Start a conversation →
        </Link>
      </div>
    </div>
  );
}
