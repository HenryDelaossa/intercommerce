import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../ui/useDebounce';
import { SEARCH_DEBOUNCE_MS } from '../../constants/config';

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  const setSearch = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const setCategory = useCallback(
    (value: string) => {
      setSearchParams((params) => {
        if (value) {
          params.set('category', value);
        } else {
          params.delete('category');
        }
        return params;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchInput('');
    setSearchParams({});
  }, [setSearchParams]);

  // Sync the debounced search term to the URL without clobbering the category param.
  useEffect(() => {
    if (debouncedSearch === urlSearch) return;

    setSearchParams(
      (params) => {
        if (debouncedSearch) {
          params.set('q', debouncedSearch);
        } else {
          params.delete('q');
        }
        return params;
      },
      { replace: true },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return {
    searchInput,
    search: urlSearch,
    category,
    setSearch,
    setCategory,
    clearFilters,
  };
}
