import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { ProjectCard } from './ProjectCard';
import { projects } from '@/data/projects';

export function Projects() {
  return (
    <Section id="work" className="max-w-5xl">
      <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(2.4rem,1.6rem+4vw,4.5rem)] leading-none">
          Selected work
        </h2>
        <p className="text-muted max-w-xs text-[0.95rem] leading-snug">
          Three things, told as short stories. Real projects only — the open slot is labelled.
        </p>
      </Reveal>

      <div className="flex flex-col gap-14">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} position={i} />
        ))}
      </div>
    </Section>
  );
}
