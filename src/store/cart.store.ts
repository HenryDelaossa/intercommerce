import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CART_STORAGE_KEY } from '../constants/config';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: number) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const existing = get().items.find((item) => item.id === product.id);

        if (existing) {
          set({
            items: get().items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
                : item,
            ),
          });
          return;
        }

        set({
          items: [
            ...get().items,
            {
              id: product.id,
              title: product.title,
              price: product.price,
              thumbnail: product.thumbnail,
              quantity: Math.min(quantity, product.stock),
              stock: product.stock,
            },
          ],
        });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      incrementItem: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) } : item,
          ),
        });
      },

      decrementItem: (id) => {
        set({
          items: get()
            .items.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
    },
  ),
);
