'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { projects } from '@/data/projects';
import { ProjectPoster } from '@/components/archive/ProjectPoster';
import { HeroCharacter } from '@/components/HeroCharacter';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;
const ROLES = ['Full-Stack Developer', 'Python Developer', 'GenAI Engineer'];

/** Slide 0 is the title; 1..n are the projects. */
const TOTAL = projects.length + 1;

/**
 * A full-screen browser: one screen per project, advanced by scroll, swipe or
 * keyboard rather than by scrolling the document.
 *
 * Hijacking scroll is a usability risk, so it is bounded deliberately —
 * arrow/page/home/end keys all work, the current slide is announced to screen
 * readers, and a plain, non-hijacked list of the same work sits one click away
 * at /archive. Reduced motion swaps slides instantly with no transform.
 */
export function ProjectBrowser() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [indexOpen, setIndexOpen] = useState(false);
  const lock = useRef(false);
  const accum = useRef(0);
  const touchY = useRef<number | null>(null);

  const go = useCallback(
    (next: number, direction: number) => {
      const clamped = Math.max(0, Math.min(TOTAL - 1, next));
      setIndex((cur) => {
        if (clamped === cur) return cur;
        setDir(direction);
        return clamped;
      });
    },
    []
  );

  const step = useCallback(
    (delta: number) => {
      if (lock.current) return;
      lock.current = true;
      go(index + delta, delta);
      window.setTimeout(() => {
        lock.current = false;
      }, reduceMotion ? 60 : 720);
    },
    [index, go, reduceMotion]
  );

  // Wheel / trackpad. Accumulate so a light trackpad flick doesn't skip three.
  useEffect(() => {
    if (indexOpen) return;
    const onWheel = (e: WheelEvent) => {
      // Let the browser handle scrolling inside anything genuinely scrollable.
      e.preventDefault();
      if (lock.current) return;
      accum.current += e.deltaY;
      if (Math.abs(accum.current) > 40) {
        step(accum.current > 0 ? 1 : -1);
        accum.current = 0;
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [step, indexOpen]);

  // Touch.
  useEffect(() => {
    if (indexOpen) return;
    const start = (e: TouchEvent) => {
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const end = (e: TouchEvent) => {
      if (touchY.current === null) return;
      const dy = touchY.current - (e.changedTouches[0]?.clientY ?? touchY.current);
      if (Math.abs(dy) > 45) step(dy > 0 ? 1 : -1);
      touchY.current = null;
    };
    window.addEventListener('touchstart', start, { passive: true });
    window.addEventListener('touchend', end, { passive: true });
    return () => {
      window.removeEventListener('touchstart', start);
      window.removeEventListener('touchend', end);
    };
  }, [step, indexOpen]);

  // Keyboard — the accessible path through a hijacked page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el && /^(INPUT|TEXTAREA)$/.test(el.tagName)) return;

      if (e.key === 'Escape') {
        setIndexOpen(false);
        return;
      }
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setIndexOpen((o) => !o);
        return;
      }
      if (indexOpen) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          step(1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          step(-1);
          break;
        case 'Home':
          e.preventDefault();
          go(0, -1);
          break;
        case 'End':
          e.preventDefault();
          go(TOTAL - 1, 1);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, go, indexOpen]);

  // The document itself never scrolls while the browser is mounted.
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  const project = index > 0 ? projects[index - 1] : null;

  const slide = reduceMotion
    ? { initial: false as const, animate: {}, exit: {}, transition: { duration: 0 } }
    : {
        initial: { y: dir > 0 ? '100%' : '-100%' },
        animate: { y: '0%' },
        exit: { y: dir > 0 ? '-40%' : '40%' },
        transition: { duration: 0.95, ease: EASE },
      };

  return (
    <div className="relative h-[100svh] overflow-hidden">
      {/* What a screen reader is told, since the visual change is transform-only. */}
      <p aria-live="polite" className="sr-only">
        {project ? `Project ${project.number} of ${projects.length}: ${project.name}` : 'Introduction'}
      </p>

      <AnimatePresence initial={false} custom={dir}>
        <motion.div key={index} {...slide} className="absolute inset-0">
          {project ? <ProjectSlide project={project} /> : <TitleSlide />}
        </motion.div>
      </AnimatePresence>

      <Chrome
        index={index}
        total={TOTAL}
        project={project}
        onStep={step}
        onOpenIndex={() => setIndexOpen(true)}
      />

      <ProjectIndex
        open={indexOpen}
        current={index}
        onClose={() => setIndexOpen(false)}
        onPick={(i) => {
          setIndexOpen(false);
          go(i, i > index ? 1 : -1);
        }}
      />
    </div>
  );
}

/* ---- the index ---------------------------------------------------------
   Hijacked scroll costs you the ability to skim, so the whole set is one
   keystroke away — every project as a metadata row, jump straight to any.
------------------------------------------------------------------------ */

function ProjectIndex({
  open,
  current,
  onClose,
  onPick,
}: {
  open: boolean;
  current: number;
  onClose: () => void;
  onPick: (i: number) => void;
}) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Move focus in when it opens so the list is immediately keyboard-operable.
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      panelRef.current?.querySelector('button')?.focus();
    }, 60);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="bg-bg fixed inset-0 z-[60] flex flex-col"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="All projects"
        >
          <div className="gutter-x flex items-center justify-between py-6">
            <span className="meta">Index — {projects.length} pieces</span>
            <button type="button" onClick={onClose} className="meta hover:text-accent transition-colors">
              Close (esc)
            </button>
          </div>

          <div ref={panelRef} className="gutter-x flex min-h-0 flex-1 items-center overflow-y-auto">
            <ul className="border-line mx-auto w-full max-w-[1500px] border-t">
              {projects.map((p, i) => (
                <motion.li
                  key={p.slug}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.04 + i * 0.04 }}
                  className="border-line border-b"
                >
                  <button
                    type="button"
                    onClick={() => onPick(i + 1)}
                    aria-current={current === i + 1 ? 'true' : undefined}
                    className="group grid w-full grid-cols-12 items-baseline gap-x-4 gap-y-1 py-5 text-left"
                  >
                    <span
                      className={cn(
                        'meta col-span-2 transition-colors sm:col-span-1',
                        current === i + 1 && 'text-accent'
                      )}
                    >
                      {p.number}
                    </span>
                    <span className="col-span-10 sm:col-span-4">
                      <span className="display-md group-hover:text-accent inline-block transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                        {p.name}
                      </span>
                    </span>
                    <span className="meta col-span-6 sm:col-span-2">{p.context ?? p.status}</span>
                    <span className="meta col-span-6 sm:col-span-1">{p.year}</span>
                    <span className="meta col-span-11 truncate sm:col-span-3">
                      {p.tech.slice(0, 3).join(' / ')}
                    </span>
                    <span
                      aria-hidden
                      className="text-faint group-hover:text-accent col-span-1 text-right text-sm transition-[color,transform] duration-500 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="gutter-x py-6">
            <Link href="/archive" className="meta hover:text-accent transition-colors">
              Read the full archive ↗
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---- slide 0 — identity ------------------------------------------------ */

function TitleSlide() {
  const reduceMotion = useReducedMotion();
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay },
        };

  // pt/pb reserve the masthead and the counter chrome, so the centring happens
  // in the space that is actually free rather than the whole viewport.
  return (
    <section
      aria-label="Introduction"
      className="gutter-x flex h-full flex-col justify-center pt-20 pb-24"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="relative">
          <h1 aria-label={site.name} className="display-hero relative z-10 max-w-[11ch]">
            {['Mahak', 'Jain'].map((word, i) => (
              <span key={word} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduceMotion ? false : { y: '110%' }}
                  animate={reduceMotion ? undefined : { y: '0%' }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.05 + i * 0.09 }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            {...rise(0.5)}
            className="pointer-events-none absolute -top-4 right-0 z-0 hidden justify-end sm:flex lg:right-[6%]"
          >
            <div className="pointer-events-auto">
              <HeroCharacter />
            </div>
          </motion.div>
        </div>

        {/* Two compact columns on a phone; the full three-part record from md up.
            The statement is the one thing that has to give on a fixed-height
            screen — it lives in full on /about. */}
        <motion.div
          {...rise(0.42)}
          className="border-line mt-7 grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-5 sm:mt-10 sm:gap-x-10 sm:pt-6 md:grid-cols-12"
        >
          <div className="md:col-span-4">
            <p className="meta mb-2.5">Role</p>
            <ul className="flex flex-col gap-1">
              {ROLES.map((r) => (
                <li key={r} className="text-fg text-[0.88rem] sm:text-[0.92rem]">
                  {r}
                </li>
              ))}
            </ul>
            <p className="meta text-accent mt-3">{site.annotation}</p>
          </div>
          <div className="hidden md:col-span-5 md:block">
            <p className="meta mb-2.5">Statement</p>
            <p className="text-muted max-w-[44ch] text-[0.95rem] leading-relaxed">
              {site.statement}
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="meta mb-2.5">Index</p>
            <div className="flex flex-col gap-1.5">
              <Link href="/about" className="text-fg hover:text-accent text-[0.92rem] transition-colors">
                About →
              </Link>
              <Link href="/contact" className="text-fg hover:text-accent text-[0.92rem] transition-colors">
                Contact →
              </Link>
              {site.socials.github ? (
                <a
                  href={site.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg hover:text-accent text-[0.92rem] transition-colors"
                >
                  GitHub ↗
                </a>
              ) : null}
              {site.resumeUrl ? (
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg hover:text-accent text-[0.92rem] transition-colors"
                >
                  Résumé ↗
                </a>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---- slides 1..n — one project per screen ------------------------------ */

function ProjectSlide({ project }: { project: (typeof projects)[number] }) {
  const reduceMotion = useReducedMotion();
  const shot = project.screenshots[0];
  const fit = shot?.fit ?? 'cover';

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  return (
    <section
      aria-label={project.name}
      className="gutter-x flex h-full flex-col justify-center pt-20 pb-28"
    >
      <div className="mx-auto grid w-full max-w-[1500px] gap-x-12 gap-y-8 md:grid-cols-12 md:items-center">
        {/* The plate */}
        <motion.div
          initial={reduceMotion ? false : { clipPath: 'inset(100% 0 0 0)' }}
          animate={reduceMotion ? undefined : { clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.05 }}
          className="md:col-span-7"
        >
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`${project.name} — case study`}
            className="group block"
          >
            {shot?.src ? (
              <div
                className={cn(
                  'border-line group-hover:border-accent relative aspect-[16/9] overflow-hidden border transition-colors duration-500',
                  fit === 'logo' ? 'bg-[#0a0a0a]' : 'bg-raise'
                )}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className={cn(
                    'transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]',
                    fit === 'logo'
                      ? 'object-contain p-14'
                      : fit === 'contain'
                        ? 'object-contain p-3'
                        : 'object-cover'
                  )}
                />
              </div>
            ) : (
              <div className="group/entry">
                <ProjectPoster project={project} ratio="aspect-[16/10]" size="lg" />
              </div>
            )}
          </Link>
        </motion.div>

        {/* The record */}
        <div className="md:col-span-5">
          <motion.div {...rise(0.16)} className="border-line flex items-baseline gap-5 border-t pt-3">
            <span className="meta text-accent">{project.number}</span>
            <span className="meta">{project.year}</span>
            <span className="meta">{project.context ?? project.status}</span>
          </motion.div>

          <h2 className="display-lg mt-5 overflow-hidden">
            <motion.span
              className="block"
              initial={reduceMotion ? false : { y: '110%' }}
              animate={reduceMotion ? undefined : { y: '0%' }}
              transition={{ duration: 1, ease: EASE, delay: 0.12 }}
            >
              {project.name}
            </motion.span>
          </h2>

          <motion.p {...rise(0.26)} className="text-muted mt-5 max-w-[42ch] text-[1rem] leading-relaxed">
            {project.oneLiner}
          </motion.p>

          <motion.p {...rise(0.32)} className="meta mt-6">
            {project.tech.join(' / ')}
          </motion.p>

          <motion.div {...rise(0.38)} className="mt-7 flex flex-wrap gap-x-8 gap-y-2">
            <Link
              href={`/projects/${project.slug}`}
              className="group meta hover:text-accent transition-colors"
            >
              Case study
              <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="meta hover:text-accent transition-colors"
              >
                Live ↗
              </a>
            )}
            {project.links.github ? (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="meta hover:text-accent transition-colors"
              >
                GitHub ↗
              </a>
            ) : project.sourceNote ? (
              <span className="meta">{project.sourceNote}</span>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---- fixed chrome ------------------------------------------------------ */

function Chrome({
  index,
  total,
  project,
  onStep,
  onOpenIndex,
}: {
  index: number;
  total: number;
  project: (typeof projects)[number] | null;
  onStep: (d: number) => void;
  onOpenIndex: () => void;
}) {
  const atEnd = index === total - 1;

  return (
    <div className="gutter-x pointer-events-none absolute inset-x-0 bottom-0 z-30 pb-6">
      <div className="mx-auto flex w-full max-w-[1500px] items-end justify-between gap-6">
        {/* The count, set large — the reference's anchor. */}
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.8] tracking-[-0.05em] tabular-nums">
            {project ? project.number : '00'}
          </span>
          <span className="meta pb-1">/ {String(projects.length).padStart(2, '0')}</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-6">
          {/* Ticks double as direct navigation. */}
          <ol className="hidden items-center gap-1.5 sm:flex" aria-label="Projects">
            {Array.from({ length: total }).map((_, i) => (
              <li key={i}>
                <span
                  aria-current={i === index ? 'true' : undefined}
                  className={cn(
                    'block h-px w-5 transition-colors duration-500',
                    i === index ? 'bg-accent' : 'bg-line'
                  )}
                />
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => onStep(atEnd ? -1 : 1)}
            className="meta hover:text-accent transition-colors"
          >
            {atEnd ? 'Back ↑' : 'Scroll ↓'}
          </button>

          <button
            type="button"
            onClick={onOpenIndex}
            aria-haspopup="dialog"
            className="meta hover:text-accent transition-colors"
          >
            Index <span className="text-line">(i)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
