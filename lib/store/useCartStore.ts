import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create<any>()(
  persist(
    (set, get) => ({
      cart: [],

      // 1. Hàm thêm sản phẩm
      addToCart: (product: any, qty: number) => set((state: any) => {
        const numericPrice = typeof product.newPrice === 'string' 
          ? Number(product.newPrice.replace(/[^0-9]/g, "")) 
          : product.newPrice;

        const existingItem = state.cart.find((item: any) => item._id === product._id);
        let newCart;

        if (existingItem) {
          newCart = state.cart.map((item: any) =>
            item._id === product._id ? { ...item, quantity: item.quantity + qty } : item
          );
        } else {
          newCart = [...state.cart, { ...product, newPrice: numericPrice, quantity: qty }];
        }

        fetch("/api/cart", { method: "POST", body: JSON.stringify({ items: newCart }) }).catch(() => {});
        return { cart: newCart };
      }),

      // 2. Hàm xóa sản phẩm
      removeFromCart: (id: string) => set((state: any) => {
        const newCart = state.cart.filter((item: any) => item._id !== id);
        fetch("/api/cart", { method: "POST", body: JSON.stringify({ items: newCart }) }).catch(() => {});
        return { cart: newCart };
      }),

      // 3. Hàm cập nhật số lượng
      updateQuantity: (id: string, qty: number) => set((state: any) => {
        const newCart = state.cart.map((item: any) =>
          item._id === id ? { ...item, quantity: Math.max(1, qty) } : item
        );
        fetch("/api/cart", { method: "POST", body: JSON.stringify({ items: newCart }) }).catch(() => {});
        return { cart: newCart };
      }),

      // 4. Các hàm bổ trợ
      clearCart: () => set({ cart: [] }),
      setCart: (items: any[]) => set({ cart: items }),

      // 💡 HÀM THIẾU ĐÂY NÈ KHÁNH:
      getTotalPrice: () => {
        const { cart } = get();
        return cart.reduce((total: number, item: any) => {
          return total + (item.newPrice * item.quantity);
        }, 0);
      },
    }),
    { name: 'k-market-cart-storage' }
  )
);