import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-md flex-col items-start justify-center px-6">
      <p className="kicker">404</p>
      <h1 className="mt-4 font-display text-[clamp(2rem,1.4rem+3vw,3rem)]">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="text-muted mt-3 text-[0.98rem] leading-relaxed">
        Probably an old link, or a typo. Everything worth seeing is on the home page.
      </p>
      <Link
        href="/"
        className="border-fg hover:border-accent mt-8 inline-block border-b pb-0.5 text-[0.95rem] transition-colors"
      >
        ← Back to start
      </Link>
    </div>
  );
}
