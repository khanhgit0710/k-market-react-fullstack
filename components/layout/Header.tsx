"use client";

import { FaFacebook, FaInstagram, FaBell, FaQuestionCircle, FaShoppingBag, FaSearch, FaCartPlus } from 'react-icons/fa';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  
  // Lấy hàm từ Zustand
  const cart = useCartStore((state) => state.cart);
  const setCart = useCartStore((state) => state.setCart);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  const isAdmin = user?.publicMetadata?.role === "admin";

  // 1. Xử lý Mounting để tránh lỗi Hydration
  useEffect(() => {
    setMounted(true);
    setSearchValue(searchParams.get("q") || "");
  }, [searchParams]);

  // 2. 💡 LOGIC LOGOUT: Tự động dọn kho khi User đăng xuất
  useEffect(() => {
    if (isLoaded && !user) {
      clearCart(); 
    }
  }, [user, isLoaded, clearCart]);

  // 3. 💡 LOGIC LOGIN: Hồi sinh giỏ hàng từ MongoDB
  useEffect(() => {
    const fetchCart = async () => {
      // Chỉ đòi đồ từ DB nếu máy đang TRỐNG (tránh đè đồ mới thêm)
      if (cart.length > 0) return; 

      try {
        const res = await fetch("/api/cart");
        if (res.ok) {
          const data = await res.json();
          if (data?.items?.length > 0) {
            setCart(data.items); 
          }
        }
      } catch (error) {
        console.log("DB đang trống hoặc chưa có dữ liệu");
      }
    };

    if (isLoaded && user && mounted) {
      fetchCart();
    }
  }, [user, isLoaded, mounted]); // Không bỏ 'cart' vào đây để tránh loop

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push("/");
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Tránh lỗi Render phía Server
  if (!mounted) return <header className="bg-[#ee4d2d] w-full h-[120px] shadow-lg"></header>;

  return (
    <header className="bg-[#ee4d2d] text-white w-full sticky top-0 z-50 shadow-lg font-sans">
      {/* TOP NAVBAR */}
      <div className="hidden md:block border-b border-white/10">
        <div className="max-w-[1200px] mx-auto flex justify-between py-1.5 text-[13px] px-4">
          <div className="flex gap-4 items-center">
            <span>Mời vào ứng dụng K-Market</span>
            <div className="flex items-center gap-2">
              <span>Kết nối</span>
              <FaFacebook className="cursor-pointer hover:opacity-80" />
              <FaInstagram className="cursor-pointer hover:opacity-80" />
            </div>
          </div>
          <ul className="flex gap-5 items-center font-medium">
            <li className="flex items-center gap-1 cursor-pointer hover:opacity-80 hover:underline"><FaBell /> Thông báo</li>
            <li className="flex items-center gap-1 cursor-pointer hover:opacity-80 hover:underline"><FaQuestionCircle /> Trợ giúp</li>

            <SignedOut>
              <Link href="/register" className="font-bold border-r pr-4 border-white/20 hover:opacity-80 hover:underline ">Đăng ký</Link>
              <Link href="/login" className="font-bold hover:opacity-80 hover:underline ">Đăng nhập</Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4 pl-4 border-l border-white/20">
                {isAdmin && (
                  <Link href="/admin" className="hidden lg:block text-[11px] bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-all border border-white/10 font-bold uppercase tracking-tighter shadow-sm">
                    Dashboard Sếp 🏎️
                  </Link>
                )}
                <UserButton afterSignOutUrl="/" />
              </div>
              <ThemeToggle />
            </SignedIn>
          </ul>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="max-w-[1200px] mx-auto py-3 md:py-4 px-4 flex items-center justify-between gap-4 md:gap-10">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <FaShoppingBag className="text-2xl md:text-4xl" />
          <span className="text-xl md:text-2xl font-black italic uppercase">K-MARKET</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 flex bg-white rounded-sm p-1 shadow-sm overflow-hidden">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full px-4 py-1 text-black outline-none text-sm"
          />
          <button type="submit" className="bg-[#fb5533] px-6 py-2 rounded-sm hover:opacity-90 transition-colors">
            <FaSearch className="text-white" />
          </button>
        </form>

        <Link href="/cart" className="relative p-2 flex-shrink-0 group">
          <FaCartPlus className="text-2xl md:text-3xl group-hover:scale-110 transition-transform" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-white text-[#ee4d2d] text-[10px] px-1.5 rounded-full font-bold border border-[#ee4d2d] shadow-sm leading-none animate-pulse">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}