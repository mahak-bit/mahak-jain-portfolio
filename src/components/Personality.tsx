'use client';

import { useState } from 'react';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { ThoughtCard } from './ThoughtCard';
import { thoughts } from '@/data/personality';

export function Personality() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <Section id="more" className="ruled">
      <Reveal>
        <h2 className="kicker font-normal">A little more about me</h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {thoughts.map((thought, i) => (
          <ThoughtCard
            key={thought.tag}
            thought={thought}
            index={i}
            number={String(i + 1).padStart(2, '0')}
            isFlipped={active === i}
            isDimmed={active !== null && active !== i}
            onToggle={() => setActive((current) => (current === i ? null : i))}
          />
        ))}
      </div>
    </Section>
  );
}
