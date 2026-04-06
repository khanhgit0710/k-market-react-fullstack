import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';
import Link from "next/link";
import SafeClientVisual from "@/components/ui/SafeClientVisual";

export default function Footer() {
  return (
    <footer id="site-footer" className="mt-12 w-full border-t border-white/15 bg-gradient-to-br from-[#c9391f] via-[#e44a29] to-[#ff6336] text-white font-sans">
      <div className="mx-auto max-w-[1240px] px-4 py-12 md:py-14">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 border-b border-white/20 pb-6 text-center md:flex-row md:text-left">
          <div>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-[0.08em] text-white md:text-4xl">K-Market</h2>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-white/20"
          >
            Khám phá sản phẩm
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 lg:grid-cols-5 lg:text-left">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/90">Về K-Market</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="cursor-pointer transition-colors hover:text-yellow-200">Giới thiệu</li>
              <li className="cursor-pointer transition-colors hover:text-yellow-200">Tuyển dụng</li>
              <li className="cursor-pointer transition-colors hover:text-yellow-200">Liên hệ</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/90">Chính sách</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="cursor-pointer transition-colors hover:text-yellow-200">Chính sách bảo hành</li>
              <li className="cursor-pointer transition-colors hover:text-yellow-200">Chính sách giao nhận</li>
              <li className="cursor-pointer transition-colors hover:text-yellow-200">Chính sách bảo mật</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/90">Thông tin</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="cursor-pointer transition-colors hover:text-yellow-200">Tin tức</li>
              <li className="cursor-pointer transition-colors hover:text-yellow-200">Hướng dẫn</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/90">Tổng đài hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-white/85">
              <li>
                Mua hàng: <span className="font-bold text-yellow-200">1900.xxxx</span>
              </li>
              <li>
                Bảo hành: <span className="font-bold text-yellow-200">1900.xxxx</span>
              </li>
              <li>
                Email: <span className="font-bold text-yellow-200">cskh@kmarket.com</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center lg:items-start">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/90">Kết nối với chúng tôi</h3>
            <ul className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <li className="rounded-full border border-white/30 bg-white/10 p-2.5 text-xl text-blue-200 transition-transform hover:scale-110">
                <SafeClientVisual fallbackClassName="inline-flex h-5 w-5 items-center justify-center">
                  <FaFacebook />
                </SafeClientVisual>
              </li>
              <li className="rounded-full border border-white/30 bg-white/10 p-2.5 text-xl text-pink-200 transition-transform hover:scale-110">
                <SafeClientVisual fallbackClassName="inline-flex h-5 w-5 items-center justify-center">
                  <FaInstagram />
                </SafeClientVisual>
              </li>
              <li className="rounded-full border border-white/30 bg-white/10 p-2.5 text-xl text-white transition-transform hover:scale-110">
                <SafeClientVisual fallbackClassName="inline-flex h-5 w-5 items-center justify-center">
                  <FaTiktok />
                </SafeClientVisual>
              </li>
              <li className="rounded-full border border-white/30 bg-white/10 p-2.5 text-xl text-red-200 transition-transform hover:scale-110">
                <SafeClientVisual fallbackClassName="inline-flex h-5 w-5 items-center justify-center">
                  <FaYoutube />
                </SafeClientVisual>
              </li>
              <li className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-blue-500 text-[10px] font-bold text-white transition-transform hover:scale-110">
                Zalo
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-xs text-white/70">
          © 2025 K-Market. All rights reserved.
        </div>
      </div>
    </footer>
  );
}