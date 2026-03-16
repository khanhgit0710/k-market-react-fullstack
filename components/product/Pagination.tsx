"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  // 1. Hàm tạo URL chuẩn: Giữ lại các params khác (như category) và chỉ đè page mới
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // 2. THUẬT TOÁN SINH DÃY SỐ THÔNG MINH (Cái não của Civic RS nè)
  const getVisiblePages = () => {
    const delta = 1; // Số trang hiển thị quanh trang hiện tại
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const pages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-1 md:gap-2 mt-12 mb-10 select-none font-sans">
      
      {/* NÚT ĐẦU: Chỉ hiện khi không ở trang 1 */}
      {currentPage > 1 && (
        <Link
          href={createPageURL(1)}
          className="px-2 md:px-4 py-2 bg-white border border-gray-200 rounded-sm hover:text-[#ee4d2d] hover:border-[#ee4d2d] transition-all text-[12px] flex items-center gap-1 shadow-sm active:scale-95"
        >
          <i className="fa-solid fa-angles-left text-[10px]"></i>
          <span className="">Đầu</span>
        </Link>
      )}

      {/* DANH SÁCH SỐ VÀ DẤU ... */}
      <div className="flex gap-1 md:gap-2 mx-1">
        {pages.map((page, index) => {
          // Nếu là dấu ba chấm
          if (page === "...") {
            return (
              <span key={index} className="w-8 h-9 md:w-10 md:h-10 flex items-center justify-center text-gray-400">
                ...
              </span>
            );
          }

          const isActive = currentPage === page;
          
          return (
            <Link
              key={index}
              href={createPageURL(page)}
              className={`w-8 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-sm text-[13px] md:text-sm font-medium transition-all border ${
                isActive 
                ? "bg-[#ee4d2d] text-white border-[#ee4d2d] shadow-md scale-110 z-10" 
                : "bg-white text-gray-600 border-gray-200 hover:border-[#ee4d2d] hover:text-[#ee4d2d]"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* NÚT CUỐI: Chỉ hiện khi chưa tới trang cuối */}
      {currentPage < totalPages && (
        <Link
          href={createPageURL(totalPages)} // Thuật toán chuẩn: Cứ nhảy về totalPages
          className="px-2 md:px-4 py-2 bg-white border border-gray-200 rounded-sm hover:text-[#ee4d2d] hover:border-[#ee4d2d] transition-all text-[12px] flex items-center justify-center gap-1 shadow-sm active:scale-95"
        >
          <span className="">Cuối</span>
          <i className="fa-solid fa-angles-right text-[10px]"></i>
        </Link>
      )}
      
    </div>
  );
}