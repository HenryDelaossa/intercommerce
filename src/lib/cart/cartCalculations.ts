import { TAX_RATE } from '../../constants/config';
import type { CartItem, CartSummary } from '../../types/cart';

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateTax(subtotal: number): number {
  return subtotal * TAX_RATE;
}

export function calculateTotal(subtotal: number, tax: number): number {
  return subtotal + tax;
}

export function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function buildCartSummary(items: CartItem[]): CartSummary {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);
  const itemCount = calculateItemCount(items);

  return { itemCount, subtotal, tax, total };
}
