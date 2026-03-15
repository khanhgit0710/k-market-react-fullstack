import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { categories } from "@/data/products";
import Link from "next/link";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store", 
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans">
      <Header />
      <main className="max-w-[1200px] mx-auto py-8 flex gap-5 flex-grow">
        {/* Sidebar */}
        <aside className="hidden lg:block w-[200px] flex-shrink-0">
          <div className="bg-white rounded-sm shadow-sm p-4 border-b-2 border-orange-500">
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 uppercase">
              <i className="fa-solid fa-list text-orange-500 text-xs"></i> Danh mục
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat} className="text-[13px] hover:text-[#ee4d2d] cursor-pointer transition-all">
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Danh sách sản phẩm từ DATABASE */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {products.map((item: any) => (
              <Link href={`/product/${item._id}`} key={item._id} className="group">
                <div className="bg-white rounded-sm shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-orange-500 h-full flex flex-col">
                  <div 
                    className="w-full pt-[100%] bg-cover bg-center" 
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></div>
                  <div className="p-2.5 flex flex-col flex-1 gap-2">
                    <h4 className="text-[12px] line-clamp-2 min-h-[32px] leading-4 text-gray-700">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="text-[10px] text-gray-400 line-through">{item.oldPrice}</span>
                      <span className="text-sm text-[#ee4d2d] font-bold">{item.newPrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-gray-50">
                      <span>{item.sold} đã bán</span>
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}