import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white text-gray-600 pt-16 pb-8 w-full mt-12 border-t border-gray-200 font-sans">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-4 text-center md:text-left">

                    {/* Cột 1 */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider">VỀ K-MARKET</h3>
                        <ul className="space-y-2">
                            <li className="hover:text-[#ee4d2d] cursor-pointer">Giới thiệu</li>
                            <li className="hover:text-[#ee4d2d] cursor-pointer">Tuyển dụng</li>
                            <li className="hover:text-[#ee4d2d] cursor-pointer">Liên hệ</li>
                        </ul>
                    </div>

                    {/* Cột 2: */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider">CHÍNH SÁCH</h3>
                        <ul className="space-y-2">
                            <li className="hover:text-[#ee4d2d] cursor-pointer">Chính sách bảo hành</li>
                            <li className="hover:text-[#c98072] cursor-pointer">Chính sách giao nhận</li>
                            <li className="hover:text-[#ee4d2d] cursor-pointer">Chính sách bảo mật</li>
                        </ul>
                    </div>

                    {/* Cột 3*/}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider">THÔNG TIN</h3>
                        <ul className="space-y-2">
                            <li className="hover:text-[#ee4d2d] cursor-pointer">Tin tức</li>
                            <li className="hover:text-[#ee4d2d] cursor-pointer">Hướng dẫn</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 uppercase">TỔNG ĐÀI HỖ TRỢ</h4>
                        <ul className="space-y-2">
                            <li>Mua hàng: <span className="text-blue-600 font-bold">1900.xxxx</span></li>
                            <li>Bảo hành: <span className="text-blue-600 font-bold">1900.xxxx</span></li>
                            <li>Email: <span className="text-blue-600 font-bold">cskh@kmarket.com</span></li>
                        </ul>
                    </div>

                    {/* Cột 4 */}
                    <div className="font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider">
                        <h3 className="text-sm font-bold text-gray-700">KẾT NỐI VỚI CHÚNG TÔI</h3>
                        <ul className="flex justify-item-center item-between mt-4 gap-4">
                            <li className="text-2xl text-blue-600 cursor-pointer hover:scale-110 transition-transform">
                                <FaFacebook />
                            </li>
                            <li className="text-2xl text-pink-500 cursor-pointer hover:scale-110 transition-transform">
                                <FaInstagram />
                            </li>
                            <li className="text-2xl text-gray-800 cursor-pointer hover:scale-110 transition-transform">
                                <FaTiktok />
                            </li>
                            <li className="text-2xl text-red-600 cursor-pointer hover:scale-110 transition-transform">
                                <FaYoutube />
                            </li>
                            <li className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold cursor-pointer hover:scale-110 transition-transform">Zalo
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="text-center mt-10 text-xs text-gray-400">
                    © 2025 K-Market. All rights reserved. Built with Aula S75 Pro
                </div>
            </div>
        </footer>
    );
}