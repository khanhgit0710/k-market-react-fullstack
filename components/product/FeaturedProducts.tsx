"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"; // Cài lucide-react hoặc dùng i fa-solid

export default function FeaturedProducts({ products }: { products: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const featuredList = products.slice(0, 10);
  if (featuredList.length === 0) return null;

  return (
    <div className="mt-16 relative group">
      {/* Tiêu đề xịn xò hơn */}
      <div className="flex items-end gap-3 mb-6 px-2">
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#ee4d2d] to-orange-400 text-white px-4 py-2 rounded-tr-2xl rounded-bl-2xl shadow-lg">
          <Flame size={20} className="animate-bounce" />
          <h2 className="text-lg font-extrabold uppercase tracking-wider">
            Gợi Ý Hôm Nay
          </h2>
        </div>
        <div className="h-[2px] flex-grow bg-gray-200 mb-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#ee4d2d] w-1/3 animate-slide"></div>
        </div>
      </div>

      {/* Nút điều hướng nổi lên trên Card */}
      <button 
        onClick={() => scroll("left")}
        className="absolute left-[-20px] top-[60%] -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ee4d2d] hover:text-white border border-gray-100"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={() => scroll("right")}
        className="absolute right-[-20px] top-[60%] -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ee4d2d] hover:text-white border border-gray-100"
      >
        <ChevronRight size={24} />
      </button>

      {/* Danh sách sản phẩm */}
      <div 
        ref={scrollRef} 
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-2 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {featuredList.map((item, index) => (
          <Link 
            href={`/product/${item._id}`} 
            key={item._id} 
            className="w-[200px] md:w-[220px] shrink-0 snap-start block group/card"
          >
            <div className="bg-white rounded-2xl border border-gray-100 transition-all duration-500 h-full flex flex-col overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 relative">
              
              {/* Badge Top Search hoặc Rank */}
              <div className="absolute top-0 left-0 z-[1] bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-xl shadow-md">
                TOP {index + 1}
              </div>

              {/* Hình ảnh với hiệu ứng Zoom nhẹ */}
              <div className="w-full relative pt-[100%] bg-gradient-to-b from-gray-50 to-white">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-700 group-hover/card:scale-110"
                />
              </div>

              {/* Nội dung thông tin */}
              <div className="p-4 flex flex-col flex-1 bg-white">
                <h4 className="text-[13px] font-semibold line-clamp-2 leading-snug h-10 text-gray-700 group-hover/card:text-[#ee4d2d] transition-colors">
                  {item.name}
                </h4>
                
                <div className="mt-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-[#ee4d2d] font-black">
                      {item.newPrice}
                    </span>
                    {/* Giả lập phần trăm giảm giá cho nó đẹp */}
                    <span className="text-[10px] text-orange-500 bg-orange-50 px-1 rounded border border-orange-100">
                      -{Math.floor(Math.random() * 20) + 5}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    {/* Thanh progress "Đã bán" nhìn cho nguy hiểm */}
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-2">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 w-[70%] rounded-full"></div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                      Đã bán {item.sold || "1.2k"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hiệu ứng viền phát sáng khi hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover/card:border-[#ee4d2d]/20 rounded-2xl pointer-events-none transition-all"></div>
            </div>
          </Link>
        ))}
      </div>

      {/* CSS Animation cho thanh line ở tiêu đề */}
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-slide {
          animation: slide 3s infinite linear;
        }
      `}</style>
    </div>
  );
}