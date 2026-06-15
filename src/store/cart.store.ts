import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CART_STORAGE_KEY } from '../constants/config';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  addCartItem: (item: CartItem) => void;
  setItems: (items: CartItem[]) => void;
  removeItem: (id: number) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
  updateItemStock: (id: number, stock: number) => void;
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
                ? {
                    ...item,
                    stock: product.stock,
                    quantity: Math.min(item.quantity + quantity, product.stock),
                  }
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

      addCartItem: (item) => {
        const existing = get().items.find((cartItem) => cartItem.id === item.id);

        if (existing) {
          set({
            items: get().items.map((cartItem) =>
              cartItem.id === item.id
                ? {
                    ...cartItem,
                    stock: item.stock,
                    quantity: Math.min(cartItem.quantity + item.quantity, item.stock),
                  }
                : cartItem,
            ),
          });
          return;
        }

        set({ items: [...get().items, { ...item, quantity: Math.min(item.quantity, item.stock) }] });
      },

      setItems: (items) => set({ items }),

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

      updateItemStock: (id, stock) => {
        set({
          items: get()
            .items.map((item) =>
              item.id === id ? { ...item, stock, quantity: Math.min(item.quantity, stock) } : item,
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
