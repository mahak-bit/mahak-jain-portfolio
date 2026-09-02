import { Section } from './ui/Section';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';

const EXPLORING = [
  'Generative AI',
  'Agentic AI',
  'AI Agents',
  'LLM Applications',
  'Automation',
  'Product Engineering',
];

export function About() {
  return (
    <Section id="about">
      <SectionHeading
        index="01"
        label="About"
        title="I like turning ideas into things that work."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <Reveal className="text-muted space-y-5 text-base leading-relaxed sm:text-[1.05rem]">
          <p>
            I came into technology from business — a BBA — and moved into it deliberately, not as a
            detour. What started as building interfaces became full-stack development, and then AI:
            generative models, LLM applications, and the engineering around them.
          </p>
          <p>
            Today I build AI-powered products end to end with an AI-first workflow — using AI coding
            assistants like Claude Code to move quickly while keeping the architecture, the data
            model and the guardrails deliberate. I&rsquo;m most interested in where product thinking
            meets real systems: shipping something people actually use — and, increasingly, in
            agentic AI, software that can plan and act rather than only respond.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="border-border-strong bg-surface/50 rounded-2xl border p-6">
            <p className="text-eyebrow mb-4">Currently exploring</p>
            <ul className="flex flex-col gap-2.5">
              {EXPLORING.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="bg-accent size-1.5 shrink-0 rounded-full" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
