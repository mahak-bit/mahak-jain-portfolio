'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems, site } from '@/lib/site';
import { IndiaClock } from './IndiaClock';

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // The home page is a fixed-viewport browser — there is nothing to scroll to.
  if (pathname === '/') return null;

  return (
    <footer className="chapter-dark">
      <div className="gutter-x mx-auto w-full max-w-[1500px] py-16 sm:py-20">
        {/* The name, one last time, at full size. */}
        <p className="display-xl">Mahak Jain</p>

        <div className="border-line mt-14 grid grid-cols-12 gap-x-4 gap-y-10 border-t pt-8">
          <div className="col-span-12 sm:col-span-3">
            <p className="meta mb-3">Index</p>
            <nav className="flex flex-col gap-1.5" aria-label="Footer">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-fg hover:text-accent text-[0.94rem] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-12 sm:col-span-3">
            <p className="meta mb-3">Elsewhere</p>
            <div className="flex flex-col gap-1.5">
              <a
                href={`mailto:${site.email}`}
                className="text-fg hover:text-accent text-[0.94rem] transition-colors"
              >
                Email ↗
              </a>
              {site.socials.github && (
                <a
                  href={site.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg hover:text-accent text-[0.94rem] transition-colors"
                >
                  GitHub ↗
                </a>
              )}
              {site.socials.linkedin && (
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-fg hover:text-accent text-[0.94rem] transition-colors"
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <p className="meta mb-3">Colophon</p>
            <dl className="text-muted grid gap-x-6 gap-y-2 text-[0.86rem] sm:grid-cols-2">
              <div>
                <dt className="meta mb-1">Type</dt>
                <dd>Playfair Display, Hanken Grotesk, JetBrains Mono</dd>
              </div>
              <div>
                <dt className="meta mb-1">Built</dt>
                <dd>
                  Next.js, by hand, on Vercel —{' '}
                  <a
                    href="https://github.com/mahak-bit/mahak-jain-portfolio"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent underline decoration-dotted underline-offset-2"
                  >
                    source ↗
                  </a>
                </dd>
              </div>
              <div>
                <dt className="meta mb-1">Tracking</dt>
                <dd>None. No analytics, no cookies.</dd>
              </div>
              <div>
                <dt className="meta mb-1">Clock</dt>
                <dd>
                  <IndiaClock />
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="border-line mt-12 flex items-baseline justify-between border-t pt-5">
          <p className="meta">© {year} {site.name}</p>
          <p className="meta">{site.location}</p>
        </div>
      </div>
    </footer>
  );
}
