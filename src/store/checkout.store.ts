import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CHECKOUT_ADDRESS_STORAGE_KEY } from '../constants/config';
import type { CheckoutStep, PaymentMethod, ShippingAddress } from '../types/checkout';
import type { CartItem } from '../types/cart';

const EMPTY_ADDRESS: ShippingAddress = {
  fullName: '',
  address: '',
  city: '',
  postalCode: '',
  phone: '',
};

interface CheckoutState {
  step: CheckoutStep;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod | null;
  couponCode: string;
  pendingBuyNowItem: CartItem | null;
  cartSnapshot: CartItem[] | null;
  setStep: (step: CheckoutStep) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: PaymentMethod | null) => void;
  setCouponCode: (code: string) => void;
  setPendingBuyNowItem: (item: CartItem | null) => void;
  setCartSnapshot: (items: CartItem[] | null) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      step: 'address',
      shippingAddress: EMPTY_ADDRESS,
      paymentMethod: null,
      couponCode: '',
      pendingBuyNowItem: null,
      cartSnapshot: null,

      setStep: (step) => set({ step }),
      setShippingAddress: (shippingAddress) => set({ shippingAddress }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      setCouponCode: (couponCode) => set({ couponCode }),
      setPendingBuyNowItem: (pendingBuyNowItem) => set({ pendingBuyNowItem }),
      setCartSnapshot: (cartSnapshot) => set({ cartSnapshot }),

      reset: () => set({ step: 'address', paymentMethod: null, couponCode: '' }),
    }),
    {
      name: CHECKOUT_ADDRESS_STORAGE_KEY,
      partialize: (state) => ({ shippingAddress: state.shippingAddress }),
    },
  ),
);
