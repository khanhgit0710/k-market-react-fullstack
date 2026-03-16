import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddToCart from "@/components/product/AddToCart";

async function getProductDetail(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

    // Rồi sửa cái fetch thành:
    const res = await fetch(`${baseUrl}/api/products...`, { cache: "no-store" });

    if (!res.ok) return null;
    return res.json();
  } catch (error) { return null; }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductDetail(id);

  if (!product) return <div className="text-center py-20 font-bold">404 - Không thấy hàng rồi ông giáo!</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col font-sans">
      <Header />
      <main className="max-w-[1200px] mx-auto py-6 px-4 flex-grow w-full">
        {/* PHẦN TRÊN: ẢNH VÀ NÚT MUA */}
        <div className="bg-white p-5 rounded-sm shadow-sm flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-[450px]">
            <img src={product.image} alt={product.name} className="w-full border border-gray-100" />
          </div>
          <div className="flex-1 flex flex-col gap-5">
            <h1 className="text-xl font-medium text-gray-800 uppercase">{product.name}</h1>
            <div className="bg-gray-50 p-5 flex items-center gap-5 rounded-sm">
              <span className="text-gray-400 line-through text-base">{product.oldPrice}</span>
              <span className="text-3xl text-[#ee4d2d] font-bold">{product.newPrice}</span>
            </div>
            {/* Gọi cái bộ nhảy số AddToCart mình vừa làm vào đây */}
            <AddToCart />
          </div>
        </div>

        {/* PHẦN DƯỚI: MÔ TẢ CHI TIẾT (Đây là cái ông cần nè) */}
        <div className="bg-white p-6 mt-6 rounded-sm shadow-sm">
          <h2 className="bg-gray-50 p-4 text-lg font-bold text-gray-800 uppercase mb-6 border-l-4 border-orange-500">
            Chi tiết sản phẩm
          </h2>
          <div className="px-4 text-gray-700 leading-8 whitespace-pre-wrap">
            {product.description || "Đang cập nhật mô tả cho siêu phẩm này..."}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}