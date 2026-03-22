import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Pagination from "@/components/product/Pagination";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const currentCategory = params.category || "Tất cả";
  const search = params.q || "";

  const limit = 10;
  const skip = (page - 1) * limit;

  // 💡 GỌI TRỰC TIẾP DATABASE (Tốc độ bàn thờ, không lỗi build)
  await connectDB();
  
  let query: any = {};
  if (currentCategory !== "Tất cả") {
    query.category = { $regex: new RegExp(`^${currentCategory}$`, "i") };
  }
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const products = await Product.find(query).skip(skip).limit(limit).lean();
  const totalCount = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit) || 1;

  // Lấy danh mục động từ DB
  const rawCategories = await Product.distinct("category");
  const categoriesList = ["Tất cả", ...rawCategories];

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans text-gray-800 overflow-x-hidden">
      <Header />
      <main className="max-w-7xl mx-auto py-3 md:py-8 flex items-start gap-0 md:gap-5 flex-grow w-full px-2 md:px-4">
        
        {/* SIDEBAR */}
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
                    className={`px-4 py-3 text-[13px] flex items-center justify-between group transition-all border-l-4 ${currentCategory === cat
                      ? "border-[#ee4d2d] bg-orange-50/50 text-[#ee4d2d] font-bold"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#ee4d2d]"
                      }`}
                  >
                    <span>{cat}</span>
                    <i className="fa-solid fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-all"></i>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* LIST SẢN PHẨM */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3 items-start">
            {products.map((item: any) => (
              <Link href={`/product/${item._id.toString()}`} key={item._id.toString()} className="group block h-full text-gray-800">
                <div className="bg-white rounded-sm shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-orange-500 overflow-hidden flex flex-col h-full">
                  <div className="relative aspect-square bg-gray-50">
                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-2 md:p-2.5 flex flex-col flex-1">
                    <h4 className="text-[11px] md:text-[12px] line-clamp-2 leading-tight h-7 md:h-8 mb-1">{item.name}</h4>
                    <div className="mt-auto">
                      <p className="text-[10px] text-gray-400 line-through leading-none">{item.oldPrice}</p>
                      <p className="text-sm md:text-base text-[#ee4d2d] font-bold">{item.newPrice}</p>
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