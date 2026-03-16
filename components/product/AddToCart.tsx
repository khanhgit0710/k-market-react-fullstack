"use client"; // Vì có bấm nút nên phải dùng Client Component

import { useState } from "react";

export default function AddToCart() {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Bộ tăng giảm số lượng */}
      <div className="flex items-center gap-4">
        <span className="text-gray-500 w-20 text-sm">Số lượng</span>
        <div className="flex items-center border border-gray-300 rounded-sm">
          <button 
            onClick={decrease}
            className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100 transition-all text-xl"
          >
            -
          </button>
          <input 
            type="text" 
            value={quantity} 
            readOnly 
            className="w-12 text-center text-sm outline-none"
          />
          <button 
            onClick={increase}
            className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100 transition-all text-xl"
          >
            +
          </button>
        </div>
      </div>

      {/* Nút bấm */}
      <div className="flex gap-4">
        <button className="px-8 py-3 border border-[#ee4d2d] bg-[#ff57221a] text-[#ee4d2d] rounded-sm hover:bg-[#ff572226] transition-all flex items-center gap-2">
          <i className="fa-solid fa-cart-plus"></i> Thêm vào giỏ hàng
        </button>
        <button className="px-12 py-3 bg-[#ee4d2d] text-white rounded-sm hover:opacity-90 transition-all shadow-md">
          Mua ngay
        </button>
      </div>
    </div>
  );
}