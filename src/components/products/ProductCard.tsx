import { memo } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../lib/format/currency';
import { Button } from '../ui/Button';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function ProductCardComponent({ product, onAddToCart }: ProductCardProps) {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-black/10 bg-brand-light transition-shadow hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-white">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
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
        <Button
          variant="primary"
          className="mt-2 w-full"
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
        </Button>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardComponent);
