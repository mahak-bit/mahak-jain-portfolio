'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const JUMPS: Record<string, string> = {
  k: 'ask',
  w: 'work',
  a: 'about',
  n: 'now',
  s: 'skills',
  l: 'log',
  m: 'more',
  c: 'contact',
};

const SHORTCUTS: [string, string][] = [
  ['/', 'search — focus the ask bar'],
  ['g then w', 'go to the archive'],
  ['g then a', 'go to about'],
  ['g then n', 'go to now'],
  ['g then c', 'go to contact'],
  ['g then t', 'back to top'],
  ['?', 'this list'],
  ['esc', 'close'],
];

function isTypingTarget(el: EventTarget | null) {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || node.isContentEditable;
}

function goTo(id: string) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function KeyboardNav() {
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    let awaitingJump = false;
    let jumpTimer: ReturnType<typeof setTimeout>;

    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'Escape') {
        setHelpOpen(false);
        awaitingJump = false;
        return;
      }

      if (isTypingTarget(e.target)) return;

      if (awaitingJump) {
        awaitingJump = false;
        clearTimeout(jumpTimer);
        if (e.key === 't') return goTo('top');
        const target = JUMPS[e.key.toLowerCase()];
        if (target) {
          e.preventDefault();
          goTo(target);
        }
        return;
      }

      if (e.key === '/') {
        e.preventDefault();
        const input = document.getElementById('ask-input') as HTMLInputElement | null;
        input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => input?.focus(), 320);
        return;
      }

      if (e.key === '?') {
        e.preventDefault();
        setHelpOpen((v) => !v);
        return;
      }

      if (e.key === 'g') {
        awaitingJump = true;
        jumpTimer = setTimeout(() => {
          awaitingJump = false;
        }, 1200);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(jumpTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {helpOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            type="button"
            aria-label="Close shortcuts"
            className="bg-bg/70 absolute inset-0 backdrop-blur-sm"
            onClick={() => setHelpOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="border-line bg-surface relative w-full max-w-sm rounded-md border p-6"
          >
            <p className="kicker mb-4">Keyboard</p>
            <dl className="flex flex-col gap-2.5">
              {SHORTCUTS.map(([key, desc]) => (
                <div key={key} className="flex items-baseline justify-between gap-4">
                  <dt className="border-line text-fg shrink-0 rounded-sm border px-1.5 py-0.5 font-mono text-xs">
                    {key}
                  </dt>
                  <dd className="text-muted text-right text-sm">{desc}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
