import { create } from 'zustand';
import { Product } from '@/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productCode: string) => void;
  updateQuantity: (productCode: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,

  addToCart: (product) => {
    const { items } = get();
    const existingItem = items.find((i) => i.product.code === product.code);
    let newItems;

    if (existingItem) {
      newItems = items.map((item) =>
        item.product.code === product.code
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    } else {
      newItems = [...items, { product, quantity: 1 }];
    }

    set({ items: newItems });
    calculateTotals(newItems, set);
  },

  removeFromCart: (productCode) => {
    const newItems = get().items.filter(
      (item) => item.product.code !== productCode,
    );
    set({ items: newItems });
    calculateTotals(newItems, set);
  },

  updateQuantity: (productCode, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productCode);
      return;
    }

    const newItems = get().items.map((item) =>
      item.product.code === productCode ? { ...item, quantity } : item,
    );

    set({ items: newItems });
    calculateTotals(newItems, set);
  },

  clearCart: () => {
    set({ items: [], total: 0, itemCount: 0 });
  },
}));

function calculateTotals(items: CartItem[], set: any) {
  const total = items.reduce(
    (sum, item) => sum + (Number(item.product.price) || 0) * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  set({ total, itemCount });
}
