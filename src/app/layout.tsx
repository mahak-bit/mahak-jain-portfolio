import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { KeyboardNav } from '@/components/KeyboardNav';
import { ProgressRail } from '@/components/ProgressRail';
import { site, seo } from '@/lib/site';

/** Display — a high-contrast editorial serif, set very large and very tight. */
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
});

/** Body. */
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

/** Every technical label, number, year and category on the site. */
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: seo.title,
    template: `%s — ${site.name}`,
  },
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f5f0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${hanken.variable} ${jetbrains.variable}`}
    >
      <head>
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="relative min-h-dvh">
        {/* The structure the page is measured against, and the tooth on the ivory. */}
        <div className="editorial-grid" aria-hidden>
          <div>
            <span />
            <span />
            <span />
            <span />
            <span className="hidden md:block" />
            <span className="hidden md:block" />
            <span className="hidden md:block" />
            <span className="hidden md:block" />
            <span className="hidden md:block" />
            <span className="hidden md:block" />
            <span className="hidden md:block" />
            <span className="hidden md:block" />
          </div>
        </div>
        <div className="grain" aria-hidden />

        <a
          href="#main"
          className="bg-surface text-fg border-line sr-only z-[70] border px-4 py-2 text-sm font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4"
        >
          Skip to content
        </a>
        <div className="relative z-[1]">
          <Navbar />
          <ProgressRail />
          <main id="main">{children}</main>
          <Footer />
        </div>
        <KeyboardNav />
      </body>
    </html>
  );
}
