"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams(); // Lấy ID từ URL cực chuẩn cho Next.js 15 Client Component
  const id = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    oldPrice: "",
    newPrice: "",
    sold: "",
    location: "",
    category: "",
    description: "",
  });

  // 1. KÉO DỮ LIỆU CŨ VỀ ĐIỀN VÀO FORM
  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name || "",
            image: data.image || "",
            oldPrice: data.oldPrice || "",
            newPrice: data.newPrice || "",
            sold: data.sold || "",
            location: data.location || "",
            category: data.category || "",
            description: data.description || "",
          });
        }
      } catch (error) {
        alert("Lỗi khi tải dữ liệu sản phẩm!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Hàm xử lý khi gõ vào ô input
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev,[name]: value }));
  };

  // 2. LƯU DỮ LIỆU MỚI LÊN MONGODB (HÀM PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Cập nhật sản phẩm thành công!");
        router.push("/admin"); // Trượt về trang quản trị
      } else {
        alert("Có lỗi xảy ra khi lưu!");
      }
    } catch (error) {
      alert("Lỗi Server!");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-xl font-bold text-gray-500">Đang tải dữ liệu động cơ...</div>;

  return (      
      <main className="max-w-[800px] mx-auto py-10 px-4 flex-grow w-full">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-gray-500 hover:text-[#ee4d2d] transition-colors">
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </Link>
          <h1 className="text-2xl font-black uppercase border-l-4 border-[#ee4d2d] pl-3">
            Chỉnh sửa sản phẩm
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm shadow-sm border border-gray-200 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên sản phẩm */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#ee4d2d] transition-colors" />
            </div>

            {/* Link ảnh */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Link Ảnh (URL)</label>
              <input type="text" name="image" value={formData.image} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#ee4d2d] transition-colors" />
              {/* Hiển thị ảnh thu nhỏ nếu có link */}
              {formData.image && (
                <img src={formData.image} alt="Preview" className="h-20 mt-3 border rounded-sm object-contain p-1" referrerPolicy="no-referrer" />
              )}
            </div>

            {/* Giá cũ & Giá mới */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Giá cũ (VD: 210.000đ)</label>
              <input type="text" name="oldPrice" value={formData.oldPrice} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#ee4d2d] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Giá mới</label>
              <input type="text" name="newPrice" value={formData.newPrice} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#ee4d2d] transition-colors" />
            </div>

            {/* Danh mục & Vị trí */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#ee4d2d] transition-colors bg-white">
                <option value="">Chọn danh mục</option>
                <option value="Mỹ phẩm">Mỹ phẩm</option>
                <option value="Điện thoại">Điện thoại</option>
                <option value="Laptop">Laptop</option>
                <option value="Trang sức">Trang sức</option>
                <option value="Phụ kiện">Phụ kiện</option>
                <option value="Gia dụng">Gia dụng</option>
                <option value="Thời trang">Thời trang</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Vị trí (VD: Hà Nội)</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#ee4d2d] transition-colors" />
            </div>

            {/* Mô tả chi tiết */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả sản phẩm</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-[#ee4d2d] transition-colors"></textarea>
            </div>
          </div>

          {/* Nút Submit */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Link href="/admin" className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-sm transition-colors">
              Hủy
            </Link>
            <button type="submit" disabled={isSaving} className="bg-[#ee4d2d] text-white px-8 py-3 rounded-sm font-bold shadow-md hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2">
              {isSaving ? "Đang lưu..." : <><i className="fa-solid fa-floppy-disk"></i> Lưu Thay Đổi</>}
            </button>
          </div>

        </form>
      </main>
  );
}