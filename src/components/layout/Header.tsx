import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/cart/useCart';
import { useUiStore } from '../../store/ui.store';
import { Badge } from '../ui/Badge';

export function Header() {
  const { summary } = useCart();
  const toggleCart = useUiStore((state) => state.toggleCart);

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-brand-light">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-brand-dark">
          Inter<span className="text-brand-primary">Commerce</span>
        </Link>
        <button
          type="button"
          onClick={toggleCart}
          aria-label="Abrir carrito"
          className="relative rounded-md p-2 text-brand-dark hover:bg-black/5"
        >
          🛒
          <Badge count={summary.itemCount} />
        </button>
      </div>
    </header>
  );
}
