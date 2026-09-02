'use client';

import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Check, Mail } from 'lucide-react';
import { Section } from './ui/Section';
import { SectionHeading } from './ui/SectionHeading';
import { Reveal } from './ui/Reveal';
import { Button, buttonStyles } from './ui/Button';
import { Magnetic } from './ui/Magnetic';
import { GithubIcon, LinkedinIcon } from './ui/BrandIcons';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export function Contact() {
  const reduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function validate(): boolean {
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Your name, please.';
    if (!EMAIL_RE.test(values.email)) next.email = 'A valid email so I can reply.';
    if (values.message.trim().length < 10) next.message = 'A sentence or two about the idea.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // No backend yet. To wire this up, POST `values` to a route handler:
    //   await fetch('/api/contact', { method: 'POST', body: JSON.stringify(values) })
    setSent(true);
  }

  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(
    `Project enquiry from ${values.name || 'the portfolio'}`
  )}&body=${encodeURIComponent(values.message || '')}`;

  return (
    <Section id="contact">
      <SectionHeading
        index="07"
        label="Contact"
        title={
          <>
            Have an idea?
            <br />
            Let&rsquo;s <span className="text-accent">build</span> it.
          </>
        }
        intro="Whether it's an AI product, a website, an automation system, or something completely new — I'd love to hear about it."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <button
                type="button"
                onClick={() => formRef.current?.querySelector('input')?.focus()}
                className={buttonStyles('primary', 'lg', 'group')}
              >
                Start a conversation
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </Magnetic>
            <a href={`mailto:${site.email}`} className={buttonStyles('outline', 'lg')}>
              <Mail className="size-4" />
              Email me
            </a>
          </div>

          <div className="border-border-strong divide-border flex flex-col divide-y rounded-2xl border">
            <ContactRow
              icon={Mail}
              label="Email"
              value={site.email}
              href={`mailto:${site.email}`}
            />
            <ContactRow
              icon={GithubIcon}
              label="GitHub"
              value={site.socials.github || '[ADD GITHUB]'}
              href={site.socials.github || undefined}
            />
            <ContactRow
              icon={LinkedinIcon}
              label="LinkedIn"
              value={site.socials.linkedin || '[ADD LINKEDIN]'}
              href={site.socials.linkedin || undefined}
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {sent ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border-border-strong bg-surface/60 flex h-full flex-col items-start justify-center gap-4 rounded-2xl border p-8"
            >
              <span className="bg-accent-soft text-accent flex size-11 items-center justify-center rounded-full">
                <Check className="size-5" />
              </span>
              <h3 className="text-xl tracking-tight">Thanks, {values.name.split(' ')[0]}.</h3>
              <p className="text-muted max-w-sm text-sm leading-relaxed">
                This form is a front-end demo and isn&rsquo;t wired to a backend yet — so send the
                same note straight to my inbox with the button below and I&rsquo;ll get back to you.
              </p>
              <a href={mailtoHref} className={buttonStyles('primary', 'md')}>
                <Mail className="size-4" />
                Open in email
              </a>
            </motion.div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              className="border-border-strong bg-surface/40 flex flex-col gap-5 rounded-2xl border p-6 sm:p-8"
            >
              <Field
                label="Name"
                name="name"
                value={values.name}
                error={errors.name}
                onChange={(v) => setValues((s) => ({ ...s, name: v }))}
                placeholder="Mahak Jain"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={values.email}
                error={errors.email}
                onChange={(v) => setValues((s) => ({ ...s, email: v }))}
                placeholder="you@company.com"
              />
              <Field
                label="About the project"
                name="message"
                textarea
                value={values.message}
                error={errors.message}
                onChange={(v) => setValues((s) => ({ ...s, message: v }))}
                placeholder="What are you trying to build?"
              />
              <Button type="submit" size="lg" className="mt-1 w-full sm:w-auto">
                Send message
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 px-5 py-4">
      <Icon className="text-muted size-4 shrink-0" />
      <span className="text-faint w-20 shrink-0 font-mono text-xs uppercase tracking-wider">
        {label}
      </span>
      <span className={cn('truncate text-sm', href ? 'text-foreground' : 'text-faint')}>
        {value}
      </span>
      {href && <ArrowUpRight className="text-muted ml-auto size-4 shrink-0" />}
    </div>
  );

  if (!href) return content;
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className="hover:bg-surface-2 transition-colors"
    >
      {content}
    </a>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  textarea = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  const shared =
    'bg-background/60 border-border focus-visible:border-accent w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-faint';
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-muted text-xs font-medium">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          aria-invalid={Boolean(error)}
          className={cn(shared, 'resize-none')}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={shared}
        />
      )}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}
