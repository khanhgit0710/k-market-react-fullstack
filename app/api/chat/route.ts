import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";

// Định nghĩa Interface để TypeScript không báo lỗi khi map dữ liệu
interface IProduct {
    name: string;
    price: number;
    description?: string;
    category?: string;
}

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        // 1. Kết nối MongoDB
        await connectDB();

        /** * 2. Lấy Model Product an toàn
         * Trong Next.js API, model có thể đã được compile ở các route khác.
         * Nếu dùng import trực tiếp đôi khi sẽ bị lỗi Overwrite.
         */
        const Product = mongoose.models.Product || mongoose.model("Product");

        // 3. Lấy danh sách sản phẩm thực tế (Lấy tối đa 10 cái để tránh quá tải Prompt)
        const realProducts = await Product.find({}).limit(10).lean() as IProduct[];

        // 4. Chuyển data thành văn bản Context
        // Dùng toLocaleString('vi-VN') để hiển thị tiền VND cho đẹp
        const productContext = realProducts.length > 0
            ? realProducts.map(p => {
                // Ép kiểu Number để chắc chắn toLocaleString chạy được
                // Nếu không có giá (undefined/null) thì hiện là "Liên hệ"
                const priceVal = Number(p.price);
                const priceDisplay = isNaN(priceVal) || p.price === null || p.price === undefined
                    ? "Liên hệ"
                    : `${priceVal.toLocaleString('vi-VN')}đ`;

                return `- Sản phẩm: ${p.name} | Giá: ${priceDisplay} | Mô tả: ${p.description || 'Chính hãng K-Market'}`;
            }).join("\n")
            : "Hiện tại kho hàng đang cập nhật, chưa có sản phẩm cụ thể.";

        // 5. Gọi Groq AI (Dùng Fetch để "bất tử" phiên bản)
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
                        content: `Bạn là trợ lý ảo thông minh của cửa hàng K-Market.
            
            ĐÂY LÀ DANH SÁCH SẢN PHẨM TRONG DATABASE CỦA SHOP:
            ${productContext}
            
            QUY TẮC TƯ VẤN:
            1. Chỉ tư vấn sản phẩm dựa trên danh sách trên. Không bịa đặt giá.
            2. Nếu khách hỏi sản phẩm không có (như rau củ, thịt cá), hãy khéo léo từ chối và giới thiệu các sản phẩm điện tử trong kho.
            3. Luôn dùng Markdown: **Bôi đậm tên sản phẩm**, dùng gạch đầu dòng, icon sinh động.
            4. Trả lời thân thiện, xưng hô Bạn - Tôi hoặc Quý khách.`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.7, // Giúp AI sáng tạo vừa phải nhưng vẫn bám sát data
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(`Groq API Error: ${data.error.message}`);
        }

        const botText = data.choices[0].message.content;
        return NextResponse.json({ text: botText });

    } catch (error: any) {
        console.error("LỖI HỆ THỐNG K-MARKET:", error);

        // Trả về lỗi chi tiết cho UI để mình dễ fix nếu còn văng Catch
        return NextResponse.json({
            text: `Hệ thống gặp sự cố: ${error.message}. Ông check lại file .env hoặc Model Product nhé!`
        }, { status: 500 });
    }
}