'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Reveal } from './ui/Reveal';
import { askPortfolio, SUGGESTED_PROMPTS, type PortfolioAnswer } from '@/lib/portfolio-ai';

type Status = 'idle' | 'thinking' | 'answering' | 'done';

export function PortfolioAI() {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [answer, setAnswer] = useState<PortfolioAnswer | null>(null);
  const [shown, setShown] = useState('');

  async function run(q: string) {
    const trimmed = q.trim();
    if (!trimmed || status === 'thinking') return;
    setQuery(trimmed);
    setStatus('thinking');
    setAnswer(null);
    setShown('');
    const res = await askPortfolio(trimmed);
    setAnswer(res);
    if (reduceMotion) {
      setShown(res.response);
      setStatus('done');
    } else {
      setStatus('answering');
    }
  }

  useEffect(() => {
    if (status !== 'answering' || !answer) return;
    const words = answer.response.split(' ');
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(words.slice(0, i).join(' '));
      if (i >= words.length) {
        clearInterval(id);
        setStatus('done');
      }
    }, 24);
    return () => clearInterval(id);
  }, [status, answer]);

  return (
    <section id="ask" aria-label="Ask around" className="mx-auto max-w-5xl px-5 py-14 sm:px-8">
      <h2 className="sr-only">Ask around</h2>
      <Reveal className="border-line border-t pt-10">
        <p className="text-muted text-[1.05rem]">
          Want to know something specific?{' '}
          <span className="text-fg">Ask around.</span>{' '}
          <span className="text-faint text-sm">
            (It&rsquo;s a small local model of me — no API, works offline.)
          </span>
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(query);
          }}
          className="mt-5 flex items-baseline gap-3"
        >
          <span className="text-accent font-mono text-sm" aria-hidden>
            &gt;
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="what has she actually built?"
            aria-label="Ask a question about Mahak"
            className="placeholder:text-faint border-line focus:border-fg min-w-0 flex-1 border-b bg-transparent pb-2 text-[1.02rem] outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!query.trim() || status === 'thinking'}
            className="text-muted hover:text-fg text-sm transition-colors disabled:opacity-40"
          >
            ↵
          </button>
        </form>

        <div className="text-faint mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.82rem]">
          {SUGGESTED_PROMPTS.slice(0, 3).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => void run(p)}
              className="hover:text-fg underline decoration-transparent underline-offset-2 transition-colors hover:decoration-current"
            >
              {p}
            </button>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {status !== 'idle' && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <p
                className="text-fg/90 mt-6 max-w-2xl text-[0.98rem] leading-relaxed"
                aria-live="polite"
              >
                {status === 'thinking' ? (
                  <span className="text-faint">thinking…</span>
                ) : (
                  <>
                    {shown}
                    {status === 'answering' && (
                      <span className="bg-accent ml-0.5 inline-block h-[1em] w-px translate-y-[0.15em] animate-pulse" />
                    )}
                  </>
                )}
              </p>
              {status === 'done' && answer?.followUps?.length ? (
                <div className="text-faint mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.82rem]">
                  {answer.followUps.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => void run(f)}
                      className="hover:text-fg transition-colors"
                    >
                      {f} →
                    </button>
                  ))}
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
