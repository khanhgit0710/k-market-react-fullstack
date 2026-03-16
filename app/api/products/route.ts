// app/api/products/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    let category = searchParams.get("category"); // Lấy category từ URL
    
    const limit = 10;
    const skip = (page - 1) * limit;

    let query: any = {};
    
    if (category && category !== "Tất cả") {
      // Dùng Regex để tìm kiếm không phân biệt hoa thường cho chắc cú
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    const products = await Product.find(query).skip(skip).limit(limit);
    const totalCount = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      totalPages: Math.ceil(totalCount / limit) || 1,
    });
  } catch (error) {
    return NextResponse.json({ products: [], totalPages: 1 }, { status: 500 });
  }
}