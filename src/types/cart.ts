export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  stock: number;
}

export type CartItemData = Omit<CartItem, 'quantity'>;

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}
