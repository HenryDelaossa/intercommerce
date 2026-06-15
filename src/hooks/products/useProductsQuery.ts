import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  getProducts,
  getProductsByCategory,
  searchProducts,
} from '../../services/products/products.service';
import { PRODUCTS_PAGE_SIZE } from '../../constants/config';
import { queryKeys, type ProductsQueryFilters } from '../../constants/queryKeys';
import type { ProductListResponse } from '../../types/product';

function fetchProductsPage(
  filters: ProductsQueryFilters,
  skip: number,
): Promise<ProductListResponse> {
  if (filters.search) {
    return searchProducts({ q: filters.search, limit: PRODUCTS_PAGE_SIZE, skip });
  }

  if (filters.category) {
    return getProductsByCategory({
      category: filters.category,
      limit: PRODUCTS_PAGE_SIZE,
      skip,
    });
  }

  return getProducts({ limit: PRODUCTS_PAGE_SIZE, skip });
}

export function useProductsQuery(filters: ProductsQueryFilters) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.products(filters),
    queryFn: ({ pageParam }) => fetchProductsPage(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit;
      return nextSkip < lastPage.total ? nextSkip : undefined;
    },
  });

  const products = useMemo(
    () => query.data?.pages.flatMap((page) => page.products) ?? [],
    [query.data],
  );

  const total = query.data?.pages[0]?.total ?? 0;

  return { ...query, products, total };
}
