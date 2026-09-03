/**
 * One collage beat — a torn strip of paper laid across the page, with a fading
 * cut of the site's halftone screen printed through it and a soft shadow so it
 * reads as pasted on top. Used once, as the divider between the work and the
 * "about" half of the page. Purely decorative.
 */

// An irregular deckle: torn along the top and bottom, straight down the sides.
const TORN =
  'polygon(0% 14.5%, 3.8% 14%, 7.7% 12.2%, 11.5% 12.1%, 15.4% 11.4%, 19.2% 21.7%, 23.1% 29.5%, 26.9% 8.5%, 30.8% 12.3%, 34.6% 11.8%, 38.5% 10.8%, 42.3% 15.5%, 46.2% 17%, 50% 19.2%, 53.8% 17.6%, 57.7% 10.9%, 61.5% 12.9%, 65.4% 21.1%, 69.2% 16%, 73.1% 19.2%, 76.9% 17.9%, 80.8% 13.2%, 84.6% 21.6%, 88.5% 19.9%, 92.3% 15.6%, 96.2% 14.6%, 100% 14.5%, 100% 90.3%, 96.2% 86.4%, 92.3% 79.5%, 88.5% 86%, 84.6% 86.4%, 80.8% 82.7%, 76.9% 80.4%, 73.1% 77.1%, 69.2% 81.2%, 65.4% 81.5%, 61.5% 79.8%, 57.7% 87.3%, 53.8% 75.8%, 50% 68.6%, 46.2% 76.1%, 42.3% 83.1%, 38.5% 88.6%, 34.6% 79.3%, 30.8% 85.2%, 26.9% 86%, 23.1% 76.3%, 19.2% 82.5%, 15.4% 78%, 11.5% 87.4%, 7.7% 80.1%, 3.8% 91.4%, 0% 78.4%)';

// Dots dense through the middle, gone by the torn edges — a halftone fade.
const DOT_FADE =
  'linear-gradient(to bottom, transparent 6%, #000 28%, #000 72%, transparent 94%)';

export function SectionBreak() {
  return (
    <div
      aria-hidden="true"
      className="relative -my-4 h-32 w-full overflow-x-clip select-none sm:-my-6 sm:h-44"
    >
      <div
        className="bg-raise absolute inset-0"
        style={{
          clipPath: TORN,
          filter: 'drop-shadow(0 6px 11px rgba(0, 0, 0, 0.18))',
        }}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ maskImage: DOT_FADE, WebkitMaskImage: DOT_FADE }}
        >
          <div
            className="absolute inset-[-35%]"
            style={{
              backgroundImage:
                'radial-gradient(circle, var(--fg) 1.5px, transparent 1.7px)',
              backgroundSize: '6px 6px',
              opacity: 0.2,
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
