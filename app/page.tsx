import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Pagination from "@/components/product/Pagination";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import FeaturedProducts from "@/components/product/FeaturedProducts";
import SafeClientVisual from "@/components/ui/SafeClientVisual";
import { List, Filter, ChevronRight, Package, ShieldCheck, Truck, RotateCcw, Star } from "lucide-react";

export const dynamic = 'force-dynamic';


export async function generateMetadata({ searchParams }: any) {
  const { q } = await searchParams;
  return {
    title: q ? `Tìm kiếm: ${q} | MyStore` : "Trang chủ | MyStore",
    description: "Nền tảng mua sắm trực tuyến hàng đầu",
  };
}

export default async function Home(props: {
  searchParams: Promise<{ page?: string; category?: string; q?: string; sort?: string }>;
}) {
  const params = await props.searchParams;
  const page = Number(params.page) || 1;
  const currentCategory = params.category || "Tất cả";
  const search = params.q || "";
  const currentSort = params.sort || "newest";

  const limit = 12;
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
  const [productsRaw, totalCount, rawCategories, allProductsForFeatured] = await Promise.all([
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
  const quickCategories = categoriesList.filter((cat: string) => cat !== "Tất cả").slice(0, 6);
  const suggestionProducts = featuredProducts.slice(0, 5);
  const topSellingPreview = [...products].sort((a: any, b: any) => (b.sold || 0) - (a.sold || 0)).slice(0, 3);
  const showcaseCategories = (rawCategories as string[]).slice(0, 4);
  const categorySectionsRaw = await Promise.all(
    showcaseCategories.map(async (categoryName) => {
      const items = await Product.find({
        category: { $regex: new RegExp(`^${categoryName}$`, "i") },
      })
        .sort({ _id: -1 })
        .limit(5)
        .lean();

      return { categoryName, items };
    })
  );
  const categorySections = JSON.parse(JSON.stringify(categorySectionsRaw));

  // Hàm tạo link Sort
  const getSortLink = (sortValue: string) => {
    const p = new URLSearchParams();
    if (currentCategory !== "Tất cả") p.set("category", currentCategory);
    if (search) p.set("q", search);
    p.set("sort", sortValue);
    return `?${p.toString()}`;
  };

  const getFakeRating = (item: any) => {
    const rawSold = item?.sold;
    const sold =
      typeof rawSold === "number"
        ? rawSold
        : Number(String(rawSold ?? "0").replace(/[^\d.-]/g, "")) || 0;
    const seedBase = String(item?._id || item?.name || "").length;
    const seed = seedBase + sold;
    const rating = 4 + ((seed % 10) / 10);
    const reviewCount = Math.max(8, Math.floor(sold * 1.3) + (seed % 31));
    return {
      rating: Math.min(5, Number(rating.toFixed(1))),
      reviewCount,
    };
  };

  return (
    <div className="bg-[#f5f5f5] dark:bg-gray-900 min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header />

      <main className="max-w-7xl mx-auto py-6 px-4 flex-grow w-full">
        {/* 1. SECTION NỔI BẬT */}
        {currentCategory === "Tất cả" && !search && featuredProducts.length > 0 && (
          <div className="mb-10">
            <FeaturedProducts products={featuredProducts} />
          </div>
        )}

        <div className="flex items-start gap-4 xl:gap-6">
          {/* 2. SIDEBAR */}
          <aside className="hidden lg:block w-[210px] flex-shrink-0 sticky top-24 space-y-5">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 p-1.5 transition-colors duration-300">
              <div className="flex items-center gap-2 px-3 py-2.5 text-slate-800 dark:text-gray-200 font-black text-xs uppercase tracking-wider border-b border-slate-50 dark:border-gray-700 mb-1">
                <SafeClientVisual fallbackClassName="inline-flex h-4 w-4 shrink-0 items-center justify-center">
                  <List size={16} className="text-[#ee4d2d]" />
                </SafeClientVisual>
                Danh mục
              </div>
              <nav className="space-y-0.5">
                {categoriesList.map((cat: any) => (
                  <Link
                    key={cat}
                    href={`?category=${encodeURIComponent(cat)}`}
                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] transition-all ${currentCategory === cat
                        ? "bg-[#ee4d2d] text-white font-bold shadow-md shadow-orange-100 dark:shadow-none"
                        : "text-slate-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-[#ee4d2d] hover:font-bold"
                      }`}
                  >
                    <span className="line-clamp-1">{cat}</span>
                    <SafeClientVisual fallbackClassName="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                      <ChevronRight
                        size={14}
                        className={`opacity-50 flex-shrink-0 ${currentCategory === cat ? "block" : "hidden group-hover:block"}`}
                      />
                    </SafeClientVisual>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg shadow-slate-200/70 dark:shadow-none group relative border-4 border-white dark:border-gray-800 transition-colors duration-300">
              <img
                src="https://img.pikbest.com/templates/20241030/e-commerce-advertising-beauty-cosmetic-product-new-year-holiday-with-ribbon-in-red-poster-_11032111.jpg!w700wp"
                alt="Sale"
                className="w-full h-auto object-cover transform transition-transform duration-700"
              />
            </div>

            <div className="rounded-2xl overflow-hidden border border-orange-100 bg-gradient-to-br from-orange-500 to-red-500 p-4 text-white shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">K-Market Ads</p>
              <h4 className="mt-1 text-sm font-black uppercase leading-tight">
                Deal 4.4 giảm đến 50%
              </h4>
              <p className="mt-2 text-[11px] text-white/90">Mua ngay để nhận mã freeship và voucher độc quyền.</p>
              <Link
                href="/?sort=sold_desc"
                className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#ee4d2d] transition hover:scale-105"
              >
                Săn deal ngay
              </Link>
            </div>
          </aside>

          {/* 3. NỘI DUNG CHÍNH */}
          <div className="flex-1 min-w-0">
            {/* SORT BAR */}
            <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl mb-6 flex flex-wrap items-center gap-4 text-[13px] shadow-sm border border-slate-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center gap-2 px-4 text-slate-400 border-r border-slate-100 dark:border-gray-700 mr-2">
                <SafeClientVisual fallbackClassName="inline-flex h-4 w-4 shrink-0 items-center justify-center">
                  <Filter size={16} />
                </SafeClientVisual>
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
                    className={`px-5 py-2 rounded-xl font-bold transition-all ${currentSort === s.id
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
              {products.map((item: any) => (
                <Link href={`/product/${item._id}`} key={item._id} className="group h-full">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-700 hover:border-[#ee4d2d]/30 hover:shadow-xl hover:shadow-slate-200 dark:hover:shadow-none transition-all duration-500 flex flex-col h-full relative overflow-hidden active:scale-95">
                    <div className="aspect-square bg-slate-50 dark:bg-gray-700 relative overflow-hidden transition-colors duration-300">
                      <img
                        src={item.image}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-contain p-5 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-4 md:p-5 flex flex-col flex-1">
                      <div className="mb-1.5 flex items-center gap-1 text-[10px] text-slate-500 dark:text-gray-400">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-600 dark:text-gray-300">{getFakeRating(item).rating}</span>
                        <span>({getFakeRating(item).reviewCount})</span>
                      </div>
                      <h4 className="text-[13px] md:text-sm font-semibold text-slate-800 dark:text-gray-200 line-clamp-2 leading-tight mb-2 group-hover:text-[#ee4d2d] transition-colors">
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
                <SafeClientVisual fallbackClassName="inline-flex h-[60px] w-[60px] shrink-0 mx-auto mb-4 items-center justify-center">
                  <Package className="mx-auto text-slate-200 dark:text-gray-600" size={60} />
                </SafeClientVisual>
                <p className="text-slate-400 italic">Không tìm thấy sản phẩm nào ở đây...</p>
              </div>
            )}

            {/* PAGINATION */}
            <div className="mt-12 flex justify-center">
              <Pagination totalPages={totalPages} />
            </div>

            {/* QUICK CATEGORIES */}
            {quickCategories.length > 0 && (
              <section className="mt-10 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors duration-300">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-gray-200">
                    Danh mục bạn có thể quan tâm
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">Xem nhanh</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickCategories.map((cat: string) => (
                    <Link
                      key={cat}
                      href={`?category=${encodeURIComponent(cat)}`}
                      className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold text-[#ee4d2d] transition-all hover:border-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white dark:border-gray-600 dark:bg-gray-700 dark:text-orange-300 dark:hover:bg-[#ee4d2d] dark:hover:text-white"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* SERVICE HIGHLIGHTS */}
            <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors duration-300">
                <div className="mb-2 flex items-center gap-2 text-[#ee4d2d]">
                  <ShieldCheck size={18} />
                  <span className="text-xs font-black uppercase tracking-wider">Hàng chính hãng</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400">Cam kết nguồn gốc rõ ràng, hỗ trợ bảo hành minh bạch.</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors duration-300">
                <div className="mb-2 flex items-center gap-2 text-[#ee4d2d]">
                  <Truck size={18} />
                  <span className="text-xs font-black uppercase tracking-wider">Giao nhanh toàn quốc</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400">Đóng gói kỹ và cập nhật trạng thái đơn hàng liên tục.</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors duration-300">
                <div className="mb-2 flex items-center gap-2 text-[#ee4d2d]">
                  <RotateCcw size={18} />
                  <span className="text-xs font-black uppercase tracking-wider">Đổi trả dễ dàng</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400">Hỗ trợ đổi trả theo chính sách, xử lý nhanh gọn cho khách.</p>
              </div>
            </section>

            {/* EXTRA PRODUCT ROW */}
            {suggestionProducts.length > 0 && (
              <section className="mt-8">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-gray-200">Gợi ý thêm cho bạn</h3>
                  <Link href="/" className="text-xs font-bold text-[#ee4d2d] hover:underline">
                    Xem thêm
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {suggestionProducts.map((item: any) => (
                    <Link href={`/product/${item._id}`} key={`suggestion-${item._id}`} className="group h-full">
                      <div className="h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ee4d2d]/30 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-none">
                        <div className="aspect-square bg-slate-50 p-3 dark:bg-gray-700">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <p className="line-clamp-2 text-xs font-semibold text-slate-700 transition-colors group-hover:text-[#ee4d2d] dark:text-gray-200">
                            {item.name}
                          </p>
                          <p className="mt-2 text-sm font-black text-[#ee4d2d]">{item.newPrice}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* CATEGORY SHOWCASE */}
            {currentCategory === "Tất cả" && !search && categorySections.length > 0 && (
              <section className="mt-10 space-y-8">
                {categorySections.map((section: any) => (
                  <div
                    key={`category-block-${section.categoryName}`}
                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors duration-300"
                  >
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-gray-200">
                        {section.categoryName}
                      </h3>
                      <Link
                        href={`?category=${encodeURIComponent(section.categoryName)}`}
                        className="text-xs font-bold text-[#ee4d2d] hover:underline"
                      >
                        Xem danh mục
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                      {section.items.map((item: any) => (
                        <Link href={`/product/${item._id}`} key={`cat-${section.categoryName}-${item._id}`} className="group h-full">
                          <div className="h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ee4d2d]/30 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-none">
                            <div className="aspect-square bg-slate-50 p-3 dark:bg-gray-700">
                              <img
                                src={item.image}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="p-3">
                              <p className="line-clamp-2 text-xs font-semibold text-slate-700 transition-colors group-hover:text-[#ee4d2d] dark:text-gray-200">
                                {item.name}
                              </p>
                              <p className="mt-2 text-sm font-black text-[#ee4d2d]">{item.newPrice}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* RIGHT RAIL */}
          <aside className="hidden xl:block w-[220px] flex-shrink-0 sticky top-24 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-orange-100 bg-gradient-to-br from-[#ff7a3d] via-[#ff6435] to-[#e94424] p-4 text-white shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">Tài trợ</p>
              <h4 className="mt-1 text-sm font-black uppercase leading-tight">
                Combo hot mỗi ngày
              </h4>
              <p className="mt-2 text-[11px] text-white/90">Flash sale cập nhật liên tục, ưu đãi có hạn cho thành viên.</p>
              <Link
                href="/?sort=price_asc"
                className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#ee4d2d] transition hover:scale-105"
              >
                Xem ngay
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors duration-300">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-gray-200">
                Gợi ý nhanh
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-slate-500 dark:text-gray-400">
                <li className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-gray-700">Sản phẩm mới cập nhật liên tục</li>
                <li className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-gray-700">Theo dõi danh mục để săn deal</li>
                <li className="rounded-xl bg-slate-50 px-3 py-2 dark:bg-gray-700">Lọc giá + bán chạy để ra quyết định nhanh</li>
              </ul>
            </div>

            {topSellingPreview.length > 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-colors duration-300">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-gray-200">
                  Bán chạy hôm nay
                </h4>
                <div className="mt-3 space-y-3">
                  {topSellingPreview.map((item: any) => (
                    <Link
                      key={`top-selling-${item._id}`}
                      href={`/product/${item._id}`}
                      className="group flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-orange-50 dark:hover:bg-gray-700"
                    >
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-50 dark:bg-gray-700">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-[11px] font-semibold text-slate-700 group-hover:text-[#ee4d2d] dark:text-gray-200">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[11px] font-black text-[#ee4d2d]">{item.newPrice}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );}