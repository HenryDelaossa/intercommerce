import { useState, type DragEvent } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/cart/useCart';
import { useAuth } from '../../hooks/auth/useAuth';
import { useUiStore } from '../../store/ui.store';
import { Badge } from '../ui/Badge';
import type { CartItemData } from '../../types/cart';

export function Header() {
  const { summary, addItemFromData } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const toggleCart = useUiStore((state) => state.toggleCart);
  const openLoginModal = useUiStore((state) => state.openLoginModal);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragOver(false);

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

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-brand-light">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-brand-dark">
          Inter<span className="text-brand-primary">Commerce</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 text-sm text-brand-dark">
              <span className="hidden sm:inline">Hola, {user?.name}</span>
              <button
                type="button"
                onClick={logout}
                aria-label="Cerrar sesión"
                className="rounded-md px-2 py-1 hover:bg-black/5"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openLoginModal}
              aria-label="Iniciar sesión"
              className="rounded-md px-2 py-1 text-sm text-brand-dark hover:bg-black/5"
            >
              Iniciar sesión
            </button>
          )}

          <button
            type="button"
            onClick={toggleCart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            aria-label="Abrir carrito"
            className={clsx(
              'relative rounded-md p-2 text-brand-dark transition-colors hover:bg-black/5',
              isDragOver && 'bg-brand-primary/10 ring-2 ring-brand-primary',
            )}
          >
            🛒
            <Badge count={summary.itemCount} />
          </button>
        </div>
      </div>
    </header>
  );
}
