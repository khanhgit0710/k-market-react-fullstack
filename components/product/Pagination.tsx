"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-10 select-none font-sans">
      
      {/* 1. Nút TRƯỚC: Chỉ hiện khi không phải trang 1 */}
      {currentPage > 1 && (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-sm hover:text-[#ee4d2d] hover:border-[#ee4d2d] transition-all text-[13px] flex items-center gap-1 shadow-sm"
        >
          <i className="fa-solid fa-chevron-left text-[10px]"></i>
          <span>Trước</span>
        </Link>
      )}

      {/* 2. Danh sách số trang */}
      <div className="flex gap-2 mx-1">
        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;
          const isActive = currentPage === page;
          
          return (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-sm text-sm font-medium transition-all border ${
                isActive 
                ? "bg-[#ee4d2d] text-white border-[#ee4d2d] shadow-md" 
                : "bg-white text-gray-600 border-gray-200 hover:border-[#ee4d2d] hover:text-[#ee4d2d]"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* 3. Nút SAU: Chỉ hiện khi chưa tới trang cuối */}
      {currentPage < totalPages && (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-3 py-2 bg-white border border-gray-200 rounded-sm hover:text-[#ee4d2d] hover:border-[#ee4d2d] transition-all text-[13px] flex items-center gap-1 shadow-sm"
        >
          <span>Sau</span>
          <i className="fa-solid fa-chevron-right text-[10px]"></i>
        </Link>
      )}
      
    </div>
  );
}