import clsx from 'clsx';
import type { ToastMessage } from '../../types/toast';

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const variantStyles: Record<ToastMessage['variant'], string> = {
  success: 'bg-brand-dark text-brand-light border-brand-primary',
  error: 'bg-brand-dark text-brand-light border-red-500',
  info: 'bg-brand-dark text-brand-light border-white/20',
};

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  return (
    <div
      role="status"
      className={clsx(
        'flex items-center justify-between gap-3 rounded-md border-l-4 px-4 py-3 text-sm shadow-lg',
        variantStyles[toast.variant],
      )}
    >
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
        className="text-brand-light/60 hover:text-brand-light"
      >
        ✕
      </button>
    </div>
  );
}
