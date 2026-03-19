// app/api/products/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");
    const search = searchParams.get("q"); // Lấy từ khóa 'q' từ URL

    const limit = 10;
    const skip = (page - 1) * limit;

    // 💡 TẠO BỘ LỌC QUERY
    let query: any = {};
    
    // 1. Lọc theo danh mục (nếu có)
    if (category && category !== "Tất cả") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // 2. Lọc theo tìm kiếm (ĐÂY LÀ CHỖ QUAN TRỌNG NHẤT)
    if (search && search.trim() !== "") {
      // Tìm các sản phẩm mà tên có chứa từ khóa (không phân biệt hoa thường)
      query.name = { $regex: search.trim(), $options: "i" };
    }

    // Soi thử xem query nó ra cái gì trong Terminal VS Code
    console.log("--- KHO HÀNG ĐANG LỌC THEO: ---", JSON.stringify(query));

    const products = await Product.find(query).skip(skip).limit(limit);
    const totalCount = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      totalPages: Math.ceil(totalCount / limit) || 1,
    });
  } catch (error) {
    console.error("Lỗi API:", error);
    return NextResponse.json({ products: [], totalPages: 1 }, { status: 500 });
  }
}