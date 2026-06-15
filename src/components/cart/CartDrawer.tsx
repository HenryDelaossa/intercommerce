import { useEffect, useLayoutEffect, useRef, useState, type DragEvent } from 'react';
import clsx from 'clsx';
import { useCart } from '../../hooks/cart/useCart';
import type { CartItemData } from '../../types/cart';
import { useCheckout } from '../../hooks/cart/useCheckout';
import { useStockSync } from '../../hooks/cart/useStockSync';
import { useUiStore } from '../../store/ui.store';
import { CartItemRow } from './CartItemRow';
import { CartSummary } from './CartSummary';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

export function CartDrawer() {
  const isCartOpen = useUiStore((state) => state.isCartOpen);
  const closeCart = useUiStore((state) => state.closeCart);
  const isDragging = useUiStore((state) => state.isDragging);
  const { items, summary, incrementItem, decrementItem, removeItem, clearCart, addItemFromData } = useCart();
  const { confirmPurchase } = useCheckout();
  const { syncStock } = useStockSync();
  const asideRef = useRef<HTMLElement>(null);
  const [isDragOverDrawer, setIsDragOverDrawer] = useState(false);

  const handleDrawerDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragOverDrawer(true);
  };

  const handleDrawerDragLeave = (event: DragEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragOverDrawer(false);
    }
  };

  const handleDrawerDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragOverDrawer(false);
    const raw = event.dataTransfer.getData('application/json');
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as CartItemData & { quantity: number };
      addItemFromData(
        { id: data.id, title: data.title, price: data.price, thumbnail: data.thumbnail, stock: data.stock },
        data.quantity,
      );
    } catch {
      // ignore malformed drag payload
    }
  };

  useEffect(() => {
    if (isCartOpen) {
      void syncStock();
    }
  }, [isCartOpen, syncStock]);

  useLayoutEffect(() => {
    if (!isCartOpen && asideRef.current?.contains(document.activeElement)) {
      (document.activeElement as HTMLElement).blur();
    }
  }, [isCartOpen]);

  return (
    <>
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black/40 transition-opacity',
          isCartOpen && !isDragging ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        ref={asideRef}
        onDragOver={handleDrawerDragOver}
        onDragLeave={handleDrawerDragLeave}
        onDrop={handleDrawerDrop}
        className={clsx(
          'fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-brand-light shadow-xl transition-transform',
          isCartOpen ? 'translate-x-0' : 'translate-x-full',
          isDragOverDrawer && 'ring-2 ring-inset ring-brand-primary',
        )}
        role="dialog"
        aria-label="Carrito de compras"
        aria-hidden={!isCartOpen}
      >
        <div className="flex items-center justify-between border-b border-black/10 p-4">
          <h2 className="text-lg font-semibold text-brand-dark">Tu carrito</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="text-brand-dark/60 hover:text-brand-primary"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isDragging && (
            <div
              className={clsx(
                'mb-4 rounded-lg border-2 border-dashed p-4 text-center text-sm transition-colors',
                isDragOverDrawer
                  ? 'border-brand-primary bg-brand-primary/10 font-medium text-brand-primary'
                  : 'border-black/20 text-brand-dark/50',
              )}
            >
              {isDragOverDrawer ? '¡Suelta para agregar al carrito!' : 'Arrastra un producto aquí'}
            </div>
          )}
          {items.length === 0 ? (
            <EmptyState title="Tu carrito está vacío" description="Agrega productos para comenzar." />
          ) : (
            <ul>
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onIncrement={incrementItem}
                  onDecrement={decrementItem}
                  onRemove={removeItem}
                />
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-black/10 p-4">
            <CartSummary summary={summary} />
            <Button onClick={confirmPurchase}>Confirmar compra</Button>
            <Button variant="secondary" onClick={clearCart}>
              Vaciar carrito
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
