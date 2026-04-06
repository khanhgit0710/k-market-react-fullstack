"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/lib/store/useCartStore"; // Check lại đường dẫn store của ông
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTrashAlt, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const subTotal = getTotalPrice();
  const freeShipThreshold = 1000000;
  const progressToFreeShip = Math.min(100, Math.round((subTotal / freeShipThreshold) * 100));
  const remainingForFreeShip = Math.max(0, freeShipThreshold - subTotal);
  const estimatedDiscount = Math.round(subTotal * 0.05);

  // Fix lỗi Hydration (đợi giao diện khớp với LocalStorage)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans text-gray-800">
      <Header />
      
      <main className="max-w-[1200px] mx-auto py-8 w-full px-4 flex-grow">
        <h1 className="text-xl font-bold mb-6 uppercase flex items-center gap-2">
          <FaShoppingCart className="text-[#ee4d2d]" /> Giỏ hàng của tui
        </h1>

        {cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* DANH SÁCH SẢN PHẨM TRONG GIỎ */}
            <div className="flex-1 space-y-4">
              <div className="bg-white border border-orange-100 rounded-sm px-4 py-3 text-sm text-gray-600">
                {remainingForFreeShip > 0 ? (
                  <p>
                    Mua thêm <span className="font-bold text-[#ee4d2d]">{remainingForFreeShip.toLocaleString()}đ</span> để được freeship.
                  </p>
                ) : (
                  <p className="font-semibold text-green-600">Bạn đã đạt mốc freeship.</p>
                )}
                <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"
                    style={{ width: `${progressToFreeShip}%` }}
                  />
                </div>
              </div>

              {cart.map((item) => (
                <div key={item._id} className="bg-white p-4 rounded-sm shadow-sm flex items-center gap-4 border border-gray-100 transition-all hover:border-orange-200">
                  <img src={item.image} className="w-20 h-20 object-contain bg-gray-50 p-1" alt={item.name} />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium line-clamp-2 leading-5">{item.name}</h3>
                    <p className="text-[#ee4d2d] font-bold mt-1 text-sm">{item.newPrice.toLocaleString()}đ</p>
                  </div>

                  {/* BỘ TĂNG GIẢM SỐ LƯỢNG */}
                  <div className="flex items-center border border-gray-200 rounded-sm">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                      className="px-2 py-1 border-r hover:bg-gray-100 text-gray-500"
                    >
                      <FaMinus className="text-[10px]" />
                    </button>
                    <span className="px-4 text-sm font-bold w-10 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                      className="px-2 py-1 border-l hover:bg-gray-100 text-gray-500"
                    >
                      <FaPlus className="text-[10px]" />
                    </button>
                  </div>

                  {/* NÚT XÓA */}
                  <button 
                    onClick={() => removeFromCart(item._id)} 
                    className="text-gray-400 hover:text-red-500 transition-colors ml-4 p-2"
                    title="Xóa khỏi giỏ"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>

            {/* TỔNG TIỀN & THANH TOÁN */}
            <div className="w-full lg:w-[350px] bg-white p-6 rounded-sm shadow-md h-fit sticky top-28 border-t-4 border-orange-500">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Tạm tính:</span>
                  <span className="font-semibold">{subTotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Ưu đãi tạm tính:</span>
                  <span className="font-semibold text-green-600">-{estimatedDiscount.toLocaleString()}đ</span>
                </div>
                <div className="h-px bg-gray-100 my-1" />
                <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Tổng cộng ({cart.length} món):</span>
                <span className="text-2xl font-black text-[#ee4d2d]">{(subTotal - estimatedDiscount).toLocaleString()}đ</span>
                </div>
              </div>
              
              <button className="w-full bg-[#ee4d2d] text-white py-3.5 rounded-sm font-bold uppercase hover:bg-[#d73211] transition-all shadow-lg active:scale-95 mb-4">
                Mua hàng ngay
              </button>
              <Link href="/" className="block text-center text-sm font-semibold text-[#ee4d2d] hover:underline mb-4">
                Tiếp tục mua sắm
              </Link>
              
              <div className="space-y-2 border-t pt-4">
                 <p className="text-[11px] text-gray-400 italic text-center">Giao hàng nhanh từ 2-4 ngày</p>
                 <div className="flex justify-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <span className="text-[10px] font-bold border px-1">VietQR</span>
                    <span className="text-[10px] font-bold border px-1">MoMo</span>
                    <span className="text-[10px] font-bold border px-1">Visa</span>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          /* TRẠNG THÁI GIỎ TRỐNG */
          <div className="bg-white py-24 flex flex-col items-center shadow-sm rounded-sm border border-dashed border-gray-200">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6">
               <FaShoppingCart className="text-6xl text-gray-200" />
            </div>
            <p className="text-gray-500 mb-8 font-medium italic">Giỏ hàng của ông giáo đang trống rỗng!</p>
            <Link href="/" className="bg-[#ee4d2d] text-white px-12 py-3 rounded-sm font-bold uppercase hover:bg-[#d73211] transition-all shadow-md active:scale-95">
               Quay lại mua sắm ngay
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}