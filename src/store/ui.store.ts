import { create } from 'zustand';

interface UiState {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useUiStore = create<UiState>()((set, get) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
}));
