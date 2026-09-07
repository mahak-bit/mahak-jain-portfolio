'use client';

/**
 * Hands the résumé to the browser's own print dialog, where "Save as PDF" is
 * the first destination on every major browser. That keeps one source of truth
 * — the page itself — instead of a checked-in PDF that quietly goes stale.
 *
 * Rendered inside a `print:hidden` wrapper, so it never appears in the output.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="meta border-line hover:border-accent hover:text-accent border px-3 py-2 transition-colors"
    >
      Download PDF ↓
    </button>
  );
}
