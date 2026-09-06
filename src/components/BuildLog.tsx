import Link from 'next/link';
import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { buildLog } from '@/data/buildlog';

export function BuildLog() {
  return (
    <Section id="log">
      <SectionMark index="06" label="Record" />

      <Reveal className="mt-10 flex flex-wrap items-end justify-between gap-6 sm:mt-14">
        <h2 className="display-lg max-w-[9ch]">Build log</h2>
        <p className="text-muted max-w-[24ch] pb-2 text-[0.95rem] leading-snug">
          A running list of what I&rsquo;ve been making and learning. Newest first.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="border-line mt-12 border-t sm:mt-16">
        {buildLog.map((item, i) => {
          const body = (
            <div className="grid grid-cols-12 items-baseline gap-x-4 gap-y-1 py-6">
              <span className="meta col-span-5 sm:col-span-2">{item.date}</span>
              <span className="meta text-accent col-span-7 sm:col-span-2">{item.verb}</span>
              <span className="text-fg col-span-12 text-[1.02rem] leading-snug sm:col-span-8">
                {item.entry}
                {item.href && (
                  <span aria-hidden className="text-faint ml-2">
                    ↗
                  </span>
                )}
              </span>
            </div>
          );

          const external = item.href?.startsWith('http');
          return (
            <div key={i} className="border-line border-b">
              {item.href ? (
                external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:bg-raise -mx-3 block px-3 transition-colors"
                  >
                    {body}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:bg-raise -mx-3 block px-3 transition-colors"
                  >
                    {body}
                  </Link>
                )
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
