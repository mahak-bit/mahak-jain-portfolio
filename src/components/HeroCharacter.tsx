'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';

/**
 * A small illustrated character that greets the visitor in the hero.
 *
 * The greeting (pop-in → look → smile → wave) is a short, muted clip with the
 * studio background cut out. It plays once on load and once more on click/tap,
 * then holds the last frame with a barely-there idle float. No animation
 * library — a <video> element, one CSS keyframe and a little state.
 *
 * She ships twice. The WebM is a true cutout (VP9 with an alpha channel), so
 * where it plays the page grid and grain run behind her with no panel at all.
 * Safari can't decode VP9 alpha, so it falls back to an MP4 pre-composited on
 * #f7f5f0 — the ivory token exactly — which is an opaque rectangle, and gets a
 * stronger radial feather to dissolve its edges. Reduced motion: the
 * transparent poster only — no video, no float, no entrance; a tap still
 * shows the "Hi!" bubble.
 */
const WEBM_SRC = '/character/mahak-character.webm';
const MP4_SRC = '/character/mahak-character-light.mp4';
const POSTER_SRC = '/character/mahak-character.webp';

/** Cutout: only the mid-thigh crop needs softening. */
const FADE_ALPHA = 'linear-gradient(to bottom, #000 78%, rgba(0, 0, 0, 0) 100%)';

/**
 * Composited fallback: the edges have to dissolve or the rectangle shows. The
 * radius has to sit near 50% of the box — anything wider leaves the edges
 * inside the opaque stop, which is exactly how the visible panel got shipped.
 */
const FADE_OPAQUE =
  'radial-gradient(ellipse 58% 60% at 50% 44%, #000 30%, rgba(0, 0, 0, 0) 100%)';

export function HeroCharacter() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const bubbleTimer = useRef<number | undefined>(undefined);
  const greeted = useRef(false);
  const [entered, setEntered] = useState(false);
  const [greeting, setGreeting] = useState(false);
  // Assume the cutout until we learn otherwise, so the common path never
  // flashes the heavier mask.
  const [alphaOk, setAlphaOk] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const v = document.createElement('video');
      setAlphaOk(v.canPlayType('video/webm; codecs="vp9"') !== '');
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

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
        'w-[clamp(146px,42vw,186px)] lg:w-[clamp(264px,25vw,352px)]',
        reduceMotion
          ? ''
          : [
              'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              entered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            ].join(' '),
      ].join(' ')}
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
            'border-line bg-surface text-fg pointer-events-none absolute top-1 left-0 z-10 -translate-x-[14%] border px-2.5 py-1 font-mono text-[0.7rem] transition-all duration-300 ease-out',
            greeting ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
          ].join(' ')}
        >
          Hi!&nbsp;<span aria-hidden="true">👋</span>
        </div>

        <button
          type="button"
          onClick={onActivate}
          aria-label="Mahak’s character — play the wave again"
          className="group relative block aspect-[4/5] w-full outline-offset-4 transition-transform duration-500 ease-out focus-visible:outline-2 focus-visible:outline-accent motion-safe:hover:-translate-y-1.5"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={
              reduceMotion || alphaOk
                ? { maskImage: FADE_ALPHA, WebkitMaskImage: FADE_ALPHA }
                : { maskImage: FADE_OPAQUE, WebkitMaskImage: FADE_OPAQUE }
            }
          >
            {reduceMotion ? (
              <Image
                src={POSTER_SRC}
                alt="A 3D-illustrated character of Mahak, smiling and waving hello"
                fill
                sizes="(min-width: 1024px) 352px, 186px"
                className="object-cover object-[center_top]"
              />
            ) : (
              <video
                ref={videoRef}
                poster={POSTER_SRC}
                muted
                playsInline
                preload="none"
                aria-hidden="true"
                disablePictureInPicture
                className="h-full w-full object-cover object-[center_top]"
              >
                {/* the true cutout first; the composited rectangle only if
                    the browser can't decode VP9 alpha */}
                <source src={WEBM_SRC} type="video/webm" />
                <source src={MP4_SRC} type="video/mp4" />
              </video>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
