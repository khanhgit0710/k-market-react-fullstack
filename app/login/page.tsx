"use client"; // Bắt buộc phải có dòng này để dùng được form/state
import { FaFacebook } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-[#ee4d2d] min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-sm shadow-xl p-8">
        {/* Header Form */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-medium text-gray-700">Đăng nhập</h2>
          <Link href="/" className="text-xl font-bold text-[#ee4d2d] hover:opacity-80 hover:-translate-x-1">K - Market</Link>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Email/Số điện thoại/Tên đăng nhập"
            className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-gray-500 text-sm"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-gray-500 text-sm"
          />

          <button className="w-full bg-[#ee4d2d] text-white py-3 rounded-sm uppercase font-medium hover:opacity-90 transition-all">
            Đăng nhập
          </button>
        </form>

        <div className="flex justify-between mt-4 text-xs text-blue-600">
          <a href="#" className="hover:opacity-80">Quên mật khẩu</a>
          <a href="#" className="hover:opacity-80">Đăng nhập với SMS</a>
        </div>

        {/* Hoặc đăng nhập bằng */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-300"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Hoặc</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button className="flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-sm hover:bg-gray-50">
              <FaFacebook className="text-2xl cursor-pointer text-blue-700" />
              <i className="fa-brands fa-facebook text-blue-700"></i> Facebook
            </button>
            <button className="flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-sm hover:bg-gray-50">
              <FcGoogle className="text-2xl" />
              <i className="fa-brands fa-google text-red-500 text-xl"></i> Google
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-400">
          Bạn mới biết đến K-Market?
          <Link href="/register" className="text-[#ee4d2d] font-medium ml-1">Đăng ký</Link>
        </p>
      </div>
    </div >
  );
}