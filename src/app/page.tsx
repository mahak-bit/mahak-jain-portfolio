import { Hero } from '@/components/Hero';
import { PortfolioAI } from '@/components/PortfolioAI';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Skills } from '@/components/Skills';
import { AIWorkflow } from '@/components/AIWorkflow';
import { Journey } from '@/components/Journey';
import { CurrentlyBuilding } from '@/components/CurrentlyBuilding';
import { BeyondCode } from '@/components/BeyondCode';
import { Contact } from '@/components/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PortfolioAI />
      <About />
      <Projects />
      <Skills />
      <AIWorkflow />
      <Journey />
      <CurrentlyBuilding />
      <BeyondCode />
      <Contact />
    </>
  );
}
