"use client";

import { FaFacebook, FaInstagram, FaBell, FaQuestionCircle, FaShoppingBag, FaSearch, FaCartPlus } from 'react-icons/fa';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cart = useCartStore((state) => state.cart);
  const [mounted, setMounted] = useState(false);



  // 1. Lấy từ khóa từ URL hiện tại (nếu có) để hiển thị lên ô input
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  // Cập nhật ô input nếu URL thay đổi (ví dụ khi nhấn vào logo để về trang chủ)
  useEffect(() => {
    setSearchValue(searchParams.get("q") || "");
  }, [searchParams]);

  // 2. Hàm xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn trang bị load lại

    const trimmedValue = searchValue.trim();
    if (trimmedValue) {
      // Nhảy về trang chủ kèm từ khóa ?q=...
      router.push(`/?q=${encodeURIComponent(trimmedValue)}`);
    } else {
      // Nếu xóa trắng thì về trang chủ
      router.push("/");
    }
  };

  // Giỏ hàng
  useEffect(() => { setMounted(true); }, []);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-[#ee4d2d] text-white w-full sticky top-0 z-50 shadow-lg transition-all font-sans">
      {/* 1. TOP NAVBAR: Ẩn trên Mobile */}
      <div className="hidden md:block border-b border-white/10">
        <div className="max-w-[1200px] mx-auto flex justify-between py-1.5 text-[12px] font-light px-4">
          <div className="flex gap-4 items-center font-medium">
            <span className="hover:text-gray-200 cursor-pointer border-r pr-4 border-white/20">Mời vào ứng dụng K-Market</span>
            <div className="flex items-center gap-2">
              <span>Kết nối</span>
              <FaFacebook className="text-base cursor-pointer hover:scale-110 transition-transform" />
              <FaInstagram className="text-base cursor-pointer hover:scale-110 transition-transform" />
            </div>
          </div>
          <ul className="flex gap-5 items-center font-medium text-[13px]">
            <li className="flex items-center gap-1 hover:text-gray-200 cursor-pointer"><FaBell className="text-[10px]" /> Thông báo</li>
            <li className="flex items-center gap-1 hover:text-gray-200 cursor-pointer"><FaQuestionCircle className="text-[10px]" /> Trợ giúp</li>
            <Link href="/register" className="font-bold hover:text-gray-200 border-r pr-4 border-white/20">Đăng ký</Link>
            <Link href="/login" className="font-bold hover:text-gray-200">Đăng nhập</Link>
          </ul>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="max-w-[1200px] mx-auto py-2 md:py-4 px-4">
        <div className="flex items-center justify-between gap-2 md:gap-10">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <FaShoppingBag className="text-2xl md:text-4xl group-hover:animate-bounce" />
            <span className="text-lg md:text-2xl font-black italic tracking-tighter hidden sm:inline uppercase group-hover:animate-bounce">
              K-MARKET
            </span>
          </Link>

          {/* SEARCH BAR: Dùng thẻ <form> để nhấn Enter là tìm luôn */}
          <form
            onSubmit={handleSearch}
            className="flex-1 min-w-0 flex bg-white rounded-sm p-0.5 md:p-1 shadow-sm"
          >
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Hãy tìm sản phẩm bạn mong muốn đi nào!..."
              className="w-full px-2 md:px-4 py-1.5 md:py-2 text-black outline-none text-[12px] md:text-sm placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="bg-[#fb5533] px-3 md:px-6 py-1.5 md:py-2 rounded-sm hover:bg-[#d73211] transition-colors active:scale-95"
            >
              <FaSearch className="text-white text-xs md:text-base" />
            </button>
          </form>

          {/* CART */}
          <Link href="/cart" className="relative p-2">
            <FaCartPlus className="text-3xl" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-[#ee4d2d] text-[11px] px-1.5 rounded-full font-bold border border-[#ee4d2d]">
                {totalItems}
              </span>
            )}
          </Link>

        </div>
      </div>
    </header>
  );
}