'use client';

import { useEffect, useState } from 'react';

/** "3:14am in India" — a small, honest, slightly playful footer detail. */
export function IndiaClock() {
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    function tick() {
      try {
        const now = new Date();
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(now);
        const hour = Number(
          new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            hour12: false,
          }).format(now)
        );
        const tail = hour >= 1 && hour < 6 ? ' — probably still up' : '';
        setLabel(`${parts.replace(' ', '').toLowerCase()} in India${tail}`);
      } catch {
        setLabel('');
      }
    }
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!label) return null;
  return <span suppressHydrationWarning>{label}</span>;
}
