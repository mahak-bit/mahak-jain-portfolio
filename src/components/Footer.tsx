import Link from 'next/link';
import { navItems, site } from '@/lib/site';
import { IndiaClock } from './IndiaClock';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-line mx-auto max-w-5xl border-t px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl">Mahak Jain</p>
          <p className="text-faint mt-1 font-mono text-xs uppercase tracking-[0.12em]">
            AI Engineer · Creative Technologist
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-1" aria-label="Footer">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              className="text-muted hover:text-fg text-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {site.socials.github && (
            <a
              href={site.socials.github}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-fg text-sm transition-colors"
            >
              GitHub ↗
            </a>
          )}
          {site.socials.linkedin && (
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-fg text-sm transition-colors"
            >
              LinkedIn ↗
            </a>
          )}
        </nav>
      </div>

      {/* Colophon */}
      <dl className="border-line text-faint mt-10 grid gap-x-8 gap-y-2 border-t pt-6 text-xs sm:grid-cols-2">
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 font-mono uppercase tracking-[0.1em]">Type</dt>
          <dd>Fraunces, Hanken Grotesk & JetBrains Mono</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 font-mono uppercase tracking-[0.1em]">Built</dt>
          <dd>
            Next.js, by hand, on Vercel —{' '}
            <a
              href="https://github.com/mahak-bit/mahak-jain-portfolio"
              target="_blank"
              rel="noreferrer"
              className="hover:text-fg underline decoration-dotted underline-offset-2"
            >
              source ↗
            </a>
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 font-mono uppercase tracking-[0.1em]">Tracking</dt>
          <dd>None. No analytics, no cookies.</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-14 shrink-0 font-mono uppercase tracking-[0.1em]">Clock</dt>
          <dd>
            <IndiaClock />
          </dd>
        </div>
      </dl>

      <p className="text-faint mt-8 text-xs">© {year} Mahak Jain</p>
    </footer>
  );
}
