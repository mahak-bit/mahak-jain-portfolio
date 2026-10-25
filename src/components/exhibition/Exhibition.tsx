'use client';

import { useState } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { chooseListView, useCapability } from '@/lib/useCapability';
import ExhibitionImmersive from './ExhibitionImmersive';
import { ExhibitionStatic } from './ExhibitionStatic';
import { BG } from './scene/shared';
import type { ExhibitProject } from './types';
import { WorkIntro } from './ui/Blocks';

/**
 * What stands in for the work until the device has been asked what it can do:
 * the server render, the first client render, and the moment before the 3D is
 * called up. A quiet screen with the heading on it, so the page doesn't flash a
 * layout it is about to leave. Without JavaScript the plain list is inside it.
 */
export function ExhibitionShell({ projects }: { projects: ExhibitProject[] }) {
  return (
    <div className="relative" style={{ backgroundColor: BG, minHeight: '100svh' }}>
      <div className="gutter-x mx-auto flex min-h-svh w-full max-w-[1500px] flex-col justify-end pt-24 pb-[108px]">
        <WorkIntro
          total={projects.length}
          className="max-w-[min(40%,34rem)] portrait:max-w-full"
          cue={false}
        />
      </div>
      <noscript>
        <ExhibitionStatic projects={projects} />
      </noscript>
    </div>
  );
}

/**
 * The work section, and which version of it a visitor gets.
 *
 * The 3D version needs WebGL2 on a real GPU and a visitor who hasn't asked for
 * less motion or for a plain page. Everyone else gets the list: the same
 * content, as an ordinary scrolling page.
 *
 * Reduced motion defaults to the list, with a button to explore in 3D anyway;
 * in that case the scene runs without easing, ambient drift or entrance.
 */
export function Exhibition({ projects }: { projects: ExhibitProject[] }) {
  const cap = useCapability();
  const reduced = useReducedMotion();
  const [optIn, setOptIn] = useState(false);

  if (cap === null) return <ExhibitionShell projects={projects} />;

  if (cap.ok && (!reduced || optIn)) {
    return <ExhibitionImmersive projects={projects} tier={cap.tier} reduced={reduced} />;
  }

  const canUpgrade = cap.ok || cap.reason === 'list-view';
  return (
    <ExhibitionStatic
      projects={projects}
      upgrade={
        canUpgrade
          ? {
              label: 'Explore in 3D',
              onClick: () => (reduced && cap.ok ? setOptIn(true) : chooseListView(false)),
            }
          : undefined
      }
    />
  );
}
