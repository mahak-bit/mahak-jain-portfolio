'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Template, TemplateVariant } from '@/data/templates';
import { cn } from '@/lib/utils';

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]';

/** Relative luminance of a #rrggbb colour, 0 (black) to 1 (white). */
function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * The stage behind a preview: the variant's own colour, with a little shading
 * for depth. The captions on it are set in `ink`, so the shading is only ever
 * allowed to move the stage AWAY from the ink: a light-ink stage falls off
 * towards darker, a dark-ink stage is lit from the top left. A highlight on a
 * stage that carries light text would quietly erode its contrast, which is how
 * the first version of this slipped under 4.5:1.
 *
 * A translucent overlay on a solid colour, rather than a mixed gradient, so an
 * older browser still gets the colour.
 */
function stageStyle(variant: TemplateVariant) {
  const shade =
    luminance(variant.ink) > 0.4
      ? 'linear-gradient(150deg, rgba(0,0,0,0), rgba(0,0,0,0.3))'
      : 'radial-gradient(120% 90% at 18% 0%, rgba(255,255,255,0.22), rgba(255,255,255,0) 58%)';
  return { backgroundColor: variant.stage, backgroundImage: shade };
}

/**
 * The plate and the words beside it. It is a client component for one reason:
 * a template with more than one theme lets you switch between them, and the
 * stage, the previews and the swatches all follow that one choice.
 *
 * Every theme's previews are stacked in the stage and cross-faded, rather than
 * swapped, so a switch is instant and nothing pops. They load lazily with the
 * stage, so a visitor never waits on one.
 *
 * The whole stage is a link to the live site, but it is hidden from assistive
 * tech and out of the tab order: the button in the text column is the same link
 * with a proper name, and two adjacent links to one place only add noise.
 */
export function TemplateShowcase({ template, flip }: { template: Template; flip: boolean }) {
  const [activeId, setActiveId] = useState(template.variants[0].id);
  const active = template.variants.find((v) => v.id === activeId) ?? template.variants[0];
  const themed = template.variants.length > 1;

  return (
    <div className="mt-8 grid gap-x-10 gap-y-8 sm:mt-10 md:grid-cols-12 md:items-end">
      <div className={cn('md:col-span-7', flip && 'md:order-2 md:col-start-6')}>
        <a
          href={template.links.preview}
          target="_blank"
          rel="noreferrer"
          aria-hidden="true"
          tabIndex={-1}
          className="group/stage border-line relative isolate block aspect-[5/4] overflow-hidden border md:aspect-[4/3]"
        >
          {template.variants.map((variant) => (
            <div
              key={variant.id}
              style={stageStyle(variant)}
              className={cn(
                'absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none',
                variant.id === active.id ? 'opacity-100' : 'pointer-events-none opacity-0'
              )}
            >
              {/* a mat line inside the edge, in the variant's own ink */}
              <span
                aria-hidden
                className="absolute inset-3 border sm:inset-4"
                style={{ borderColor: variant.ink, opacity: 0.2 }}
              />
              <Devices variant={variant} host={template.host} />
            </div>
          ))}

          <span
            className="meta absolute top-4 left-5 z-10 flex items-center gap-2 transition-colors duration-700 sm:top-5 sm:left-6"
            style={{ color: active.ink }}
          >
            <span aria-hidden className="size-1.5 rounded-full bg-current" />
            Live
          </span>
          <span
            className="meta absolute bottom-4 left-5 z-10 transition-colors duration-700 sm:bottom-5 sm:left-6"
            style={{ color: active.ink }}
          >
            Open the live site{' '}
            <span
              aria-hidden
              className={cn(
                'inline-block transition-transform duration-500 group-hover/stage:translate-x-0.5 group-hover/stage:-translate-y-0.5',
                EASE
              )}
            >
              ↗
            </span>
          </span>
        </a>
      </div>

      <div className={cn('md:col-span-5', flip && 'md:order-1 md:col-start-1 md:row-start-1')}>
        <h2 id={`template-${template.slug}`} className="display-lg">
          {template.name}
        </h2>
        <p className="text-muted mt-6 max-w-[40ch] text-[1rem] leading-relaxed">
          {template.oneLiner}
        </p>

        <a
          href={template.links.preview}
          target="_blank"
          rel="noreferrer"
          aria-label={`Live preview of ${template.name} (opens in a new tab)`}
          className="meta bg-fg text-bg hover:bg-accent group mt-8 inline-flex items-center gap-3 px-5 py-3 transition-colors duration-300"
        >
          Live preview
          <span
            aria-hidden
            className={cn(
              'inline-block transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
              EASE
            )}
          >
            ↗
          </span>
        </a>

        {themed ? (
          <div className="mt-10">
            <p className="meta mb-3.5">Themes</p>
            <div
              role="group"
              aria-label={`${template.name} themes`}
              className="flex flex-wrap gap-2.5"
            >
              {template.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  aria-pressed={variant.id === active.id}
                  onClick={() => setActiveId(variant.id)}
                  className="border-line hover:border-fg aria-[pressed=true]:border-fg aria-[pressed=true]:bg-surface inline-flex min-h-11 items-center gap-3 border py-2 pr-4 pl-2.5 transition-colors"
                >
                  <Swatches colors={variant.colors} />
                  <span className="meta text-fg">{variant.label}</span>
                </button>
              ))}
            </div>
            <p aria-live="polite" className="text-muted mt-4 text-[0.92rem] leading-relaxed">
              <span className="text-fg">{active.label}</span> &mdash; {active.note}
            </p>
            <Hex colors={active.colors} />
          </div>
        ) : (
          <div className="mt-10">
            <p className="meta mb-3.5">Palette</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Swatches colors={active.colors} />
              <span className="meta text-muted">{active.names}</span>
            </div>
            <Hex colors={active.colors} />
          </div>
        )}
      </div>
    </div>
  );
}

function Swatches({ colors }: { colors: string[] }) {
  return (
    <span aria-hidden className="flex shrink-0">
      {colors.map((color, i) => (
        <span
          key={color}
          className={cn('border-line block size-6 border', i > 0 && '-ml-px')}
          style={{ backgroundColor: color }}
        />
      ))}
    </span>
  );
}

function Hex({ colors }: { colors: string[] }) {
  return (
    <p className="text-muted mt-2 font-mono text-[0.68rem] tracking-[0.06em] uppercase">
      {colors.join(' · ')}
    </p>
  );
}

/**
 * A browser and a phone, set on the stage. The frames are deliberately plain:
 * a title bar with the real address, a bezel. The template is the subject.
 * On hover the two lift by different amounts, which is the whole of the motion.
 */
function Devices({ variant, host }: { variant: TemplateVariant; host: string }) {
  const { desktop, mobile } = variant;

  return (
    <>
      <div
        className={cn(
          'absolute top-[12%] left-[7%] w-[76%] transition-transform duration-700 motion-safe:group-hover/stage:-translate-y-1.5',
          EASE
        )}
      >
        <div className="overflow-hidden rounded-[0.4rem] bg-[#fbfaf7] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55),0_0_0_1px_rgba(0,0,0,0.14)] sm:rounded-lg">
          <div className="relative flex h-[1.1rem] items-center gap-[0.2rem] border-b border-black/10 bg-[#efede8] px-2 sm:h-6 sm:gap-1.5 sm:px-3">
            <span aria-hidden className="size-1 rounded-full bg-black/25 sm:size-[0.4rem]" />
            <span aria-hidden className="size-1 rounded-full bg-black/25 sm:size-[0.4rem]" />
            <span aria-hidden className="size-1 rounded-full bg-black/25 sm:size-[0.4rem]" />
            <span
              aria-hidden
              className="absolute inset-x-0 mx-auto hidden w-fit font-mono text-[0.58rem] tracking-[0.04em] text-black/45 sm:block"
            >
              {host}
            </span>
          </div>
          <Image
            src={desktop.src}
            width={desktop.width}
            height={desktop.height}
            alt={desktop.alt}
            sizes="(min-width: 768px) 40vw, 72vw"
            className="block h-auto w-full"
          />
        </div>
      </div>

      <div
        className={cn(
          'absolute right-[6%] bottom-[8%] w-[21%] transition-transform duration-700 motion-safe:group-hover/stage:-translate-y-3',
          EASE
        )}
      >
        <div className="rounded-[0.9rem] bg-[#15120f] p-[0.2rem] shadow-[0_30px_50px_-18px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.14)] sm:rounded-[1.4rem] sm:p-[0.32rem]">
          <div className="overflow-hidden rounded-[0.7rem] sm:rounded-[1.1rem]">
            <Image
              src={mobile.src}
              width={mobile.width}
              height={mobile.height}
              alt={mobile.alt}
              sizes="(min-width: 768px) 12vw, 21vw"
                className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
