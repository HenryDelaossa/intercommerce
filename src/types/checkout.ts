export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export type PaymentMethod = 'cash' | 'credit_card' | 'pse' | 'coupon';

export type CheckoutStep = 'address' | 'payment' | 'summary';

export interface OrderTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}
