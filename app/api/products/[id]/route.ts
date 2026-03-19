import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15 phải await params
    
    // 💡 TÌM THEO ID THẬT CỦA MONGODB
    const product = await Product.findById(id);
    
    if (!product) return NextResponse.json({ error: "Hết hàng rồi" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi ID" }, { status: 500 });
  }
}