import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/test-utils';
import { AppRoutes } from '../app/AppRoutes';
import { useCartStore } from '../store/cart.store';
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

describe('Add to cart flow', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    localStorage.clear();
  });

  it('updates the cart total after adding a product to the cart', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AppRoutes />, { route: '/product/1' });

    expect(await screen.findByText('Test Product')).toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: /agregar al carrito/i });
    await user.click(addButton);

    const openCartButton = screen.getByRole('button', { name: /abrir carrito/i });
    await user.click(openCartButton);

    expect(await screen.findByTestId('cart-subtotal')).toHaveTextContent('$100.00');
    expect(screen.getByTestId('cart-tax')).toHaveTextContent('$19.00');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$119.00');
  });
});
