import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCart from "@/components/product/AddToCart";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { notFound } from "next/navigation";
import ReviewForm from "@/components/product/ReviewForm";
import { Star } from "lucide-react"; // Cài lucide-react hoặc dùng i fa-solid

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;

   await connectDB();
   // 💡 GỌI TRỰC TIẾP DB, DÙNG LEAN ĐỂ NHẸ MÁY
   const product = await Product.findById(id).lean();

   if (!product) return notFound();

   // Convert ID sang string để tránh lỗi serialize
   const safeProduct = { ...product, _id: product._id.toString() };

   return (
      <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans text-gray-800">
         <Header />
         <main className="max-w-[1200px] mx-auto py-10 px-4 flex-grow w-full">
            <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col md:flex-row gap-10">
               <div className="w-full md:w-[450px]">
                  <img src={safeProduct.image} alt={safeProduct.name} className="w-full border border-gray-100 object-contain aspect-square" />
               </div>
               <div className="flex-1 flex flex-col gap-5">
                  <h1 className="text-2xl font-medium uppercase">{safeProduct.name}</h1>
                  <div className="bg-gray-50 p-6 flex items-center gap-5 rounded-sm border-l-4 border-orange-500">
                     <span className="text-gray-400 line-through">{safeProduct.oldPrice}</span>
                     <span className="text-4xl text-[#ee4d2d] font-black">{safeProduct.newPrice}</span>
                  </div>
                  <AddToCart product={safeProduct} />
               </div>
            </div>
            <div className="bg-white p-8 mt-8 rounded-sm shadow-sm">
               <h2 className="bg-gray-50 p-4 text-lg font-bold uppercase mb-6">Mô tả sản phẩm</h2>
               <div className="px-4 leading-8 whitespace-pre-wrap text-[15px]">{safeProduct.description || "Hàng hiệu xịn xò!"}</div>
            </div>

            <div className="bg-white p-8 mt-8 rounded-sm shadow-sm">
               <h2 className="bg-gray-50 p-4 text-lg font-bold uppercase mb-6">Đánh giá sản phẩm</h2>
               <div className="bg-white p-8 mt-8 rounded-sm shadow-sm">
                  <div className="px-4">
                     {/* Phần danh sách đánh giá mẫu */}
                     <div className="mb-10 space-y-6">
                        <div className="flex gap-4 border-b pb-4">
                           <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                           <div>
                              <p className="text-xs font-bold">m***h (Khách hàng)</p>
                              <div className="flex text-yellow-400 my-1"><Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /> <Star size={12} fill="currentColor" /></div>
                              <p className="text-sm text-gray-600">Sản phẩm cực kỳ ưng ý, đóng gói cẩn thận!</p>
                              <p className="text-[10px] text-gray-400 mt-2">2026-03-26 10:30</p>
                           </div>
                        </div>
                     </div>

                     {/* Form nhập đánh giá */}
                     <ReviewForm productId={safeProduct._id} />
                  </div>
               </div>
            </div>
         </main>
         <Footer />
      </div>
   );
}