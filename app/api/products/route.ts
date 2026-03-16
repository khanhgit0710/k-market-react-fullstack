import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product"; // Nhìn hình tui thấy Product nằm trong lib/models

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({}).skip(skip).limit(limit);
    const total = await Product.countDocuments({});

    // PHẢI NHẢ RA ĐÚNG CÁI HỘP NÀY
    return NextResponse.json({
      products: products,
      totalPages: Math.ceil(total / limit) || 1
    });
  } catch (error) {
    return NextResponse.json({ products: [], totalPages: 1 }, { status: 500 });
  }
}