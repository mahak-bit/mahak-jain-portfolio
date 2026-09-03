import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';

export function About() {
  return (
    <Section id="about" className="ruled pt-16 sm:pt-20">
      <div className="grid gap-x-12 gap-y-10 md:grid-cols-[1fr_1.4fr]">
        <Reveal className="md:sticky md:top-24 md:self-start">
          <span className="kicker">About</span>
          <h2 className="mt-4 text-[clamp(1.7rem,1.2rem+2vw,2.6rem)]">
            I studied business. Then I got more interested in the thing everyone was building on
            top of.
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="prose-links flex flex-col gap-5 text-[1.06rem] leading-relaxed">
          <p className="text-faint font-mono text-[0.78rem] leading-relaxed tracking-[0.04em]">
            Full-Stack Developer <span className="opacity-40">·</span> Python Developer{' '}
            <span className="opacity-40">·</span> GenAI Engineer{' '}
            <span className="opacity-40">·</span>{' '}
            <span className="text-accent">Moving toward Agentic AI</span>
          </p>
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
            The work here is real and deliberately small. I&rsquo;d rather ship something that
            works than write a paragraph about something that might.
          </p>

          <p className="annotation mt-3 max-w-sm -rotate-1">
            Most of my ideas start as a random thought and end up as a repo.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
