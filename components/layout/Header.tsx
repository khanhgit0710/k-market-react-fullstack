import { FaFacebook, FaInstagram, FaBell, FaQuestionCircle, FaShoppingBag, FaSearch, FaCartPlus } from 'react-icons/fa';
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#ee4d2d] text-white w-full sticky top-0 z-50 shadow-lg transition-all">
      {/* 1. TOP NAVBAR: Ẩn hoàn toàn trên Mobile (dưới 768px) cho sạch */}
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
          <ul className="flex gap-5 items-center font-medium">
            <li className="flex items-center gap-1 hover:text-gray-200 cursor-pointer"><FaBell className="text-[10px]"/> Thông báo</li>
            <li className="flex items-center gap-1 hover:text-gray-200 cursor-pointer"><FaQuestionCircle className="text-[10px]"/> Trợ giúp</li>
            <Link href="/register" className="font-bold hover:text-gray-200 border-r pr-4 border-white/20">Đăng ký</Link>
            <Link href="/login" className="font-bold hover:text-gray-200">Đăng nhập</Link>
          </ul>
        </div>
      </div>

      {/* 2. MAIN HEADER: Tự động co giãn */}
      <div className="max-w-[1200px] mx-auto py-2 md:py-4 px-4">
        <div className="flex items-center justify-between gap-2 md:gap-10">
          
          {/* LOGO: Nhỏ lại trên mobile, to trên desktop */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <FaShoppingBag className="text-2xl md:text-4xl group-hover:animate-bounce" />
            <span className="text-lg md:text-2xl font-black tracking-tighter group-hover:text-gray-100 transition-colors">
              K-MARKET
            </span>
          </Link>

          {/* SEARCH BAR: Chiếm hết chỗ trống */}
          <div className="flex-1 flex bg-white rounded-sm p-0.5 md:p-1 shadow-inner overflow-hidden">
            <input 
              type="text" 
              placeholder="Hãy tìm sản phảm bạn mong muốn đi nào!..." 
              className="w-full px-2 md:px-4 py-1.5 md:py-2 text-black outline-none text-[12px] md:text-sm placeholder:text-gray-400"
            />
            <button className="bg-[#fb5533] px-3 md:px-6 py-1.5 md:py-2 rounded-sm hover:bg-[#d73211] transition-colors active:scale-95">
              <FaSearch className="text-white text-xs md:text-base" />
            </button>
          </div>

          {/* CART: Luôn hiện ở góc phải */}
          <Link href="/cart" className="relative cursor-pointer group p-2 flex-shrink-0">
            <FaCartPlus className="text-2xl md:text-3xl group-hover:scale-110 transition-transform" />
            {/* Badge số lượng */}
            <span className="absolute top-0 right-0 bg-white text-[#ee4d2d] text-[10px] md:text-[11px] px-1.5 py-0.5 rounded-full font-bold border border-[#ee4d2d] shadow-sm leading-none">
              0
            </span>
          </Link>
          
        </div>
      </div>
    </header>
  );
}