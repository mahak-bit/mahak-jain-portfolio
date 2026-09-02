'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Section } from './ui/Section';
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
    }, 22);
    return () => clearInterval(id);
  }, [status, answer]);

  return (
    <Section id="ask" aria-label="Ask my portfolio" className="ruled">
      <Reveal>
        <span className="kicker">Ask around</span>
        <h2 className="mt-4 text-[clamp(1.9rem,1.3rem+2.6vw,3rem)]">
          Ask my portfolio anything.
        </h2>
        <p className="text-muted mt-4 max-w-md text-[1.05rem] leading-relaxed">
          Not sure where to start? Ask about the projects, the AI work, the tools, or how I work.
          It&rsquo;s a small local model of me — no API, runs offline.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-9">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(query);
          }}
          className="border-line focus-within:border-fg flex items-center gap-3 border-b pb-3 transition-colors"
        >
          <span className="text-accent font-mono text-sm" aria-hidden>
            &gt;
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="what has she actually built?"
            aria-label="Ask a question about Mahak"
            className="placeholder:text-faint min-w-0 flex-1 bg-transparent text-[1.05rem] outline-none"
          />
          <button
            type="submit"
            disabled={!query.trim() || status === 'thinking'}
            aria-label="Ask"
            className="text-muted hover:text-fg font-mono text-sm transition-colors disabled:opacity-40"
          >
            ask ↵
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => void run(p)}
              className="border-line text-muted hover:border-fg hover:text-fg rounded-sm border px-3 py-1.5 text-[0.82rem] transition-colors"
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
              <div className="border-line mt-8 border-t pt-6" aria-live="polite">
                <p className="text-faint mb-3 font-mono text-xs uppercase tracking-[0.12em]">
                  {status === 'thinking' ? 'thinking' : 'assistant'}
                </p>
                {status === 'thinking' ? (
                  <span className="text-faint text-sm">…</span>
                ) : (
                  <p className="text-fg/90 max-w-2xl text-[1rem] leading-relaxed">
                    {shown}
                    {status === 'answering' && (
                      <span className="bg-accent ml-0.5 inline-block h-[1em] w-px translate-y-[0.15em] animate-pulse" />
                    )}
                  </p>
                )}

                {status === 'done' && answer?.followUps?.length ? (
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.85rem]">
                    {answer.followUps.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => void run(f)}
                        className="text-muted hover:text-fg transition-colors"
                      >
                        {f} →
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>
    </Section>
  );
}
