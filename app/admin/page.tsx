"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  newPrice: string;
  category: string;
  image: string;
}

export default function AdminPage() {
  const[products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  // READ: Lấy dữ liệu
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products ||[]);
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  },[]);

  // DELETE: Hàm xóa sản phẩm
  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Xóa thành công!");
        fetchProducts(); // Load lại danh sách sau khi xóa
      }
    } catch (error) {
      alert("Xóa thất bại!");
    }
  };

const handleEdit = (id: string) => {
    // Chuyển trang cực mượt không bị chớp trắng màn hình
    router.push(`/admin/products/${id}/edit`);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <main className="max-w-[1200px] mx-auto py-10 px-4 flex-grow w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-800 uppercase border-l-4 border-orange-500 pl-4">
            Quản trị K-Market
          </h1>
          {/* Nút CREATE (Sẽ làm ở bước sau) */}
          <button className="bg-[#ee4d2d] text-white px-6 py-2.5 rounded-sm font-bold shadow-md hover:bg-orange-600 transition-all flex items-center gap-2">
            <i className="fa-solid fa-plus"></i> Thêm Sản Phẩm Mới
          </button>
        </div>

        {/* Bảng Danh sách (Table) */}
        <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
                <th className="p-4 border-b">Hình ảnh</th>
                <th className="p-4 border-b">Tên sản phẩm</th>
                <th className="p-4 border-b">Danh mục</th>
                <th className="p-4 border-b">Giá bán</th>
                <th className="p-4 border-b text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-10 text-center text-gray-400">Đang tải dữ liệu từ MongoDB...</td></tr>
              ) : products.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors border-b">
                  <td className="p-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-sm border" referrerPolicy="no-referrer" />
                  </td>
                  <td className="p-4 font-medium text-gray-800 max-w-[300px] truncate">{item.name}</td>
                  <td className="p-4 text-sm text-gray-500">{item.category}</td>
                  <td className="p-4 font-bold text-[#ee4d2d]">{item.newPrice}</td>
                  <td className="p-4 text-center space-x-3">
                    {/* Nút UPDATE */}
                    <button onClick={() => handleEdit(item._id)}
                      className="text-blue-500 hover:text-blue-700 transition-colors" 
                      title="Sửa">
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    {/* Nút DELETE */}
                    <button 
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700 transition-colors" 
                      title="Xóa"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}