'use client';

import { useState } from 'react';
import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { ThoughtCard } from './ThoughtCard';
import { thoughts } from '@/data/personality';

/**
 * Five notes, laid out asymmetrically rather than as a row of equals — the
 * spans and heights vary so the set reads as a composition instead of a grid.
 */
const LAYOUT = [
  'md:col-span-7 min-h-[300px] sm:min-h-[360px]',
  'md:col-span-5 min-h-[300px] sm:min-h-[360px]',
  'md:col-span-5 min-h-[300px] sm:min-h-[330px]',
  'md:col-span-7 min-h-[300px] sm:min-h-[330px]',
  'md:col-span-12 min-h-[280px] sm:min-h-[320px]',
];

export function Personality() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Section id="more">
      <SectionMark index="05" label="Notes" />

      <Reveal className="mt-10 sm:mt-14">
        <h2 className="display-lg max-w-[14ch]">A little more about me</h2>
        <p className="meta mt-6">Turn a card over</p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-12 md:gap-5">
        {thoughts.map((thought, i) => (
          <div key={thought.tag} className={LAYOUT[i]}>
            <ThoughtCard
              thought={thought}
              index={i}
              number={String(i + 1).padStart(2, '0')}
              isFlipped={active === i}
              isDimmed={active !== null && active !== i}
              onToggle={() => setActive((cur) => (cur === i ? null : i))}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
