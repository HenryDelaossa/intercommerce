import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../../hooks/products/useRecentlyViewed';
import { formatPrice } from '../../lib/format/currency';

export function RecentlyViewedList() {
  const { items, removeItem } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-brand-dark">Vistos recientemente</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => {
          const discountedPrice = item.price * (1 - item.discountPercentage / 100);

          return (
            <div key={item.id} className="relative w-32 shrink-0 rounded-md border border-black/10 bg-brand-light p-2">
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label={`Quitar ${item.title} del historial`}
                className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-brand-light/90 text-xs text-brand-dark/60 hover:text-brand-primary"
              >
                ✕
              </button>
              <Link to={`/product/${item.id}`} className="flex flex-col gap-1">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="aspect-square w-full rounded-md object-cover"
                />
                <span className="line-clamp-2 text-xs text-brand-dark">{item.title}</span>
                <span className="text-xs font-semibold text-brand-dark">{formatPrice(discountedPrice)}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
