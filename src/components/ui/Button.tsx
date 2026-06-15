import { type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-primary text-brand-light hover:bg-orange-600 disabled:opacity-50',
  secondary:
    'bg-transparent border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-light disabled:opacity-50',
  ghost: 'bg-transparent text-brand-dark hover:bg-black/5 disabled:opacity-50',
};

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}
