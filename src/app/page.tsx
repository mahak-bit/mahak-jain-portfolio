import { Hero } from '@/components/Hero';
import { PortfolioAI } from '@/components/PortfolioAI';
import { HomeArchive } from '@/components/HomeArchive';
import { SectionBreak } from '@/components/SectionBreak';
import { About } from '@/components/About';
import { Now } from '@/components/Now';
import { Skills } from '@/components/Skills';
import { BuildLog } from '@/components/BuildLog';
import { Personality } from '@/components/Personality';
import { Contact } from '@/components/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <PortfolioAI />
      <HomeArchive />
      <SectionBreak />
      <About />
      <Now />
      <Skills />
      <BuildLog />
      <Personality />
      <Contact />
    </>
  );
}
