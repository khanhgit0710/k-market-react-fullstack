"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";

interface FeaturedProductsProps {
  products: any[];
  title?: string; // Thêm prop title để tùy biến
}

export default function FeaturedProducts({ products, title = "Gợi Ý Hôm Nay" }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12 relative group">
      {/* Tiêu đề động */}
      <div className="flex items-end gap-3 mb-6 px-2">
        <div className="flex items-center gap-2 bg-gradient-to-r from-[#ee4d2d] to-orange-400 text-white px-4 py-2 rounded-tr-2xl rounded-bl-2xl shadow-lg">
          <Flame size={20} className="animate-bounce" />
          <h2 className="text-lg font-extrabold uppercase tracking-wider">
            {title}
          </h2>
        </div>
        <div className="h-[2px] flex-grow bg-gray-200 mb-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#ee4d2d] w-1/3 animate-slide"></div>
        </div>
      </div>

      {/* Nút điều hướng */}
      <button 
        onClick={() => scroll("left")}
        className="absolute left-[-15px] top-[60%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ee4d2d] hover:text-white border border-gray-100"
      >
        <ChevronLeft size={20} />
      </button>

      <button 
        onClick={() => scroll("right")}
        className="absolute right-[-15px] top-[60%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ee4d2d] hover:text-white border border-gray-100"
      >
        <ChevronRight size={20} />
      </button>

      {/* List sản phẩm */}
      <div 
        ref={scrollRef} 
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-2 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((item, index) => (
          <Link 
            href={`/product/${item._id}`} 
            key={item._id} 
            className="w-[180px] md:w-[220px] shrink-0 snap-start block group/card"
          >
            <div className="bg-white rounded-xl border border-gray-100 transition-all duration-500 h-full flex flex-col overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 relative">
              
              <div className="absolute top-0 left-0 z-[1] bg-orange-600 text-white text-[9px] font-bold px-2 py-1 rounded-br-lg shadow-md">
                GỢI Ý
              </div>

              <div className="w-full relative pt-[100%] bg-white">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute top-0 left-0 w-full h-full object-contain p-3 transition-transform duration-500 group-hover/card:scale-105"
                />
              </div>

              <div className="p-3 flex flex-col flex-1">
                <h4 className="text-[12px] font-medium line-clamp-2 h-9 text-gray-700 group-hover/card:text-[#ee4d2d]">
                  {item.name}
                </h4>
                
                <div className="mt-3 flex items-center justify-between">
                   <span className="text-md text-[#ee4d2d] font-bold">
                     {item.newPrice}
                   </span>
                   <span className="text-[10px] text-gray-400">
                     Đã bán {item.sold || "100+"}
                   </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-slide {
          animation: slide 4s infinite linear;
        }
      `}</style>
    </div>
  );
}