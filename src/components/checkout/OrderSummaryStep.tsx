import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/cart/useCart';
import { useCheckout } from '../../hooks/cart/useCheckout';
import { useStockSync } from '../../hooks/cart/useStockSync';
import { useToast } from '../../hooks/ui/useToast';
import { useCartStore } from '../../store/cart.store';
import { useCheckoutStore } from '../../store/checkout.store';
import { buildOrderTotals } from '../../lib/checkout/orderCalculations';
import { formatPrice } from '../../lib/format/currency';
import { PAYMENT_METHOD_LABELS } from '../../constants/checkout';
import { TAX_RATE } from '../../constants/config';
import { Button } from '../ui/Button';

export function OrderSummaryStep() {
  const { items } = useCart();
  const { completePurchase } = useCheckout();
  const { syncStock } = useStockSync();
  const { addToast } = useToast();
  const setStep = useCheckoutStore((state) => state.setStep);
  const shippingAddress = useCheckoutStore((state) => state.shippingAddress);
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const couponCode = useCheckoutStore((state) => state.couponCode);

  const totals = useMemo(() => buildOrderTotals(items), [items]);

  const handleConfirm = async () => {
    const itemsBefore = useCartStore.getState().items;
    await syncStock();
    const itemsAfter = useCartStore.getState().items;

    if (itemsAfter.length === 0) {
      addToast('Tu carrito quedó vacío tras actualizar el stock disponible.', 'info');
      return;
    }

    const changed =
      itemsAfter.length !== itemsBefore.length ||
      itemsAfter.some((item) => {
        const before = itemsBefore.find((prev) => prev.id === item.id);
        return !before || before.quantity !== item.quantity || before.stock !== item.stock;
      });

    if (changed) {
      addToast('Actualizamos el stock de tu pedido, revisa el resumen antes de confirmar.', 'info');
      return;
    }

    completePurchase();
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-brand-dark">Resumen del pedido</h3>

      <ul className="flex flex-col gap-2 text-sm text-brand-dark">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <Link to={`/product/${item.id}`} target="_blank" rel="noopener noreferrer" className="shrink-0">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-12 w-12 rounded-md border border-black/10 object-cover"
              />
            </Link>
            <Link
              to={`/product/${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-1 flex-1 hover:text-brand-primary hover:underline"
            >
              {item.title} x{item.quantity}
            </Link>
            <span className="whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <dl className="flex flex-col gap-1 border-t border-black/10 pt-3 text-sm text-brand-dark">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>IVA ({Math.round(TAX_RATE * 100)}%)</dt>
          <dd>{formatPrice(totals.tax)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Envío</dt>
          <dd>{totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)}</dd>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd data-testid="checkout-total">{formatPrice(totals.total)}</dd>
        </div>
      </dl>

      <div className="rounded-md bg-black/5 p-2 text-xs text-brand-dark/70">
        <p>
          Envío a: {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city}
        </p>
        <p>
          Pago: {paymentMethod ? PAYMENT_METHOD_LABELS[paymentMethod] : ''}
          {paymentMethod === 'coupon' ? ` (${couponCode})` : ''}
        </p>
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={() => setStep('payment')}>
          Atrás
        </Button>
        <Button type="button" onClick={() => void handleConfirm()}>
          Confirmar compra
        </Button>
      </div>
    </div>
  );
}
