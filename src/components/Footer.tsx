import Link from 'next/link';
import { navItems, site } from '@/lib/site';

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
        </nav>
      </div>

      <div className="text-faint mt-10 flex flex-col gap-1 text-xs sm:flex-row sm:justify-between">
        <p>Built by hand with Next.js and too many small revisions.</p>
        <p>© {year} Mahak Jain</p>
      </div>
    </footer>
  );
}
