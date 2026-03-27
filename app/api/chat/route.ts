import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
// IMPORT TRỰC TIẾP FILE MODEL ĐỂ ĐĂNG KÝ SCHEMA VỚI MONGOOSE (QUAN TRỌNG KHI DEPLOY)
import "@/lib/models/Product"; 

// Cấu hình cho Vercel (Gói Hobby cho phép tối đa 10s-15s, cứ thêm vào cho chắc)
export const maxDuration = 30; 
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Kết nối MongoDB
    await connectDB();

    // 2. Lấy Model Product (Đảm bảo Schema đã được đăng ký)
    const Product = mongoose.models.Product;

    if (!Product) {
      throw new Error("Không tìm thấy Model Product. Check lại file @/lib/models/Product nhé!");
    }

    // 3. Lấy 10 sản phẩm mới nhất để làm ngữ cảnh cho AI
    const realProducts = await Product.find({}).limit(10).lean();

    // 4. Xử lý dữ liệu sản phẩm thành chuỗi văn bản (Chống crash lỗi toLocaleString)
    const productContext = realProducts.length > 0 
      ? realProducts.map((p: any) => {
          const priceVal = Number(p.price);
          const priceDisplay = (isNaN(priceVal) || p.price === null || p.price === undefined)
            ? "Liên hệ" 
            : `${priceVal.toLocaleString('vi-VN')}đ`;
            
          return `- Sản phẩm: ${p.name} | Giá: ${priceDisplay} | Mô tả: ${p.description || 'Sản phẩm chất lượng từ K-Market'}`;
        }).join("\n")
      : "Hiện tại danh mục sản phẩm đang được cập nhật.";

    // 5. Gọi Groq AI bằng Fetch (Bản llama-3.3-70b cực mạnh)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", 
        messages: [
          {
            role: "system",
            content: `Bạn là trợ lý ảo thông minh, thân thiện của cửa hàng K-Market. 
            
            DANH SÁCH SẢN PHẨM CÓ TRONG KHO CỦA SHOP:
            ${productContext}
            
            QUY TẮC PHẢI TUÂN THỦ:
            1. Chỉ tư vấn các sản phẩm có tên trong danh sách trên.
            2. Nếu khách hỏi sản phẩm không có (thực phẩm, rau củ...), hãy khéo léo từ chối và gợi ý các đồ điện tử đang có.
            3. Trình bày bằng Markdown: Bôi đậm **Tên sản phẩm**, dùng icon (📱, 💻, ✨) cho sinh động.
            4. Luôn báo đúng giá niêm yết trong danh sách.
            5. Xưng hô lịch sự (Bạn/Tôi hoặc Quý khách).`
          },
          { role: "user", content: message }
        ],
        temperature: 0.6, // Để AI trả lời ổn định, không bị "bay" quá
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Groq API: ${data.error.message}`);
    }

    const botText = data.choices[0].message.content;
    return NextResponse.json({ text: botText });

  } catch (error: any) {
    console.error("LỖI RUNTIME K-MARKET:", error.message);
    
    // Trả về lỗi chi tiết để Khánh dễ debug trên giao diện
    return NextResponse.json({ 
      text: `Hệ thống gặp sự cố: ${error.message}. Thử lại sau nhé Khánh!` 
    }, { status: 500 });
  }
}