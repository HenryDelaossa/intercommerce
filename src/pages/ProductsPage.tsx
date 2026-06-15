import { useCallback } from 'react';
import { useProductFilters } from '../hooks/filters/useProductFilters';
import { useProductsQuery } from '../hooks/products/useProductsQuery';
import { useCategoriesQuery } from '../hooks/products/useCategoriesQuery';
import { useCart } from '../hooks/cart/useCart';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductGrid } from '../components/products/ProductGrid';
import { InfiniteScrollSentinel } from '../components/products/InfiniteScrollSentinel';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import type { Product } from '../types/product';

export function ProductsPage() {
  const { searchInput, search, category, setSearch, setCategory } = useProductFilters();
  const { data: categories } = useCategoriesQuery();
  const { addItem } = useCart();

  const { products, total, isLoading, isError, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductsQuery({ search, category });

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product);
    },
    [addItem],
  );

  const handleFetchNext = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Catálogo de productos</h1>
        <p className="text-sm text-brand-dark/60">
          {total > 0 ? `${total} productos encontrados` : ' '}
        </p>
      </div>

      <ProductFilters
        searchInput={searchInput}
        category={category}
        categories={categories ?? []}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />

      {isError && <ErrorMessage error={error} onRetry={() => void refetch()} />}

      {!isError && !isLoading && products.length === 0 && (
        <EmptyState
          title="No se encontraron productos"
          description="Intenta con otra búsqueda o categoría."
        />
      )}

      {!isError && (
        <ProductGrid
          products={products}
          isLoading={isLoading || isFetchingNextPage}
          onAddToCart={handleAddToCart}
        />
      )}

      {!isError && <InfiniteScrollSentinel onIntersect={handleFetchNext} enabled={Boolean(hasNextPage)} />}
    </div>
  );
}
