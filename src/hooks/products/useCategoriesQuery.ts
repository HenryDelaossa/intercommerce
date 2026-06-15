import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../services/products/products.service';
import { queryKeys } from '../../constants/queryKeys';

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: getCategories,
    staleTime: Infinity,
  });
}
