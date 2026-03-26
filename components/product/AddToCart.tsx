"use client"; // 💡 CHÌA KHÓA Ở ĐÂY: Chỉ thằng này mới cần dùng Hook

import { useState } from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import { toast } from "react-hot-toast";

export default function AddToCart({ product }: { product: any }) {
  const [qty, setQty] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
    // Gọi hàm addToCart từ Zustand
    addToCart(product, qty);
    
    toast.success(`Đã thêm ${qty} sản phẩm vào giỏ hàng!`, {
      style: {
        border: '1px solid #ee4d2d',
        padding: '16px',
        color: '#ee4d2d',
      },
      iconTheme: {
        primary: '#ee4d2d',
        secondary: '#FFFAEE',
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Bộ tăng giảm số lượng */}
      <div className="flex items-center gap-4">
        <span className="text-gray-500 w-20 text-sm font-medium">Số lượng</span>
        <div className="flex items-center border border-gray-300 rounded-sm">
          <button 
            onClick={() => qty > 1 && setQty(qty - 1)}
            className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100 transition-all text-xl"
          >
            -
          </button>
          <input 
            type="text" 
            value={qty} 
            readOnly 
            className="w-12 text-center text-sm outline-none font-bold"
          />
          <button 
            onClick={() => setQty(qty + 1)}
            className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100 transition-all text-xl"
          >
            +
          </button>
        </div>
      </div>

      {/* Cụm nút bấm */}
      <div className="flex gap-4">
        <button 
          onClick={handleAdd}
          className="px-8 py-3 border border-[#ee4d2d] bg-[#ff57221a] text-[#ee4d2d] rounded-sm hover:bg-[#ff572226] transition-all flex items-center justify-center gap-2 font-medium"
        >
          <i className="fa-solid fa-cart-plus"></i> Thêm vào giỏ hàng
        </button>
        <button className="px-14 py-3 bg-[#ee4d2d] text-white rounded-sm hover:opacity-90 transition-all shadow-md font-bold uppercase">
          Mua ngay
        </button>
      </div>
    </div>
  );
}