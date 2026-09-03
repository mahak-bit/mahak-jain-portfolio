'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';

/**
 * A small illustrated character that greets the visitor in the hero.
 *
 * The greeting (pop-in → look → smile → wave) lives in a short, muted, watermark-
 * free MP4 that plays once on load and once more on click/tap; afterwards she
 * holds the last frame with a barely-there idle float. No animation library —
 * just a <video> element, one CSS keyframe and a little local state.
 *
 * Reduced motion: renders the poster frame only — no video, no float, no
 * entrance transition; a tap still shows the "Hi!" bubble.
 */
const VIDEO_SRC = '/character/mahak-character.mp4';
const POSTER_SRC = '/character/mahak-character.jpg';

// Feathers the character's studio backdrop into the page background so she reads
// as standing in the hero rather than pasted onto it. Theme-aware via --bg.
const BACKDROP_BLEND =
  'radial-gradient(125% 90% at 50% 38%, transparent 40%, var(--bg) 88%)';

export function HeroCharacter() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const bubbleTimer = useRef<number | undefined>(undefined);
  const greeted = useRef(false);
  const [entered, setEntered] = useState(false);
  const [greeting, setGreeting] = useState(false);

  const flashBubble = useCallback(() => {
    setGreeting(true);
    window.clearTimeout(bubbleTimer.current);
    bubbleTimer.current = window.setTimeout(() => setGreeting(false), 2800);
  }, []);

  const playGreeting = useCallback(() => {
    greeted.current = true;
    const v = videoRef.current;
    if (v) {
      try {
        v.currentTime = 0;
        const p = v.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch {
        /* autoplay can be blocked — the poster stays, tap still works */
      }
    }
    window.setTimeout(flashBubble, 1300);
  }, [flashBubble]);

  // Enter just after mount so the character never competes with first paint.
  // If the tab loads in the background, hold the greeting until it's visible.
  useEffect(() => {
    const start = () => {
      setEntered(true);
      if (reduceMotion || greeted.current) return;
      if (document.visibilityState === 'hidden') return;
      playGreeting();
    };
    const t = window.setTimeout(start, reduceMotion ? 0 : 320);
    const onVisible = () => {
      if (document.visibilityState === 'visible') start();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [reduceMotion, playGreeting]);

  useEffect(() => () => window.clearTimeout(bubbleTimer.current), []);

  const onActivate = () => {
    if (reduceMotion) flashBubble();
    else playGreeting();
  };

  return (
    <div
      className={[
        'w-[clamp(128px,36vw,164px)] lg:w-[clamp(216px,18vw,264px)]',
        reduceMotion
          ? ''
          : [
              'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              entered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            ].join(' '),
      ].join(' ')}
      style={{ filter: 'drop-shadow(0 22px 34px rgba(0,0,0,0.28))' }}
    >
      <div
        className={
          !reduceMotion && entered
            ? 'relative motion-safe:animate-[char-float_6s_ease-in-out_infinite]'
            : 'relative'
        }
      >
        {/* Speech bubble — decorative, sits up by her waving hand */}
        <div
          aria-hidden="true"
          className={[
            'border-line bg-surface text-fg pointer-events-none absolute top-2 left-0 z-10 -translate-x-[18%] rounded-full border px-2.5 py-1 font-mono text-[0.72rem] shadow-sm transition-all duration-300 ease-out',
            greeting ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
          ].join(' ')}
        >
          Hi!&nbsp;<span aria-hidden="true">👋</span>
        </div>

        <button
          type="button"
          onClick={onActivate}
          aria-label="Mahak’s character — play the wave again"
          className="group relative block aspect-[4/5] w-full overflow-hidden rounded-[1.6rem] outline-offset-4 transition-transform duration-500 ease-out focus-visible:outline-2 focus-visible:outline-accent motion-safe:hover:-translate-y-1.5"
        >
          {reduceMotion ? (
            <Image
              src={POSTER_SRC}
              alt="A 3D-illustrated character of Mahak, smiling and waving hello"
              fill
              sizes="(min-width: 1024px) 264px, 164px"
              className="object-cover object-[center_top]"
            />
          ) : (
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              muted
              playsInline
              preload="none"
              aria-hidden="true"
              disablePictureInPicture
              className="h-full w-full object-cover object-[center_top]"
            />
          )}

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: BACKDROP_BLEND }}
          />
        </button>
      </div>
    </div>
  );
}
