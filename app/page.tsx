import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Pagination from "@/components/product/Pagination";
import { categories } from "@/data/products";
import Link from "next/link";

async function getProducts(page: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/products?page=${page}&t=${Date.now()}`, {
      cache: "no-store", 
    });
    
    const result = await res.json();
    
    // LOGIC TỰ SỬA LỖI:
    let finalProducts = [];
    let finalPages = 1;

    if (Array.isArray(result)) {
      // Nếu API vẫn "lỳ" nhả mảng (như cái hình ông chụp)
      finalProducts = result;
      finalPages = 1;
    } else {
      // Nếu API đã ngoan, nhả đúng Object
      finalProducts = result.products || [];
      finalPages = result.totalPages || 1;
    }

    return { products: finalProducts, totalPages: finalPages };
  } catch (error) {
    return { products: [], totalPages: 1 };
  }
}

export default async function Home({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = params.page || "1";

  const { products, totalPages } = await getProducts(page);

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans">
      <Header />
      <main className="max-w-[1200px] mx-auto py-8 flex items-start gap-5 flex-grow w-full px-4 text-gray-800">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[190px] flex-shrink-0 bg-white rounded-sm shadow-sm p-4 border-b-2 border-orange-500">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2 uppercase"><i className="fa-solid fa-list text-orange-500 text-xs"></i> Danh mục</h3>
          <ul className="space-y-3">
            {categories.map((cat) => (
              <li key={cat} className="text-[13px] hover:text-[#ee4d2d] cursor-pointer">{cat}</li>
            ))}
          </ul>
        </aside>

        {/* List Hàng & Phân trang */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 min-h-[600px]">
            {products.length > 0 ? products.map((item: any) => (
              <Link href={`/product/${item._id}`} key={item._id} className="group bg-white rounded-sm shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-transparent hover:border-orange-500 overflow-hidden flex flex-col">
                  <div className="w-full relative pt-[100%] bg-gray-50">
                    <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="absolute top-0 left-0 w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-2.5 flex flex-col flex-1">
                    <h4 className="text-[12px] line-clamp-2 h-8 leading-4 mb-2">{item.name}</h4>
                    <div className="mt-auto">
                      <p className="text-[10px] text-gray-400 line-through">{item.oldPrice}</p>
                      <p className="text-sm text-[#ee4d2d] font-bold">{item.newPrice}</p>
                    </div>
                  </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-20 text-gray-400 italic">Đang cập nhật kho hàng...</div>
            )}
          </div>

          {/* BỘ PHÂN TRANG: HIỆN LÊN CHUẨN CHỈ */}
          <div className="mt-12 flex justify-center">
             <Pagination totalPages={totalPages} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}