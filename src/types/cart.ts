export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  stock: number;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}
