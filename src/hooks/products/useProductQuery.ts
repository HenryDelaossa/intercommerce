import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../../services/products/products.service';
import { queryKeys } from '../../constants/queryKeys';

export function useProductQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.product(id ?? ''),
    queryFn: () => getProductById(id ?? ''),
    enabled: Boolean(id),
  });
}
