'use client';

import { useTheme } from 'next-themes';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useMounted } from '@/lib/use-mounted';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();

  const isDark = mounted ? resolvedTheme === 'dark' : true;

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Toggle colour theme'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'border-border-strong text-foreground hover:bg-surface-2 relative inline-flex size-9 items-center justify-center rounded-full border transition-colors',
        className
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? 'sun' : 'moon'}
          initial={reduceMotion ? false : { opacity: 0, rotate: -35, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 35, scale: 0.6 }}
          transition={{ duration: 0.18 }}
          className="absolute inline-flex"
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
