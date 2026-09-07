'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HeroCharacter } from './HeroCharacter';
import { site } from '@/lib/site';

const TAGS = ['Web Apps', 'Python Systems', 'GenAI Products', 'Agents'];
const ROLES = ['Full-Stack Developer', 'Python Developer', 'GenAI Engineer'];

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The opening page. Composed like a title spread rather than a landing page:
 * the name is set enormous and allowed to run to the measure, everything that
 * supports it is set at label scale, and the space between them does the work.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  // The display type leaves a little slower than everything around it.
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const metaY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, ease: EASE, delay },
        };

  return (
    <section
      ref={ref}
      aria-label="Introduction"
      className="gutter-x relative flex min-h-[100svh] flex-col justify-between pt-10 pb-8"
    >
      {/* Top register — the page's own filing information. */}
      <motion.div
        style={reduceMotion ? undefined : { opacity: fade }}
        className="flex items-start justify-between"
      >
        <motion.p {...rise(0)} className="meta">
          Portfolio
          <span className="text-line mx-2">/</span>
          {site.location}
        </motion.p>
        <motion.p {...rise(0.06)} className="meta text-right">
          Available for work
        </motion.p>
      </motion.div>

      {/* The name, and the character standing beside it. */}
      <div className="relative py-14 sm:py-16">
        <motion.h1
          aria-label={site.name}
          style={reduceMotion ? undefined : { y: nameY }}
          className="display-xl relative z-10 max-w-[13ch]"
        >
          {['Mahak', 'Jain'].map((word, i) => (
            <span key={word} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={reduceMotion ? false : { y: '110%' }}
                animate={reduceMotion ? undefined : { y: '0%' }}
                transition={{ duration: 1.15, ease: EASE, delay: 0.08 + i * 0.1 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Set against the type, not centred under it. */}
        <motion.div
          {...rise(0.5)}
          className="pointer-events-none absolute right-0 -bottom-2 z-0 flex justify-end sm:bottom-0 lg:right-[4%]"
        >
          <div className="pointer-events-auto">
            <HeroCharacter />
          </div>
        </motion.div>
      </div>

      {/* Bottom register — roles, statement, what she builds, where to go. */}
      <motion.div
        style={reduceMotion ? undefined : { y: metaY, opacity: fade }}
        className="border-line grid gap-x-10 gap-y-9 border-t pt-7 md:grid-cols-12"
      >
        <div className="md:col-span-4">
          <p className="meta mb-3">Role</p>
          <ul className="flex flex-col gap-1.5">
            {ROLES.map((role, i) => (
              <motion.li key={role} {...rise(0.55 + i * 0.05)} className="text-fg text-[0.94rem]">
                {role}
              </motion.li>
            ))}
          </ul>
          <motion.p {...rise(0.72)} className="meta text-accent mt-4">
            {site.annotation}
          </motion.p>
        </div>

        <motion.div {...rise(0.6)} className="md:col-span-5">
          <p className="meta mb-3">Statement</p>
          <p className="text-muted max-w-[46ch] text-[0.98rem] leading-relaxed">{site.statement}</p>
        </motion.div>

        <motion.div {...rise(0.68)} className="md:col-span-3">
          <p className="meta mb-3">Index</p>
          <ul className="mb-6 flex flex-col gap-1.5">
            {TAGS.map((tag) => (
              <li key={tag} className="text-fg text-[0.94rem]">
                {tag}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2.5">
            <HeroLink href="/#work" label="See the work" mark="↓" />
            <HeroLink href="/#contact" label="Say hi" mark="→" />
            {site.resumeUrl ? (
              <HeroLink href={site.resumeUrl} label="Résumé" mark="→" />
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function HeroLink({
  href,
  label,
  mark,
  external = false,
}: {
  href: string;
  label: string;
  mark: string;
  external?: boolean;
}) {
  const cls =
    'group border-line hover:border-accent flex items-center justify-between border-b pb-1.5 transition-colors';
  const inner = (
    <>
      <span className="text-fg group-hover:text-accent text-[0.94rem] transition-colors">
        {label}
      </span>
      <span aria-hidden className="text-faint group-hover:text-accent text-xs transition-colors">
        {mark}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
