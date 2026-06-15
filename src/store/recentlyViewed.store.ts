import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RECENTLY_VIEWED_MAX, RECENTLY_VIEWED_STORAGE_KEY } from '../constants/config';
import type { RecentlyViewedProduct } from '../types/product';

interface RecentlyViewedState {
  items: RecentlyViewedProduct[];
  addItem: (product: RecentlyViewedProduct) => void;
  removeItem: (id: number) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const withoutCurrent = get().items.filter((item) => item.id !== product.id);
        set({ items: [product, ...withoutCurrent].slice(0, RECENTLY_VIEWED_MAX) });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: RECENTLY_VIEWED_STORAGE_KEY,
    },
  ),
);
