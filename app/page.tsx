import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Pagination from "@/components/product/Pagination";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import FeaturedProducts from "@/components/product/FeaturedProducts";
import { List, Filter, ChevronRight, Package } from "lucide-react"; 

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

  // 1. Build Query (Bộ lọc)
  let query: any = {};
  if (currentCategory !== "Tất cả") {
    query.category = { $regex: new RegExp(`^${currentCategory}$`, "i") };
  }
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // 2. Build Sort (Sắp xếp)
  let sortOptions: any = {};
  if (currentSort === "price_asc") sortOptions = { newPrice: 1 }; // MongoDB dùng 1 cho tăng dần
  else if (currentSort === "price_desc") sortOptions = { newPrice: -1 }; // -1 cho giảm dần
  else if (currentSort === "sold_desc") sortOptions = { sold: -1 };
  else sortOptions = { _id: -1 }; // Mặc định mới nhất

  // 3. Fetch Data trực tiếp từ MongoDB (Cực nhanh)
  // Sửa lại cú pháp Promise.all cho chuẩn Mongoose
  const[productsRaw, totalCount, rawCategories, allProductsForFeatured] = await Promise.all([
    Product.find(query).sort(sortOptions).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
    Product.distinct("category"),
    Product.find({}).limit(8).lean() // Lấy tạm 8 món làm nổi bật
  ]);

  // Ép kiểu để truyền xuống Client Component không bị lỗi
  const products = JSON.parse(JSON.stringify(productsRaw));
  const featuredProducts = JSON.parse(JSON.stringify(allProductsForFeatured));
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
    // 💡 FIX LỖI DARK MODE: Đã bỏ cái chữ 'className=' dư thừa
    <div className="bg-[#f5f5f5] dark:bg-gray-900 min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 flex-grow w-full">
        {/* 1. SECTION NỔI BẬT */}
        {currentCategory === "Tất cả" && !search && featuredProducts.length > 0 && (
          <div className="mb-10">
             <FeaturedProducts products={featuredProducts} />
          </div>
        )}

        <div className="flex items-start gap-6">
          {/* 2. SIDEBAR */}
          <aside className="hidden lg:block w-[210px] flex-shrink-0 sticky top-24 space-y-5">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 p-1.5 transition-colors duration-300">
              <div className="flex items-center gap-2 px-3 py-2.5 text-slate-800 dark:text-gray-200 font-black text-xs uppercase tracking-wider border-b border-slate-50 dark:border-gray-700 mb-1">
                <List size={16} className="text-[#ee4d2d]" /> Danh mục
              </div>
              <nav className="space-y-0.5">
                {categoriesList.map((cat: any) => (
                  <Link
                    key={cat}
                    href={`?category=${encodeURIComponent(cat)}`}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                      currentCategory === cat
                        ? "bg-[#ee4d2d] text-white font-bold shadow-md shadow-orange-100 dark:shadow-none"
                        : "text-slate-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-[#ee4d2d] hover:font-bold"
                    }`}
                  >
                    <span className="line-clamp-1">{cat}</span>
                    <ChevronRight size={14} className={`opacity-50 flex-shrink-0 ${currentCategory === cat ? "block" : "hidden group-hover:block"}`} />
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-slate-200/70 dark:shadow-none group relative border-4 border-white dark:border-gray-800 transition-colors duration-300">
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
            <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl mb-6 flex flex-wrap items-center gap-4 text-[13px] shadow-sm border border-slate-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center gap-2 px-4 text-slate-400 border-r border-slate-100 dark:border-gray-700 mr-2">
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
                      ? "bg-[#ee4d2d] text-white shadow-lg shadow-orange-100 dark:shadow-none" 
                      : "bg-slate-50 dark:bg-gray-700 text-slate-500 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-600"
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
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 hover:border-[#ee4d2d]/30 hover:shadow-xl hover:shadow-slate-200 dark:hover:shadow-none transition-all duration-500 flex flex-col h-full relative overflow-hidden active:scale-95">
                    <div className="aspect-square bg-slate-50 dark:bg-gray-700 relative overflow-hidden transition-colors duration-300">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-[13px] font-semibold text-slate-800 dark:text-gray-200 line-clamp-2 leading-tight mb-2 group-hover:text-[#ee4d2d] transition-colors">
                        {item.name}
                      </h4>
                      <div className="mt-auto flex justify-between items-center">
                        <p className="text-base text-[#ee4d2d] font-black">{item.newPrice}</p>
                        <span className="text-[9px] font-bold text-slate-400">ĐÃ BÁN {item.sold || 0}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* EMPTY STATE */}
            {products.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-slate-200 dark:border-gray-700 transition-colors duration-300">
                <Package className="mx-auto text-slate-200 dark:text-gray-600 mb-4" size={60} />
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