'use client';

import { useState } from 'react';
import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { ThoughtCard } from './ThoughtCard';
import { thoughts } from '@/data/personality';

/**
 * Five notes as an even row of cards that wrap down to one per line on a
 * phone. More than one can be left turned over — they are independent notes,
 * not a single-answer control.
 */
export function Personality() {
  const [flipped, setFlipped] = useState<boolean[]>(() => thoughts.map(() => false));

  const toggle = (i: number) =>
    setFlipped((prev) => prev.map((value, index) => (index === i ? !value : value)));

  return (
    <Section id="more">
      <SectionMark index="07" label="Notes" />

      <Reveal className="mt-10 sm:mt-14">
        <h2 className="display-lg font-display italic">A little more about me</h2>
        <p className="meta mt-5">Turn a card over</p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {thoughts.map((thought, i) => (
          <ThoughtCard
            key={thought.tag}
            thought={thought}
            index={i}
            number={String(i + 1).padStart(2, '0')}
            isFlipped={flipped[i]}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </Section>
  );
}
