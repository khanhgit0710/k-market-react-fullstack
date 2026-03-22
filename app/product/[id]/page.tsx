import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCart from "@/components/product/AddToCart";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { notFound } from "next/navigation";

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
      </main>
      <Footer />
    </div>
  );
}