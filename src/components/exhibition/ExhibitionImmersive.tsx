'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { chooseListView } from '@/lib/useCapability';
import type { Tier } from '@/lib/gpu';
import { cn } from '@/lib/utils';
import { SCENES, TOUR, wordsAt } from './timeline';
import { BG, resetRig } from './scene/shared';
import { exhibition, live, useExhibition } from './store';
import type { ExhibitProject } from './types';
import { CapabilitiesBlock, ContactBlock, ProjectCaption, WorkIntro } from './ui/Blocks';
import { DesignCodeControl, SceneNav } from './ui/Controls';
import { DetailPanel } from './ui/DetailPanel';
import { CardLabels, ProjectIndex } from './ui/ProjectLayer';

/** three.js and everything that draws with it arrive as their own chunk. */
const SceneRoot = dynamic(() => import('./scene/SceneRoot'), { ssr: false });

/** Where each scene is shown when you jump to it, as a point on the scroll. */
const JUMP_TO = { work: 0, projects: 0.245, skills: 0.72, contact: 1 } as const;

/**
 * The 3D work section: a tall track to scroll through, and inside it one stage
 * that stays put while the camera in the 3D scene does the travelling.
 *
 * Scrolling is left alone — it is ordinary page scrolling. The only thing done
 * with it is to read how far through the track we are, and hand that to the
 * camera. The words of each scene are real DOM laid over the canvas; the canvas
 * is decoration and is hidden from assistive technology, and everything it shows
 * is also reachable as text, links and buttons.
 */
export default function ExhibitionImmersive({
  projects,
  tier,
  reduced,
}: {
  projects: ExhibitProject[];
  tier: Tier;
  reduced: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const n = projects.length;

  const scene = useExhibition((s) => s.scene);
  const words = useExhibition((s) => s.words);
  const active = useExhibition((s) => s.active);
  const selected = useExhibition((s) => s.selected);
  const ready = useExhibition((s) => s.ready);

  const open = selected ? (projects.find((p) => p.slug === selected) ?? null) : null;
  const current = projects[Math.min(active, n - 1)];

  // one exhibition per page: start clean, and leave nothing behind
  useEffect(() => {
    exhibition.reset();
    resetRig();
    return () => {
      exhibition.reset();
      resetRig();
    };
  }, []);

  // scroll -> progress through the track, and which scene and project that is
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let queued = false;
    let raf = 0;

    const update = () => {
      queued = false;
      const rect = track.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -rect.top / range));
      live.progress = p;
      live.dirty = true;

      const sceneIndex =
        p < SCENES.projects.from
          ? 0
          : p < SCENES.capabilities.from
            ? 1
            : p < SCENES.contact.from
              ? 2
              : 3;
      const f = ((p - TOUR.from) / (TOUR.to - TOUR.from)) * (n - 1);
      exhibition.set({
        scene: sceneIndex,
        words: wordsAt(p),
        active: Math.min(n - 1, Math.max(0, Math.round(f))),
      });
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  // The stage is only worth drawing while a fair part of it is on screen. Scrolled
  // away, nothing is drawn, and a project left open is put back rather than left
  // behind. (The ratio is read, not isIntersecting, which is true for a single pixel.)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const watcher = new IntersectionObserver(
      (entries) => {
        // several can arrive at once; the last one is where things stand
        const inView = entries[entries.length - 1].intersectionRatio >= 0.2;
        exhibition.set(inView ? { inView } : { inView, selected: null });
      },
      { threshold: [0, 0.2] }
    );
    watcher.observe(stage);
    return () => watcher.disconnect();
  }, []);

  // a little parallax from a real mouse; touch and pen don't get one
  useEffect(() => {
    if (tier === 'mobile' || reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      live.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      live.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [tier, reduced]);

  const jump = useCallback(
    (id: 'work' | 'projects' | 'detail' | 'skills' | 'contact') => {
      if (id === 'detail') {
        exhibition.set({ selected: selected ?? current.slug });
        return;
      }
      const track = trackRef.current;
      if (!track) return;
      exhibition.set({ selected: null });
      const rect = track.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      window.scrollTo({
        top: window.scrollY + rect.top + JUMP_TO[id] * range,
        behavior: reduced ? 'auto' : 'smooth',
      });
    },
    [selected, current, reduced]
  );

  // The list is a good deal shorter than the track, so a visitor who was in the
  // scene is brought to the top of it rather than left part-way down.
  const showList = useCallback(() => {
    const watching = exhibition.get().inView;
    chooseListView(true);
    if (watching) window.setTimeout(() => document.getElementById('work')?.scrollIntoView(), 0);
  }, []);

  const veiled = open !== null;

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: tier === 'mobile' ? '640svh' : '600svh' }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-svh w-full overflow-hidden"
        style={{ backgroundColor: BG }}
        data-scene={scene}
      >
        <button
          type="button"
          onClick={showList}
          className="meta bg-bg text-fg border-line absolute top-24 left-[var(--gutter)] z-50 -translate-y-[400%] border px-4 py-3 focus-visible:translate-y-0"
        >
          Skip the 3D — see everything as a list
        </button>

        {/* early in the tab order: the projects are the point */}
        <ProjectIndex projects={projects} />

        <div
          aria-hidden
          className={cn(
            'absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none',
            ready ? 'opacity-100' : 'opacity-0'
          )}
        >
          <SceneRoot projects={projects} tier={tier} reduced={reduced} onContextLost={showList} />
        </div>

        <CardLabels projects={projects} />

        {/* A soft ground under the type, so a card passing beneath it never costs
            the words their legibility. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[190px] portrait:h-[46%]"
          style={{
            backgroundImage: `linear-gradient(to top, ${BG} 0%, ${BG} 40%, ${BG}d0 64%, ${BG}00)`,
          }}
        />
        <div
          aria-hidden
          data-on={words >= 0 && words <= 2 && !veiled}
          className="pointer-events-none absolute inset-y-0 left-0 z-[4] w-[56%] transition-opacity duration-700 data-[on=false]:opacity-0 portrait:hidden"
          style={{ backgroundImage: `linear-gradient(to right, ${BG}e6, ${BG}8c 55%, ${BG}00)` }}
        />

        <div className="gutter-x pointer-events-none absolute inset-0 z-10 pt-24 pb-[108px]">
          <div className="relative mx-auto h-full w-full max-w-[1500px]">
            <Block
              on={words === 0 && !veiled}
              className="bottom-0 left-0 max-w-[min(40%,34rem)] portrait:max-w-full"
            >
              <WorkIntro total={n} />
            </Block>

            <Block
              on={words === 1 && !veiled}
              className="bottom-0 left-0 max-w-[min(44%,30rem)] portrait:max-w-full"
            >
              <ProjectCaption project={current} total={n} />
            </Block>

            <Block
              on={words === 2 && !veiled}
              className="bottom-0 left-0 w-[min(54%,40rem)] portrait:w-full"
            >
              <CapabilitiesBlock />
            </Block>

            <Block
              on={words === 3 && !veiled}
              className="inset-0 flex items-center justify-center portrait:items-end"
            >
              <ContactBlock />
            </Block>

            {open ? (
              <DetailPanel
                project={open}
                total={n}
                className="absolute top-0 right-0 bottom-0 w-[min(31rem,40%)] portrait:inset-x-0 portrait:top-auto portrait:bottom-0 portrait:max-h-[52svh] portrait:w-full"
              />
            ) : null}
          </div>
        </div>

        <div className="gutter-x absolute inset-x-0 bottom-0 z-20 pb-3 sm:pb-4">
          <div className="mx-auto w-full max-w-[1500px]">
            <div className="flex items-center justify-between gap-4">
              <SceneNav onJump={jump} className="-ml-1.5" />
              <button
                type="button"
                onClick={showList}
                className="meta text-muted hover:text-fg tap pointer-events-auto shrink-0 py-2 transition-colors"
              >
                List view
              </button>
            </div>
            <DesignCodeControl />
          </div>
        </div>
      </div>
    </div>
  );
}

/** One scene's words: shown when its scene is current, inert and invisible otherwise. */
function Block({
  on,
  className,
  children,
}: {
  on: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-block=""
      data-on={on}
      inert={!on}
      className={cn(
        'absolute transition-[opacity,translate,visibility] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
        // the scene that is leaving goes quickly, and the one arriving waits a beat,
        // so two scenes' words are never on screen over each other
        'data-[on=false]:invisible data-[on=false]:translate-y-3 data-[on=false]:opacity-0 data-[on=false]:duration-200 data-[on=true]:delay-[240ms]',
        className
      )}
    >
      {children}
    </div>
  );
}
