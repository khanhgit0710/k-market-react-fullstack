import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Pagination from "@/components/product/Pagination";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import FeaturedProducts from "@/components/product/FeaturedProducts";
import { List, Flame, Filter, ChevronRight, Package } from "lucide-react"; // npm install lucide-react nếu chưa có

export const dynamic = 'force-dynamic';

export default async function Home(props: {
  searchParams: Promise<{ page?: string; category?: string; q?: string; sort?: string }>;
}) {
  const params = await props.searchParams;
  const page = Number(params.page) || 1;
  const currentCategory = params.category || "Tất cả";
  const search = params.q || "";
  const currentSort = params.sort || "newest";

  const limit = 10;
  const skip = (page - 1) * limit;

  await connectDB();

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

  const [productsRaw, totalCount, rawCategories, allProductsForFeatured] = await Promise.all([
    Product.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
    Product.distinct("category"),
    Product.find({ sold: { $gt: 50 } }).limit(10).lean()
  ]);

  const products = JSON.parse(JSON.stringify(productsRaw));
  const featuredProducts = JSON.parse(JSON.stringify(allProductsForFeatured));
  const categoriesList = ["Tất cả", ...rawCategories];
  const totalPages = Math.ceil(totalCount / limit) || 1;

  const getSortLink = (sortValue: string) => {
    const p = new URLSearchParams();
    if (currentCategory !== "Tất cả") p.set("category", currentCategory);
    if (search) p.set("q", search);
    p.set("sort", sortValue);
    return `?${p.toString()}`;
  };

  return (
    <div className="bg-[#f5f5f7] min-h-screen flex flex-col font-sans text-slate-900 overflow-x-hidden">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 flex-grow w-full">
        {/* 1. SECTION NỔI BẬT */}
        {currentCategory === "Tất cả" && !search && (
          <div className="mb-10">
             <FeaturedProducts products={featuredProducts} />
          </div>
        )}

        <div className="flex items-start gap-6">
          {/* 2. SIDEBAR - ĐÃ ĐƯỢC "GỌT GIŨA" NHỎ LẠI */}
          <aside className="hidden lg:block w-[210px] flex-shrink-0 sticky top-24 space-y-5">
            {/* Box Danh Mục - Bóp chiều rộng và padding */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1.5">
              <div className="flex items-center gap-2 px-3 py-2.5 text-slate-800 font-black text-xs uppercase tracking-wider italic border-b border-slate-50 mb-1">
                <List size={16} className="text-[#ee4d2d]" /> Danh mục
              </div>
              <nav className="space-y-0.5">
                {categoriesList.map((cat: any) => (
                  <Link
                    key={cat}
                    href={`?category=${encodeURIComponent(cat)}`}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                      currentCategory === cat
                        ? "bg-[#ee4d2d] text-white font-bold shadow-md shadow-orange-100"
                        : "text-slate-600 hover:bg-orange-50 hover:text-[#ee4d2d]"
                    }`}
                  >
                    <span className="line-clamp-1">{cat}</span>
                    <ChevronRight size={14} className={`opacity-50 flex-shrink-0 ${currentCategory === cat ? "block" : "hidden group-hover:block"}`} />
                  </Link>
                ))}
              </nav>
            </div>
            
            {/* Ảnh Quảng Cáo Nhỏ - Thêm bo góc mạnh và bóng đổ nhẹ */}
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-slate-200/70 group relative border-4 border-white">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all pointer-events-none z-[1]"></div>
                <img 
                    src="https://img.pikbest.com/templates/20241030/e-commerce-advertising-beauty-cosmetic-product-new-year-holiday-with-ribbon-in-red-poster-_11032111.jpg!w700wp" 
                    alt="Sale" 
                    className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700" 
                />
            </div>
          </aside>

          {/* 3. NỘI DUNG CHÍNH */}
          <div className="flex-1 min-w-0">
            {/* SORT BAR */}
            <div className="bg-white p-2 rounded-2xl mb-6 flex flex-wrap items-center gap-4 text-[13px] shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 px-4 text-slate-400 border-r border-slate-100 mr-2">
                <Filter size={16} />
                <span className="font-bold uppercase tracking-tighter">Sắp xếp</span>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: "newest", label: "Mới nhất" },
                  { id: "sold_desc", label: "Bán chạy" },
                  { id: "price_asc", label: "Giá thấp" },
                  { id: "price_desc", label: "Giá cao" },
                ].map((s) => (
                  <Link
                    key={s.id}
                    href={getSortLink(s.id)}
                    className={`px-5 py-2 rounded-xl font-bold transition-all ${
                      currentSort === s.id 
                      ? "bg-[#ee4d2d] text-white shadow-lg shadow-orange-100" 
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* GRID SẢN PHẨM */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((item: any) => (
                <Link href={`/product/${item._id}`} key={item._id} className="group h-full">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-[#ee4d2d]/30 hover:shadow-xl hover:shadow-slate-200 transition-all duration-500 flex flex-col h-full relative overflow-hidden active:scale-95">
                    <div className="aspect-square bg-slate-50 relative overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-[13px] font-semibold text-slate-800 line-clamp-2 leading-tight mb-2 group-hover:text-[#ee4d2d] transition-colors">
                        {item.name}
                      </h4>
                      <div className="mt-auto flex justify-between items-center">
                        <p className="text-base text-[#ee4d2d] font-black">{item.newPrice.toLocaleString()}</p>
                        <span className="text-[9px] font-bold text-slate-400">ĐÃ BÁN {item.sold || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* EMPTY STATE */}
            {products.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <Package className="mx-auto text-slate-200 mb-4" size={60} />
                <p className="text-slate-400 italic">Không tìm thấy sản phẩm nào ở đây...</p>
              </div>
            )}

            {/* PAGINATION */}
            <div className="mt-12 flex justify-center">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}