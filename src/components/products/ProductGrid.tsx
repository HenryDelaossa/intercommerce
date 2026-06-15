import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { Product } from '../../types/product';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  skeletonCount?: number;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({
  products,
  isLoading,
  skeletonCount = 8,
  onAddToCart,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
      {isLoading &&
        Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={`skeleton-${index}`} />
        ))}
    </div>
  );
}
