'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { Button } from './ui/Button';
import { site } from '@/lib/site';
import { GithubIcon, LinkedinIcon } from './ui/BrandIcons';
import { cn } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export function Contact() {
  const reduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function validate() {
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Your name?';
    if (!EMAIL_RE.test(values.email)) next.email = 'A real email, so I can reply.';
    if (values.message.trim().length < 10) next.message = 'A line or two about the idea.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // No backend yet — to wire it up, POST `values` to a route handler.
    setSent(true);
  }

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `Hi from ${values.name || 'your portfolio'}`
  )}&body=${encodeURIComponent(values.message || '')}`;

  return (
    <Section id="contact" className="ruled">
      <div className="grid gap-x-12 gap-y-12 md:grid-cols-[1fr_1fr]">
        <Reveal>
          <span className="kicker">Contact</span>
          <h2 className="mt-4 text-[clamp(2rem,1.4rem+3vw,3.4rem)] leading-[1.05]">
            Got something you want built?
          </h2>
          <p className="text-muted prose-links mt-5 max-w-sm text-[1.05rem] leading-relaxed">
            An AI product, a website, an automation, or a half-formed idea you want a second
            opinion on — I&rsquo;d like to hear it.
          </p>

          <ul className="mt-8 flex flex-col text-[0.95rem]">
            <ContactRow label="Email" value={site.email} href={`mailto:${site.email}`} />
            <ContactRow
              label="GitHub"
              value={pretty(site.socials.github) || '[ADD GITHUB]'}
              href={site.socials.github || undefined}
              icon={<GithubIcon className="size-3.5" />}
            />
            <ContactRow
              label="LinkedIn"
              value={pretty(site.socials.linkedin) || '[ADD LINKEDIN]'}
              href={site.socials.linkedin || undefined}
              icon={<LinkedinIcon className="size-3.5" />}
            />
          </ul>
        </Reveal>

        <Reveal delay={0.05}>
          {sent ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-line flex h-full flex-col items-start justify-center gap-4 border-l pl-8"
            >
              <p className="font-display text-2xl">Thanks, {values.name.split(' ')[0]}.</p>
              <p className="text-muted max-w-sm text-[0.95rem] leading-relaxed">
                Small honesty note: this form isn&rsquo;t wired to a backend yet. Hit the button
                and it&rsquo;ll drop the same message straight into my inbox.
              </p>
              <a
                href={mailto}
                className="border-fg hover:border-accent border-b pb-0.5 text-[0.95rem] transition-colors"
              >
                Open it in email →
              </a>
            </motion.div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
              <Field
                label="Name"
                name="name"
                value={values.name}
                error={errors.name}
                onChange={(v) => setValues((s) => ({ ...s, name: v }))}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={values.email}
                error={errors.email}
                onChange={(v) => setValues((s) => ({ ...s, email: v }))}
              />
              <Field
                label="What’s the idea?"
                name="message"
                textarea
                value={values.message}
                error={errors.message}
                onChange={(v) => setValues((s) => ({ ...s, message: v }))}
              />
              <Button type="submit" size="md" className="self-start">
                Send it
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

function pretty(url: string) {
  return url ? url.replace(/^https?:\/\/(www\.)?/, '') : '';
}

function ContactRow({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon?: React.ReactNode;
}) {
  const inner = (
    <div className="border-line flex items-baseline gap-4 border-b py-3">
      <span className="text-faint w-20 shrink-0 font-mono text-xs uppercase tracking-[0.1em]">
        {label}
      </span>
      <span
        className={cn(
          'inline-flex items-center gap-2 transition-colors',
          href ? 'text-fg group-hover:text-accent' : 'text-faint'
        )}
      >
        {icon}
        {value}
        {href && <span className="text-faint">↗</span>}
      </span>
    </div>
  );
  if (!href) return <li>{inner}</li>;
  return (
    <li>
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
        className="group block"
      >
        {inner}
      </a>
    </li>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  textarea = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
}) {
  const shared =
    'border-line focus:border-fg w-full border-b bg-transparent pb-2 text-[1rem] outline-none transition-colors';
  return (
    <label className="flex flex-col gap-2">
      <span className="text-faint font-mono text-xs uppercase tracking-[0.1em]">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          aria-invalid={Boolean(error)}
          className={cn(shared, 'resize-none')}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={shared}
        />
      )}
      {error && <span className="text-accent text-xs">{error}</span>}
    </label>
  );
}
