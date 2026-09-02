import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, projects, type Screenshot } from '@/data/projects';
import { Reveal } from '@/components/ui/Reveal';
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
  if (!project) return { title: 'Not found' };
  const title = project.name === '[ADD PROJECT]' ? 'Project slot' : project.name;
  return {
    title,
    description: project.oneLiner,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${title} — ${site.name}`,
      description: project.oneLiner,
      url: `${site.url}/projects/${project.slug}`,
      type: 'article',
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const isPlaceholder = project.status === 'placeholder';
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <Link
        href="/archive"
        className="text-muted hover:text-fg inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        ← The Archive
      </Link>

      <Reveal className="mt-10">
        <p className="kicker">
          {project.number} · {project.year} ·{' '}
          {isPlaceholder ? 'Open slot' : (project.context ?? project.status)}
        </p>
        <h1 className="mt-4 text-[clamp(2.2rem,1.5rem+3.6vw,3.8rem)] leading-[1.02]">
          {project.name}
        </h1>
        <p className="text-muted mt-4 max-w-xl text-[1.15rem] leading-snug">{project.oneLiner}</p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.9rem]">
          <LinkOrPlaceholder label="Live" href={project.links.demo} placeholder="[ADD LIVE URL]" />
          {project.links.github ? (
            <LinkOrPlaceholder label="Source" href={project.links.github} placeholder="" />
          ) : project.sourceNote ? (
            <span className="text-faint">{project.sourceNote}</span>
          ) : (
            <LinkOrPlaceholder label="Source" href={undefined} placeholder="[ADD REPO URL]" />
          )}
        </div>
      </Reveal>

      {/* Lead visual */}
      <Reveal delay={0.05} className="mt-12">
        <Shot shot={project.screenshots[0]} priority />
      </Reveal>

      {/* Story */}
      {!isPlaceholder && (
        <div className="mt-16 flex flex-col gap-12">
          <StoryBlock label="The problem" text={project.story.solving} />
          <StoryBlock label="What I built" text={project.story.built} />
          <StoryBlock label="What I learned" text={project.story.learned} />
        </div>
      )}

      {/* Deeper detail */}
      <div className="ruled mt-16 flex flex-col gap-14 pt-14">
        <Block label="Overview">
          <p>{project.caseStudy.overview}</p>
        </Block>

        <Block label="Features">
          <ul className="flex flex-col gap-4">
            {project.caseStudy.features.map((f) => (
              <li key={f.title} className="border-line border-l pl-4">
                <p className="text-fg font-medium">{f.title}</p>
                <p className="text-muted mt-1 text-[0.96rem] leading-relaxed">{f.detail}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block label="How it's put together">
          <ul className="flex flex-col gap-3">
            {project.caseStudy.architecture.map((point, i) => (
              <li key={i} className="text-muted flex gap-3 text-[0.96rem] leading-relaxed">
                <span className="text-accent font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                {point}
              </li>
            ))}
          </ul>
        </Block>

        <Block label="Challenges">
          <ul className="flex flex-col gap-4">
            {project.caseStudy.challenges.map((c) => (
              <li key={c.title} className="border-line border-l pl-4">
                <p className="text-fg font-medium">{c.title}</p>
                <p className="text-muted mt-1 text-[0.96rem] leading-relaxed">{c.detail}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block label="Where it landed">
          <p>{project.caseStudy.outcome}</p>
        </Block>

        {project.screenshots.length > 0 && (
          <Block label="Screens">
            <div className="grid gap-4 sm:grid-cols-2">
              {project.screenshots.map((shot, i) => (
                <Shot key={i} shot={shot} ratio="aspect-video" />
              ))}
            </div>
          </Block>
        )}
      </div>

      {/* Flip through the archive */}
      <nav
        className="border-line mt-16 flex items-stretch justify-between gap-4 border-t pt-10 text-sm"
        aria-label="Archive navigation"
      >
        {prev ? (
          <Link href={`/projects/${prev.slug}`} className="group flex-1">
            <span className="text-faint font-mono text-xs">← {prev.number}</span>
            <span className="group-hover:text-accent mt-1 block font-display text-lg transition-colors">
              {prev.name}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link href={`/projects/${next.slug}`} className="group flex-1 text-right">
            <span className="text-faint font-mono text-xs">{next.number} →</span>
            <span className="group-hover:text-accent mt-1 block font-display text-lg transition-colors">
              {next.name}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>

      <Reveal className="ruled mt-14 pt-14">
        <p className="font-display text-2xl">Want something like this?</p>
        <Link
          href="/#contact"
          className="border-fg hover:border-accent mt-3 inline-block border-b pb-0.5 text-[0.95rem] transition-colors"
        >
          Get in touch →
        </Link>
      </Reveal>
    </article>
  );
}

function Shot({
  shot,
  ratio,
  priority = false,
}: {
  shot?: Screenshot;
  ratio?: string;
  priority?: boolean;
}) {
  const fit = shot?.fit ?? 'cover';
  // A portrait / logo lead reads better in a squarer frame than a wide one.
  const frameRatio = ratio ?? (fit === 'cover' ? 'aspect-[16/10]' : 'aspect-[4/3]');
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border ${frameRatio} ${
        fit === 'logo' ? 'border-line bg-[#0a0a0a]' : 'border-line bg-raise'
      }`}
    >
      {shot?.src ? (
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 720px"
          className={
            fit === 'logo'
              ? 'object-contain p-10'
              : fit === 'contain'
                ? 'object-contain p-3'
                : 'object-cover'
          }
        />
      ) : (
        <span className="text-faint px-4 text-center font-mono text-xs">
          {shot?.caption ?? '[ADD SCREENSHOT]'}
        </span>
      )}
    </div>
  );
}

function LinkOrPlaceholder({
  label,
  href,
  placeholder,
}: {
  label: string;
  href?: string;
  placeholder: string;
}) {
  if (!href) {
    return (
      <span className="text-faint">
        {label} — {placeholder}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="border-fg hover:border-accent border-b pb-0.5 transition-colors"
    >
      {label} ↗
    </a>
  );
}

function StoryBlock({ label, text }: { label: string; text: string }) {
  return (
    <Reveal>
      <p className="kicker">{label}</p>
      <p className="mt-3 max-w-xl text-[1.1rem] leading-relaxed">{text}</p>
    </Reveal>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="kicker mb-4">{label}</p>
      <div className="prose-links text-fg/90 max-w-xl text-[1.02rem] leading-relaxed">{children}</div>
    </Reveal>
  );
}
