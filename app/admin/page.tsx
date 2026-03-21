import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export default async function AdminDashboard() {
  await connectDB();
  const totalProducts = await Product.countDocuments({});
  const categories = await Product.distinct("category");

  return (
    <div className="space-y-8 text-gray-800">
      <h1 className="text-3xl font-bold">Chào sếp Khánh!</h1>
      
      {/* Các ô chỉ số (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm uppercase font-bold">Tổng sản phẩm</p>
          <p className="text-4xl font-black mt-2">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm uppercase font-bold">Danh mục</p>
          <p className="text-4xl font-black mt-2">{categories.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-gray-500 text-sm uppercase font-bold">Lượt truy cập</p>
          <p className="text-4xl font-black mt-2">1,204</p>
        </div>
      </div>

      {/* Nút bấm nhanh */}
      <div className="mt-10">
         <button className="bg-[#ee4d2d] text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-all">
            + Thêm sản phẩm mới
         </button>
      </div>
    </div>
  );
}