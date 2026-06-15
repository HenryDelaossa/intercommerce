import { useToastStore } from '../../store/toast.store';

export function useToast() {
  const toasts = useToastStore((state) => state.toasts);
  const addToast = useToastStore((state) => state.addToast);
  const removeToast = useToastStore((state) => state.removeToast);

  return { toasts, addToast, removeToast };
}
