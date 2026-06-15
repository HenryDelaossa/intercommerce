import { useCallback } from 'react';
import { useCartStore } from '../../store/cart.store';
import { useToast } from '../ui/useToast';
import { getProductById } from '../../services/products/products.service';
import { ApiError } from '../../services/http/httpClient';

export function useStockSync() {
  const { addToast } = useToast();

  const syncStock = useCallback(async () => {
    const items = useCartStore.getState().items;
    if (items.length === 0) return;

    const results = await Promise.all(
      items.map(async (item) => {
        try {
          const product = await getProductById(item.id);
          return { id: item.id, title: item.title, stock: product.stock as number | null | undefined };
        } catch (error) {
          if (error instanceof ApiError && error.status === 404) {
            return { id: item.id, title: item.title, stock: null };
          }
          return { id: item.id, title: item.title, stock: undefined };
        }
      }),
    );

    for (const result of results) {
      if (result.stock === undefined) continue;

      const current = useCartStore.getState().items.find((item) => item.id === result.id);
      if (!current) continue;

      if (result.stock === null) {
        useCartStore.getState().removeItem(result.id);
        addToast(`${result.title} ya no está disponible y se eliminó del carrito.`, 'info');
        continue;
      }

      const wasOverStock = current.quantity > result.stock;

      if (result.stock !== current.stock || wasOverStock) {
        useCartStore.getState().updateItemStock(result.id, result.stock);

        if (result.stock === 0) {
          addToast(`${result.title} está agotado y se eliminó del carrito.`, 'info');
        } else if (wasOverStock) {
          addToast(`Solo quedan ${result.stock} unidades de ${result.title}. Ajustamos la cantidad.`, 'info');
        }
      }
    }
  }, [addToast]);

  return { syncStock };
}
