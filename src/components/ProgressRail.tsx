'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const SECTIONS: { id: string; label: string }[] = [
  { id: 'ask', label: 'Ask' },
  { id: 'work', label: 'Archive' },
  { id: 'about', label: 'About' },
  { id: 'now', label: 'Now' },
  { id: 'skills', label: 'Tools' },
  { id: 'log', label: 'Log' },
  { id: 'more', label: 'More' },
  { id: 'contact', label: 'Contact' },
];

export function ProgressRail() {
  const pathname = usePathname();
  const [active, setActive] = useState<string>('ask');

  useEffect(() => {
    if (pathname !== '/') return;

    function onScroll() {
      const line = window.innerHeight * 0.35;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      setActive(current);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  if (pathname !== '/') return null;

  return (
    <nav
      aria-label="Section progress"
      className="group fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 min-[1440px]:flex"
    >
      {SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex items-center gap-3"
            aria-current={on ? 'true' : undefined}
          >
            <span
              className={cn(
                'block h-px transition-all duration-300',
                on ? 'bg-fg w-8' : 'bg-line w-4 group-hover:w-6'
              )}
            />
            <span
              className={cn(
                'font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-opacity duration-200',
                on
                  ? 'text-fg opacity-100'
                  : 'text-faint opacity-0 group-hover:opacity-100'
              )}
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
