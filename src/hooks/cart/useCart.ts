import { useMemo } from 'react';
import { useCartStore } from '../../store/cart.store';
import { buildCartSummary } from '../../lib/cart/cartCalculations';
import { useToast } from '../ui/useToast';
import type { Product } from '../../types/product';
import type { CartItemData } from '../../types/cart';

export function useCart() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const storeIncrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const storeAddCartItem = useCartStore((state) => state.addCartItem);
  const { addToast } = useToast();

  const summary = useMemo(() => buildCartSummary(items), [items]);

  const addItemFromData = (data: CartItemData, quantity = 1) => {
    const existing = items.find((item) => item.id === data.id);
    const currentQuantity = existing?.quantity ?? 0;

    if (currentQuantity >= data.stock) {
      addToast(`No hay más stock disponible de ${data.title}.`, 'error');
      return;
    }

    storeAddCartItem({ ...data, quantity });
    addToast(`${data.title} se agregó al carrito`, 'success');
  };

  const addItem = (product: Product, quantity = 1) => {
    addItemFromData(
      { id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, stock: product.stock },
      quantity,
    );
  };

  const incrementItem = (id: number) => {
    const item = items.find((cartItem) => cartItem.id === id);

    if (item && item.quantity >= item.stock) {
      addToast('No hay más stock disponible.', 'error');
      return;
    }

    storeIncrementItem(id);
  };

  return {
    items,
    summary,
    addItem,
    addItemFromData,
    removeItem,
    incrementItem,
    decrementItem,
    clearCart,
  };
}
