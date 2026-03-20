import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  _id: string;
  name: string;
  price: string;
  newPrice: number; // Lưu số để tính toán cho dễ
  image: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: any, qty: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, qty) => set((state) => {
        // Chuyển đổi giá từ chuỗi "195.000đ" thành số 195000
        const numericPrice = Number(product.newPrice.replace(/[^0-9]/g, ""));
        const existingItem = state.cart.find((item) => item._id === product._id);

        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item._id === product._id ? { ...item, quantity: item.quantity + qty } : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, newPrice: numericPrice, quantity: qty }] };
      }),

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item._id !== id),
      })),

      updateQuantity: (id, qty) => set((state) => ({
        cart: state.cart.map((item) =>
          item._id === id ? { ...item, quantity: Math.max(1, qty) } : item
        ),
      })),

      clearCart: () => set({ cart: [] }),

      getTotalPrice: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.newPrice * item.quantity), 0);
      },
    }),
    { name: 'k-market-cart-storage' } // Lưu vào LocalStorage
  )
);