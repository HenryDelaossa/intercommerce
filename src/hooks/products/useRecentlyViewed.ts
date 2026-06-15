import { useRecentlyViewedStore } from '../../store/recentlyViewed.store';
import type { Product, RecentlyViewedProduct } from '../../types/product';

export function useRecentlyViewed() {
  const items = useRecentlyViewedStore((state) => state.items);
  const addItem = useRecentlyViewedStore((state) => state.addItem);
  const removeItem = useRecentlyViewedStore((state) => state.removeItem);

  const addProduct = (product: Product) => {
    const entry: RecentlyViewedProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      discountPercentage: product.discountPercentage,
      thumbnail: product.thumbnail,
    };
    addItem(entry);
  };

  return { items, addProduct, removeItem };
}
