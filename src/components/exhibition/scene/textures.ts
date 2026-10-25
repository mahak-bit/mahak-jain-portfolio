import { CanvasTexture, LinearMipmapLinearFilter, SRGBColorSpace } from 'three';
import { bare, type ExhibitProject } from '../types';

/**
 * The two faces of every card, drawn to canvases and handed to the GPU.
 *
 * DESIGN is the work as a visitor sees it: the real screenshot, framed exactly
 * as it is framed on the rest of the site (cover, contain, or a logo on its
 * dark panel), or a typographic panel where a project has no image. CODE is the
 * same project as a spec sheet — its stack, its year, where the source and the
 * live site are — set in the site's own mono and serif faces. Every word on it
 * is read from the project data.
 */

export interface Fonts {
  display: string;
  mono: string;
  sans: string;
}

/** The site's real font stacks, as next/font resolved them. */
export function readFonts(): Fonts {
  const cs = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  return {
    display: read('--font-display', 'Georgia, serif'),
    mono: read('--font-mono', 'ui-monospace, monospace'),
    sans: read('--font-sans', 'system-ui, sans-serif'),
  };
}

/** Make sure the faces are actually loaded before text is painted with them. */
export async function loadFonts(fonts: Fonts) {
  if (!('fonts' in document)) return;
  try {
    await Promise.all([
      document.fonts.load(`400 40px ${fonts.display}`),
      document.fonts.load(`500 20px ${fonts.mono}`),
      document.fonts.load(`400 20px ${fonts.sans}`),
    ]);
  } catch {
    /* fall back to whatever is installed; the card still reads */
  }
}

const INK = '#151515';
const IVORY = '#f2efe9';
const FAINT = '#a5a099';
const BLUE = '#7d9bff';

function toTexture(canvas: HTMLCanvasElement, anisotropy: number): CanvasTexture {
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  return tex;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });
}

function setSpacing(ctx: CanvasRenderingContext2D, em: number, size: number) {
  if ('letterSpacing' in ctx)
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${em * size}px`;
}

/** Break `text` into lines no wider than `max`, at spaces. */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function makeDesignFace(
  p: ExhibitProject,
  width: number,
  anisotropy: number,
  fonts: Fonts
): Promise<CanvasTexture> {
  const W = width;
  const H = Math.round((width * 9) / 16);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';

  if (p.shot) {
    const img = await loadImage(p.shot.src);
    const fit = p.shot.fit;
    if (fit === 'cover') {
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    } else {
      // contain: a neutral panel for photographs, a dark one for marks
      ctx.fillStyle = fit === 'logo' ? '#0a0a0a' : '#edeae3';
      ctx.fillRect(0, 0, W, H);
      const pad = fit === 'logo' ? H * 0.16 : H * 0.03;
      const s = Math.min((W - pad * 2) / img.naturalWidth, (H - pad * 2) / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    }
  } else {
    // no screenshot yet: the project's own line, set as a poster
    const u = W / 1280;
    ctx.fillStyle = '#edeae3';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = INK;
    ctx.textBaseline = 'alphabetic';
    ctx.font = `400 ${86 * u}px ${fonts.display}`;
    const lines = wrap(ctx, p.poster ?? p.oneLiner, W - 160 * u).slice(0, 4);
    lines.forEach((line, i) => ctx.fillText(line, 80 * u, 200 * u + i * 92 * u));
    ctx.font = `500 ${22 * u}px ${fonts.mono}`;
    ctx.fillStyle = '#726e67';
    setSpacing(ctx, 0.12, 22 * u);
    ctx.fillText(p.tech.join(' / ').toUpperCase(), 80 * u, H - 70 * u);
  }

  return toTexture(canvas, anisotropy);
}

export function makeCodeFace(
  p: ExhibitProject,
  total: number,
  width: number,
  anisotropy: number,
  fonts: Fonts
): CanvasTexture {
  const W = width;
  const H = Math.round((width * 9) / 16);
  const u = W / 1280;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);

  const left = 72 * u;
  const right = W - 72 * u;
  const rule = (y: number) => {
    ctx.fillStyle = 'rgba(242,239,233,0.16)';
    ctx.fillRect(left, y, right - left, Math.max(1, u));
  };

  // header: where this sits in the set, and what it is
  ctx.font = `500 ${22 * u}px ${fonts.mono}`;
  setSpacing(ctx, 0.14, 22 * u);
  ctx.fillStyle = BLUE;
  ctx.fillText(`${p.number} / ${String(total).padStart(2, '0')}`, left, 74 * u);
  ctx.fillStyle = FAINT;
  const meta = `${p.year} · ${p.context ?? p.status}`.toUpperCase();
  ctx.fillText(meta, right - ctx.measureText(meta).width, 74 * u);
  rule(100 * u);

  // title
  let size = 84;
  ctx.font = `400 ${size * u}px ${fonts.display}`;
  setSpacing(ctx, 0, size * u);
  while (ctx.measureText(p.name).width > right - left && size > 40) {
    size -= 4;
    ctx.font = `400 ${size * u}px ${fonts.display}`;
  }
  ctx.fillStyle = IVORY;
  ctx.fillText(p.name, left, 214 * u);

  // stack
  ctx.font = `500 ${18 * u}px ${fonts.mono}`;
  setSpacing(ctx, 0.16, 18 * u);
  ctx.fillStyle = FAINT;
  ctx.fillText('STACK', left, 292 * u);

  ctx.font = `500 ${31 * u}px ${fonts.mono}`;
  setSpacing(ctx, 0, 31 * u);
  ctx.fillStyle = IVORY;
  const stack = wrap(ctx, p.tech.join('  ·  '), right - left).slice(0, 3);
  stack.forEach((line, i) => ctx.fillText(line, left, 342 * u + i * 48 * u));

  // where to find it
  rule(H - 168 * u);
  const row = (label: string, value: string, y: number) => {
    ctx.font = `500 ${18 * u}px ${fonts.mono}`;
    setSpacing(ctx, 0.16, 18 * u);
    ctx.fillStyle = FAINT;
    ctx.fillText(label, left, y);
    ctx.font = `500 ${24 * u}px ${fonts.mono}`;
    setSpacing(ctx, 0, 24 * u);
    ctx.fillStyle = IVORY;
    ctx.fillText(value, left + 150 * u, y);
  };
  row('LIVE', p.demo ? bare(p.demo) : '—', H - 112 * u);
  row('SOURCE', p.github ? bare(p.github) : (p.sourceNote ?? '—'), H - 64 * u);

  return toTexture(canvas, anisotropy);
}
