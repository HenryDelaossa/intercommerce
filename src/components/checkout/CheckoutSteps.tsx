import clsx from 'clsx';
import type { CheckoutStep } from '../../types/checkout';

const STEPS: { key: CheckoutStep; label: string }[] = [
  { key: 'address', label: 'Dirección' },
  { key: 'payment', label: 'Pago' },
  { key: 'summary', label: 'Resumen' },
];

interface CheckoutStepsProps {
  current: CheckoutStep;
}

export function CheckoutSteps({ current }: CheckoutStepsProps) {
  const currentIndex = STEPS.findIndex((step) => step.key === current);

  return (
    <ol className="flex border-b border-black/10 px-4 py-3 text-xs text-brand-dark/70">
      {STEPS.map((step, index) => (
        <li
          key={step.key}
          className={clsx('flex-1 text-center', index <= currentIndex && 'font-semibold text-brand-primary')}
        >
          {index + 1}. {step.label}
        </li>
      ))}
    </ol>
  );
}
