import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { pokingAt, toolGroups, toolsCoda } from '@/data/skills';

/**
 * The toolset as a grid of ruled groups rather than one long run — the same
 * items, sorted so the full-stack spread is legible at a glance. The last
 * group closes with an italic aside: the list stops, the sentence doesn't.
 */
export function Skills() {
  return (
    <Section id="skills">
      <SectionMark index="05" label="Tools" />

      <Reveal className="mt-10 sm:mt-14">
        <h2 className="display-lg font-display italic">I work with</h2>
      </Reveal>

      <div className="mt-14 grid gap-x-10 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {toolGroups.map((group, i) => (
          <Reveal
            key={group.label}
            delay={Math.min(i * 0.06, 0.3)}
            className="border-line border-t pt-4"
          >
            <p className="meta mb-3.5">{group.label}</p>
            <p className="font-display text-fg text-[1.08rem] leading-[1.75]">
              {group.items.join(', ')}
              {i === toolGroups.length - 1 ? (
                <span className="text-accent ml-2 inline-block text-[max(0.9rem,0.82em)] leading-none tracking-[0.01em] italic">
                  &mdash;&thinsp;{toolsCoda}
                </span>
              ) : null}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.05} className="mt-14">
        <p className="meta text-accent">
          Still poking at
          <span aria-hidden className="text-line mx-2.5">
            &mdash;
          </span>
          {pokingAt.join(', ')}
        </p>
      </Reveal>
    </Section>
  );
}
