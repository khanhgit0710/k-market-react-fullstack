import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCart from "@/components/product/AddToCart";

async function getProductDetail(id: string) {
  try {
    const baseUrl = "https://k-market-react-fullstack.vercel.app";
    const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) { return null; }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductDetail(id);

  if (!product) return <div className="text-center py-20 font-bold uppercase text-red-500 font-sans">404 - Sản phẩm không tồn tại!</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans">
      <Header />
      <main className="max-w-[1200px] mx-auto py-6 px-4 flex-grow w-full">
        <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-[450px]">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full border border-gray-100 object-contain aspect-square" 
            />
          </div>
          <div className="flex-1 flex flex-col gap-5">
            <h1 className="text-xl font-medium text-gray-800 uppercase">{product.name}</h1>
            <div className="bg-gray-50 p-5 flex items-center gap-5 rounded-sm">
              <span className="text-gray-400 line-through text-base">{product.oldPrice}</span>
              <span className="text-3xl text-[#ee4d2d] font-bold">{product.newPrice}</span>
            </div>
            
            {/* 💡 TRUYỀN DỮ LIỆU SẢN PHẨM VÀO ĐÂY */}
            <AddToCart product={product} />
          </div>
        </div>

        <div className="bg-white p-6 mt-6 rounded-sm shadow-sm border-t-2 border-orange-500">
          <h2 className="bg-gray-50 p-4 text-lg font-bold text-gray-800 uppercase mb-6">
            Chi tiết sản phẩm
          </h2>
          <div className="px-4 text-gray-700 leading-8 whitespace-pre-wrap text-sm">
            {product.description || "Sản phẩm chính hãng, cam kết chất lượng tốt nhất từ K-Market."}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}