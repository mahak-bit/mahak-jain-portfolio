'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { navItems } from '@/lib/site';
import { ThemeToggle } from './ThemeToggle';
import { Magnetic } from './ui/Magnetic';
import { buttonStyles } from './ui/Button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4">
      <nav
        className={cn(
          'mt-3 flex w-full max-w-3xl items-center gap-1 rounded-full border transition-all duration-300 sm:mt-4',
          scrolled
            ? 'border-border-strong bg-surface/80 p-1.5 shadow-lg shadow-black/5 backdrop-blur-xl'
            : 'border-border/60 bg-surface/40 p-2 backdrop-blur-md'
        )}
        aria-label="Primary"
      >
        <Link
          href="/"
          className="focus-visible:bg-surface-2 rounded-full px-3 py-1.5 font-mono text-sm font-semibold tracking-tight"
        >
          MAHAK
        </Link>

        <div className="mx-auto hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              className="text-muted hover:text-foreground hover:bg-surface-2 rounded-full px-3 py-1.5 text-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <Magnetic className="hidden sm:block">
            <Link
              href="/#contact"
              className={buttonStyles('primary', 'sm', 'group whitespace-nowrap')}
            >
              Let&rsquo;s Work Together
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Magnetic>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="border-border-strong hover:bg-surface-2 inline-flex size-9 items-center justify-center rounded-full border md:hidden"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="bg-background/95 absolute inset-0 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <nav className="relative flex h-dvh flex-col px-6 pb-10 pt-6" aria-label="Mobile">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold tracking-tight">MAHAK</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="border-border-strong inline-flex size-9 items-center justify-center rounded-full border"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mt-16 flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={`/${item.href}`}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-3xl tracking-tight"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between">
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className={buttonStyles('primary', 'md')}
                >
                  Let&rsquo;s Work Together
                  <ArrowUpRight className="size-4" />
                </Link>
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
