import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import  Cart  from "@/lib/models/Cart";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ items: [] });

  await connectDB();
  const userCart = await Cart.findOne({ userId });
  return NextResponse.json(userCart || { items: [] });
}

export async function POST(req: Request) {
  const { userId } = getAuth(req);
  const { items } = await req.json(); // Mảng items từ Zustand
  
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  // Lưu hoặc cập nhật giỏ hàng theo userId của Clerk
  const updatedCart = await Cart.findOneAndUpdate(
    { userId },
    { items },
    { upsert: true, new: true }
  );

  return NextResponse.json(updatedCart);
}