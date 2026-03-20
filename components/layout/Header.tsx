"use client";

import { FaFacebook, FaInstagram, FaBell, FaQuestionCircle, FaShoppingBag, FaSearch, FaCartPlus } from 'react-icons/fa';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/store/useCartStore";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut
} from "@clerk/nextjs";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cart = useCartStore((state) => state.cart);
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setMounted(true);
    setSearchValue(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      router.push("/");
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted) return null; // Tránh lỗi Hydration

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
            <li className="flex items-center gap-1 cursor-pointer"><FaBell /> Thông báo</li>
            <li className="flex items-center gap-1 cursor-pointer"><FaQuestionCircle /> Trợ giúp</li>

            {/* 💡 LOGIC LOGIN/LOGOUT NẰM GỌN Ở ĐÂY */}
            <SignedOut>
              <Link href="/register" className="font-bold border-r pr-4 border-white/20">Đăng ký</Link>
              <Link href="/login" className="font-bold border-r pr-4 border-white/20">Đăng nhập</Link>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
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
          <button type="submit" className="bg-[#fb5533] px-6 py-2 rounded-sm hover:opacity-90">
            <FaSearch className="text-white" />
          </button>
        </form>

        <Link href="/cart" className="relative p-2 flex-shrink-0">
          <FaCartPlus className="text-2xl md:text-3xl" />
          {totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-white text-[#ee4d2d] text-[10px] px-1.5 rounded-full font-bold border border-[#ee4d2d]">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}