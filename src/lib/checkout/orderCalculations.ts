import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '../../constants/config';
import { calculateSubtotal, calculateTax, calculateTotal } from '../cart/cartCalculations';
import type { CartItem } from '../../types/cart';
import type { OrderTotals } from '../../types/checkout';

export function calculateShippingCost(subtotal: number): number {
  return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

export function buildOrderTotals(items: CartItem[]): OrderTotals {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShippingCost(subtotal);
  const total = calculateTotal(subtotal, tax) + shipping;

  return { subtotal, tax, shipping, total };
}
