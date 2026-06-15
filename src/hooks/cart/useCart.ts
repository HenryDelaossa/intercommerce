import { useMemo } from 'react';
import { useCartStore } from '../../store/cart.store';
import { buildCartSummary } from '../../lib/cart/cartCalculations';
import { useToast } from '../ui/useToast';
import type { Product } from '../../types/product';

export function useCart() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const storeAddItem = useCartStore((state) => state.addItem);
  const { addToast } = useToast();

  const summary = useMemo(() => buildCartSummary(items), [items]);

  const addItem = (product: Product, quantity = 1) => {
    storeAddItem(product, quantity);
    addToast(`${product.title} se agregó al carrito`, 'success');
  };

  return {
    items,
    summary,
    addItem,
    removeItem,
    incrementItem,
    decrementItem,
    clearCart,
  };
}
