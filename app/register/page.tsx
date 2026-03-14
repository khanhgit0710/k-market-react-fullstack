"use client";

import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="bg-[#ee4d2d] min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-sm shadow-xl p-8">
                {/* Header Form */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-medium text-gray-700">Đăng ký</h2>
                    <Link href="/" className="text-xl font-bold text-[#ee4d2d] hover:opacity-80 hover:-translate-x-1">K - Market</Link>
                </div>

                {/* Form */}
                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Họ và tên"
                        className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-gray-500 text-sm"
                    />
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
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-gray-500 text-sm"
                    />

                    <button className="w-full bg-[#ee4d2d] text-white py-3 rounded-sm uppercase font-medium hover:opacity-90 transition-all">
                        Đăng ký
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-gray-400">
                    Bạn đã có tài khoản?
                    <Link href="/login" className="text-[#ee4d2d] font-medium ml-1">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}