import { Section } from './ui/Section';
import { SectionHeading } from './ui/SectionHeading';
import { ProjectCard } from './ProjectCard';
import { projects } from '@/data/projects';

export function Projects() {
  return (
    <Section id="work">
      <SectionHeading
        index="02"
        label="Work"
        title="Selected work."
        intro="A collection of products, experiments and systems I've built. Real projects only — open slots are labelled."
      />

      <div className="mt-14 flex flex-col gap-8 sm:gap-10">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} flip={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}
