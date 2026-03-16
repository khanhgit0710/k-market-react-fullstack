import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET() {
  try {
    await connectDB();
    // Lấy danh sách category duy nhất từ bảng Product
    const categories = await Product.distinct("category");
    return NextResponse.json(["Tất cả", ...categories]);
  } catch (error) {
    console.error("Lỗi API Categories:", error);
    return NextResponse.json(["Tất cả"], { status: 500 });
  }
}