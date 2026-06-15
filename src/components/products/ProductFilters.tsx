import type { ChangeEvent } from 'react';
import type { ProductCategory } from '../../types/product';

interface ProductFiltersProps {
  searchInput: string;
  category: string;
  categories: ProductCategory[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function ProductFilters({
  searchInput,
  category,
  categories,
  onSearchChange,
  onCategoryChange,
}: ProductFiltersProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(event.target.value);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={searchInput}
        onChange={handleSearchChange}
        placeholder="Buscar productos..."
        aria-label="Buscar productos"
        className="w-full rounded-md border border-black/10 bg-brand-light px-3 py-2 text-sm text-brand-dark outline-none focus:border-brand-primary sm:flex-1"
      />
      <select
        value={category}
        onChange={handleCategoryChange}
        aria-label="Filtrar por categoría"
        className="w-full rounded-md border border-black/10 bg-brand-light px-3 py-2 text-sm text-brand-dark outline-none focus:border-brand-primary sm:w-56"
      >
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
