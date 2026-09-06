'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { ArchiveBackdrop } from './ArchiveBackdrop';
import { projects } from '@/data/projects';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The work, presented as an index rather than a wall of cards: one ruled row
 * per project carrying its number, name, context, year and stack. On a mouse,
 * hovering a row raises a small plate of that project near the cursor.
 * The featured, full compositions live on /archive.
 */
export function HomeArchive() {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 28, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 220, damping: 28, mass: 0.5 });

  const onMove = (e: React.MouseEvent) => {
    if (reduceMotion || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const count = projects.filter((p) => p.status !== 'placeholder').length;
  const active = hovered !== null ? projects[hovered] : null;
  const activeShot = active?.screenshots?.[0];

  return (
    <section id="work" aria-label="Selected work" className="relative scroll-mt-24">
      {/* The mark sits on clean ground — only display type runs over the collage. */}
      <div className="gutter-x pt-24 sm:pt-32 lg:pt-40">
        <div className="mx-auto w-full max-w-[1500px]">
          <SectionMark index="02" label="Selected work" />
        </div>
      </div>

      {/* Chapter opening. */}
      <div className="gutter-x relative overflow-hidden py-12 sm:py-16">
        <ArchiveBackdrop />
        <div className="relative z-10 mx-auto w-full max-w-[1500px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display-lg max-w-[10ch]">The Archive</h2>
            <p className="text-fg pb-2 font-mono text-xs tracking-[0.16em] uppercase">
              {count} {count === 1 ? 'piece' : 'pieces'}
            </p>
          </Reveal>
        </div>
      </div>

      {/* The index. */}
      <div
        ref={wrapRef}
        onMouseMove={onMove}
        className="gutter-x relative pb-24 sm:pb-32 lg:pb-40"
      >
        <div className="mx-auto w-full max-w-[1500px]">
          <ul className="border-line border-t">
            {projects.map((project, i) => (
              <motion.li
                key={project.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.7, ease: EASE, delay: Math.min(i * 0.05, 0.3) }}
                className="border-line border-b"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-1 py-6 sm:py-7"
                >
                  <span className="meta group-hover:text-accent col-span-2 transition-colors sm:col-span-1">
                    {project.number}
                  </span>

                  <span className="col-span-10 sm:col-span-4">
                    <span className="display-md group-hover:text-accent inline-block transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                      {project.name}
                    </span>
                  </span>

                  <span className="meta col-span-6 sm:col-span-2">
                    {project.context ?? project.status}
                  </span>
                  <span className="meta col-span-6 sm:col-span-1">{project.year}</span>

                  <span className="meta col-span-11 truncate sm:col-span-3">
                    {project.tech.slice(0, 3).join(' / ')}
                  </span>

                  <span
                    aria-hidden
                    className="text-faint group-hover:text-accent col-span-1 text-right text-sm transition-[color,transform] duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>

          <Reveal className="mt-10">
            <Link
              href="/archive"
              className="group border-line hover:border-accent inline-flex items-baseline gap-4 border-b pb-2 transition-colors"
            >
              <span className="display-md group-hover:text-accent transition-colors">
                Open the archive
              </span>
              <span
                aria-hidden
                className="text-faint group-hover:text-accent text-sm transition-[color,transform] duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>

        {/* The plate that follows the cursor. Desktop, mouse, motion-on only. */}
        {!reduceMotion && (
          <AnimatePresence>
            {activeShot?.src ? (
              <motion.div
                key={active?.slug}
                aria-hidden
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{ x: sx, y: sy }}
                className="pointer-events-none absolute top-0 left-0 z-20 hidden lg:block"
              >
                <div className="border-line bg-surface relative -translate-x-1/2 -translate-y-1/2 overflow-hidden border">
                  <Image
                    src={activeShot.src}
                    alt=""
                    width={260}
                    height={180}
                    className="h-[180px] w-[260px] object-cover"
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
