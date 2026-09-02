import Link from 'next/link';
import { buttonStyles } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="text-eyebrow">Error 404</p>
      <h1 className="mt-4 text-4xl tracking-tight">This page wandered off.</h1>
      <p className="text-muted mt-3 text-sm leading-relaxed">
        The link may be old or mistyped. Everything worth seeing is on the home page.
      </p>
      <Link href="/" className={buttonStyles('primary', 'md', 'mt-8')}>
        Back to start
      </Link>
    </div>
  );
}
