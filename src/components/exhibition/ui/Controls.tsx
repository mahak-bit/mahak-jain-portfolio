'use client';

import { cn } from '@/lib/utils';
import { exhibition, useExhibition } from '../store';

/**
 * DESIGN ——— CODE.
 *
 * One control, and it does what it says: at DESIGN the cards show the work as a
 * visitor sees it; at CODE they turn over and show how it is built — the stack,
 * where the source is, where it lives. It is a real range input, so it works
 * with a keyboard and announces itself properly; the arrow keys jump to either
 * end, because a card left half-turned means nothing.
 */
export function DesignCodeControl({ className }: { className?: string }) {
  const mix = useExhibition((s) => s.mix);
  const settle = (v: number) => exhibition.set({ mix: v < 0.5 ? 0 : 1 });

  return (
    <div className={cn('pointer-events-auto flex items-center gap-4 sm:gap-6', className)}>
      <button
        type="button"
        onClick={() => exhibition.set({ mix: 0 })}
        aria-pressed={mix < 0.5}
        className={cn(
          'tap font-sans text-[clamp(0.9rem,1.5vw,1.3rem)] font-medium tracking-[0.04em] uppercase transition-colors',
          mix < 0.5 ? 'text-fg' : 'text-muted hover:text-fg'
        )}
      >
        Design
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={mix}
        aria-label="Show the work as design or as code"
        aria-valuetext={mix < 0.5 ? 'Design' : 'Code'}
        className="dc-range min-w-0 flex-1"
        onChange={(e) => exhibition.set({ mix: Number(e.target.value) })}
        onPointerUp={(e) => settle(Number(e.currentTarget.value))}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'Home') {
            e.preventDefault();
            exhibition.set({ mix: 0 });
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'End') {
            e.preventDefault();
            exhibition.set({ mix: 1 });
          }
        }}
        onBlur={(e) => settle(Number(e.currentTarget.value))}
      />

      <button
        type="button"
        onClick={() => exhibition.set({ mix: 1 })}
        aria-pressed={mix >= 0.5}
        className={cn(
          'tap font-sans text-[clamp(0.9rem,1.5vw,1.3rem)] font-medium tracking-[0.04em] uppercase transition-colors',
          mix >= 0.5 ? 'text-fg' : 'text-muted hover:text-fg'
        )}
      >
        Code
      </button>
    </div>
  );
}

const SCENE_ITEMS = [
  { id: 'work', label: 'Work', n: '01' },
  { id: 'projects', label: 'Projects', n: '02' },
  { id: 'detail', label: 'Detail', n: '03' },
  { id: 'skills', label: 'Skills', n: '04' },
  { id: 'contact', label: 'Contact', n: '05' },
] as const;

/**
 * The five scenes as a plain list of buttons: where you are, and a way to jump.
 * "Detail" is the project view — it lights while one is open, and opens the
 * project the tour is on when pressed.
 */
export function SceneNav({
  onJump,
  className,
}: {
  onJump: (id: (typeof SCENE_ITEMS)[number]['id']) => void;
  className?: string;
}) {
  const scene = useExhibition((s) => s.scene);
  const selected = useExhibition((s) => s.selected);

  const current = selected ? 'detail' : (['work', 'projects', 'skills', 'contact'] as const)[scene];

  return (
    <nav aria-label="Work scenes" className={cn('pointer-events-auto', className)}>
      <ol className="flex items-center sm:gap-x-2">
        {SCENE_ITEMS.map((item) => {
          const on = item.id === current;
          return (
            <li key={item.id} className={cn(item.id === 'detail' && 'max-sm:hidden')}>
              <button
                type="button"
                onClick={() => onJump(item.id)}
                aria-current={on ? 'step' : undefined}
                className="tap block px-1.5 py-1.5"
              >
                <span
                  className={cn(
                    'border-b pb-0.5 font-mono text-[0.625rem] font-medium tracking-[0.14em] uppercase transition-colors',
                    on ? 'text-fg border-fg' : 'text-muted hover:text-fg border-transparent'
                  )}
                >
                  <span className="max-sm:hidden">{item.n} </span>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
