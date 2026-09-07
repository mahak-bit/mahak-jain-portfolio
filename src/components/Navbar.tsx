'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { navItems, site } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * A deliberately quiet masthead: the name on the left, three destinations on
 * the right, everything at label scale. It gains a hairline rule and a ground
 * once the page moves, and otherwise stays out of the composition's way.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled ? 'bg-bg/80 border-line border-b backdrop-blur-sm' : 'border-transparent'
      )}
    >
      <div
        className={cn(
          'gutter-x flex items-center justify-between transition-[padding] duration-500',
          scrolled ? 'py-3.5' : 'py-6'
        )}
      >
        <Link href="/" className="meta tap text-fg hover:text-accent transition-colors">
          {site.name}
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="meta hover:text-fg transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {site.resumeUrl ? (
            <Link
              href={site.resumeUrl}
              className="meta border-line hover:border-accent hover:text-accent border px-3 py-2 transition-colors"
            >
              Résumé
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          {site.resumeUrl ? (
            <Link
              href={site.resumeUrl}
              className="meta border-line hover:border-accent hover:text-accent border px-2.5 py-2 transition-colors"
            >
              Résumé
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="meta tap hover:text-fg transition-colors"
          >
            Menu
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-bg absolute inset-0" onClick={() => setOpen(false)} />
            <nav className="gutter-x relative flex h-dvh flex-col pt-6 pb-14" aria-label="Mobile">
              <div className="flex items-center justify-between">
                <span className="meta text-fg">{site.name}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="meta tap hover:text-fg transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="mt-auto flex flex-col">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="border-line border-t"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-5 py-5"
                    >
                      <span className="meta">{String(i + 1).padStart(2, '0')}</span>
                      <span className="display-md">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
