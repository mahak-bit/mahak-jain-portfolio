'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { navItems } from '@/lib/site';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

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
        'sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter]',
        scrolled
          ? 'bg-bg/85 border-line border-b backdrop-blur'
          : 'border-transparent bg-transparent'
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-5xl items-baseline justify-between px-5 transition-[padding] sm:px-8',
          scrolled ? 'py-3' : 'py-5'
        )}
      >
        <Link
          href="/"
          className="font-mono text-[0.82rem] font-semibold uppercase tracking-[0.16em]"
        >
          Mahak Jain
        </Link>

        <nav className="hidden items-baseline gap-7 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              className="text-muted hover:text-fg text-[0.9rem] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="font-mono text-[0.8rem] uppercase tracking-[0.14em]"
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
            transition={{ duration: 0.18 }}
          >
            <div className="bg-bg absolute inset-0" onClick={() => setOpen(false)} />
            <nav
              className="relative flex h-dvh flex-col px-6 pb-12 pt-5"
              aria-label="Mobile"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[0.8rem] font-semibold uppercase tracking-[0.16em]">
                  Mahak Jain
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="font-mono text-[0.8rem] uppercase tracking-[0.14em]"
                >
                  Close
                </button>
              </div>

              <div className="mt-auto flex flex-col">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.04, duration: 0.25 }}
                    className="border-line border-t"
                  >
                    <Link
                      href={`/${item.href}`}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 py-5"
                    >
                      <span className="text-faint font-mono text-xs">
                        0{i + 1}
                      </span>
                      <span className="font-display text-3xl">{item.label}</span>
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
