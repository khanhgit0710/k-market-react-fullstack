import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET() {
  try {
    await connectDB();
    const data = await Product.find({}); // Lấy hết, không cần ID gì cả
    return NextResponse.json(data);
  } catch (error) {
    console.error("Lỗi API lấy hàng:", error);
    return NextResponse.json({ error: "Lỗi kết nối Server" }, { status: 500 });
  }
}