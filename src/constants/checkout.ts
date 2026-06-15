import type { PaymentMethod } from '../types/checkout';

export const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'credit_card', 'pse', 'coupon'];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  credit_card: 'Tarjeta de crédito',
  pse: 'PSE',
  coupon: 'Cupón',
};
