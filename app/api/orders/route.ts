// app/api/orders/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newOrder = await Order.create(body);
    return NextResponse.json(newOrder);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi đặt hàng" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    // Admin lấy toàn bộ đơn hàng, xếp cái mới nhất lên đầu
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi lấy đơn hàng" }, { status: 500 });
  }
}