import Link from 'next/link';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { buildLog } from '@/data/buildlog';

export function BuildLog() {
  return (
    <Section id="log" className="ruled">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(2.2rem,1.6rem+3.4vw,3.8rem)] leading-none">
          Build log
        </h2>
        <p className="text-faint max-w-[15rem] text-[0.9rem] leading-snug">
          A running list of what I&rsquo;ve been making and learning. Newest first.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-10 border-line border-t">
        {buildLog.map((item, i) => {
          const body = (
            <div className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-[7rem_7rem_1fr] sm:items-baseline sm:gap-6">
              <span className="text-faint font-mono text-xs uppercase tracking-[0.1em]">
                {item.date}
              </span>
              <span className="text-accent font-mono text-xs uppercase tracking-[0.1em]">
                {item.verb} →
              </span>
              <span className="text-[1.02rem] leading-snug">
                {item.entry}
                {item.href && (
                  <span aria-hidden className="text-faint ml-1.5">
                    ↗
                  </span>
                )}
              </span>
            </div>
          );

          return (
            <div key={i} className="border-line border-b">
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:bg-raise -mx-3 block px-3 transition-colors"
                >
                  {body}
                </Link>
              ) : (
                body
              )}
            </div>
          );
        })}
      </Reveal>
    </Section>
  );
}
