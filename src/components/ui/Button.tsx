import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'solid' | 'line';
export type ButtonSize = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-45';

const variants: Record<ButtonVariant, string> = {
  solid: 'bg-fg text-bg hover:bg-accent hover:text-accent-fg',
  line: 'border border-line text-fg hover:border-fg',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[0.8rem]',
  md: 'h-11 px-5 text-sm',
};

export function buttonStyles(
  variant: ButtonVariant = 'solid',
  size: ButtonSize = 'md',
  className?: string
) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'solid', size = 'md', className, ...props },
  ref
) {
  return <button ref={ref} className={buttonStyles(variant, size, className)} {...props} />;
});
