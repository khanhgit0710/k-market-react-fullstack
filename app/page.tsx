import Header from "@/components/layout/Header";
import { products, categories } from "@/data/products";

export default function Home() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <Header />
      
      <main className="max-w-[1200px] mx-auto mt-6 flex gap-4">
        {/* Sidebar - Cột trái (2 phần) */}
        <aside className="w-2/12">
          <div className="bg-white rounded-sm shadow-sm p-4">
            <h3 className="font-bold border-b pb-3 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-list"></i> DANH MỤC
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat} className="text-sm hover:text-[#ee4d2d] cursor-pointer transition-colors">
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product List - Cột phải (10 phần) */}
        <div className="w-10/12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {products.map((item) => (
              <div key={item.id} className="bg-white rounded-sm shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all cursor-pointer group">
                {/* Image */}
                <div 
                  className="w-full h-48 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${item.image})` }}
                ></div>
                
                {/* Content */}
                <div className="p-3">
                  <h4 className="text-[13px] line-clamp-2 mb-2 group-hover:text-[#ee4d2d]">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-400 line-through text-xs">{item.oldPrice}</span>
                    <span className="text-[#ee4d2d] font-semibold">{item.newPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-[12px] text-gray-500">
                    <span>{item.sold} đã bán</span>
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}