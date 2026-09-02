import Link from 'next/link';
import { Mail } from 'lucide-react';
import { navItems, site } from '@/lib/site';
import { GithubIcon, LinkedinIcon } from './ui/BrandIcons';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border mt-8 border-t">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div>
            <p className="font-mono text-sm font-semibold tracking-tight">MAHAK JAIN</p>
            <p className="text-muted mt-1 text-sm">AI Engineer · Creative Technologist</p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${item.href}`}
                className="text-muted hover:text-foreground text-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-3">
            <SocialLink href={site.socials.github || undefined} label="GitHub" icon={GithubIcon} />
            <SocialLink
              href={site.socials.linkedin || undefined}
              label="LinkedIn"
              icon={LinkedinIcon}
            />
            <SocialLink href={`mailto:${site.email}`} label="Email" icon={Mail} />
          </div>
        </div>

        <div className="border-border text-faint mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:justify-between">
          <p>Built with Next.js, TypeScript &amp; curiosity.</p>
          <p>© {year} Mahak Jain</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  if (!href) {
    return (
      <span
        title={`[ADD ${label.toUpperCase()}]`}
        className="border-border text-faint inline-flex size-9 items-center justify-center rounded-full border border-dashed"
        aria-label={`${label} link not set yet`}
      >
        <Icon className="size-4" />
      </span>
    );
  }
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      aria-label={label}
      className="border-border-strong text-muted hover:text-foreground hover:bg-surface-2 inline-flex size-9 items-center justify-center rounded-full border transition-colors"
    >
      <Icon className="size-4" />
    </a>
  );
}
