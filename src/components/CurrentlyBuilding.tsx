import { Reveal } from './ui/Reveal';

const ITEMS = [
  'AI-powered products',
  'GenAI applications',
  'Agentic workflows',
  'Premium websites',
  'Automation systems',
];

export function CurrentlyBuilding() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <Reveal className="border-border-strong bg-surface/50 flex flex-col gap-5 rounded-2xl border p-6 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2.5">
            <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" />
            <span className="bg-accent relative inline-flex size-2.5 rounded-full" />
          </span>
          <span className="text-eyebrow">Currently building</span>
        </div>

        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-xs sm:justify-end sm:text-[0.8rem]">
          {ITEMS.map((item, i) => (
            <li key={item} className="text-muted flex items-center gap-3">
              {item}
              {i < ITEMS.length - 1 && <span className="text-faint hidden sm:inline">/</span>}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
