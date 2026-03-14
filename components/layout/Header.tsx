import { FaFacebook, FaInstagram, FaBell, FaQuestionCircle, FaShoppingBag, FaSearch, FaCartPlus } from 'react-icons/fa';
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#ee4d2d] text-white w-full shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between py-2 text-[13px] font-light">
        <div className="flex gap-4 items-center">
          <span className="hover:opacity-80 cursor-pointer border-r pr-4 border-white/30">Mời vào ứng dụng K-Market</span>
          <div className="flex items-center gap-2">
            <span>Kết nối</span>
            <FaFacebook className="text-lg cursor-pointer" />
            <FaInstagram className="text-lg cursor-pointer" />
          </div>
        </div>
        <ul className="flex gap-4 items-center">
          <li className="flex items-center gap-1 hover:opacity-80 cursor-pointer"><FaBell /> Thông báo</li>
          <li className="flex items-center gap-1 hover:opacity-80 cursor-pointer"><FaQuestionCircle /> Trợ giúp</li>
          <Link href="/register" className="font-bold hover:opacity-80 cursor-pointer border-r pr-4 border-white/30">
            Đăng ký
          </Link>
          <Link href="/login" className="font-bold hover:opacity-80 cursor-pointer">
            Đăng nhập
          </Link>
        </ul>
      </div>


      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-2">
        <div className="hover:opacity-50 flex items-center gap-2 text-3xl py- font-bold cursor-pointer">
          <FaShoppingBag />
          <span className="hover:opacity-90  text-xl text-center">K - Market</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-12 flex bg-white rounded-sm p-1 shadow-sm">
          <input 
            type="text" 
            placeholder="Mời bạn tìm sản phẩm!" 
            className="w-full px-4 py-2 text-black outline-none text-sm"
          />
          <button className="bg-[#fb5533] px-6 py-2 rounded-sm hover:opacity-90">
            <FaSearch className="text-white" />
          </button>
        </div>

        {/* Cart */}
        <div className="relative cursor-pointer group">
          <FaCartPlus className="text-3xl" />
          <span className="absolute -top-2 -right-3 bg-white text-[#ee4d2d] text-[12px] px-[6px] py-[1px] rounded-full font-bold border border-[#ee4d2d]">
            0
          </span>
        </div>
      </div>
    </header>
  );
}