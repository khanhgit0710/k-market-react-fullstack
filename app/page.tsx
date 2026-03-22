import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Pagination from "@/components/product/Pagination";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export const dynamic = 'force-dynamic';

export default async function Home(props: {
  searchParams: Promise<{ page?: string; category?: string; q?: string; sort?: string }>;
}) {
  // 1. Await searchParams đúng chuẩn Next.js 15
  const params = await props.searchParams;
  const page = Number(params.page) || 1;
  const currentCategory = params.category || "Tất cả";
  const search = params.q || "";
  const currentSort = params.sort || "newest";

  const limit = 10;
  const skip = (page - 1) * limit;

  // 2. KẾT NỐI DATABASE TRỰC TIẾP
  await connectDB();

  // 3. LOGIC TRUY VẤN SẢN PHẨM
  let query: any = {};
  if (currentCategory !== "Tất cả") {
    query.category = { $regex: new RegExp(`^${currentCategory}$`, "i") };
  }
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  let sortOptions: any = {};
  if (currentSort === "price_asc") sortOptions = { newPrice: 1 };
  else if (currentSort === "price_desc") sortOptions = { newPrice: -1 };
  else if (currentSort === "sold_desc") sortOptions = { sold: -1 };
  else sortOptions = { createdAt: -1 };

  // 4. CHẠY LỆNH LẤY HÀNG VÀ DANH MỤC CÙNG LÚC
  const [productsRaw, totalCount, rawCategories] = await Promise.all([
    Product.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
    Product.distinct("category")
  ]);

  // Convert dữ liệu MongoDB sang JSON an toàn
  const products = JSON.parse(JSON.stringify(productsRaw));
  const categoriesList = ["Tất cả", ...rawCategories];
  const totalPages = Math.ceil(totalCount / limit) || 1;

  // Hàm tạo link Sort
  const getSortLink = (sortValue: string) => {
    const p = new URLSearchParams();
    if (currentCategory !== "Tất cả") p.set("category", currentCategory);
    if (search) p.set("q", search);
    p.set("sort", sortValue);
    return `?${p.toString()}`;
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans text-gray-800 overflow-x-hidden">
      <Header />
      <main className="max-w-7xl mx-auto py-3 md:py-8 flex items-start gap-0 md:gap-5 flex-grow w-full px-2 md:px-4">
        
        {/* SIDEBAR DYNAMIC - ĐÃ TRỞ LẠI VÀ LỢI HẠI HƠN! */}
        <aside className="hidden lg:block w-[200px] flex-shrink-0 sticky top-28">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-100 font-bold text-sm uppercase">
              <i className="fa-solid fa-list text-orange-500 text-xs"></i> Danh mục
            </div>
            <ul className="py-1">
              {categoriesList.map((cat: any) => (
                <li key={cat}>
                  <Link
                    href={`?category=${encodeURIComponent(cat)}`}
                    className={`px-4 py-3 text-[13px] flex items-center justify-between group transition-all border-l-4 ${
                      currentCategory === cat
                        ? "border-[#ee4d2d] bg-orange-50/50 text-[#ee4d2d] font-bold"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#ff8168] hover:font-bold"
                    }`}
                  >
                    <span>{cat}</span>
                    <i className="fa-solid fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-all"></i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4 rounded-sm overflow-hidden shadow-sm">
            <img src="https://img.pikbest.com/templates/20241030/e-commerce-advertising-beauty-cosmetic-product-new-year-holiday-with-ribbon-in-red-poster-_11032111.jpg!w700wp" alt="Sale" className="w-full h-auto object-cover" />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* SORT BAR */}
          <div className="bg-[#ededed] p-3 rounded-sm mb-3 flex items-center gap-4 text-[13px] text-gray-600 shadow-sm">
            <span className="hidden sm:inline font-medium">Sắp xếp theo</span>
            <div className="flex gap-2 flex-wrap">
              <Link href={getSortLink("newest")} className={`px-5 py-2 rounded-sm transition-all ${currentSort === "newest" ? "bg-[#ee4d2d] text-white" : "bg-white hover:text-[#ee4d2d]"}`}>Mới nhất</Link>
              <Link href={getSortLink("sold_desc")} className={`px-5 py-2 rounded-sm transition-all ${currentSort === "sold_desc" ? "bg-[#ee4d2d] text-white" : "bg-white hover:text-[#ee4d2d]"}`}>Bán chạy</Link>
              <Link href={getSortLink("price_asc")} className={`bg-white px-4 py-2 rounded-sm flex items-center gap-2 hover:text-[#ee4d2d] border ${currentSort === "price_asc" ? "border-[#ee4d2d] text-[#ee4d2d]" : "border-transparent"}`}>Giá: Thấp-Cao</Link>
              <Link href={getSortLink("price_desc")} className={`bg-white px-4 py-2 rounded-sm flex items-center gap-2 hover:text-[#ee4d2d] border ${currentSort === "price_desc" ? "border-[#ee4d2d] text-[#ee4d2d]" : "border-transparent"}`}>Giá: Cao-Thấp</Link>
            </div>
          </div>

          {/* GRID SẢN PHẨM */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 items-start">
            {products.map((item: any) => (
              <Link href={`/product/${item._id}`} key={item._id} className="group block h-full">
                <div className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-orange-500 overflow-hidden flex flex-col h-full">
                  <div className="relative aspect-square bg-gray-50">
                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-2.5 flex flex-col flex-1">
                    <h4 className="text-[11px] md:text-[12px] line-clamp-2 leading-tight h-7 md:h-8 mb-1">{item.name}</h4>
                    <div className="mt-auto">
                      <p className="text-sm md:text-base text-[#ee4d2d] font-bold">{item.newPrice.toLocaleString()}đ</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}