import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProductQuery } from '../hooks/products/useProductQuery';
import { useCart } from '../hooks/cart/useCart';
import { ProductGallery } from '../components/product-detail/ProductGallery';
import { ProductInfo } from '../components/product-detail/ProductInfo';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import type { Product } from '../types/product';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError, error, refetch } = useProductQuery(id);
  const { addItem } = useCart();

  const handleAddToCart = useCallback(
    (product: Product, quantity: number) => {
      addItem(product, quantity);
    },
    [addItem],
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
      <Link to="/" className="text-sm text-brand-primary hover:underline">
        ← Volver al catálogo
      </Link>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      )}

      {isError && (
        <ErrorMessage
          error={error}
          onRetry={() => void refetch()}
          notFoundTitle="Producto no encontrado"
          notFoundDescription="El producto que buscas no existe o fue eliminado."
        />
      )}

      {!isLoading && !isError && product && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ProductGallery images={product.images} title={product.title} />
          <ProductInfo product={product} onAddToCart={handleAddToCart} />
        </div>
      )}
    </div>
  );
}
