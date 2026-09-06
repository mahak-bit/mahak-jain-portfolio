'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { askPortfolio, SUGGESTED_PROMPTS, type PortfolioAnswer } from '@/lib/portfolio-ai';

const EASE = [0.16, 1, 0.3, 1] as const;

type Status = 'idle' | 'thinking' | 'answering' | 'done';

/**
 * "Ask my portfolio" — set as a piece of technical apparatus rather than a
 * chat widget: an oversized prompt line, the suggestions as a numbered index,
 * and the answer as a ruled record with its own metadata.
 */
export function PortfolioAI() {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [answer, setAnswer] = useState<PortfolioAnswer | null>(null);
  const [shown, setShown] = useState('');
  const [asked, setAsked] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function run(q: string) {
    const trimmed = q.trim();
    if (!trimmed || status === 'thinking') return;
    setQuery(trimmed);
    setAsked(trimmed);
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

  const busy = status === 'thinking';

  return (
    <Section id="ask" aria-label="Ask my portfolio">
      <SectionMark index="01" label="Ask around" className="mb-10 sm:mb-14" />

      <div className="grid gap-x-12 gap-y-12 md:grid-cols-12">
        {/* Left — the standing invitation */}
        <Reveal className="md:col-span-5">
          <h2 className="display-lg max-w-[11ch]">Ask my portfolio anything.</h2>
          <p className="text-muted mt-6 max-w-[38ch] text-[1rem] leading-relaxed">
            Not sure where to start? Ask about the projects, the web and AI work, the tools, or how
            I work.
          </p>
          <p className="meta mt-6">Runs offline · no API calls · answers are pre-written</p>
        </Reveal>

        {/* Right — the apparatus */}
        <Reveal delay={0.05} className="md:col-span-7">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run(query);
            }}
            className="border-fg/25 focus-within:border-accent group border-b-2 pb-4 transition-colors duration-500"
          >
            <label htmlFor="ask-input" className="meta mb-3 block">
              Your question
            </label>
            <div className="flex items-baseline gap-3">
              <span
                aria-hidden
                className="text-accent font-mono text-[clamp(1rem,0.8rem+0.7vw,1.35rem)] leading-none"
              >
                →
              </span>
              <input
                id="ask-input"
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="what has she actually built?"
                aria-label="Ask a question about Mahak"
                autoComplete="off"
                className="placeholder:text-faint/70 min-w-0 flex-1 bg-transparent font-display text-[clamp(1.15rem,0.9rem+1.1vw,1.75rem)] tracking-[-0.02em] outline-none"
              />
              <button
                type="submit"
                disabled={!query.trim() || busy}
                className="meta hover:text-accent shrink-0 transition-colors disabled:opacity-35"
              >
                {busy ? 'Asking…' : 'Ask ↵'}
              </button>
            </div>
          </form>

          {/* The suggestions, as an index rather than a row of pills */}
          <div className="mt-8">
            <p className="meta mb-2">Or try one</p>
            <ul className="border-line border-t">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <li key={p} className="border-line border-b">
                  <button
                    type="button"
                    onClick={() => void run(p)}
                    className="group flex w-full items-baseline gap-4 py-3 text-left"
                  >
                    <span className="meta group-hover:text-accent w-6 shrink-0 transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-fg group-hover:text-accent flex-1 text-[0.96rem] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                      {p}
                    </span>
                    <span
                      aria-hidden
                      className="text-faint group-hover:text-accent shrink-0 text-xs opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* The record */}
          <AnimatePresence initial={false}>
            {status !== 'idle' && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="border-accent mt-10 border-t-2 pt-5" aria-live="polite">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="meta text-accent">{busy ? 'Thinking' : 'Answer'}</p>
                    {answer ? <p className="meta">{answer.intent}</p> : null}
                  </div>

                  {asked ? (
                    <p className="text-faint mt-3 font-display text-[1.05rem] tracking-[-0.02em]">
                      “{asked}”
                    </p>
                  ) : null}

                  {busy ? (
                    <p className="text-faint mt-4 flex gap-1 text-sm" aria-hidden>
                      {['·', '·', '·'].map((d, i) => (
                        <motion.span
                          key={i}
                          animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
                        >
                          {d}
                        </motion.span>
                      ))}
                    </p>
                  ) : (
                    <p className="text-fg mt-4 max-w-[58ch] text-[1.02rem] leading-relaxed">
                      {shown}
                      {status === 'answering' && (
                        <span className="bg-accent ml-1 inline-block h-[0.95em] w-[2px] translate-y-[0.12em] animate-pulse" />
                      )}
                    </p>
                  )}

                  {status === 'done' && answer?.followUps?.length ? (
                    <div className="border-line mt-6 border-t pt-4">
                      <p className="meta mb-2.5">Then ask</p>
                      <div className="flex flex-wrap gap-x-7 gap-y-2">
                        {answer.followUps.map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => void run(f)}
                            className="group text-fg hover:text-accent text-[0.94rem] transition-colors"
                          >
                            {f}
                            <span
                              aria-hidden
                              className="ml-1.5 inline-block transition-transform duration-500 group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </Section>
  );
}
