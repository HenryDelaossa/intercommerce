import { useCallback, useState } from 'react';
import { formatPrice } from '../../lib/format/currency';
import { Button } from '../ui/Button';
import type { Product } from '../../types/product';

interface ProductInfoProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

const FEEDBACK_DURATION_MS = 1500;

export function ProductInfo({ product, onAddToCart, onBuyNow }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;
  const inStock = product.stock > 0;

  const handleDecrement = useCallback(() => {
    setQuantity((current) => Math.max(1, current - 1));
  }, []);

  const handleIncrement = useCallback(() => {
    setQuantity((current) => Math.min(product.stock, current + 1));
  }, [product.stock]);

  const handleAddToCart = useCallback(() => {
    onAddToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), FEEDBACK_DURATION_MS);
  }, [onAddToCart, product, quantity]);

  const handleBuyNow = useCallback(() => {
    onBuyNow(product, quantity);
  }, [onBuyNow, product, quantity]);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs uppercase tracking-wide text-brand-dark/50">
        {product.category}
      </span>
      <h1 className="text-2xl font-bold text-brand-dark">{product.title}</h1>

      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-brand-dark">
          {formatPrice(discountedPrice)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-sm text-brand-dark/40 line-through">
              {formatPrice(product.price)}
            </span>
            <span className="rounded-md bg-brand-primary/10 px-2 py-0.5 text-xs font-semibold text-brand-primary">
              -{Math.round(product.discountPercentage)}%
            </span>
          </>
        )}
      </div>

      <p className="text-sm text-brand-dark/70">{product.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-brand-dark/60">
        <span>Calificación: {product.rating.toFixed(1)} / 5</span>
        <span>{inStock ? `${product.stock} disponibles` : 'Sin stock'}</span>
      </div>

      {inStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-brand-dark">Cantidad</span>
          <div className="flex items-center rounded-md border border-black/10">
            <button
              type="button"
              onClick={handleDecrement}
              aria-label="Disminuir cantidad"
              className="px-3 py-1 text-brand-dark disabled:opacity-40"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-medium text-brand-dark">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              aria-label="Aumentar cantidad"
              className="px-3 py-1 text-brand-dark disabled:opacity-40"
              disabled={quantity >= product.stock}
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="primary"
          className="mt-2 w-full sm:w-auto"
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          {justAdded ? '✓ Agregado al carrito' : inStock ? 'Agregar al carrito' : 'Agotado'}
        </Button>

        {inStock && (
          <Button variant="secondary" className="mt-2 w-full sm:w-auto" onClick={handleBuyNow}>
            Comprar ahora
          </Button>
        )}
      </div>
    </div>
  );
}
