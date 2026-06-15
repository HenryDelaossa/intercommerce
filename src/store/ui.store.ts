import { create } from 'zustand';

interface UiState {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  pendingCheckout: boolean;
  setPendingCheckout: (pending: boolean) => void;
  isBuyNowModalOpen: boolean;
  openBuyNowModal: () => void;
  closeBuyNowModal: () => void;
}

export const useUiStore = create<UiState>()((set, get) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

  isLoginModalOpen: false,
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  isCheckoutOpen: false,
  openCheckout: () => set({ isCheckoutOpen: true }),
  closeCheckout: () => set({ isCheckoutOpen: false }),

  pendingCheckout: false,
  setPendingCheckout: (pending) => set({ pendingCheckout: pending }),

  isBuyNowModalOpen: false,
  openBuyNowModal: () => set({ isBuyNowModalOpen: true }),
  closeBuyNowModal: () => set({ isBuyNowModalOpen: false }),
}));
