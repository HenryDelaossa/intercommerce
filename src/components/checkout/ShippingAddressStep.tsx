import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useCheckoutStore } from '../../store/checkout.store';
import { useCheckout } from '../../hooks/cart/useCheckout';
import { isShippingAddressComplete } from '../../lib/checkout/checkoutValidation';
import { Button } from '../ui/Button';
import type { ShippingAddress } from '../../types/checkout';

const FIELDS: { key: keyof ShippingAddress; label: string; placeholder: string }[] = [
  { key: 'fullName', label: 'Nombre completo', placeholder: 'Ana Torres' },
  { key: 'address', label: 'Dirección', placeholder: 'Calle 123 # 45-67' },
  { key: 'city', label: 'Ciudad', placeholder: 'Bogotá' },
  { key: 'postalCode', label: 'Código postal', placeholder: '110111' },
  { key: 'phone', label: 'Teléfono', placeholder: '+57 300 123 4567' },
];

export function ShippingAddressStep() {
  const shippingAddress = useCheckoutStore((state) => state.shippingAddress);
  const setShippingAddress = useCheckoutStore((state) => state.setShippingAddress);
  const setStep = useCheckoutStore((state) => state.setStep);
  const { cancelCheckout } = useCheckout();

  const [form, setForm] = useState<ShippingAddress>(shippingAddress);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: keyof ShippingAddress) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isShippingAddressComplete(form)) {
      setError('Completa todos los campos de la dirección de envío.');
      return;
    }

    setError(null);
    setShippingAddress(form);
    setStep('payment');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="font-semibold text-brand-dark">Dirección de envío</h3>

      {FIELDS.map((field) => (
        <label key={field.key} className="flex flex-col gap-1 text-sm text-brand-dark">
          {field.label}
          <input
            type="text"
            required
            value={form[field.key]}
            onChange={handleChange(field.key)}
            placeholder={field.placeholder}
            className="rounded-md border border-black/10 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
          />
        </label>
      ))}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-between gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={cancelCheckout}>
          Cancelar
        </Button>
        <Button type="submit">Continuar</Button>
      </div>
    </form>
  );
}
