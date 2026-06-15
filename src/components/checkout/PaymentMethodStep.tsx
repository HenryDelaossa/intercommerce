import { useState } from 'react';
import { useCheckoutStore } from '../../store/checkout.store';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../../constants/checkout';
import { COUPON_CODE_LENGTH } from '../../constants/config';
import { isPaymentMethodComplete } from '../../lib/checkout/checkoutValidation';
import { Button } from '../ui/Button';

export function PaymentMethodStep() {
  const paymentMethod = useCheckoutStore((state) => state.paymentMethod);
  const setPaymentMethod = useCheckoutStore((state) => state.setPaymentMethod);
  const couponCode = useCheckoutStore((state) => state.couponCode);
  const setCouponCode = useCheckoutStore((state) => state.setCouponCode);
  const setStep = useCheckoutStore((state) => state.setStep);

  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!isPaymentMethodComplete(paymentMethod, couponCode)) {
      setError(
        paymentMethod === 'coupon'
          ? `El cupón debe tener ${COUPON_CODE_LENGTH} caracteres.`
          : 'Selecciona un método de pago.',
      );
      return;
    }

    setError(null);
    setStep('summary');
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-brand-dark">Método de pago</h3>

      <div className="flex flex-col gap-2">
        {PAYMENT_METHODS.map((method) => (
          <label
            key={method}
            className="flex items-center gap-2 rounded-md border border-black/10 p-2 text-sm text-brand-dark"
          >
            <input
              type="radio"
              name="payment-method"
              checked={paymentMethod === method}
              onChange={() => setPaymentMethod(method)}
            />
            {PAYMENT_METHOD_LABELS[method]}
          </label>
        ))}
      </div>

      {paymentMethod === 'coupon' && (
        <label className="flex flex-col gap-1 text-sm text-brand-dark">
          Código de cupón ({COUPON_CODE_LENGTH} caracteres)
          <input
            type="text"
            maxLength={COUPON_CODE_LENGTH}
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
            placeholder="ABCD123456"
            className="rounded-md border border-black/10 px-3 py-2 text-sm uppercase focus:border-brand-primary focus:outline-none"
          />
          <span className="text-xs text-brand-dark/60">
            {couponCode.length}/{COUPON_CODE_LENGTH}
          </span>
        </label>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-between gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={() => setStep('address')}>
          Atrás
        </Button>
        <Button type="button" onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
