import { Hero } from '@/components/Hero';
import { PortfolioAI } from '@/components/PortfolioAI';
import { HomeArchive } from '@/components/HomeArchive';
import { About } from '@/components/About';
import { Now } from '@/components/Now';
import { Skills } from '@/components/Skills';
import { BuildLog } from '@/components/BuildLog';
import { Personality } from '@/components/Personality';
import { Contact } from '@/components/Contact';
import { Chapter } from '@/components/ui/Section';

/**
 * The page reads as six chapters, alternating ground. The colour change is the
 * page turn — each one opens a new movement rather than continuing the last.
 */
export default function HomePage() {
  return (
    <>
      {/* I — the opening spread */}
      <Chapter tone="ivory">
        <Hero />
        <PortfolioAI />
      </Chapter>

      {/* II — the work */}
      <Chapter tone="charcoal">
        <HomeArchive />
      </Chapter>

      {/* III — the person */}
      <Chapter tone="ivory">
        <About />
        <Now />
        <Skills />
      </Chapter>

      {/* IV — the record */}
      <Chapter tone="charcoal">
        <BuildLog />
      </Chapter>

      {/* V — the thinking */}
      <Chapter tone="ivory">
        <Personality />
      </Chapter>

      {/* VI — the invitation */}
      <Chapter tone="charcoal">
        <Contact />
      </Chapter>
    </>
  );
}
