import { request } from '../http/httpClient';
import type { Product, ProductCategory, ProductListResponse } from '../../types/product';

export interface PaginationParams {
  limit: number;
  skip: number;
}

export function getProducts({ limit, skip }: PaginationParams): Promise<ProductListResponse> {
  return request<ProductListResponse>('/products', { limit, skip });
}

export function searchProducts({
  q,
  limit,
  skip,
}: PaginationParams & { q: string }): Promise<ProductListResponse> {
  return request<ProductListResponse>('/products/search', { q, limit, skip });
}

export function getProductsByCategory({
  category,
  limit,
  skip,
}: PaginationParams & { category: string }): Promise<ProductListResponse> {
  return request<ProductListResponse>(`/products/category/${encodeURIComponent(category)}`, {
    limit,
    skip,
  });
}

export function getCategories(): Promise<ProductCategory[]> {
  return request<ProductCategory[]>('/products/categories');
}

export function getProductById(id: string | number): Promise<Product> {
  return request<Product>(`/products/${id}`);
}
