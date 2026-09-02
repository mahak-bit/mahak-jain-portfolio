import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { aboutMeLines } from '@/data/personality';

/** Slight, deliberate indentation drift — designed, not centered-by-default. */
const indent = ['', 'sm:pl-[4%]', 'sm:pl-[1%]', 'sm:pl-[7%]', 'sm:pl-[2%]', 'sm:pl-[5%]'];

export function Personality() {
  return (
    <Section id="more" className="ruled">
      <Reveal>
        <h2 className="kicker font-normal">A little more about me</h2>
      </Reveal>

      <div className="mt-8 flex flex-col">
        {aboutMeLines.map((line, i) => (
          <Reveal
            key={line}
            delay={Math.min(i * 0.04, 0.2)}
            className={`border-line border-b py-6 first:border-t ${indent[i % indent.length]}`}
          >
            <p className="font-display text-[clamp(1.3rem,1rem+1.6vw,2rem)] leading-tight">
              {line}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
