import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { now, nowUpdated } from '@/data/now';

export function Now() {
  return (
    <Section id="now" className="ruled">
      <Reveal className="flex items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(3rem,2rem+6vw,6rem)] leading-none">Now</h2>
        <span className="kicker pb-2">Updated {nowUpdated}</span>
      </Reveal>

      <Reveal delay={0.05} className="mt-10">
        <dl className="border-line border-t">
          {now.map((row) => (
            <div
              key={row.verb}
              className="border-line grid grid-cols-1 gap-1 border-b py-5 sm:grid-cols-[10rem_1fr] sm:gap-8"
            >
              <dt className="text-faint font-mono text-xs uppercase tracking-[0.12em] sm:pt-1.5">
                {row.verb}
              </dt>
              <dd className="text-[1.12rem] leading-snug">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
