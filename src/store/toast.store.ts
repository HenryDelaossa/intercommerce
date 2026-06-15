import { create } from 'zustand';
import { TOAST_DURATION_MS } from '../constants/config';
import type { ToastMessage, ToastVariant } from '../types/toast';

interface ToastState {
  toasts: ToastMessage[];
  addToast: (message: string, variant?: ToastVariant) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],

  addToast: (message, variant = 'info') => {
    const id = crypto.randomUUID();
    set({ toasts: [...get().toasts, { id, message, variant }] });

    setTimeout(() => {
      get().removeToast(id);
    }, TOAST_DURATION_MS);
  },

  removeToast: (id) => {
    set({ toasts: get().toasts.filter((toast) => toast.id !== id) });
  },
}));
