"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Pencil, Trash2, Search,
  ChevronLeft, ChevronRight, Loader2, Package, X, Save
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  newPrice: string;
  category: string;
  image: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // State đóng mở Modal
  const itemsPerPage = 8;
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/products?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!res.ok) throw new Error("Lỗi kết nối Server");

      const data = await res.json();

      // 💡 CHIÊU SENIOR: Đảm bảo lấy được mảng sản phẩm từ mọi cấu trúc data
      const allProducts = data.products || (Array.isArray(data) ? data : []);

      // 💡 FIX LỖI SEARCH: Nếu là trang Admin, hãy set trực tiếp vào state chính
      // và reset lại filter nếu cần để user thấy ngay món mới
      setProducts(allProducts);

      // Nếu bạn có một state riêng cho việc hiển thị kết quả search (filteredProducts)
      // thì phải cập nhật cả nó nữa:
      searchTerm(allProducts);

    } catch (error) {
      console.error("Lỗi fetch Admin Search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xóa sản phẩm này?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Xóa thành công!");
        fetchProducts();
      }
    } catch (error) {
      alert("Xóa thất bại!");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 font-sans relative">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
              Quản trị <span className="text-orange-500">K-Market</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                placeholder="Tìm tên sản phẩm..."
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none w-full md:w-64 transition-all bg-white"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Nút mở Modal */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#ee4d2d] hover:bg-[#d73211] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-200 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus size={20} /> Thêm Mới
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                  <th className="p-5">Sản phẩm</th>
                  <th className="p-5">Danh mục</th>
                  <th className="p-5">Giá niêm yết</th>
                  <th className="p-5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <Loader2 className="animate-spin mx-auto text-orange-500" size={40} />
                      <p className="mt-4 text-slate-400 font-medium">Đang truy xuất...</p>
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr key={item._id} className="hover:bg-orange-50/30 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                            <img src={item.image} className="w-full h-full object-contain p-1" alt={item.name} referrerPolicy="no-referrer" />
                          </div>
                          <span className="font-bold text-slate-700 line-clamp-1 max-w-[200px]">{item.name}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-5 font-black text-[#ee4d2d] text-lg">{item.newPrice}</td>
                      <td className="p-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => router.push(`/admin/products/${item._id}/edit`)}
                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-400">
                      <Package size={48} className="mx-auto mb-3 opacity-20" />
                      Không tìm thấy sản phẩm nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân Trang Section */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 font-semibold">
              Hiển thị {currentItems.length} / {filteredProducts.length} sản phẩm
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="w-10 h-10 flex items-center justify-center rounded-xl border bg-white text-slate-400 hover:text-orange-500 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all shadow-sm ${currentPage === num
                    ? "bg-[#ee4d2d] text-white"
                    : "bg-white border text-slate-600 hover:border-orange-500"
                    }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="w-10 h-10 flex items-center justify-center rounded-xl border bg-white text-slate-400 hover:text-orange-500 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL THÊM SẢN PHẨM --- */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={() => {
          fetchProducts();
          setSearchTerm("");
        }
        } // Reset lại search để dễ thấy sản phẩm mới})

      />
    </div>
  );
}

// --- COMPONENT MODAL (Tách ra cho dễ nhìn) ---
function AddProductModal({ isOpen, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);

  // 💡 LỖI SỐ 1 ĐÃ FIX: Phải khai báo State formData ở ngay trong Component này!
  const [formData, setFormData] = useState({
    name: "",
    newPrice: "",
    category: "Chọn danh mục",
    image: "",
    sold: "0", // Nên để là chuỗi "0" thay vì số 0 nếu schema của ông là String
    oldPrice: "",
    location: "TP. Hồ Chí Minh",
    description: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 💡 LỖI SỐ 2 ĐÃ FIX: Đảm bảo gọi API tạo mới bằng method POST
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Nhập kho thành công!");

        // Reset lại form cho trống trơn
        setFormData({
          name: "", newPrice: "", category: "Chọn danh mục", image: "", sold: "0", oldPrice: "", location: "TP. Hồ Chí Minh", description: ""
        });

        onRefresh(); // Gọi lại hàm fetchProducts ở trang chính để load hàng mới
        onClose();   // Đóng Modal lại
      } else {
        const errorData = await res.json();
        console.error("Lỗi từ Server:", errorData);
        alert("❌ Lỗi rồi thêm sản phẩm. Hãy kiểm tra lại!");
      }
    } catch (error) {
      alert("Không gọi được Server!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý gõ phím chung cho gọn
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header Modal */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            Thêm <span className="text-[#ee4d2d]">Sản Phẩm</span>
          </h2>
          <button onClick={onClose} className="p-2 bg-white hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-all shadow-sm border border-slate-100">
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5 pl-1">Tên sản phẩm</label>
            <input
              required
              type="text"
              name="name" // Cực kỳ quan trọng để handleChange nó nhận diện
              value={formData.name}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all font-medium text-slate-700"
              placeholder="Ví dụ: Samsung Galaxy S24 Ultra"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5 pl-1">Giá bán</label>
              <input
                required
                type="text"
                name="newPrice"
                value={formData.newPrice}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all font-bold text-[#ee4d2d]"
                placeholder="20.000.000đ"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5 pl-1">Danh mục</label>
              <select
                name="category"
                value={formData.category}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all font-medium text-slate-700"
                onChange={handleChange}
              >
                <option value="Gia dụng">Gia dụng</option>
                <option value="Điện thoại">Điện thoại</option>
                <option value="Laptop">Laptop</option>
                <option value="Phụ kiện">Phụ kiện</option>
                <option value="Tai nghe">Tai nghe</option>
                <option value="Mỹ phẩm">Mỹ phẩm</option>
                <option value="Trang sức">Trang sức</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5 pl-1">Đường dẫn ảnh (URL)</label>
            <input
              required
              type="text"
              name="image"
              value={formData.image}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-xs text-blue-600 font-medium"
              placeholder="https://images..."
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1 ml-1">Mô tả sản phẩm</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium text-slate-700"
              placeholder="Nhập mô tả chi tiết sản phẩm..."
            />
          </div>

          {/* Nút Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-black py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 uppercase tracking-wider text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? "Đang xử lý..." : "Xác nhận lưu kho"}
          </button>
        </form>

      </div>
    </div>
  );
}
