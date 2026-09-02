import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { About } from '@/components/About';
import { Now } from '@/components/Now';
import { Skills } from '@/components/Skills';
import { BuildLog } from '@/components/BuildLog';
import { Personality } from '@/components/Personality';
import { PortfolioAI } from '@/components/PortfolioAI';
import { Contact } from '@/components/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Now />
      <Skills />
      <BuildLog />
      <Personality />
      <PortfolioAI />
      <Contact />
    </>
  );
}
