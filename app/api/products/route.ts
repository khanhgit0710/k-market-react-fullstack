
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");
    const search = searchParams.get("q");
    const sort = searchParams.get("sort"); // 💡 LẤY THAM SỐ SORT

    const limit = 10;
    const skip = (page - 1) * limit;

    let query: any = {};
    if (category && category !== "Tất cả") query.category = { $regex: new RegExp(`^${category}$`, "i") };
    if (search) query.name = { $regex: search, $options: "i" };

    // 💡 LOGIC SẮP XẾP
    let sortOptions: any = { createdAt: -1 }; // Mặc định là mới nhất
    if (sort === "price_asc") sortOptions = { newPrice: 1 };  // Giá thấp đến cao
    if (sort === "price_desc") sortOptions = { newPrice: -1 }; // Giá cao đến thấp
    if (sort === "sold_desc") sortOptions = { sold: -1 };      // Bán chạy nhất

    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit);
    const totalCount = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      totalPages: Math.ceil(totalCount / limit) || 1,
    });
  } catch (error) {
    return NextResponse.json({ products: [], totalPages: 1 }, { status: 500 });
  }
}