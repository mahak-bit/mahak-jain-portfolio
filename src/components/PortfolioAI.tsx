'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Progressive word reveal for the "answering" phase.
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
    <Section id="ask" aria-label="Ask my portfolio">
      <SectionHead />

      <Reveal
        delay={0.05}
        className="border-border-strong bg-surface/70 mt-10 overflow-hidden rounded-2xl border backdrop-blur-md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void run(query);
          }}
          className="flex items-center gap-3 px-4 py-3.5 sm:px-5"
        >
          <Sparkles className="text-accent size-4 shrink-0" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask: What can Mahak build?"
            aria-label="Ask my portfolio a question"
            className="placeholder:text-faint min-w-0 flex-1 bg-transparent text-sm outline-none sm:text-base"
          />
          <button
            type="submit"
            disabled={!query.trim() || status === 'thinking'}
            aria-label="Send question"
            className="bg-accent text-accent-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-full transition hover:brightness-110 disabled:opacity-40"
          >
            <ArrowRight className="size-4" />
          </button>
        </form>

        <div className="border-border/60 flex flex-wrap gap-2 border-t px-4 py-3 sm:px-5">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => void run(p)}
              className="border-border text-muted hover:border-border-strong hover:text-foreground rounded-full border px-3 py-1.5 text-xs transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {status !== 'idle' && (
            <motion.div
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-border/60 border-t"
            >
              <div className="px-4 py-5 sm:px-5" aria-live="polite">
                <p className="text-eyebrow mb-3 flex items-center gap-2">
                  <span className="bg-accent inline-block size-1.5 rounded-full" aria-hidden />
                  {status === 'thinking' ? 'Thinking' : 'Portfolio assistant'}
                </p>

                {status === 'thinking' ? (
                  <ThinkingDots />
                ) : (
                  <p className="text-foreground/90 text-sm leading-relaxed sm:text-[0.95rem]">
                    {shown}
                    {status === 'answering' && (
                      <span className="bg-accent ml-0.5 inline-block h-[1em] w-[2px] translate-y-0.5 animate-pulse" />
                    )}
                  </p>
                )}

                {status === 'done' && answer?.followUps?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {answer.followUps.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => void run(f)}
                        className="text-muted hover:text-foreground inline-flex items-center gap-1 text-xs"
                      >
                        <ArrowRight className="size-3" />
                        {f}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>

      <p className="text-faint mt-3 flex items-center gap-1.5 font-mono text-xs">
        <CornerDownLeft className="size-3" />
        Simulated locally — built so a real model API can be connected later.
      </p>
    </Section>
  );
}

function SectionHead() {
  return (
    <Reveal className="flex flex-col gap-5">
      <div className="text-eyebrow flex items-center gap-3">
        <span className="text-accent">◆</span>
        <span className="bg-border-strong h-px w-8" aria-hidden />
        <span>Ask my portfolio</span>
      </div>
      <h2 className="max-w-2xl text-[clamp(1.9rem,1.2rem+3vw,3.25rem)] leading-[1.05]">
        Ask my portfolio anything.
      </h2>
      <p className="text-muted max-w-xl text-base leading-relaxed sm:text-lg">
        Not sure where to start? Ask about my projects, skills, AI work, or what I&rsquo;m building.
      </p>
    </Reveal>
  );
}

function ThinkingDots() {
  return (
    <span className="text-muted inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="bg-muted inline-block size-1.5 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}
