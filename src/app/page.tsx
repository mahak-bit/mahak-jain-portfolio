'use client';

import { Intro } from '@/components/Intro';
import { ProjectBrowser } from '@/components/home/ProjectBrowser';

/**
 * The home page is the work itself — a full-screen browser, one project per
 * screen. Everything else lives at /about, /contact and /archive.
 */
export default function HomePage() {
  return (
    <>
      <Intro />
      <ProjectBrowser />
    </>
  );
}
