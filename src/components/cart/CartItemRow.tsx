import { memo } from 'react';
import { formatPrice } from '../../lib/format/currency';
import type { CartItem } from '../../types/cart';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (id: number) => void;
}

function CartItemRowComponent({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  return (
    <li className="flex gap-3 border-b border-black/10 py-3">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="h-16 w-16 rounded-md border border-black/10 object-cover"
      />
      <div className="flex flex-1 flex-col gap-1">
        <span className="line-clamp-2 text-sm font-medium text-brand-dark">{item.title}</span>
        <span className="text-sm font-semibold text-brand-dark">{formatPrice(item.price)}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onDecrement(item.id)}
            aria-label="Disminuir cantidad"
            className="rounded-md border border-black/10 px-2 text-sm text-brand-dark"
          >
            −
          </button>
          <span className="w-6 text-center text-sm text-brand-dark">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onIncrement(item.id)}
            aria-label="Aumentar cantidad"
            className="rounded-md border border-black/10 px-2 text-sm text-brand-dark disabled:opacity-40"
            disabled={item.quantity >= item.stock}
          >
            +
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="ml-auto text-xs text-brand-dark/50 underline hover:text-brand-primary"
          >
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
}

export const CartItemRow = memo(CartItemRowComponent);
