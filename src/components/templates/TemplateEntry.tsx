import { Reveal } from '@/components/ui/Reveal';
import type { Template } from '@/data/templates';
import { TemplateShowcase } from './TemplateShowcase';

/**
 * One template, set as a spread: the metadata rule the archive opens every
 * entry with, the stage beside the name and the way in, then what is inside as
 * a band of its own. `flip` mirrors the stage to the other side so two entries
 * in a row do not read as a repeated card.
 *
 * The list sits below rather than in the column beside the stage. Put there, it
 * made that column several times taller than the stage.
 */
export function TemplateEntry({ template, flip }: { template: Template; flip: boolean }) {
  return (
    <Reveal>
      <article aria-labelledby={`template-${template.slug}`} className="group/entry">
        <div className="border-line grid grid-cols-12 items-baseline gap-x-4 gap-y-2 border-t pt-4">
          <span className="meta text-accent col-span-2 sm:col-span-1">{template.number}</span>
          <span className="meta col-span-10 sm:col-span-3">{template.category}</span>
          <span className="meta col-span-12 sm:col-span-8 sm:text-right">
            {template.tech.join(' / ')}
          </span>
        </div>

        <TemplateShowcase template={template} flip={flip} />

        <div className="border-line mt-10 border-t pt-5 sm:mt-12">
          <p className="meta mb-4">What’s inside</p>
          <ul className="md:columns-2 md:gap-x-10">
            {template.inside.map((line) => (
              <li
                key={line}
                className="text-fg relative mb-3 pl-5 text-[0.94rem] leading-[1.6] break-inside-avoid"
              >
                <span aria-hidden className="text-line absolute left-0">
                  —
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}
