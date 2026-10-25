'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Section, SectionMark } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import type { ExhibitProject } from './types';
import { CapabilitiesBlock, ContactBlock, IntroBlock } from './ui/Blocks';

/**
 * The exhibition as an ordinary page: the same intro, the same six projects
 * with their real links, the same two halves of what the work is made of, the
 * same way to get in touch. It is what you get with no WebGL, on a machine too
 * modest for the 3D, with reduced motion on, or when you simply ask for it —
 * and it is what a search engine or a screen reader meets first.
 */
export function ExhibitionStatic({
  projects,
  upgrade,
}: {
  projects: ExhibitProject[];
  /** Present when this device could run the 3D version: offers the way back. */
  upgrade?: { label: string; onClick: () => void };
}) {
  return (
    <div id="exhibition-list">
      <Section className="pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20">
        <SectionMark index="01" label="Intro" className="mb-10 sm:mb-14" />
        <IntroBlock cue={false} />
        {upgrade ? (
          <button
            type="button"
            onClick={upgrade.onClick}
            className="meta bg-fg text-bg hover:bg-accent tap mt-10 px-5 py-3 transition-colors"
          >
            {upgrade.label}
          </button>
        ) : null}
      </Section>

      <Section id="projects" aria-label="Projects" className="py-12 sm:py-16 lg:py-20">
        <SectionMark index="02" label="Projects" className="mb-10 sm:mb-14" />
        <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Reveal>
                <Plate project={p} eager={i < 2} />
                <div className="border-line mt-4 flex items-baseline gap-5 border-t pt-3">
                  <span className="meta text-accent">{p.number}</span>
                  <span className="meta">{p.year}</span>
                  <span className="meta">{p.context ?? p.status}</span>
                </div>
                <h2 className="display-md mt-4">{p.name}</h2>
                <p className="text-muted mt-3 max-w-[44ch] text-[0.98rem] leading-relaxed">
                  {p.oneLiner}
                </p>
                <p className="meta mt-4">{p.tech.join(' / ')}</p>
                <div className="mt-5 flex flex-wrap gap-x-7 gap-y-1">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="meta text-fg hover:text-accent py-2 transition-colors"
                  >
                    Case study →
                  </Link>
                  {p.demo ? (
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="meta text-fg hover:text-accent py-2 transition-colors"
                    >
                      Live ↗
                    </a>
                  ) : null}
                  {p.github ? (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="meta text-fg hover:text-accent py-2 transition-colors"
                    >
                      GitHub ↗
                    </a>
                  ) : p.sourceNote ? (
                    <span className="meta py-2">{p.sourceNote}</span>
                  ) : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="capabilities" className="py-12 sm:py-16 lg:py-20">
        <SectionMark index="03" label="Design and code" className="mb-10 sm:mb-14" />
        <CapabilitiesBlock className="max-w-4xl" />
      </Section>

      <Section id="contact" className="py-12 pb-24 sm:py-16 sm:pb-32 lg:py-20 lg:pb-40">
        <SectionMark index="04" label="Contact" className="mb-10 sm:mb-14" />
        <ContactBlock />
      </Section>
    </div>
  );
}

/** The project's image in a 16:9 frame, framed the way the rest of the site frames it. */
function Plate({ project, eager }: { project: ExhibitProject; eager: boolean }) {
  const shot = project.shot;
  return (
    <Link
      href={`/projects/${project.slug}`}
      aria-label={`${project.name} — case study`}
      className="group block"
    >
      <div
        className={cn(
          'border-line group-hover:border-accent relative aspect-[16/9] overflow-hidden border transition-colors duration-500',
          shot?.fit === 'logo' ? 'bg-[#0a0a0a]' : 'bg-raise'
        )}
      >
        {shot ? (
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            loading={eager ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={cn(
              'transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]',
              shot.fit === 'logo'
                ? 'object-contain p-12'
                : shot.fit === 'contain'
                  ? 'object-contain p-3'
                  : 'object-cover'
            )}
          />
        ) : (
          <p className="font-display absolute inset-0 flex items-center p-8 text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.02] tracking-[-0.03em]">
            {project.poster ?? project.oneLiner}
          </p>
        )}
      </div>
    </Link>
  );
}
