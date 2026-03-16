import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Pagination from "@/components/product/Pagination";
import { categories } from "@/data/products";
import Link from "next/link";

async function getProducts(page: string, category: string) {
  try {
    const decodedCategory = decodeURIComponent(category);
    const catParam = (decodedCategory && decodedCategory !== "Tất cả")
      ? `&category=${encodeURIComponent(decodedCategory)}`
      : "";

    const url = `http://localhost:3000/api/products?page=${page}${catParam}&t=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { products: [], totalPages: 1 };
    return res.json();
  } catch (error) {
    return { products: [], totalPages: 1 };
  }
}

async function getCategories() {
  try {
    const res = await fetch("http://localhost:3000/api/categories", { cache: "no-store" });
    return res.json();
  } catch (error) {
    return ["Tất cả"];
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = params.page || "1";
  const currentCategory = params.category || "Tất cả";

  const [data, categoriesList] = await Promise.all([
    getProducts(page, currentCategory),
    getCategories()
  ]);

  const products = data.products || [];
  const totalPages = data.totalPages || 1;

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans text-gray-800 overflow-x-hidden">
      <Header />
      
      {/* Container chính: max-w-7xl (~1280px) là chuẩn nhất cho desktop */}
      <main className="w-full max-w-7xl mx-auto py-3 md:py-8 flex items-start gap-0 md:gap-5 flex-grow px-2 md:px-4">
        
        {/* SIDEBAR: Chỉ hiện từ màn hình lg trở lên */}
        <aside className="hidden lg:block w-[200px] flex-shrink-0 sticky top-28">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
              <i className="fa-solid fa-bars-staggered text-gray-700 text-sm"></i>
              <h3 className="font-bold text-[14px] uppercase text-gray-800 tracking-tight">Danh mục</h3>
            </div>

            <ul className="py-1 text-gray-600">
              {categoriesList.map((cat: string) => (
                <li key={cat}>
                  <Link
                    href={`?category=${encodeURIComponent(cat)}`}
                    className={`px-4 py-3 text-[13px] flex items-center justify-between group transition-all border-l-4 ${
                      currentCategory === cat
                        ? "border-[#ee4d2d] bg-orange-50/50 text-[#ee4d2d] font-bold"
                        : "border-transparent hover:bg-gray-50 hover:text-[#ee4d2d]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full transition-all ${currentCategory === cat ? "bg-[#ee4d2d]" : "bg-gray-300 scale-0 group-hover:scale-100"}`}></span>
                      {cat}
                    </span>
                    <i className="fa-solid fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-all"></i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4 rounded-sm overflow-hidden shadow-sm border border-gray-100">
            <img src="https://img.pikbest.com/templates/20241030/e-commerce-advertising-beauty-cosmetic-product-new-year-holiday-with-ribbon-in-red-poster-_11032111.jpg!w700wp" alt="Sale" className="w-full h-auto object-cover" />
          </div>
        </aside>

        {/* DANH SÁCH SẢN PHẨM: min-w-0 để chống tràn ngang */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 items-start">
            {products.map((item: any) => (
              <Link href={`/product/${item._id}`} key={item._id} className="group block h-full">
                <div className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-orange-500 overflow-hidden flex flex-col h-full">
                  
                  {/* Ảnh sản phẩm: Dùng aspect-square để luôn vuông vức */}
                  <div className="relative aspect-square bg-gray-50 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      referrerPolicy="no-referrer" 
                      className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  
                  {/* Nội dung sản phẩm */}
                  <div className="p-2 md:p-2.5 flex flex-col flex-1">
                    <h4 className="text-[11px] md:text-[12px] line-clamp-2 leading-tight md:leading-4 h-7 md:h-8 text-gray-700 group-hover:text-orange-600 transition-colors mb-1 md:mb-2">
                      {item.name}
                    </h4>
                    
                    <div className="mt-auto">
                      <p className="text-[10px] text-gray-400 line-through leading-none">{item.oldPrice}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm md:text-base text-[#ee4d2d] font-bold">{item.newPrice}</p>
                        <p className="hidden sm:block text-[9px] md:text-[10px] text-gray-400">{item.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* PHÂN TRANG */}
          <div className="mt-10 overflow-x-auto w-full flex justify-center">
             <Pagination totalPages={totalPages} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}