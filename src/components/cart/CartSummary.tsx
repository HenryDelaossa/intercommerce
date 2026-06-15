import { formatPrice } from '../../lib/format/currency';
import { TAX_RATE } from '../../constants/config';
import type { CartSummary as CartSummaryType } from '../../types/cart';

interface CartSummaryProps {
  summary: CartSummaryType;
}

export function CartSummary({ summary }: CartSummaryProps) {
  return (
    <dl className="flex flex-col gap-1 border-t border-black/10 pt-3 text-sm text-brand-dark">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd data-testid="cart-subtotal">{formatPrice(summary.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>IVA ({Math.round(TAX_RATE * 100)}%)</dt>
        <dd data-testid="cart-tax">{formatPrice(summary.tax)}</dd>
      </div>
      <div className="flex justify-between text-base font-semibold">
        <dt>Total</dt>
        <dd data-testid="cart-total">{formatPrice(summary.total)}</dd>
      </div>
    </dl>
  );
}
