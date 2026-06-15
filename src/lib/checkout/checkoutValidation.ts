import { COUPON_CODE_LENGTH } from '../../constants/config';
import type { PaymentMethod, ShippingAddress } from '../../types/checkout';

export function isShippingAddressComplete(address: ShippingAddress): boolean {
  return (
    address.fullName.trim().length > 0 &&
    address.address.trim().length > 0 &&
    address.city.trim().length > 0 &&
    address.postalCode.trim().length > 0 &&
    address.phone.trim().length > 0
  );
}

export function isPaymentMethodComplete(method: PaymentMethod | null, couponCode: string): boolean {
  if (!method) return false;
  if (method === 'coupon') return couponCode.trim().length === COUPON_CODE_LENGTH;
  return true;
}
