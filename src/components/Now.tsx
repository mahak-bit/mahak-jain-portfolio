import Link from 'next/link';
import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { IndiaClock } from './IndiaClock';
import { now, nowUpdated, type NowRow } from '@/data/now';

/**
 * "Now" — a status line rather than a feature grid, and the one section that
 * is literally about this moment, so it carries a live clock.
 *
 * Each row that has evidence somewhere on the site is a link to it: the claim
 * can be followed rather than just read. Rows without evidence stay inert
 * instead of getting a decorative one.
 */
export function Now() {
  return (
    <Section id="now" className="pt-0 sm:pt-0 lg:pt-0">
      <SectionMark index="04" label="Now" />

      <Reveal className="mt-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 sm:mt-14">
        <h2 className="display-lg">Now</h2>
        <p className="meta pb-2">
          Updated {nowUpdated}
          <span className="text-line mx-2">/</span>
          <span className="text-accent">
            <IndiaClock />
          </span>
        </p>
      </Reveal>

      <div className="mt-12 sm:mt-16">
        <dl className="border-line border-t">
          {now.map((row, i) => (
            <Reveal key={row.verb} delay={Math.min(i * 0.05, 0.25)}>
              <NowEntry row={row} />
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}

function NowEntry({ row }: { row: NowRow }) {
  const body = (
    <div className="grid grid-cols-12 items-baseline gap-x-4 gap-y-1 py-6">
      <dt className="meta group-hover:text-accent col-span-12 transition-colors duration-500 sm:col-span-3">
        {row.verb}
      </dt>
      <dd className="col-span-12 sm:col-span-9">
        <span className="text-fg inline-block text-[1.05rem] leading-snug transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
          {row.value}
        </span>
        {row.evidence ? (
          <span className="meta text-accent ml-3 inline-block opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
            {row.evidence} →
          </span>
        ) : null}
      </dd>
    </div>
  );

  if (!row.href) {
    return <div className="border-line border-b">{body}</div>;
  }

  // `group` sits on the link itself so both hover and keyboard focus drive the
  // same treatment — a sibling rule would be out of the group's reach.
  return (
    <div className="border-line border-b">
      <Link href={row.href} className="group relative block outline-offset-2">
        <span
          aria-hidden
          className="bg-accent absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
        {body}
      </Link>
    </div>
  );
}
