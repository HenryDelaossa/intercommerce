export interface ProductsQueryFilters {
  search?: string;
  category?: string;
}

export const queryKeys = {
  products: (filters: ProductsQueryFilters) => ['products', filters] as const,
  product: (id: string) => ['product', id] as const,
  categories: ['categories'] as const,
};
