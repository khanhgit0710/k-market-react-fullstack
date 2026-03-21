import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Lấy thông tin từ hệ thống bảo mật Clerk
  const { sessionClaims } = await auth();

  // 2. Kiểm tra quyền: Nếu không phải sếp Khánh (admin), đá ra trang chủ ngay!
  if (sessionClaims?.metadata?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* SIDEBAR ADMIN SANG CHẢNH */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col shadow-2xl">
        <div className="p-8 text-2xl font-black italic text-orange-500 border-b border-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-shield-halved"></i> K-ADMIN
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link href="/admin" className="block p-3 bg-orange-500 rounded-lg font-bold shadow-lg transition-all">
            <i className="fa-solid fa-chart-pie mr-2"></i> Tổng quan
          </Link>
          <div className="block p-3 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer">
            <i className="fa-solid fa-box-open mr-2"></i> Quản lý sản phẩm
          </div>
          <div className="block p-3 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer">
            <i className="fa-solid fa-truck-ramp-box mr-2"></i> Đơn hàng
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800">
           <Link href="/" className="text-xs text-gray-500 hover:text-orange-500 flex items-center gap-2 transition-all">
              <i className="fa-solid fa-arrow-left"></i> Quay lại cửa hàng
           </Link>
        </div>
      </aside>

      {/* VÙNG LÀM VIỆC CỦA SẾP */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}