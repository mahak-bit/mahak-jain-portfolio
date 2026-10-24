import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { TemplateEntry } from '@/components/templates/TemplateEntry';
import { templates } from '@/data/templates';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Templates',
  description:
    'Website templates by Mahak Jain — one for a dermatology clinic, one for a restaurant. Both are live to explore.',
  alternates: { canonical: '/templates' },
  openGraph: {
    title: `Templates — ${site.name}`,
    description:
      'Website templates for local businesses, a clinic and a restaurant, both live to explore.',
    url: `${site.url}/templates`,
    type: 'website',
  },
};

/**
 * Templates are things you start from, not client work, so they sit on a page of
 * their own instead of among the projects. The layout is the archive's on
 * purpose (same rule, same plate, same rhythm) so it reads as part of the site.
 */
export default function TemplatesPage() {
  const count = templates.length;

  return (
    <div className="gutter-x mx-auto w-full max-w-[1500px] pt-24 pb-28 sm:pt-32">
      <div className="border-line flex items-baseline justify-between border-b pb-4">
        <Link href="/" className="meta tap hover:text-fg transition-colors">
          ← Work
        </Link>
        <span className="meta">
          {count} {count === 1 ? 'template' : 'templates'}
        </span>
      </div>

      <Reveal className="relative mt-14 sm:mt-20">
        {/* The count, set enormous and faint: texture, not text. */}
        <span
          aria-hidden
          className="text-fg font-display pointer-events-none absolute top-0 right-0 hidden leading-[0.8] tracking-tight opacity-[0.07] select-none lg:block"
          style={{ fontSize: 'clamp(9rem, 20vw, 22rem)' }}
        >
          {String(count).padStart(2, '0')}
        </span>
        <h1 className="display-xl">Templates</h1>
        <p className="text-muted mt-8 max-w-[42ch] text-[1.02rem] leading-relaxed">
          Website templates for local businesses. Each one is live &mdash; open it and click around.
        </p>
      </Reveal>

      <div className="mt-20 flex flex-col gap-24 sm:mt-28 sm:gap-36">
        {templates.map((template, i) => (
          <TemplateEntry key={template.slug} template={template} flip={i % 2 === 1} />
        ))}
      </div>

      <div className="border-line mt-28 border-t pt-10">
        <Link
          href="/contact"
          className="group border-line hover:border-accent inline-flex items-baseline gap-4 border-b pb-2 transition-colors"
        >
          <span className="display-md group-hover:text-accent transition-colors">
            Start a conversation
          </span>
          <span
            aria-hidden
            className="text-faint group-hover:text-accent text-sm transition-[color,transform] duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
