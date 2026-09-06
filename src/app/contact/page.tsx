import type { Metadata } from 'next';
import { Contact } from '@/components/Contact';
import { PortfolioAI } from '@/components/PortfolioAI';
import { Chapter } from '@/components/ui/Section';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${site.name} — AI products, web apps and automation.`,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: `Contact — ${site.name}`,
    description: 'Open to good problems — AI products, web apps, automation.',
    url: `${site.url}/contact`,
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <>
      <Chapter tone="ivory">
        <PortfolioAI />
      </Chapter>

      <Chapter tone="charcoal">
        <Contact />
      </Chapter>
    </>
  );
}
