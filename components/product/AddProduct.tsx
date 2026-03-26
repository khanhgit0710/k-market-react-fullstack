"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";

export default function AddProductModal({ isOpen, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    newPrice: "",
    category: "Gia dụng",
    image: "",
    sold: 0
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Thêm sản phẩm thành công!");
        onRefresh(); // Gọi hàm load lại danh sách ở trang Admin
        onClose();   // Đóng modal
      }
    } catch (error) {
      alert("Lỗi khi thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">Thêm Sản Phẩm Mới</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tên sản phẩm</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              placeholder="Nhập tên sản phẩm..."
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Giá bán</label>
              <input
                required
                type="text"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Ví dụ: 200.000đ"
                onChange={(e) => setFormData({...formData, newPrice: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Danh mục</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Gia dụng">Gia dụng</option>
                <option value="Điện thoại">Điện thoại</option>
                <option value="Laptop">Laptop</option>
                <option value="Phụ kiện">Phụ kiện</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Link hình ảnh (URL)</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="https://..."
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ee4d2d] hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Lưu Sản Phẩm
          </button>
        </form>
      </div>
    </div>
  );
}