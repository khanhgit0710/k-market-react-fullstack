import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

async function getProductDetail(id: string) {
  try {
    // Gọi đến chính cái API mình vừa thông nòng lúc nãy
    const res = await fetch(`http://localhost:3000/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Lỗi fetch chi tiết:", error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductDetail(id);

  if (!product) {
    return <div className="text-center py-20 font-bold text-red-500">Sản phẩm không tồn tại trong Database!</div>;
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col">
      <Header />
      <main className="max-w-[1200px] mx-auto py-10 px-4 flex-grow w-full">
        <div className="bg-white p-6 rounded-sm shadow-sm flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-[450px]">
            <img src={product.image} alt={product.name} className="w-full border border-gray-100 shadow-sm" />
          </div>
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-2xl font-medium text-gray-800">{product.name}</h1>
            <div className="bg-gray-50 p-6 flex items-center gap-5 rounded-sm border-l-4 border-orange-500">
              <span className="text-gray-400 line-through text-lg">{product.oldPrice}</span>
              <span className="text-4xl text-[#ee4d2d] font-bold">{product.newPrice}</span>
            </div>
            <p className="text-gray-500 text-sm">Vị trí: {product.location} | Đã bán: {product.sold}</p>
            <div className="mt-auto flex gap-4">
              <button className="px-8 py-4 border border-[#ee4d2d] bg-[#ff57221a] text-[#ee4d2d] rounded-sm hover:bg-[#ff572226] font-medium">
                Thêm vào giỏ hàng
              </button>
              <button className="px-14 py-4 bg-[#ee4d2d] text-white rounded-sm hover:opacity-90 shadow-md font-medium">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}