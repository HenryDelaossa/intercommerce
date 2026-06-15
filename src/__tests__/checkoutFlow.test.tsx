import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/test-utils';
import { AppRoutes } from '../app/AppRoutes';
import { useCartStore } from '../store/cart.store';
import { useAuthStore } from '../store/auth.store';
import { useUiStore } from '../store/ui.store';
import { useCheckoutStore } from '../store/checkout.store';
import { DUMMY_USERS } from '../constants/dummyUsers';
import type { Product } from '../types/product';

const { mockProduct } = vi.hoisted(() => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'A product used for testing',
    category: 'test-category',
    price: 100,
    discountPercentage: 0,
    rating: 4.5,
    stock: 10,
    tags: ['test'],
    brand: 'TestBrand',
    sku: 'TEST-SKU',
    weight: 1,
    dimensions: { width: 10, height: 10, depth: 10 },
    warrantyInformation: 'No warranty',
    shippingInformation: 'Ships in 1 day',
    availabilityStatus: 'In Stock',
    reviews: [],
    returnPolicy: 'No return',
    minimumOrderQuantity: 1,
    meta: {
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      barcode: '0000000000000',
      qrCode: 'https://example.com/qr',
    },
    images: ['https://example.com/image.jpg'],
    thumbnail: 'https://example.com/thumbnail.jpg',
  };

  return { mockProduct };
});

vi.mock('../services/products/products.service', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/products/products.service')>();
  return {
    ...actual,
    getProductById: vi.fn().mockResolvedValue(mockProduct),
  };
});

describe('Checkout flow', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useAuthStore.setState({ currentUser: null });
    useUiStore.setState({
      isCartOpen: false,
      isLoginModalOpen: false,
      isCheckoutOpen: false,
      pendingCheckout: false,
      isBuyNowModalOpen: false,
    });
    useCheckoutStore.setState({
      step: 'address',
      shippingAddress: { fullName: '', address: '', city: '', postalCode: '', phone: '' },
      paymentMethod: null,
      couponCode: '',
      pendingBuyNowItem: null,
      cartSnapshot: null,
    });
    localStorage.clear();
  });

  it('walks through address, payment and summary steps and completes the purchase', async () => {
    const user = userEvent.setup();
    const testUser = DUMMY_USERS[0];
    renderWithProviders(<AppRoutes />, { route: '/product/1' });

    expect(await screen.findByText('Test Product')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /agregar al carrito/i }));
    await user.click(screen.getByRole('button', { name: /abrir carrito/i }));
    await user.click(screen.getByRole('button', { name: /confirmar compra/i }));

    const loginDialog = await screen.findByRole('dialog', { name: /iniciar sesión/i });
    await user.type(within(loginDialog).getByLabelText(/correo electrónico/i), testUser.email);
    await user.type(within(loginDialog).getByLabelText(/contraseña/i), testUser.password);
    await user.click(within(loginDialog).getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText(/dirección de envío/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Torres');
    await user.type(screen.getByLabelText(/^dirección$/i), 'Calle 123 # 45-67');
    await user.type(screen.getByLabelText(/ciudad/i), 'Bogotá');
    await user.type(screen.getByLabelText(/código postal/i), '110111');
    await user.type(screen.getByLabelText(/teléfono/i), '+57 300 123 4567');
    await user.click(screen.getByRole('button', { name: /continuar/i }));

    expect(await screen.findByText(/método de pago/i)).toBeInTheDocument();
    await user.click(screen.getByLabelText(/efectivo/i));
    await user.click(screen.getByRole('button', { name: /continuar/i }));

    expect(await screen.findByText(/resumen del pedido/i)).toBeInTheDocument();
    expect(screen.getByTestId('checkout-total')).toHaveTextContent('$119.00');

    await user.click(screen.getByRole('button', { name: /confirmar compra/i }));

    expect(await screen.findByText(/¡compra confirmada! gracias por tu pedido\./i)).toBeInTheDocument();
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
