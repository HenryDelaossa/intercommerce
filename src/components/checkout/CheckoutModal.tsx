import { useUiStore } from '../../store/ui.store';
import { useCheckoutStore } from '../../store/checkout.store';
import { useCheckout } from '../../hooks/cart/useCheckout';
import { CheckoutSteps } from './CheckoutSteps';
import { ShippingAddressStep } from './ShippingAddressStep';
import { PaymentMethodStep } from './PaymentMethodStep';
import { OrderSummaryStep } from './OrderSummaryStep';

export function CheckoutModal() {
  const isOpen = useUiStore((state) => state.isCheckoutOpen);
  const { cancelCheckout } = useCheckout();
  const step = useCheckoutStore((state) => state.step);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Finalizar compra"
    >
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-brand-light shadow-xl">
        <div className="flex items-center justify-between border-b border-black/10 p-4">
          <h2 className="text-lg font-semibold text-brand-dark">Finalizar compra</h2>
          <button
            type="button"
            onClick={cancelCheckout}
            aria-label="Cerrar"
            className="text-brand-dark/60 hover:text-brand-primary"
          >
            ✕
          </button>
        </div>

        <CheckoutSteps current={step} />

        <div className="flex-1 overflow-y-auto p-4">
          {step === 'address' && <ShippingAddressStep />}
          {step === 'payment' && <PaymentMethodStep />}
          {step === 'summary' && <OrderSummaryStep />}
        </div>
      </div>
    </div>
  );
}
