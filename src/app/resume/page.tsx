import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Section, SectionMark, Chapter } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { PrintButton } from '@/components/PrintButton';
import { site } from '@/lib/site';
import {
  currentDirection,
  education,
  experience,
  focusAreas,
  hackathons,
  resumeHeader,
  resumeProjects,
  skillGroups,
  strengths,
  summary,
  type ResumeRole,
} from '@/data/resume';

export const metadata: Metadata = {
  title: 'Résumé',
  description:
    'Résumé — Mahak Jain, AI / Generative AI developer, full-stack developer and AI product builder based in Kota, Rajasthan.',
  alternates: { canonical: '/resume' },
  openGraph: {
    title: `Résumé — ${site.name}`,
    description:
      'Summary, technical skills, selected projects, experience and education.',
    url: `${site.url}/resume`,
    type: 'profile',
  },
};

/**
 * The résumé, on her own domain. It used to be a link out to a hosted artifact,
 * which framed the document in someone else's chrome and a sign-in prompt.
 *
 * Set in the site's own type rather than a document pastiche — no simulated A4
 * page, no drop shadow. It reads as part of the portfolio on screen, and the
 * print rules in globals.css turn it into a clean PDF via the browser's own
 * "Save as PDF", which is why there is no separate file to keep in sync.
 */
export default function ResumePage() {
  return (
    <Chapter tone="ivory">
      <Section id="resume">
        <SectionMark index="01" label="Résumé" />

        <Reveal className="mt-10 sm:mt-14">
          <h1 className="display-lg font-display">{resumeHeader.name}</h1>
          <p className="text-muted mt-4 max-w-[52ch] text-[clamp(0.98rem,0.9rem+0.3vw,1.15rem)] leading-relaxed">
            {resumeHeader.roles}
          </p>

          <div className="border-line mt-8 flex flex-wrap items-center gap-x-7 gap-y-2.5 border-t pt-5">
            <span className="meta">{resumeHeader.location}</span>
            <a
              href={`mailto:${resumeHeader.email}`}
              className="meta tap hover:text-accent transition-colors"
            >
              {resumeHeader.email}
            </a>
            {resumeHeader.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="meta tap hover:text-accent transition-colors"
              >
                {l.text}
                <span aria-hidden className="ml-1.5">
                  ↗
                </span>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 print:hidden">
            <PrintButton />
            <Link
              href="/contact"
              className="meta border-line hover:border-accent hover:text-accent border px-3 py-2 transition-colors"
            >
              Get in touch →
            </Link>
          </div>
        </Reveal>

        <Block index="02" title="Summary">
          <div className="flex max-w-[68ch] flex-col gap-4">
            {summary.map((p, i) => (
              <p key={i} className="text-fg text-[0.98rem] leading-[1.75]">
                {p}
              </p>
            ))}
          </div>
        </Block>

        <Block index="03" title="Technical Skills">
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {skillGroups.map((g) => (
              <div key={g.label} className="border-line border-t pt-4">
                <p className="meta text-accent mb-3">{g.label}</p>
                <p className="text-fg text-[0.94rem] leading-[1.7]">{g.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block index="04" title="Selected Projects">
          <div className="flex flex-col gap-10">
            {resumeProjects.map((p) => (
              <article key={p.title} className="border-line break-inside-avoid border-t pt-5">
                <h3 className="font-display text-fg text-[1.2rem] leading-tight">{p.title}</h3>
                <p className="meta text-accent mt-2.5">{p.stack}</p>
                <ul className="mt-4 flex max-w-[70ch] flex-col gap-2">
                  {p.points.map((pt, i) => (
                    <li
                      key={i}
                      className="text-fg relative pl-5 text-[0.94rem] leading-[1.65]"
                    >
                      <span aria-hidden className="text-line absolute left-0">
                        —
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                {p.link ? (
                  <p className="meta mt-4">
                    {p.link.label}
                    <span aria-hidden className="text-line mx-2">
                      /
                    </span>
                    <a
                      href={p.link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent underline decoration-dotted underline-offset-4 transition-colors"
                    >
                      {p.link.text} ↗
                    </a>
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </Block>

        <Block index="05" title="Experience">
          <div className="flex flex-col gap-10">
            {experience.map((r) => (
              <RoleEntry key={r.title} role={r} />
            ))}
          </div>
        </Block>

        {/* The role's own title is the section title here, so it is not
            repeated — only its tag line and points carry new information. */}
        <Block index="06" title="Hackathons & Building">
          <RoleEntry role={hackathons} showTitle={false} />
        </Block>

        <Block index="07" title="Education">
          <RoleEntry role={education} />
        </Block>

        <Block index="08" title="AI & Development Focus">
          <ul className="flex flex-wrap gap-x-3 gap-y-2.5">
            {focusAreas.map((f) => (
              <li
                key={f}
                className="border-line text-fg border px-3 py-1.5 text-[0.86rem] leading-none"
              >
                {f}
              </li>
            ))}
          </ul>
          <p className="meta text-accent mt-8 mb-2.5">Current direction</p>
          <p className="text-fg max-w-[68ch] text-[0.98rem] leading-[1.7]">{currentDirection}</p>
        </Block>

        <Block index="09" title="Professional Strengths">
          <ul className="flex flex-wrap gap-x-3 gap-y-2.5">
            {strengths.map((s) => (
              <li
                key={s}
                className="border-line text-fg border px-3 py-1.5 text-[0.86rem] leading-none"
              >
                {s}
              </li>
            ))}
          </ul>
        </Block>
      </Section>
    </Chapter>
  );
}

/**
 * One résumé section. The number and the heading share a single rule, so the
 * section name is stated once — the site's usual mark pairs an index with a
 * *different* phrase, which does not apply where the section name is the
 * heading.
 */
function Block({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal className="resume-block mt-20 break-inside-avoid sm:mt-24">
      <div className="border-line mb-9 flex items-baseline gap-5 border-t pt-4">
        <span className="meta text-accent">{index}</span>
        <h2 className="display-md font-display italic">{title}</h2>
      </div>
      {children}
    </Reveal>
  );
}

function RoleEntry({ role, showTitle = true }: { role: ResumeRole; showTitle?: boolean }) {
  return (
    <div className="border-line break-inside-avoid border-t pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1.5">
        {showTitle ? (
          <h3 className="font-display text-fg text-[1.2rem] leading-tight">{role.title}</h3>
        ) : null}
        <p className="meta text-accent">{role.period}</p>
      </div>
      {role.meta ? <p className="text-muted mt-2 text-[0.94rem]">{role.meta}</p> : null}
      {role.points.length > 0 ? (
        <ul className="mt-4 flex max-w-[70ch] flex-col gap-2">
          {role.points.map((pt, i) => (
            <li key={i} className="text-fg relative pl-5 text-[0.94rem] leading-[1.65]">
              <span aria-hidden className="text-line absolute left-0">
                —
              </span>
              {pt}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
