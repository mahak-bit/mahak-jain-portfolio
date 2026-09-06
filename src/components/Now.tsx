import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { now, nowUpdated } from '@/data/now';

export function Now() {
  return (
    <Section id="now" className="pt-0 sm:pt-0 lg:pt-0">
      <SectionMark index="04" label="Now" />

      <Reveal className="mt-10 flex flex-wrap items-end justify-between gap-6 sm:mt-14">
        <h2 className="display-lg">Now</h2>
        <span className="meta pb-2">Updated {nowUpdated}</span>
      </Reveal>

      <Reveal delay={0.05} className="mt-12 sm:mt-16">
        <dl className="border-line border-t">
          {now.map((row) => (
            <div
              key={row.verb}
              className="border-line grid grid-cols-12 items-baseline gap-x-4 gap-y-1 border-b py-6"
            >
              <dt className="meta col-span-12 sm:col-span-3">{row.verb}</dt>
              <dd className="text-fg col-span-12 text-[1.05rem] leading-snug sm:col-span-9">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
