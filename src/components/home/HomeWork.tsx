'use client';

import { useEffect, useState } from 'react';
import { Exhibition, ExhibitionShell } from '@/components/exhibition/Exhibition';
import type { ExhibitProject } from '@/components/exhibition/types';
import { TitleSlide } from './ProjectBrowser';

/**
 * The home page: the first screen, then the work.
 *
 * The first screen is the one the project browser always opened with, in the
 * same box, untouched. What follows it is the work section — the 3D walk
 * through the projects where the device can run it, the same projects as a
 * plain list where it can't. The page itself scrolls; nothing takes the wheel.
 */
export function HomeWork({ projects }: { projects: ExhibitProject[] }) {
  const armed = useArmed();

  return (
    <>
      {/* the box the old project browser gave this screen: a viewport tall, from the masthead down */}
      <div className="relative h-[100svh] overflow-hidden">
        <div className="absolute inset-0 isolate">
          <TitleSlide />
        </div>
      </div>

      <section id="work" aria-label="Work">
        {armed ? <Exhibition projects={projects} /> : <ExhibitionShell projects={projects} />}
      </section>
    </>
  );
}

/** Wait this long after the page has loaded before calling up the 3D. */
const SETTLE_MS = 1500;

/**
 * Set once the 3D has been called up in this tab. Coming back to the home page
 * from another page (the back button after a case study, say) then brings it
 * back at once, tall enough for the browser to return to where it was.
 */
let calledUp = false;

/**
 * Holds the 3D back until it is wanted: once the first screen has loaded and
 * had a moment to play, or sooner, the instant anyone starts to scroll. The
 * first screen is what a visitor meets, so it gets the network and the main
 * thread to itself; by the time they have read it the room is usually ready.
 */
function useArmed(): boolean {
  const [armed, setArmed] = useState(calledUp);

  useEffect(() => {
    if (calledUp) return;
    let timer = 0;
    let idle = 0;
    const arm = () => {
      calledUp = true;
      setArmed(true);
    };

    const settle = () => {
      timer = window.setTimeout(() => {
        if (typeof window.requestIdleCallback === 'function') {
          idle = window.requestIdleCallback(arm, { timeout: 2000 });
        } else {
          arm();
        }
      }, SETTLE_MS);
    };
    if (document.readyState === 'complete') settle();
    else window.addEventListener('load', settle, { once: true });

    const sooner = ['scroll', 'wheel', 'touchstart', 'keydown'] as const;
    const onIntent = () => arm();
    sooner.forEach((e) => window.addEventListener(e, onIntent, { passive: true, once: true }));

    return () => {
      window.clearTimeout(timer);
      if (idle && typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle);
      window.removeEventListener('load', settle);
      sooner.forEach((e) => window.removeEventListener(e, onIntent));
    };
  }, []);

  return armed;
}
