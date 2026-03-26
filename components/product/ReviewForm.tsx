"use client";
import { useState } from "react";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Giả lập gọi API POST tới /api/reviews
    console.log({ productId, rating, comment });
    
    setTimeout(() => {
      alert("Đã gửi đánh giá thành công!");
      setComment("");
      setRating(5);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="mt-10 border-t border-dashed pt-8">
      <h3 className="text-lg font-bold uppercase mb-4 text-[#ee4d2d]">Viết đánh giá của bạn</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Phần chọn sao dùng Font Awesome */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-sm">
          <span className="text-sm font-medium">Chất lượng:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fa-star cursor-pointer text-2xl transition-all ${
                  (hover || rating) >= star ? "fa-solid text-yellow-400" : "fa-regular text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
          <span className="text-orange-500 font-semibold text-sm ml-2">
            {rating === 5 ? "Rất hài lòng" : rating === 4 ? "Hài lòng" : rating === 3 ? "Bình thường" : "Tệ"}
          </span>
        </div>

        {/* Ô nhập nội dung */}
        <div className="relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Hãy chia sẻ nhận xét của bạn về sản phẩm này nhé (độ bền, màu sắc, đóng gói...)"
            className="w-full border border-gray-200 p-4 rounded-sm focus:border-orange-500 outline-none min-h-[150px] text-sm shadow-sm"
            required
          />
        </div>

        {/* Nút gửi đúng style Shopee */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#ee4d2d] text-white px-10 py-3 rounded-sm hover:bg-[#d73211] transition-all font-medium shadow-md disabled:bg-gray-400 uppercase text-sm"
          >
            {isSubmitting ? "Đang gửi..." : "Hoàn thành"}
          </button>
        </div>
      </form>
    </div>
  );
}