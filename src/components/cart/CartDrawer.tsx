import { useEffect, useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';
import { useCart } from '../../hooks/cart/useCart';
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
  const { items, summary, incrementItem, decrementItem, removeItem, clearCart } = useCart();
  const { confirmPurchase } = useCheckout();
  const { syncStock } = useStockSync();
  const asideRef = useRef<HTMLElement>(null);

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
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        ref={asideRef}
        className={clsx(
          'fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-brand-light shadow-xl transition-transform',
          isCartOpen ? 'translate-x-0' : 'translate-x-full',
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
