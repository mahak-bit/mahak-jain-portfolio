import Link from 'next/link';
import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { buildLog, type LogEntry } from '@/data/buildlog';

/**
 * The record: date, what happened, and the thing itself — the title set in the
 * display face and its qualifier alongside in the body face, so a row reads as
 * one line rather than three columns of equal weight.
 */
export function BuildLog() {
  return (
    <Section id="log">
      <SectionMark index="06" label="Record" />

      <Reveal className="mt-10 flex flex-wrap items-end justify-between gap-6 sm:mt-14">
        <h2 className="display-lg font-display italic">Build log</h2>
        <p className="text-muted max-w-[26ch] pb-2 text-[0.95rem] leading-snug">
          A running list of what I&rsquo;ve been making and learning. Newest first.
        </p>
      </Reveal>

      <div className="mt-14 sm:mt-16">
        {buildLog.map((entry, i) => (
          <Reveal key={`${entry.title}-${i}`} delay={Math.min(i * 0.05, 0.35)}>
            <LogRow entry={entry} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function LogRow({ entry }: { entry: LogEntry }) {
  const body = (
    <div className="border-line grid grid-cols-2 items-baseline gap-x-5 gap-y-2 border-b py-5 sm:grid-cols-[minmax(90px,120px)_minmax(90px,140px)_minmax(0,1fr)]">
      <span className="text-faint font-mono text-[0.7rem]">{entry.date}</span>
      <span className="meta text-accent">{entry.verb}</span>
      <span className="col-span-2 sm:col-span-1">
        <span className="font-display text-fg group-hover:text-accent text-[1.08rem] transition-colors duration-500">
          {entry.title}
        </span>
        <span className="text-muted text-[0.92rem]">
          {' '}
          &mdash; {entry.detail}
          {entry.href?.startsWith('http') ? (
            <span aria-hidden className="text-faint ml-1.5">
              ↗
            </span>
          ) : null}
        </span>
      </span>
    </div>
  );

  if (!entry.href) return <div className="group">{body}</div>;

  const external = entry.href.startsWith('http');
  if (external) {
    return (
      <a href={entry.href} target="_blank" rel="noreferrer" className="group block outline-offset-2">
        {body}
      </a>
    );
  }
  return (
    <Link href={entry.href} className="group block outline-offset-2">
      {body}
    </Link>
  );
}
