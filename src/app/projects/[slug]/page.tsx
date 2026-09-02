import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Globe } from 'lucide-react';
import { getProject, projects } from '@/data/projects';
import { Reveal } from '@/components/ui/Reveal';
import { buttonStyles } from '@/components/ui/Button';
import { GithubIcon } from '@/components/ui/BrandIcons';
import { site } from '@/lib/site';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Project not found' };

  const title = project.name === '[ADD PROJECT]' ? 'Project slot' : project.name;
  return {
    title,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${title} — ${site.name}`,
      description: project.tagline,
      url: `${site.url}/projects/${project.slug}`,
      type: 'article',
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const hasDemo = Boolean(project.links.demo);
  const hasRepo = Boolean(project.links.github);

  return (
    <article className="mx-auto max-w-4xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <Link
        href="/#work"
        className="text-muted hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        All work
      </Link>

      <Reveal className="mt-8">
        <div className="text-eyebrow flex flex-wrap items-center gap-3">
          <span className="text-accent">{project.number}</span>
          <span className="bg-border-strong h-px w-8" aria-hidden />
          <span>{project.year}</span>
          <span className="text-faint">·</span>
          <span>{project.status === 'placeholder' ? 'Open slot' : project.status}</span>
        </div>
        <h1 className="mt-5 text-[clamp(2rem,1.3rem+3.4vw,3.5rem)] leading-[1.05]">
          {project.name}
        </h1>
        <p className="text-muted mt-4 max-w-2xl text-lg leading-relaxed">{project.tagline}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          {hasDemo ? (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles('primary', 'md')}
            >
              <Globe className="size-4" />
              Live demo
            </a>
          ) : (
            <span className={buttonStyles('outline', 'md', 'pointer-events-none opacity-60')}>
              <Globe className="size-4" />
              Live demo — [ADD URL]
            </span>
          )}
          {hasRepo ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className={buttonStyles('outline', 'md')}
            >
              <GithubIcon className="size-4" />
              Source
            </a>
          ) : (
            <span className={buttonStyles('outline', 'md', 'pointer-events-none opacity-60')}>
              <GithubIcon className="size-4" />
              Source — [ADD REPO]
            </span>
          )}
        </div>
      </Reveal>

      <div className="mt-16 flex flex-col gap-14">
        <Block title="Overview">
          <p>{project.overview}</p>
        </Block>

        <div className="grid gap-10 sm:grid-cols-2">
          <Block title="Problem">
            <p>{project.problem}</p>
          </Block>
          <Block title="Approach">
            <p>{project.approach}</p>
          </Block>
        </div>

        <Block title="Features">
          <ul className="not-prose flex flex-col gap-4">
            {project.features.map((f) => (
              <li key={f.title} className="border-border border-l-2 pl-4">
                <p className="text-foreground font-medium">{f.title}</p>
                <p className="text-muted mt-1 text-sm leading-relaxed">{f.detail}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Technology">
          <div className="not-prose flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="border-border text-muted rounded-full border px-3 py-1.5 text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </Block>

        <Block title="Screenshots">
          <div className="not-prose grid gap-4 sm:grid-cols-2">
            {project.screenshots.map((shot, i) => (
              <figure key={i} className="flex flex-col gap-2">
                <div className="border-border bg-surface/40 grid-lines flex aspect-video items-center justify-center rounded-xl border">
                  <span className="text-faint font-mono text-xs">
                    {shot.caption ?? '[ADD SCREENSHOT]'}
                  </span>
                </div>
              </figure>
            ))}
          </div>
        </Block>

        <Block title="Architecture">
          <ul className="not-prose flex flex-col gap-3">
            {project.architecture.map((point, i) => (
              <li key={i} className="text-muted flex gap-3 text-sm leading-relaxed">
                <span className="text-accent font-mono">{String(i + 1).padStart(2, '0')}</span>
                {point}
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Challenges">
          <ul className="not-prose flex flex-col gap-4">
            {project.challenges.map((c) => (
              <li key={c.title} className="border-border border-l-2 pl-4">
                <p className="text-foreground font-medium">{c.title}</p>
                <p className="text-muted mt-1 text-sm leading-relaxed">{c.detail}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Outcome">
          <p>{project.outcome}</p>
        </Block>
      </div>

      <Reveal className="border-border-strong mt-16 flex flex-col items-start gap-4 rounded-2xl border p-8">
        <h2 className="text-xl tracking-tight">Want something like this?</h2>
        <p className="text-muted max-w-md text-sm leading-relaxed">
          I&rsquo;m open to opportunities and collaborations on AI products, web experiences and
          automation.
        </p>
        <Link href="/#contact" className={buttonStyles('primary', 'md', 'group')}>
          Get in touch
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal as="item">
      <h2 className="text-eyebrow mb-4">{title}</h2>
      <div className="text-foreground/90 max-w-2xl text-base leading-relaxed [&>p]:text-[1.02rem]">
        {children}
      </div>
    </Reveal>
  );
}
