# Mahak Jain — Portfolio

Personal portfolio for **Mahak Jain**, AI/ML Engineer & Full-Stack Developer. A single-page,
editorial site with dynamic project case studies.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**
and **Lucide**. No database, no backend — all content lives in typed data files.

Type: Fraunces (display), Hanken Grotesk (text), JetBrains Mono (labels), Caveat (annotations).
Palette: warm near-black / warm paper white / one vermilion accent. Dark by default, light toggle.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command             | Does                          |
| ------------------- | ----------------------------- |
| `npm run dev`       | Dev server (Turbopack)        |
| `npm run build`     | Production build              |
| `npm run start`     | Serve the production build    |
| `npm run lint`      | ESLint                        |
| `npm run typecheck` | `tsc --noEmit`                |
| `npm run format`    | Prettier write                |

## Editing content

Everything you'd want to change lives in a handful of files — no component edits needed:

| File                      | Contains                                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| `src/lib/site.ts`         | Name, role, hero statement, **email, GitHub, LinkedIn, resume**, SEO copy, nav |
| `src/data/projects.ts`    | Projects — one-liner, the mini-story (problem / built / learned), and the deeper case study. Add one here and its card + `/projects/<slug>` page appear automatically. |
| `src/data/now.ts`         | The "Now" list (building / learning / exploring / using / reading)       |
| `src/data/buildlog.ts`    | The "Build log" — a personal changelog, newest first                     |
| `src/data/skills.ts`      | `iWorkWith` and `pokingAt` — plain lists, no ratings                     |
| `src/data/personality.ts` | The "a little more about me" lines                                       |
| `src/lib/portfolio-ai.ts` | Answers + keyword intents for the "ask around" assistant                 |

### Placeholders

Unknowns are visible `[ADD ...]` markers — GitHub is set to `github.com/mahak-bit`; LinkedIn,
resume, live-demo URLs, project screenshots and the third project slot are still placeholders.
Search the repo for `[ADD` to find them all. Public contact email: `mahakj532@gmail.com`.

### Connecting a real model to "ask around"

`src/lib/portfolio-ai.ts` exposes one `askPortfolio(query)` function the UI calls. Swap its body
for a `fetch('/api/ask', …)` and nothing else changes.

## The 3D work section (home page)

The home page is the first screen (the name, the quote, the character — `TitleSlide`, unchanged)
followed by the work as a walk-through installation: a large metal ring standing in a pale room, the
real projects laid out as cards on the floor, and a camera that travels with the scroll. Pick a card
and it comes forward with its real details; the **DESIGN — CODE** control turns every card from the
work as it looks to how it is built. Built with three.js and `@react-three/fiber`. The page scrolls
normally; the 3D is called up once the first screen has loaded and settled (or the moment a visitor
starts to scroll), so the first screen never waits on it, and nothing is drawn while the section is
off screen.

- **Reads, never invents:** projects from `src/data/projects.ts`, the DESIGN / CODE lists from
  `src/data/skills.ts`, name, role, statement and contact links from `src/lib/site.ts`.
- **Where things live:** `src/components/home/HomeWork.tsx` is the page — the first screen, then the
  work section. `src/components/exhibition/` is the work section itself: `scene/` is everything
  three.js (the only code that imports it, behind a lazy boundary), `ui/` is the words and controls
  over it, `scene/layout.ts` is where everything stands and how the camera moves, `timeline.ts` is
  where each scene sits on the scroll and when its words show (only while the camera is settled on
  it, never over a room in motion). Device tiers (pixel ratio, shadow size, texture size) are in
  `src/lib/gpu.ts`.
- **Fallbacks:** no WebGL2 (or only a software renderer), `prefers-reduced-motion`, or the
  **List view** button all give the same projects as an ordinary list (`ExhibitionStatic`). With
  reduced motion there is an "Explore in 3D" button; the scene then runs without easing or drift.
- **Test hooks:** `?view=list` (force the list), `?tier=mobile|tablet|desktop` (force a quality
  tier), `?debug` (exposes `window.__ex` with each card's screen rectangle and renderer stats).
- **Going back to the old project browser:** the one-project-per-screen browser it replaced is still
  in `src/components/home/ProjectBrowser.tsx` (the first screen is exported from there). Render
  `<ProjectBrowser />` from `src/app/page.tsx` instead of `<HomeWork />`, or revert the commit that
  introduced `HomeWork`.
- **`/exhibition`:** the scene was briefly at that address before it moved onto the home page; it now
  redirects to `/` (see `next.config.ts`).

## Deployment (Vercel)

1. This repo is at `github.com/mahak-bit/mahak-jain-portfolio`.
2. Import it at [vercel.com/new](https://vercel.com/new) — Next.js is auto-detected, no env vars.
3. After the first deploy, set the real domain in `src/lib/site.ts` (`site.url`) so canonical
   URLs, the sitemap and OG tags point at production, then redeploy.

## Notes

- `AGENTS.md` / `CLAUDE.md` in the repo root are generated by `next dev` (Next.js 16) — safe to commit.
- Motion respects `prefers-reduced-motion` everywhere; with it on, content renders statically.
- Favicon is a placeholder monogram at `src/app/icon.svg`.
