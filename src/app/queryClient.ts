import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../services/http/httpClient';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 404) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
