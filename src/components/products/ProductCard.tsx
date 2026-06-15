import { memo, useState, type DragEvent } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../lib/format/currency';
import { Button } from '../ui/Button';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

function ProductCardComponent({ product, onAddToCart, onBuyNow }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;
  const inStock = product.stock > 0;

  const handleDecrement = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleIncrement = () => {
    setQuantity((current) => Math.min(product.stock, current + 1));
  };

  const handleDragStart = (event: DragEvent<HTMLElement>) => {
    if (!inStock) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        stock: product.stock,
        quantity,
      }),
    );
  };

  return (
    <article
      draggable={inStock}
      onDragStart={handleDragStart}
      className="flex flex-col overflow-hidden rounded-lg border border-black/10 bg-brand-light transition-shadow hover:shadow-md"
    >
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-white">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          draggable={false}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs uppercase tracking-wide text-brand-dark/50">
          {product.category}
        </span>
        <Link to={`/product/${product.id}`} className="line-clamp-2 font-medium text-brand-dark">
          {product.title}
        </Link>
        <div className="mt-auto flex items-center gap-2 pt-1">
          <span className="font-semibold text-brand-dark">{formatPrice(discountedPrice)}</span>
          {hasDiscount && (
            <span className="text-xs text-brand-dark/40 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {inStock && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-brand-dark/60">Cantidad</span>
            <div className="flex items-center rounded-md border border-black/10">
              <button
                type="button"
                onClick={handleDecrement}
                aria-label="Disminuir cantidad"
                className="px-2 text-sm text-brand-dark disabled:opacity-40"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-medium text-brand-dark">{quantity}</span>
              <button
                type="button"
                onClick={handleIncrement}
                aria-label="Aumentar cantidad"
                className="px-2 text-sm text-brand-dark disabled:opacity-40"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
        )}

        <Button
          variant="primary"
          className="mt-2 w-full"
          onClick={() => onAddToCart(product, quantity)}
          disabled={!inStock}
        >
          {inStock ? 'Agregar al carrito' : 'Agotado'}
        </Button>

        {inStock && (
          <Button variant="secondary" className="w-full" onClick={() => onBuyNow(product, quantity)}>
            Comprar ahora
          </Button>
        )}
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardComponent);
