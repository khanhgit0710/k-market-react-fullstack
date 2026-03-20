import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Pagination from "@/components/product/Pagination";
import Link from "next/link";


async function getProducts(page: string, category: string, search: string) {
  try {
    // 💡 DÙNG localhost KHI CODE Ở MÁY, DÙNG LINK VERCEL KHI DEPLOY
    // const baseUrl = "http://localhost:3000"; 
    const baseUrl = "https://k-market-react-fullstack.vercel.app";

    const catParam = (category && category !== "Tất cả") ? `&category=${encodeURIComponent(category)}` : "";
    const searchParam = search ? `&q=${encodeURIComponent(search)}` : ""; // <--- PHẢI CÓ DÒNG NÀY

    const url = `${baseUrl}/api/products?page=${page}${catParam}${searchParam}`;

    console.log("--- ĐANG GỌI API TẠI: ---", url);

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { products: [], totalPages: 1 };

    const result = await res.json();
    return {
      products: result.products || [],
      totalPages: result.totalPages || 1
    };
  } catch (error) {
    return { products: [], totalPages: 1 };
  }
}

// 2. Hàm lấy Danh mục (Fetch Categories)
async function getCategories() {
  try {
    const baseUrl = "https://k-market-react-fullstack.vercel.app";
    const res = await fetch(`${baseUrl}/api/categories`, { cache: "no-store" });
    if (!res.ok) return ["Tất cả"];
    return res.json();
  } catch (error) {
    return ["Tất cả"];
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = params.page || "1";
  const currentCategory = params.category || "Tất cả";
  const search = params.q || "";

  // 💡 ĐỒNG BỘ TÊN BIẾN: Lấy ra đúng tên categoriesList để bên dưới dùng
  const [productData, categoriesList] = await Promise.all([
    getProducts(page, currentCategory, search),
    getCategories(),
  ]);

  const products = productData.products;
  const totalPages = productData.totalPages;

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans text-gray-800 overflow-x-hidden">
      <Header />

      <main className="max-w-7xl mx-auto py-3 md:py-8 flex items-start gap-0 md:gap-5 flex-grow w-full px-2 md:px-4">

        {/* SIDEBAR */}
        <aside className="hidden lg:block w-[200px] flex-shrink-0 sticky top-28">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-100 font-bold text-sm uppercase text-gray-900 flex items-center gap-2">
              <i className="fa-solid fa-list text-orange-500 text-xs"></i> Danh mục
            </div>
            <ul className="py-1">
              {/* DÙNG ĐÚNG TÊN categoriesList */}
              {categoriesList.map((cat: string) => (
                <li key={cat}>
                  <Link
                    href={`?category=${encodeURIComponent(cat)}`}
                    className={`px-4 py-3 text-[13px] flex items-center justify-between group transition-all border-l-4 ${currentCategory === cat
                      ? "border-[#ee4d2d] bg-orange-50/50 text-[#ee4d2d] font-bold hover:border-[#f38b76]"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#ffc2b6] hover:font-bold hover:border-[#ffc2b6]"
                      }`}
                  >
                    <span>{cat}</span>
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

        {/* LIST HÀNG */}
        <div className="flex-1 min-w-0">
          {search && (
            <div className="mb-4 text-[14px]">
              Kết quả tìm kiếm cho: <span className="text-[#ee4d2d] font-bold">"{search}"</span>
            </div>
          )}

          {/* Thanh Sắp Xếp (Sort Bar) */}
          <div className="bg-[#ededed] p-3 rounded-sm mb-3 flex items-center gap-4 text-sm text-gray-600">
            <span className="hidden sm:inline">Sắp xếp theo</span>
            <div className="flex gap-2 flex-wrap">
              <Link href="?sort=newest" className="bg-white px-5 py-2 rounded-sm hover:text-[#ee4d2d]">Mới nhất</Link>
              <Link href="?sort=sold_desc" className="bg-white px-5 py-2 rounded-sm hover:text-[#ee4d2d]">Bán chạy</Link>

              {/* Dropdown hoặc Nút giá đơn giản */}
              <Link href="?sort=price_asc" className="bg-white px-5 py-2 rounded-sm flex items-center gap-2 hover:text-[#ee4d2d]">
                Giá: Thấp đến Cao <i className="fa-solid fa-arrow-up-short-wide text-[10px]"></i>
              </Link>
              <Link href="?sort=price_desc" className="bg-white px-5 py-2 rounded-sm flex items-center gap-2 hover:text-[#ee4d2d]">
                Giá: Cao đến Thấp <i className="fa-solid fa-arrow-down-short-wide text-[10px]"></i>
              </Link>
            </div>
          </div>


          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 items-start">
            {products.map((item: any) => (
              <Link href={`/product/${item._id}`} key={item._id} className="group block h-full">
                <div className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-orange-500 overflow-hidden flex flex-col h-full">
                  <div className="relative aspect-square bg-gray-50 flex-shrink-0">
                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-2 md:p-2.5 flex flex-col flex-1">
                    <h4 className="text-[11px] md:text-[12px] line-clamp-2 leading-tight md:leading-4 h-7 md:h-8 text-gray-700 group-hover:text-orange-600 transition-colors mb-1 md:mb-2">{item.name}</h4>
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

          <div className="mt-10 overflow-x-auto w-full flex justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}