import { NextResponse } from 'next/server';
import { site } from '@/lib/site';

/**
 * The contact form's backend.
 *
 * Sends through Resend's REST API with `fetch` — no SDK, so the site gains a
 * working form without gaining a dependency. Configuration is entirely
 * environment-driven:
 *
 *   RESEND_API_KEY    required; without it the route reports `not_configured`
 *                     and the form falls back to opening the visitor's mail
 *                     client, so it is never a dead button
 *   CONTACT_TO_EMAIL  optional; defaults to the address in site.ts
 *   CONTACT_FROM_EMAIL optional; defaults to Resend's shared onboarding
 *                     sender, which needs no domain verification and is
 *                     allowed to deliver to the account owner — exactly the
 *                     shape of a personal contact form
 *
 * The visitor's address goes in Reply-To, never in From, so replying works
 * without letting anyone send as this domain.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: { min: 1, max: 100 },
  email: { max: 200 },
  message: { min: 10, max: 4000 },
} as const;

type Field = 'name' | 'email' | 'message';

/**
 * Best-effort rate limit. Serverless instances are not shared, so this bounds
 * a single burst rather than guaranteeing a global ceiling — it is friction
 * for casual abuse, not a security control.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // keep the map from growing without bound on a long-lived instance
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: 'invalid' }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const name = str(raw.name);
  const email = str(raw.email);
  const message = str(raw.message);

  // Honeypot: a field hidden from people and irresistible to bots. Answer 200
  // so the bot has nothing to learn from the response.
  if (str(raw.company)) return NextResponse.json({ ok: true });

  const errors: Partial<Record<Field, string>> = {};
  if (name.length < LIMITS.name.min) errors.name = 'Your name?';
  else if (name.length > LIMITS.name.max) errors.name = 'That name is unusually long.';

  if (!EMAIL_RE.test(email) || email.length > LIMITS.email.max)
    errors.email = 'A real email, so I can reply.';

  if (message.length < LIMITS.message.min) errors.message = 'A line or two about the idea.';
  else if (message.length > LIMITS.message.max) errors.message = 'That is a little long for a form.';

  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, code: 'invalid', errors }, { status: 400 });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json({ ok: false, code: 'rate_limited' }, { status: 429 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not an error the visitor caused — the client falls back to mailto.
    return NextResponse.json({ ok: false, code: 'not_configured' }, { status: 503 });
  }

  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio — ${name}`,
        text: `${name} <${email}>\n\n${message}`,
        html:
          `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>` +
          `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
    });

    if (!res.ok) {
      // Log the provider's reason server-side; never return it to the client.
      console.error('[contact] resend responded', res.status, await res.text().catch(() => ''));
      return NextResponse.json({ ok: false, code: 'send_failed' }, { status: 502 });
    }
  } catch (err) {
    console.error('[contact] send threw', err);
    return NextResponse.json({ ok: false, code: 'send_failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
