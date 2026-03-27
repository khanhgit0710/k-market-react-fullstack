import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCart from "@/components/product/AddToCart";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { notFound } from "next/navigation";
import ReviewForm from "@/components/product/ReviewForm";
import FeaturedProducts from "@/components/product/FeaturedProducts";
import { Star } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;

   await connectDB();
   
   // 1. Lấy thông tin sản phẩm hiện tại
   const product = await Product.findById(id).lean();
   if (!product) return notFound();

   const randomProducts = await Product.aggregate([
   { $sample: { size: 10 } } // 👈 Lấy ngẫu nhiên 10 sản phẩm từ toàn bộ kho
]);

   // 2. Lấy danh sách sản phẩm liên quan (cùng category, khác ID hiện tại)
   const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: id }
   })
   .limit(12) // Lấy 12 cái cho slide dài đẹp
   .lean();

   // 3. Chuẩn hóa dữ liệu để tránh lỗi Serialization từ MongoDB Object sang Plain Object
   const safeProduct = { ...product, _id: product._id.toString() };
   const safeRelatedProducts = relatedProducts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
   }));

   return (
      <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans text-gray-800">
         <Header />
         
         <main className="max-w-[1200px] mx-auto py-10 px-4 flex-grow w-full">
            {/* Box nội dung chính sản phẩm */}
            <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col md:flex-row gap-10">
               <div className="w-full md:w-[450px]">
                  <img 
                     src={safeProduct.image} 
                     alt={safeProduct.name} 
                     className="w-full border border-gray-100 object-contain aspect-square" 
                  />
               </div>
               <div className="flex-1 flex flex-col gap-5">
                  <h1 className="text-2xl font-medium uppercase">{safeProduct.name}</h1>
                  <div className="bg-gray-50 p-6 flex items-center gap-5 rounded-sm border-l-4 border-orange-500">
                     <span className="text-gray-400 line-through text-xl">{safeProduct.oldPrice}</span>
                     <span className="text-4xl text-[#ee4d2d] font-black">{safeProduct.newPrice}</span>
                  </div>
                  <AddToCart product={safeProduct} />
               </div>
            </div>

            {/* Chi tiết mô tả */}
            <div className="bg-white p-8 mt-8 rounded-sm shadow-sm">
               <h2 className="bg-gray-50 p-4 text-lg font-bold uppercase mb-6">Mô tả sản phẩm</h2>
               <div className="px-4 leading-8 whitespace-pre-wrap text-[15px]">
                  {safeProduct.description || "Sản phẩm chất lượng cao, cam kết chính hãng."}
               </div>
            </div>

            {/* Phần đánh giá */}
            <div className="bg-white p-8 mt-8 rounded-sm shadow-sm">
               <h2 className="bg-gray-50 p-4 text-lg font-bold uppercase mb-6">Đánh giá sản phẩm</h2>
               <div className="px-4">
                  {/* Danh sách đánh giá mẫu */}
                  <div className="mb-10 space-y-6">
                     <div className="flex gap-4 border-b pb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                        <div>
                           <p className="text-xs font-bold">m***h (Khách hàng)</p>
                           <div className="flex text-yellow-400 my-1">
                              {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                           </div>
                           <p className="text-sm text-gray-600">Sản phẩm cực kỳ ưng ý, đóng gói cẩn thận!</p>
                           <p className="text-[10px] text-gray-400 mt-2">2026-03-26 10:30</p>
                        </div>
                     </div>
                  </div>

                  {/* Form nhập đánh giá */}
                  <ReviewForm productId={safeProduct._id} />
               </div>
            </div>

            {/* --- SLIDE SẢN PHẨM LIÊN QUAN --- */}
            {safeRelatedProducts.length > 0 && (
               <div className="mt-8">
                  <FeaturedProducts 
                     products={safeRelatedProducts} 
                     title="Sản phẩm tương tự" 
                  />
               </div>
            )}
         </main>

         <Footer />
      </div>
   );
}