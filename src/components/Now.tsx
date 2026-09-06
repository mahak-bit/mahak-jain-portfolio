import Link from 'next/link';
import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { IndiaClock } from './IndiaClock';
import { now, nowUpdated, type NowRow } from '@/data/now';

/**
 * "Now" — numbered rows, each one followable to wherever that claim is
 * actually backed up on the site. This is the one section literally about the
 * present moment, so it carries a live clock.
 *
 * Hover and keyboard focus drive the same treatment: the number and category
 * take the accent, the row shifts, and an accent rule draws under the line.
 */
export function Now() {
  return (
    <Section id="now">
      <SectionMark index="04" label="Now" />

      <Reveal className="mt-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 sm:mt-14">
        <h2 className="display-lg font-display italic">What I&rsquo;m doing now</h2>
        <p className="meta pb-2">
          Updated {nowUpdated}
          {/* decorative divider, deliberately faint — not information */}
          <span aria-hidden className="text-line mx-2">
            /
          </span>
          <span className="text-accent">
            <IndiaClock />
          </span>
        </p>
      </Reveal>

      <div className="mt-14 sm:mt-16">
        {now.map((row, i) => (
          <Reveal key={row.verb} delay={Math.min(i * 0.06, 0.28)}>
            <NowEntry row={row} number={String(i + 1).padStart(2, '0')} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function NowEntry({ row, number }: { row: NowRow; number: string }) {
  const body = (
    <div className="border-line grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-5 gap-y-3 border-b py-6 sm:grid-cols-[3rem_minmax(0,1fr)_auto]">
      <span className="text-faint group-hover:text-accent font-mono text-[0.75rem] transition-colors duration-500">
        {number}
      </span>

      <div className="min-w-0">
        <p className="meta group-hover:text-accent mb-2.5 transition-colors duration-500">
          {row.verb}
        </p>
        <p className="font-display text-fg max-w-[56ch] text-[clamp(1.05rem,0.9rem+0.7vw,1.4rem)] leading-[1.35]">
          {row.value}
        </p>
        {/* the rule that draws across as you arrive on the row */}
        <span
          aria-hidden
          className="bg-accent mt-4 block h-px max-w-[56ch] origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </div>

      {row.evidence ? (
        <span className="meta group-hover:text-accent col-start-2 whitespace-nowrap transition-colors duration-500 sm:col-start-3 sm:pt-0.5">
          {row.evidence}
          <span
            aria-hidden
            className="ml-2 inline-block transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      ) : null}
    </div>
  );

  if (!row.href) return <div className="group">{body}</div>;

  return (
    <Link href={row.href} className="group block outline-offset-2">
      {body}
    </Link>
  );
}
