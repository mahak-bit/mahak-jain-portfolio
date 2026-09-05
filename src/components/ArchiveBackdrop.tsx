'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * A quiet moving backdrop for the Archive section — a desaturated collage of
 * code, megaphones and torn paper, drifting on a slow push-in/push-out loop.
 *
 * It is decoration, never content: heavily scrimmed with the page's own
 * background colour so the folder and its type stay dominant, and masked to
 * fade out at the top and bottom so it dissolves into the page rather than
 * reading as a pasted-in band. Only plays while the section is on screen.
 * Reduced motion gets the still frame.
 */
const VIDEO_SRC = '/archive/archive-bg.mp4';
const POSTER_SRC = '/archive/archive-bg.jpg';

/**
 * Dissolves the top and bottom edges so the band has no hard seam. The
 * transparent run at the top is measured, not decorative: it keeps the video
 * entirely clear of the "The archive" kicker (which lands 86–136px in,
 * depending on viewport) so the label's contrast is exactly what it is
 * everywhere else on the site.
 */
const EDGE_FADE =
  'linear-gradient(to bottom, transparent 0, transparent 150px, #000 260px, #000 calc(100% - 80px), transparent 100%)';

export function ArchiveBackdrop() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only run the video while the section is actually on screen.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const play = () => {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    if (typeof IntersectionObserver === 'undefined') {
      play();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else v.pause();
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
    >
      {reduceMotion ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={POSTER_SRC}
          alt=""
          className="h-full w-full object-cover opacity-[0.25] dark:opacity-[0.40]"
        />
      ) : (
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          className="h-full w-full object-cover opacity-[0.25] dark:opacity-[0.40]"
        />
      )}

      {/* Scrim in the page's own background colour — keeps the type dominant. */}
      <div className="bg-bg/45 absolute inset-0" />
    </div>
  );
}
