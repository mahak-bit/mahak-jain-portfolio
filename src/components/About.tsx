import { Section, SectionMark } from './ui/Section';
import { Reveal } from './ui/Reveal';

const ROLES = ['Full-Stack Developer', 'Python Developer', 'GenAI Engineer'];

export function About() {
  return (
    <Section id="about">
      <SectionMark index="03" label="About" />

      <div className="mt-10 grid gap-x-12 gap-y-12 sm:mt-14 md:grid-cols-12">
        <Reveal className="md:sticky md:top-28 md:col-span-5 md:self-start">
          <h2 className="display-lg max-w-[12ch]">
            I studied business. Then I got more interested in the thing everyone was building on top
            of.
          </h2>

          <ul className="mt-8 flex flex-col gap-1.5">
            {ROLES.map((role) => (
              <li key={role} className="meta">
                {role}
              </li>
            ))}
            <li className="meta text-accent">Moving toward Agentic AI</li>
          </ul>
        </Reveal>

        <Reveal
          delay={0.05}
          className="prose-links text-muted flex flex-col gap-5 text-[1.02rem] leading-relaxed md:col-span-6 md:col-start-7"
        >
          <p>
            I&rsquo;m Mahak. Somewhere between spreadsheets and a late-night &ldquo;wait, can I just
            build this?&rdquo;, I started building for the web — and lately, that&rsquo;s
            increasingly meant putting AI on top of it.
          </p>
          <p>
            I build full-stack web applications, Python backends, AI-powered products, and
            automations. My work has grown from traditional web development into Generative AI, and
            I&rsquo;m now going deeper into Agentic AI — building systems that can reason, use tools,
            work with data, and handle tasks beyond a simple prompt-and-response.
          </p>
          <p>
            I work across the stack: React, Next.js, TypeScript, Python, APIs, databases, and cloud
            deployment, alongside modern AI tools and frameworks.
          </p>
          <p>
            I work AI-first. An assistant handles the repetitive parts; I decide the architecture —
            the data model, system boundaries, integrations, and the places where things
            aren&rsquo;t allowed to break. It&rsquo;s fast, but it&rsquo;s not hands-off.
          </p>
          <p>
            The work here is real and deliberately small. I&rsquo;d rather ship something that works
            than write a paragraph about something that might.
          </p>

          <p className="border-accent text-fg mt-6 border-l-2 pl-5 font-display text-[clamp(1.2rem,1rem+1.1vw,1.75rem)] leading-tight">
            Most of my ideas start as a random thought and end up as a repo.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
