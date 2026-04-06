import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCart from "@/components/product/AddToCart";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Review } from "@/lib/models/Review";
import { notFound } from "next/navigation";
import ReviewForm from "@/components/product/ReviewForm";
import FeaturedProducts from "@/components/product/FeaturedProducts";
import SafeClientVisual from "@/components/ui/SafeClientVisual";
import { Star } from "lucide-react";
import Link from "next/link";

function formatReviewCount(n: number) {
   if (n >= 1000) {
      const k = n / 1000;
      return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
   }
   return String(n);
}

function maskDisplayName(name: string) {
   const t = name.trim();
   if (t.length <= 1) return `${t || "?"}**`;
   if (t.length === 2) return `${t[0]}*`;
   return `${t[0]}***${t[t.length - 1]}`;
}

function formatReviewDate(iso: string) {
   try {
      return new Intl.DateTimeFormat("vi-VN", {
         dateStyle: "short",
         timeStyle: "short",
         timeZone: "Asia/Ho_Chi_Minh",
      }).format(new Date(iso));
   } catch {
      return iso;
   }
}

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
   const { id } = await params;

   await connectDB();

   // 1. Lấy thông tin sản phẩm hiện tại
   const product = await Product.findById(id).lean();
   if (!product) return notFound();

   const reviews = await Review.find({ product: id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

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
   const avgRating = typeof product.averageRating === "number" ? product.averageRating : 0;
   const reviewCount = typeof product.reviewCount === "number" ? product.reviewCount : 0;
   const safeProduct = { ...product, _id: product._id.toString() };
   const safeReviews = reviews.map((r) => ({
      _id: r._id.toString(),
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
   }));
   const safeRelatedProducts = relatedProducts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
   }));
   const safeRandomProducts = randomProducts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
   }));

   return (
      <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans text-gray-800">
         <Header />

         <main className="max-w-[1200px] mx-auto py-10 px-4 flex-grow w-full">
            <div className="mb-4 text-xs text-gray-500">
               <Link href="/" className="hover:text-[#ee4d2d]">Trang chủ</Link>
               <span className="mx-1">/</span>
               <Link href={`/?category=${encodeURIComponent(String(safeProduct.category || ""))}`} className="hover:text-[#ee4d2d]">
                  {safeProduct.category || "Sản phẩm"}
               </Link>
               <span className="mx-1">/</span>
               <span className="font-semibold text-gray-700">{safeProduct.name}</span>
            </div>

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
                  {/* Rating Section */}
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                     <div className="flex text-[#ee4d2d] items-center">
                        <span className="font-medium text-lg mr-2 border-b border-[#ee4d2d]">
                           {reviewCount > 0 ? avgRating.toFixed(1) : "—"}
                        </span>
                        <SafeClientVisual fallbackClassName="inline-flex h-4 w-[92px] shrink-0 gap-0.5 items-center">
                           {[...Array(5)].map((_, i) => (
                              <Star
                                 key={i}
                                 size={16}
                                 fill={reviewCount > 0 && i < Math.round(avgRating) ? "currentColor" : "none"}
                                 strokeWidth={1}
                                 className={reviewCount === 0 ? "text-gray-300" : ""}
                              />
                           ))}
                        </SafeClientVisual>
                     </div>
                     <div className="h-4 w-[1px] bg-gray-300"></div>
                     <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                        <span className="font-medium text-black border-b border-black">
                           {formatReviewCount(reviewCount)}
                        </span>
                        <span className="text-gray-500 capitalize">Đánh giá</span>
                     </div>
                     <div className="h-4 w-[1px] bg-gray-300"></div>
                     <div className="flex items-center gap-1.5">
                        <span className="font-medium text-black">4.5k</span>
                        <span className="text-gray-500 capitalize">Đã bán</span>
                     </div>
                  </div>
                  <div className="bg-gray-50 p-6 flex items-center gap-5 rounded-sm border-l-4 border-orange-500">
                     <span className="text-gray-400 line-through text-xl">{safeProduct.oldPrice}</span>
                     <span className="text-4xl text-[#ee4d2d] font-black">{safeProduct.newPrice}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                     <div className="rounded-lg bg-orange-50 border border-orange-100 px-3 py-2 text-[#c44122]">Chính hãng 100%</div>
                     <div className="rounded-lg bg-orange-50 border border-orange-100 px-3 py-2 text-[#c44122]">Hỗ trợ đổi trả 7 ngày</div>
                     <div className="rounded-lg bg-orange-50 border border-orange-100 px-3 py-2 text-[#c44122]">Giao nhanh toàn quốc</div>
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
                  <div className="mb-10 space-y-6">
                     {safeReviews.length === 0 ? (
                        <p className="text-sm text-gray-500">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                     ) : (
                        safeReviews.map((r) => (
                           <div key={r._id} className="flex gap-4 border-b pb-4">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                              <div>
                                 <p className="text-xs font-bold">
                                    {maskDisplayName(r.userName)}{" "}
                                    <span className="text-gray-400 font-normal">(Khách hàng)</span>
                                 </p>

                                 <SafeClientVisual fallbackClassName="flex flex-row items-center h-3 w-[68px] shrink-0 gap-0.5 my-1 text-yellow-400">
                                    {/* Thêm thẻ div có class flex ở đây để dàn hàng ngang */}
                                    <div className="flex flex-row items-center gap-0.5 my-1 text-yellow-400">
                                       {[...Array(5)].map((_, i) => (
                                          <Star
                                             key={i}
                                             size={12}
                                             fill={i < r.rating ? "currentColor" : "none"}
                                          />
                                       ))}
                                    </div>
                                 </SafeClientVisual>

                                 <p className="text-sm text-gray-600 whitespace-pre-wrap">{r.comment}</p>
                                 <p className="text-[10px] text-gray-400 mt-2">
                                    {formatReviewDate(r.createdAt)}
                                 </p>
                              </div>
                           </div>
                        ))
                     )}
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

            {safeRandomProducts.length > 0 && (
               <div className="mt-8">
                  <FeaturedProducts
                     products={safeRandomProducts}
                     title="Có thể bạn sẽ thích"
                  />
               </div>
            )}
         </main>

         <Footer />
      </div>
   );
}