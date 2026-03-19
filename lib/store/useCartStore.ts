import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. Định nghĩa kiểu dữ liệu cho 1 món hàng trong giỏ
interface CartItem {
  _id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

// 2. Định nghĩa các hành động của giỏ hàng
interface CartStore {
  cart: CartItem[];
  addToCart: (product: any, qty: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],

      // Thêm hàng vào giỏ
      addToCart: (product, qty) => set((state) => {
        const existingItem = state.cart.find((item) => item._id === product._id);
        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item._id === product._id ? { ...item, quantity: item.quantity + qty } : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, quantity: qty }] };
      }),

      // Xóa hàng
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item._id !== id),
      })),

      // Sửa số lượng trực tiếp
      updateQuantity: (id, qty) => set((state) => ({
        cart: state.cart.map((item) =>
          item._id === id ? { ...item, quantity: qty } : item
        ),
      })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: 'k-market-storage' } // Tên key lưu dưới LocalStorage
  )
);