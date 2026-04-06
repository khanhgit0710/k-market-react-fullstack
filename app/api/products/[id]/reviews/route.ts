import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { currentUser, getAuth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import { Review } from "@/lib/models/Review";

async function syncProductReviewStats(productId: string) {
  const oid = new mongoose.Types.ObjectId(productId);
  const stats = await Review.aggregate([
    { $match: { product: oid } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const avg = stats[0]?.avg ?? 0;
  const count = stats[0]?.count ?? 0;
  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
}

function displayUserName(user: Awaited<ReturnType<typeof currentUser>>) {
  if (!user) return "Khách";
  const first = user.firstName?.trim();
  const last = user.lastName?.trim();
  if (first && last) return `${first} ${last}`;
  if (first) return first;
  if (user.username) return user.username;
  const email = user.emailAddresses[0]?.emailAddress;
  if (email) return email.split("@")[0] || email;
  return "Khách";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }
    const product = await Product.findById(id).select("averageRating reviewCount").lean();
    if (!product) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }
    const reviews = await Review.find({ product: id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    const list = reviews.map((r) => ({
      _id: r._id.toString(),
      userId: r.userId,
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    }));
    return NextResponse.json({
      reviews: list,
      averageRating: product.averageRating ?? 0,
      reviewCount: product.reviewCount ?? 0,
    });
  } catch (e) {
    console.error("GET reviews:", e);
    return NextResponse.json({ error: "Lỗi tải đánh giá" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để đánh giá" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    const body = await request.json();
    const rating = Number(body.rating);
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Điểm đánh giá từ 1 đến 5" }, { status: 400 });
    }
    if (!comment) {
      return NextResponse.json({ error: "Nội dung đánh giá không được để trống" }, { status: 400 });
    }
    if (comment.length > 2000) {
      return NextResponse.json({ error: "Nội dung quá dài" }, { status: 400 });
    }

    const user = await currentUser();
    const userName = displayUserName(user);

    await Review.findOneAndUpdate(
      { product: id, userId },
      { product: id, userId, userName, rating, comment },
      { upsert: true, new: true, runValidators: true }
    );

    await syncProductReviewStats(id);

    const updated = await Product.findById(id).select("averageRating reviewCount").lean();
    return NextResponse.json({
      message: "Đã lưu đánh giá",
      averageRating: updated?.averageRating ?? 0,
      reviewCount: updated?.reviewCount ?? 0,
    });
  } catch (e: unknown) {
    console.error("POST review:", e);
    if (e && typeof e === "object" && "code" in e && (e as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "Bạn đã đánh giá sản phẩm này" }, { status: 409 });
    }
    return NextResponse.json({ error: "Không thể lưu đánh giá" }, { status: 500 });
  }
}
